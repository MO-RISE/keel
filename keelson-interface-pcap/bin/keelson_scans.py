import time
from typing import cast, Iterator, Tuple, Optional, Dict

import numpy as np
from ouster import client
from ouster.client import _client
from ouster.client.core import ClientTimeout, Sensor, LidarPacket, ImuPacket, LidarScan


class KeelsonScans(client.Scans):
    def __iter__(self) -> Iterator[Tuple[Optional[Dict[str, np.ndarray]], Optional[LidarScan]]]:
        """Get an iterator, returning a tuple where either the LidarScan or ImuData is None, indicating which type of
        packets is being returned."""

        w = self._source.metadata.format.columns_per_frame
        h = self._source.metadata.format.pixels_per_column
        columns_per_packet = self._source.metadata.format.columns_per_packet
        packets_per_frame = w // columns_per_packet
        column_window = self._source.metadata.format.column_window

        # If source is a sensor, make a type-specialized reference available
        sensor = cast(Sensor, self._source) if isinstance(
            self._source, Sensor) else None

        ls_write = None
        pf = _client.PacketFormat.from_info(self._source.metadata)
        batch = _client.ScanBatcher(w, pf)

        # Time from which to measure timeout
        start_ts = time.monotonic()

        it = iter(self._source)
        self._packets_consumed = 0
        self._scans_produced = 0
        while True:
            try:
                packet = next(it)
                self._packets_consumed += 1
            except StopIteration:
                if ls_write is not None:
                    if not self._complete or ls_write.complete(column_window):
                        yield None, ls_write
                return
            except ClientTimeout:
                self._timed_out = True
                return

            if self._timeout is not None and (time.monotonic() >=
                                              start_ts + self._timeout):
                self._timed_out = True
                return

            if isinstance(packet, LidarPacket):
                ls_write = ls_write or LidarScan(h, w, self._fields, columns_per_packet)

                if batch(packet, ls_write):
                    # Got a new frame, return it and start another
                    if not self._complete or ls_write.complete(column_window):
                        yield None, ls_write
                        self._scans_produced += 1
                        start_ts = time.monotonic()
                    ls_write = None

                    # Drop data along frame boundaries to maintain _max_latency and
                    # clear out already-batched first packet of next frame
                    if self._max_latency and sensor is not None:
                        buf_frames = sensor.buf_use() // packets_per_frame
                        drop_frames = buf_frames - self._max_latency + 1

                        if drop_frames > 0:
                            sensor.flush(drop_frames)
                            batch = _client.ScanBatcher(w, pf)

            elif isinstance(packet, ImuPacket):
                yield {
                    "acceleration": packet.accel,
                    "angular_velocity": packet.angular_vel,
                    "capture_timestamp": packet.capture_timestamp
                }, None
