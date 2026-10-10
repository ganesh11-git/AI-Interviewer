from .semantic_relevance import compute_semantic_relevance
from .concept_coverage import compute_concept_coverage

def evaluate_knowledge(question: str, answer: str, expected_concepts: list) -> dict:
    """
    Final knowledge evaluation combining relevance and concept coverage.
    """

    relevance = compute_semantic_relevance(question, answer)
    coverage = compute_concept_coverage(answer, expected_concepts)

    knowledge_score = (0.6 * relevance + 0.4 * coverage) * 100

    return {
        "semantic_relevance": relevance,
        "concept_coverage": coverage,
        "knowledge_score": round(knowledge_score, 2)
    }
