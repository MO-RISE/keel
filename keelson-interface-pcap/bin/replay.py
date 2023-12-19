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


def run(session: zenoh.Session, args: argparse.Namespace):
    imu_topic = brefv.construct_pub_sub_topic(
        realm=args.realm,
        entity_id=args.entity_id,
        interface_type=KEELSON_INTERFACE_TYPE,
        interface_id=args.interface_id,
        tag=KEELSON_TAG_IMU_READING,
        source_id=args.source_id,
    )

    lidar_topic = brefv.construct_pub_sub_topic(
        realm=args.realm,
        entity_id=args.entity_id,
        interface_type=KEELSON_INTERFACE_TYPE,
        interface_id=args.interface_id,
        tag=KEELSON_TAG_POINT_CLOUD,
        source_id=args.source_id,
    )

    logging.info("IMU topic: %s", imu_topic)
    logging.info("LiDAR topic: %s", lidar_topic)

    imu_publisher = session.declare_publisher(
        imu_topic,
        priority=zenoh.Priority.INTERACTIVE_HIGH(),
        congestion_control=zenoh.CongestionControl.DROP(),
    )

    lidar_publisher = session.declare_publisher(
        lidar_topic,
        priority=zenoh.Priority.INTERACTIVE_HIGH(),
        congestion_control=zenoh.CongestionControl.DROP(),
    )

    with open(args.metadata_file, 'r') as f:
        metadata = client.SensorInfo(f.read())
        logging.info("Read metadata from %s", args.metadata_file)

    pcap_source = pcap.Pcap(args.pcap_file, metadata)
    logging.info("Loaded pcap file: %s", args.pcap_file)

    scans = KeelsonScans(source=pcap_source)
    logging.info("Created scans generator for %s", args.pcap_file)

    try:

        for imu_data, lidar_scan in scans:

            if imu_data is not None:
                payload = imu_data_to_imu_proto_payload(imu_data)

                serialized_payload = payload.SerializeToString()
                logging.debug("...serialized.")

                envelope = brefv.enclose(serialized_payload)
                logging.debug("...enclosed into envelope, serialized as: %s", envelope)

                imu_publisher.put(envelope)
                logging.info("...published to zenoh!")

            elif lidar_scan is not None:
                payload = lidarscan_to_pointcloud_proto_payload(lidar_scan, metadata)

                serialized_payload = payload.SerializeToString()
                logging.debug("...serialized.")

                envelope = brefv.enclose(serialized_payload)
                logging.debug("...enclosed into envelope, serialized as: %s", envelope)

                lidar_publisher.put(envelope)
                logging.info("...published to zenoh!")


    except ClientTimeout:
        logging.info("Timeout occurred while waiting for packets.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="ouster",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("--log-level", type=int, default=logging.WARNING)
    parser.add_argument(
        "--connect",
        action="append",
        type=str,
        help="Endpoints to connect to.",
    )

    parser.add_argument("-r", "--realm", type=str, required=True)
    parser.add_argument("-e", "--entity-id", type=str, required=True)
    parser.add_argument("-i", "--interface-id", type=str, required=True)
    parser.add_argument("-s", "--source-id", type=str, required=True)
    parser.add_argument("-p", "--pcap-file", type=str, required=True)
    parser.add_argument("-m", "--metadata-file", type=str, required=True)

    ## Parse arguments and start doing our thing
    args = parser.parse_args()

    # Setup logger
    logging.basicConfig(
        format="%(asctime)s %(levelname)s %(name)s %(message)s", level=args.log_level
    )
    logging.captureWarnings(True)
    warnings.filterwarnings("once")

    ## Construct session
    logging.info("Opening Zenoh session...")
    conf = zenoh.Config()

    if args.connect is not None:
        conf.insert_json5(zenoh.config.CONNECT_KEY, json.dumps(args.connect))
    session = zenoh.open(conf)


    def _on_exit():
        session.close()


    atexit.register(_on_exit)

    try:
        run(session, args)
    except KeyboardInterrupt:
        logging.info("Program ended due to user request (Ctrl-C)")
        pass
