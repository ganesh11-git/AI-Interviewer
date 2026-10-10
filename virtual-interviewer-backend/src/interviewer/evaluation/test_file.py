from knowledge_score import evaluate_knowledge
from semantic_relevance import compute_semantic_relevance

question = "Explain database normalization"
answer = "Normalization reduces data redundancy by organizing tables using primary keys."
expected_concepts = [
    "normalization",
    "data redundancy",
    "primary",
    "key"
]

print(compute_semantic_relevance(question, answer))