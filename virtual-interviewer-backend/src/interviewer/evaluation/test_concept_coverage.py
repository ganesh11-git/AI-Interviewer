from concept_coverage import compute_concept_coverage

def test_concept_coverage():
    answer = """
    Normalization reduces duplicate data and avoids update anomalies.
    It helps in structuring the database properly.
    """

    expected_concepts = [
        {
            "name": "redundancy",
            "variants": ["duplicate data", "data repetition"]
        },
        {
            "name": "anomalies",
            "variants": ["update anomaly", "delete anomaly"]
        },
        {
            "name": "normal forms",
            "variants": ["1nf", "2nf", "3nf"]
        }
    ]

    result = compute_concept_coverage(answer, expected_concepts)

    print(result)

    assert result["score"] > 0
    assert "redundancy" in result["covered"]
    assert "normal forms" in result["missing"]

    print("✅ Concept coverage test passed!")


if __name__ == "__main__":
    test_concept_coverage()