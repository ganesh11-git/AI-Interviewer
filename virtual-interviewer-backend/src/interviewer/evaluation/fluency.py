import re
from .preprocess import preprocess

FILLER_WORDS = ["uh", "um", "like", "you know", "actually"]

def compute_fluency(answer: str) -> float:
    """
    Computes fluency score based on length, sentence structure,
    and filler word usage.
    """

    if not answer:
        return 0.0

    words = answer.split()
    word_count = len(words)

    # 1️⃣ Length score (ideal: 40–120 words)
    if word_count < 15:
        length_score = 0.4
    elif word_count < 30:
        length_score = 0.7
    elif word_count <= 120:
        length_score = 1.0
    else:
        length_score = 0.85


    # 2️⃣ Sentence continuity
    sentences = re.split(r'[.!?]', answer)
    sentences = [s for s in sentences if len(s.strip()) > 0]
    avg_sentence_length = word_count / max(len(sentences), 1)

    continuity_score = 1.0 if avg_sentence_length >= 8 else 0.6

    # 3️⃣ Filler penalty
    filler_count = sum(answer.lower().count(f) for f in FILLER_WORDS)
    filler_penalty = min(filler_count * 0.05, 0.3)

    fluency_score = (
    0.4 * length_score +
    0.5 * continuity_score -
    filler_penalty
) * 100
    
    return round(max(fluency_score, 0), 2)