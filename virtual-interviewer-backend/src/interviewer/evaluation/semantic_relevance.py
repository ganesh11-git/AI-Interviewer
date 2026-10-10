from sentence_transformers import SentenceTransformer, util
from .preprocess import preprocess

model = SentenceTransformer("all-MiniLM-L6-v2")


def compute_semantic_relevance(
    question: str,
    answer: str,
    reference: str = ""
) -> dict:
    """
    Computes semantic relevance using embeddings.
    Relevance = max(sim(question, answer), sim(reference, answer))
    """

    q_text = preprocess(question)["clean_text"]
    a_text = preprocess(answer)["clean_text"]
    r_text = preprocess(reference)["clean_text"] if reference else ""

    if not a_text:
        return {"score": 0.0, "verdict": "low"}

    a_emb = model.encode(a_text, convert_to_tensor=True)

    scores = []

    if q_text:
        q_emb = model.encode(q_text, convert_to_tensor=True)
        scores.append(util.cos_sim(q_emb, a_emb).item())

    if r_text:
        r_emb = model.encode(r_text, convert_to_tensor=True)
        scores.append(util.cos_sim(r_emb, a_emb).item())

    relevance = max(scores) if scores else 0.0
    relevance = round(float(relevance), 3)

    if relevance >= 0.65:
        verdict = "high"
    elif relevance >= 0.4:
        verdict = "medium"
    else:
        verdict = "low"

    return {
        "score": relevance,
        "verdict": verdict
    }
