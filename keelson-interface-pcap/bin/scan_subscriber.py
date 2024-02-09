#!/usr/bin/env python3

import zenoh
from zenoh import Config
from brefv.payloads.compound.ImuReading_pb2 import ImuReading
from brefv.payloads.foxglove.PointCloud_pb2 import PointCloud
import brefv

def callback(sample: zenoh.Sample):
    if 'imu_reading' in str(sample.key_expr):
        imu_reading = ImuReading()
        imu_reading.ParseFromString(sample.payload)

        print(f"Orientation: {imu_reading.orientation}")
        print(f"Angular Velocity: {imu_reading.angular_velocity.x}, {imu_reading.angular_velocity.y}, {imu_reading.angular_velocity.z}")
    
    elif 'point_cloud' in str(sample.key_expr):
        point_cloud = PointCloud()
        point_cloud.ParseFromString(sample.payload)
        print(f"Frame ID: {point_cloud.frame_id}")
        

def main():
    session = zenoh.open(Config())

    imu_topic = "lidar/imu_reading"
    point_cloud_topic = "lidar/point_cloud"

    sub_imu = session.declare_subscriber(imu_topic, callback)
    sub_point_cloud = session.declare_subscriber(point_cloud_topic, callback)

    print("Subscribed to topics: '{}' and '{}'".format(imu_topic, point_cloud_topic))
    print("Waiting for data...")

    try:
        while True:
            pass
    except KeyboardInterrupt:
        print("Unsubscribing and closing session...")
        sub_imu.undeclare()
        sub_point_cloud.undeclare()
        session.close()

if __name__ == "__main__":
    main()
