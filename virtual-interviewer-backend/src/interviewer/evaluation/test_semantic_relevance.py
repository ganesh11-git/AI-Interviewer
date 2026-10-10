from interviewer.evaluation.semantic_relevance import compute_semantic_relevance

def test_semantic_relevance():
    question = "Explain normalization in DBMS"

    reference = """
    Normalization is a database design technique used to reduce redundancy
    and avoid insertion, deletion, and update anomalies by organizing
    tables into normal forms such as 1NF, 2NF, and 3NF.
    """

    good_answer = """
    Normalization reduces duplicate data and avoids anomalies
    by structuring tables into normal forms.
    """

    bad_answer = "Normalization is very important in life."

    good = compute_semantic_relevance(question, good_answer, reference)
    bad = compute_semantic_relevance(question, bad_answer, reference)

    print("GOOD:", good)
    print("BAD:", bad)

    assert good["score"] > bad["score"]
    assert good["verdict"] in ["high", "medium"]
    assert bad["verdict"] == "low"

    print("✅ Semantic relevance test passed!")


if __name__ == "__main__":
    test_semantic_relevance()