import time
import brefv

import brefv.payloads.primitives_pb2 as primitives


def test_construct_topic():
    assert (
        brefv.construct_topic(
            realm="realm",
            entity_id="entity_id",
            interface_type="interface_type",
            interface_id="interface_id",
            tag="tag",
            source_id="source_id",
        )
        == "realm/entity_id/interface_type/interface_id/tag/source_id"
    )


def test_parse_topic():
    assert brefv.parse_topic(
        "realm/entity_id/interface_type/interface_id/tag/source_id/sub_id"
    ) == dict(
        realm="realm",
        entity_id="entity_id",
        interface_type="interface_type",
        interface_id="interface_id",
        tag="tag",
        source_id="source_id/sub_id",
    )


def test_get_tag_from_topic():
    assert (
        brefv.get_tag_from_topic(
            "realm/entity_id/interface_type/interface_id/tag/source_id"
        )
        == "tag"
    )


def test_enclose_uncover():
    test = b"test"

    message = brefv.enclose(test)

    received_at, enclosed_at, content = brefv.uncover(message)

    assert test == content
    assert received_at >= enclosed_at


def test_enclose_uncover_actual_payload():
    data = primitives.TimestampedFloat()
    data.timestamp.FromNanoseconds(time.time_ns())
    data.value = 3.14

    message = brefv.enclose(data.SerializeToString())

    received_at, enclosed_at, payload = brefv.uncover(message)

    content = primitives.TimestampedFloat.FromString(payload)

    assert data.value == content.value
    assert data.timestamp == content.timestamp
    assert enclosed_at >= content.timestamp.ToNanoseconds()
    assert received_at >= enclosed_at


def test_get_protobuf_file_descriptor_set_from_type_name():
    file_descriptor_set = brefv.get_protobuf_file_descriptor_set_from_type_name(
        "brefv.primitives.TimestampedString"
    )
    assert file_descriptor_set


def test_decode_protobuf_using_generated_message_classes():
    data = primitives.TimestampedFloat()
    data.timestamp.FromNanoseconds(time.time_ns())
    data.value = 3.14

    payload = data.SerializeToString()

    decoded = brefv.decode_protobuf_payload_from_type_name(
        payload, "brefv.primitives.TimestampedFloat"
    )

    assert data.value == decoded.value
    assert (
        data.timestamp.ToNanoseconds() == decoded.timestamp.ToNanoseconds()
    )  # These are different class definitions and will fail a direct comparison...


def test_is_tag_well_known():
    assert brefv.is_tag_well_known("raw_bytes") == True
    assert brefv.is_tag_well_known("random_mumbo_jumbo") == False


def test_get_tag_encoding():
    assert brefv.get_tag_encoding("raw_bytes") == "protobuf"


def test_get_tag_encoding():
    assert brefv.get_tag_description("raw_bytes") == "brefv.primitives.TimestampedBytes"
