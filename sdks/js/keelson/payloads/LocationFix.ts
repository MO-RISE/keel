/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Timestamp } from "./google/protobuf/timestamp";
import { messageTypeRegistry } from "./typeRegistry";

/** A navigation satellite fix for any Global Navigation Satellite System */
export interface LocationFix {
  $type: "foxglove.LocationFix";
  /** Timestamp of the message */
  timestamp:
    | Date
    | undefined;
  /** Frame for the sensor. Latitude and longitude readings are at the origin of the frame. */
  frameId: string;
  /** Latitude in degrees */
  latitude: number;
  /** Longitude in degrees */
  longitude: number;
  /** Altitude in meters */
  altitude: number;
  /** Position covariance (m^2) defined relative to a tangential plane through the reported position. The components are East, North, and Up (ENU), in row-major order. */
  positionCovariance: number[];
  /** If `position_covariance` is available, `position_covariance_type` must be set to indicate the type of covariance. */
  positionCovarianceType: LocationFix_PositionCovarianceType;
}

/** Type of position covariance */
export enum LocationFix_PositionCovarianceType {
  UNKNOWN = 0,
  APPROXIMATED = 1,
  DIAGONAL_KNOWN = 2,
  KNOWN = 3,
  UNRECOGNIZED = -1,
}

export function locationFix_PositionCovarianceTypeFromJSON(object: any): LocationFix_PositionCovarianceType {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return LocationFix_PositionCovarianceType.UNKNOWN;
    case 1:
    case "APPROXIMATED":
      return LocationFix_PositionCovarianceType.APPROXIMATED;
    case 2:
    case "DIAGONAL_KNOWN":
      return LocationFix_PositionCovarianceType.DIAGONAL_KNOWN;
    case 3:
    case "KNOWN":
      return LocationFix_PositionCovarianceType.KNOWN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return LocationFix_PositionCovarianceType.UNRECOGNIZED;
  }
}

export function locationFix_PositionCovarianceTypeToJSON(object: LocationFix_PositionCovarianceType): string {
  switch (object) {
    case LocationFix_PositionCovarianceType.UNKNOWN:
      return "UNKNOWN";
    case LocationFix_PositionCovarianceType.APPROXIMATED:
      return "APPROXIMATED";
    case LocationFix_PositionCovarianceType.DIAGONAL_KNOWN:
      return "DIAGONAL_KNOWN";
    case LocationFix_PositionCovarianceType.KNOWN:
      return "KNOWN";
    case LocationFix_PositionCovarianceType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseLocationFix(): LocationFix {
  return {
    $type: "foxglove.LocationFix",
    timestamp: undefined,
    frameId: "",
    latitude: 0,
    longitude: 0,
    altitude: 0,
    positionCovariance: [],
    positionCovarianceType: 0,
  };
}

export const LocationFix = {
  $type: "foxglove.LocationFix" as const,

  encode(message: LocationFix, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(50).fork()).ldelim();
    }
    if (message.frameId !== "") {
      writer.uint32(58).string(message.frameId);
    }
    if (message.latitude !== 0) {
      writer.uint32(9).double(message.latitude);
    }
    if (message.longitude !== 0) {
      writer.uint32(17).double(message.longitude);
    }
    if (message.altitude !== 0) {
      writer.uint32(25).double(message.altitude);
    }
    writer.uint32(34).fork();
    for (const v of message.positionCovariance) {
      writer.double(v);
    }
    writer.ldelim();
    if (message.positionCovarianceType !== 0) {
      writer.uint32(40).int32(message.positionCovarianceType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LocationFix {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLocationFix();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 6:
          if (tag !== 50) {
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
        case 1:
          if (tag !== 9) {
            break;
          }

          message.latitude = reader.double();
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }

          message.longitude = reader.double();
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }

          message.altitude = reader.double();
          continue;
        case 4:
          if (tag === 33) {
            message.positionCovariance.push(reader.double());

            continue;
          }

          if (tag === 34) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.positionCovariance.push(reader.double());
            }

            continue;
          }

          break;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.positionCovarianceType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LocationFix {
    return {
      $type: LocationFix.$type,
      timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
      frameId: isSet(object.frameId) ? globalThis.String(object.frameId) : "",
      latitude: isSet(object.latitude) ? globalThis.Number(object.latitude) : 0,
      longitude: isSet(object.longitude) ? globalThis.Number(object.longitude) : 0,
      altitude: isSet(object.altitude) ? globalThis.Number(object.altitude) : 0,
      positionCovariance: globalThis.Array.isArray(object?.positionCovariance)
        ? object.positionCovariance.map((e: any) => globalThis.Number(e))
        : [],
      positionCovarianceType: isSet(object.positionCovarianceType)
        ? locationFix_PositionCovarianceTypeFromJSON(object.positionCovarianceType)
        : 0,
    };
  },

  toJSON(message: LocationFix): unknown {
    const obj: any = {};
    if (message.timestamp !== undefined) {
      obj.timestamp = message.timestamp.toISOString();
    }
    if (message.frameId !== "") {
      obj.frameId = message.frameId;
    }
    if (message.latitude !== 0) {
      obj.latitude = message.latitude;
    }
    if (message.longitude !== 0) {
      obj.longitude = message.longitude;
    }
    if (message.altitude !== 0) {
      obj.altitude = message.altitude;
    }
    if (message.positionCovariance?.length) {
      obj.positionCovariance = message.positionCovariance;
    }
    if (message.positionCovarianceType !== 0) {
      obj.positionCovarianceType = locationFix_PositionCovarianceTypeToJSON(message.positionCovarianceType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LocationFix>, I>>(base?: I): LocationFix {
    return LocationFix.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LocationFix>, I>>(object: I): LocationFix {
    const message = createBaseLocationFix();
    message.timestamp = object.timestamp ?? undefined;
    message.frameId = object.frameId ?? "";
    message.latitude = object.latitude ?? 0;
    message.longitude = object.longitude ?? 0;
    message.altitude = object.altitude ?? 0;
    message.positionCovariance = object.positionCovariance?.map((e) => e) || [];
    message.positionCovarianceType = object.positionCovarianceType ?? 0;
    return message;
  },
};

messageTypeRegistry.set(LocationFix.$type, LocationFix);

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
