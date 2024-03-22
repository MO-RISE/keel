/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { PackedElementField } from "./PackedElementField";
import { Pose } from "./Pose";
import { Timestamp } from "./google/protobuf/timestamp";
import { messageTypeRegistry } from "./typeRegistry";

/** A collection of N-dimensional points, which may contain additional fields with information like normals, intensity, etc. */
export interface PointCloud {
  $type: "foxglove.PointCloud";
  /** Timestamp of point cloud */
  timestamp:
    | Date
    | undefined;
  /** Frame of reference */
  frameId: string;
  /** The origin of the point cloud relative to the frame of reference */
  pose:
    | Pose
    | undefined;
  /** Number of bytes between points in the `data` */
  pointStride: number;
  /** Fields in `data`. At least 2 coordinate fields from `x`, `y`, and `z` are required for each point's position; `red`, `green`, `blue`, and `alpha` are optional for customizing each point's color. */
  fields: PackedElementField[];
  /** Point data, interpreted using `fields` */
  data: Uint8Array;
}

function createBasePointCloud(): PointCloud {
  return {
    $type: "foxglove.PointCloud",
    timestamp: undefined,
    frameId: "",
    pose: undefined,
    pointStride: 0,
    fields: [],
    data: new Uint8Array(0),
  };
}

export const PointCloud = {
  $type: "foxglove.PointCloud" as const,

  encode(message: PointCloud, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(10).fork()).ldelim();
    }
    if (message.frameId !== "") {
      writer.uint32(18).string(message.frameId);
    }
    if (message.pose !== undefined) {
      Pose.encode(message.pose, writer.uint32(26).fork()).ldelim();
    }
    if (message.pointStride !== 0) {
      writer.uint32(37).fixed32(message.pointStride);
    }
    for (const v of message.fields) {
      PackedElementField.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (message.data.length !== 0) {
      writer.uint32(50).bytes(message.data);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PointCloud {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePointCloud();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.frameId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.pose = Pose.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }

          message.pointStride = reader.fixed32();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.fields.push(PackedElementField.decode(reader, reader.uint32()));
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

  fromJSON(object: any): PointCloud {
    return {
      $type: PointCloud.$type,
      timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
      frameId: isSet(object.frameId) ? globalThis.String(object.frameId) : "",
      pose: isSet(object.pose) ? Pose.fromJSON(object.pose) : undefined,
      pointStride: isSet(object.pointStride) ? globalThis.Number(object.pointStride) : 0,
      fields: globalThis.Array.isArray(object?.fields)
        ? object.fields.map((e: any) => PackedElementField.fromJSON(e))
        : [],
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(0),
    };
  },

  toJSON(message: PointCloud): unknown {
    const obj: any = {};
    if (message.timestamp !== undefined) {
      obj.timestamp = message.timestamp.toISOString();
    }
    if (message.frameId !== "") {
      obj.frameId = message.frameId;
    }
    if (message.pose !== undefined) {
      obj.pose = Pose.toJSON(message.pose);
    }
    if (message.pointStride !== 0) {
      obj.pointStride = Math.round(message.pointStride);
    }
    if (message.fields?.length) {
      obj.fields = message.fields.map((e) => PackedElementField.toJSON(e));
    }
    if (message.data.length !== 0) {
      obj.data = base64FromBytes(message.data);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PointCloud>, I>>(base?: I): PointCloud {
    return PointCloud.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PointCloud>, I>>(object: I): PointCloud {
    const message = createBasePointCloud();
    message.timestamp = object.timestamp ?? undefined;
    message.frameId = object.frameId ?? "";
    message.pose = (object.pose !== undefined && object.pose !== null) ? Pose.fromPartial(object.pose) : undefined;
    message.pointStride = object.pointStride ?? 0;
    message.fields = object.fields?.map((e) => PackedElementField.fromPartial(e)) || [];
    message.data = object.data ?? new Uint8Array(0);
    return message;
  },
};

messageTypeRegistry.set(PointCloud.$type, PointCloud);

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
