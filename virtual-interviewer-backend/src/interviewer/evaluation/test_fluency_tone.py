from fluency import compute_fluency
from tone import detect_tone

answer = """
Normalization clearly reduces data redundancy and ensures
better database structure. I am confident this improves integrity.
"""

print("Fluency:", compute_fluency(answer))
print("Tone:", detect_tone(answer))