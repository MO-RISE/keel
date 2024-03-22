/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { messageTypeRegistry } from "./typeRegistry";

/** A field present within each element in a byte array of packed elements. */
export interface PackedElementField {
  $type: "foxglove.PackedElementField";
  /** Name of the field */
  name: string;
  /** Byte offset from start of data buffer */
  offset: number;
  /** Type of data in the field. Integers are stored using little-endian byte order. */
  type: PackedElementField_NumericType;
}

/** Numeric type */
export enum PackedElementField_NumericType {
  UNKNOWN = 0,
  UINT8 = 1,
  INT8 = 2,
  UINT16 = 3,
  INT16 = 4,
  UINT32 = 5,
  INT32 = 6,
  FLOAT32 = 7,
  FLOAT64 = 8,
  UNRECOGNIZED = -1,
}

export function packedElementField_NumericTypeFromJSON(object: any): PackedElementField_NumericType {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return PackedElementField_NumericType.UNKNOWN;
    case 1:
    case "UINT8":
      return PackedElementField_NumericType.UINT8;
    case 2:
    case "INT8":
      return PackedElementField_NumericType.INT8;
    case 3:
    case "UINT16":
      return PackedElementField_NumericType.UINT16;
    case 4:
    case "INT16":
      return PackedElementField_NumericType.INT16;
    case 5:
    case "UINT32":
      return PackedElementField_NumericType.UINT32;
    case 6:
    case "INT32":
      return PackedElementField_NumericType.INT32;
    case 7:
    case "FLOAT32":
      return PackedElementField_NumericType.FLOAT32;
    case 8:
    case "FLOAT64":
      return PackedElementField_NumericType.FLOAT64;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PackedElementField_NumericType.UNRECOGNIZED;
  }
}

export function packedElementField_NumericTypeToJSON(object: PackedElementField_NumericType): string {
  switch (object) {
    case PackedElementField_NumericType.UNKNOWN:
      return "UNKNOWN";
    case PackedElementField_NumericType.UINT8:
      return "UINT8";
    case PackedElementField_NumericType.INT8:
      return "INT8";
    case PackedElementField_NumericType.UINT16:
      return "UINT16";
    case PackedElementField_NumericType.INT16:
      return "INT16";
    case PackedElementField_NumericType.UINT32:
      return "UINT32";
    case PackedElementField_NumericType.INT32:
      return "INT32";
    case PackedElementField_NumericType.FLOAT32:
      return "FLOAT32";
    case PackedElementField_NumericType.FLOAT64:
      return "FLOAT64";
    case PackedElementField_NumericType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBasePackedElementField(): PackedElementField {
  return { $type: "foxglove.PackedElementField", name: "", offset: 0, type: 0 };
}

export const PackedElementField = {
  $type: "foxglove.PackedElementField" as const,

  encode(message: PackedElementField, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.offset !== 0) {
      writer.uint32(21).fixed32(message.offset);
    }
    if (message.type !== 0) {
      writer.uint32(24).int32(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PackedElementField {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePackedElementField();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.offset = reader.fixed32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PackedElementField {
    return {
      $type: PackedElementField.$type,
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      offset: isSet(object.offset) ? globalThis.Number(object.offset) : 0,
      type: isSet(object.type) ? packedElementField_NumericTypeFromJSON(object.type) : 0,
    };
  },

  toJSON(message: PackedElementField): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.offset !== 0) {
      obj.offset = Math.round(message.offset);
    }
    if (message.type !== 0) {
      obj.type = packedElementField_NumericTypeToJSON(message.type);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PackedElementField>, I>>(base?: I): PackedElementField {
    return PackedElementField.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PackedElementField>, I>>(object: I): PackedElementField {
    const message = createBasePackedElementField();
    message.name = object.name ?? "";
    message.offset = object.offset ?? 0;
    message.type = object.type ?? 0;
    return message;
  },
};

messageTypeRegistry.set(PackedElementField.$type, PackedElementField);

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in Exclude<keyof T, "$type">]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P> | "$type">]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
