#!/usr/bin/env python3
import argparse
import atexit
import json
import logging
import warnings
import datetime

import zenoh
from google.protobuf.timestamp_pb2 import Timestamp
from ouster import pcap, client
from ouster.client.core import ClientTimeout

from brefv.payloads.compound.ImuReading_pb2 import ImuReading
from brefv.payloads.foxglove.PointCloud_pb2 import PointCloud
from brefv.payloads.foxglove.PackedElementField_pb2 import PackedElementField
import brefv
from keelson_scans import KeelsonScans

KEELSON_INTERFACE_TYPE = "lidar"
KEELSON_TAG_POINT_CLOUD = "point_cloud"
KEELSON_TAG_IMU_READING = "imu_reading"


def google_protobuf_timestamp_from_unix_timestamp(capture_timestamp):
    timestamp_seconds = int(capture_timestamp)
    timestamp_microseconds = int((capture_timestamp - timestamp_seconds) * 1e6)
    timestamp_datetime = datetime.datetime.fromtimestamp(timestamp_seconds)
    timestamp_datetime = timestamp_datetime.replace(microsecond=timestamp_microseconds)

    protobuf_timestamp = Timestamp()
    protobuf_timestamp.FromDatetime(timestamp_datetime)

    return protobuf_timestamp


def imu_data_to_imu_proto_payload(imu_data: dict):
    payload = ImuReading()

    payload.timestamp.CopyFrom(google_protobuf_timestamp_from_unix_timestamp(imu_data["capture_timestamp"]))

    payload.linear_acceleration.x = imu_data["acceleration"][0]
    payload.linear_acceleration.y = imu_data["acceleration"][1]
    payload.linear_acceleration.z = imu_data["acceleration"][2]

    payload.angular_velocity.x = imu_data["angular_velocity"][0]
    payload.angular_velocity.y = imu_data["angular_velocity"][1]
    payload.angular_velocity.z = imu_data["angular_velocity"][2]

    return payload


def lidarscan_to_pointcloud_proto_payload(lidar_scan, info):
    payload = PointCloud()

    payload.timestamp.FromNanoseconds(int(lidar_scan.timestamp[0]))

    payload.frame_id = str(lidar_scan.frame_id)

    # Create XYZ LUT and destagger the data
    xyz_lut = client.XYZLut(info)
    xyz_destaggered = client.destagger(info, xyz_lut(lidar_scan))

    # Points as [[x, y, z], ...]
    points = xyz_destaggered.reshape(-1, xyz_destaggered.shape[-1])

    # Zero relative position
    payload.pose.position.x = 0
    payload.pose.position.y = 0
    payload.pose.position.z = 0

    # Identity quaternion
    payload.pose.orientation.x = 0
    payload.pose.orientation.y = 0
    payload.pose.orientation.z = 0
    payload.pose.orientation.w = 1

    # Fields
    payload.fields.add(name="x", offset=0, type=PackedElementField.NumericType.FLOAT64)
    payload.fields.add(name="y", offset=8, type=PackedElementField.NumericType.FLOAT64)
    payload.fields.add(name="z", offset=16, type=PackedElementField.NumericType.FLOAT64)

    data = points.tobytes()
    payload.point_stride = len(data) // len(points)
    payload.data = data

    return payload


pcap_file_path = "brefv/sample_data/OS-2-128_v2.5.1-rc.1_1024x10_20230419_100425.json"
json_file_path = "brefv/sample_data/OS-2-128_v2.5.1-rc.1_1024x10_20230419_100425-000.pcap"
lidar_topic_name = f"{KEELSON_INTERFACE_TYPE}/{KEELSON_TAG_POINT_CLOUD}"
imu_topic_name = f"{KEELSON_INTERFACE_TYPE}/{KEELSON_TAG_IMU_READING}"


def main():
    conf = zenoh.Config()
    session = zenoh.open(conf)

    lidar_publisher = session.declare_publisher(lidar_topic_name)
    imu_publisher = session.declare_publisher(imu_topic_name)

    with open(json_file_path, 'r') as f:
        metadata = client.SensorInfo(f.read())

    pcap_source = pcap.Pcap(pcap_file_path, metadata)

    scans = KeelsonScans(source=pcap_source)

    try:

        for imu_data, lidar_scan in scans:

            if imu_data is not None:
                payload = imu_data_to_imu_proto_payload(imu_data)

                serialized_payload = payload.SerializeToString()

                imu_publisher.put(serialized_payload)

            elif lidar_scan is not None:
                payload = lidarscan_to_pointcloud_proto_payload(lidar_scan, metadata)

                serialized_payload = payload.SerializeToString()

                lidar_publisher.put(serialized_payload)


    except ClientTimeout:
        logging.info("Timeout occurred while waiting for packets.")

    session.close()


if __name__ == "__main__":
    main()
