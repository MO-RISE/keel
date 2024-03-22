/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Timestamp } from "./google/protobuf/timestamp";
import { messageTypeRegistry } from "./typeRegistry";

/** A raw image */
export interface RawImage {
  $type: "foxglove.RawImage";
  /** Timestamp of image */
  timestamp:
    | Date
    | undefined;
  /** Frame of reference for the image. The origin of the frame is the optical center of the camera. +x points to the right in the image, +y points down, and +z points into the plane of the image. */
  frameId: string;
  /** Image width */
  width: number;
  /** Image height */
  height: number;
  /**
   * Encoding of the raw image data
   *
   * Supported values: `8UC1`, `8UC3`, `16UC1`, `32FC1`, `bayer_bggr8`, `bayer_gbrg8`, `bayer_grbg8`, `bayer_rggb8`, `bgr8`, `bgra8`, `mono8`, `mono16`, `rgb8`, `rgba8`, `uyvy` or `yuv422`, `yuyv` or `yuv422_yuy2`
   */
  encoding: string;
  /** Byte length of a single row */
  step: number;
  /** Raw image data */
  data: Uint8Array;
}

function createBaseRawImage(): RawImage {
  return {
    $type: "foxglove.RawImage",
    timestamp: undefined,
    frameId: "",
    width: 0,
    height: 0,
    encoding: "",
    step: 0,
    data: new Uint8Array(0),
  };
}

export const RawImage = {
  $type: "foxglove.RawImage" as const,

  encode(message: RawImage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(10).fork()).ldelim();
    }
    if (message.frameId !== "") {
      writer.uint32(58).string(message.frameId);
    }
    if (message.width !== 0) {
      writer.uint32(21).fixed32(message.width);
    }
    if (message.height !== 0) {
      writer.uint32(29).fixed32(message.height);
    }
    if (message.encoding !== "") {
      writer.uint32(34).string(message.encoding);
    }
    if (message.step !== 0) {
      writer.uint32(45).fixed32(message.step);
    }
    if (message.data.length !== 0) {
      writer.uint32(50).bytes(message.data);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RawImage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRawImage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.frameId = reader.string();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.width = reader.fixed32();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }

          message.height = reader.fixed32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.encoding = reader.string();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }

          message.step = reader.fixed32();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.data = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RawImage {
    return {
      $type: RawImage.$type,
      timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
      frameId: isSet(object.frameId) ? globalThis.String(object.frameId) : "",
      width: isSet(object.width) ? globalThis.Number(object.width) : 0,
      height: isSet(object.height) ? globalThis.Number(object.height) : 0,
      encoding: isSet(object.encoding) ? globalThis.String(object.encoding) : "",
      step: isSet(object.step) ? globalThis.Number(object.step) : 0,
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(0),
    };
  },

  toJSON(message: RawImage): unknown {
    const obj: any = {};
    if (message.timestamp !== undefined) {
      obj.timestamp = message.timestamp.toISOString();
    }
    if (message.frameId !== "") {
      obj.frameId = message.frameId;
    }
    if (message.width !== 0) {
      obj.width = Math.round(message.width);
    }
    if (message.height !== 0) {
      obj.height = Math.round(message.height);
    }
    if (message.encoding !== "") {
      obj.encoding = message.encoding;
    }
    if (message.step !== 0) {
      obj.step = Math.round(message.step);
    }
    if (message.data.length !== 0) {
      obj.data = base64FromBytes(message.data);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RawImage>, I>>(base?: I): RawImage {
    return RawImage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RawImage>, I>>(object: I): RawImage {
    const message = createBaseRawImage();
    message.timestamp = object.timestamp ?? undefined;
    message.frameId = object.frameId ?? "";
    message.width = object.width ?? 0;
    message.height = object.height ?? 0;
    message.encoding = object.encoding ?? "";
    message.step = object.step ?? 0;
    message.data = object.data ?? new Uint8Array(0);
    return message;
  },
};

messageTypeRegistry.set(RawImage.$type, RawImage);

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in Exclude<keyof T, "$type">]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P> | "$type">]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = Math.trunc(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { $type: "google.protobuf.Timestamp", seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof globalThis.Date) {
    return o;
  } else if (typeof o === "string") {
    return new globalThis.Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
