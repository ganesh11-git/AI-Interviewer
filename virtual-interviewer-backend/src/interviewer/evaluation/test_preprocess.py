from preprocess import preprocess

def test_preprocess_basic():
    answer = """
    Normalization is used in DBMS to reduce redundancy.
    For example, it helps avoid update anomalies.
    """

    result = preprocess(answer)

    print("CLEAN TEXT:")
    print(result["clean_text"])
    print("\nSENTENCES:")
    print(result["sentences"])
    print("\nWORD COUNT:")
    print(result["word_count"])

    assert isinstance(result, dict)
    assert "clean_text" in result
    assert "sentences" in result
    assert "word_count" in result

    assert len(result["sentences"]) > 0
    assert result["word_count"] > 0

    print("\n✅ Preprocess test passed!")


def test_preprocess_empty():
    result = preprocess("")

    assert result["clean_text"] == ""
    assert result["sentences"] == []
    assert result["word_count"] == 0

    print("✅ Empty input test passed!")


if __name__ == "__main__":
    test_preprocess_basic()
    test_preprocess_empty()
