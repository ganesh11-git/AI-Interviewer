from .preprocess import preprocess

def compute_concept_coverage(answer: str, expected_concepts: list) -> dict:
    """
    Computes how many expected concepts are covered in the answer.
    Returns score + covered/missing concepts.
    """

    if not expected_concepts:
        return {
            "score": 0.0,
            "covered": [],
            "missing": []
        }

    pre = preprocess(answer)
    text = pre["clean_text"]

    covered = []
    missing = []

    for concept in expected_concepts:
        concept_found = False

        # Check concept name
        if concept["name"].lower() in text:
            concept_found = True
        else:
            # Check variants
            for variant in concept.get("variants", []):
                if variant.lower() in text:
                    concept_found = True
                    break

        if concept_found:
            covered.append(concept["name"])
        else:
            missing.append(concept["name"])

    score = len(covered) / len(expected_concepts)

    return {
        "score": round(score, 3),
        "covered": covered,
        "missing": missing
    }