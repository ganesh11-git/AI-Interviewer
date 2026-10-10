CONFIDENT_WORDS = [
    "clearly", "definitely", "confidently", "ensures", "always"
]

HEDGING_WORDS = [
    "maybe", "i think", "probably", "not sure", "i guess"
]

def detect_tone(answer: str) -> dict:
    """
    Detects interview tone using lexical cues.
    """

    if not answer:
        return {"tone": "Neutral", "confidence": 0.0}

    text = answer.lower()

    confident_hits = sum(text.count(w) for w in CONFIDENT_WORDS)
    hedging_hits = sum(text.count(w) for w in HEDGING_WORDS)

    if confident_hits > hedging_hits:
        tone = "Confident"
        confidence = min(0.6 + confident_hits * 0.1, 1.0)
    elif hedging_hits > confident_hits:
        tone = "Nervous"
        confidence = min(0.6 + hedging_hits * 0.1, 1.0)
    else:
        tone = "Neutral"
        confidence = 0.5

    return {
        "tone": tone,
        "confidence": round(confidence, 2)
    }