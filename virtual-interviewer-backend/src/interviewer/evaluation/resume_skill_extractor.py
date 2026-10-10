# resume_skill_extractor.py

import re

# Expandable controlled vocabulary
SKILL_KEYWORDS = {
    "python": ["python"],
    "javascript": ["javascript", "js"],
    "java": ["java"],
    "c++": ["c++", "cpp"],
    "react": ["react", "reactjs"],
    "nodejs": ["node", "nodejs", "express"],
    "mongodb": ["mongodb", "mongo"],
    "sql": ["sql", "mysql", "postgres", "oracle"],
    "data structures": ["data structures", "stack", "queue", "linked list", "tree", "graph"],
    "algorithms": ["algorithm", "sorting", "searching", "dp", "greedy"],
    "oop": ["oop", "object oriented", "inheritance", "polymorphism", "encapsulation"],
    "machine learning": ["machine learning", "ml", "neural network"],
    "deep learning": ["deep learning", "cnn", "rnn", "lstm"],
    "mern stack": ["mern"],
    "system design": ["system design", "scalability"],
}


def extract_skills(resume_text: str) -> list:
    """
    Extract ranked technical skills from resume text.
    Deterministic + research-friendly.
    """

    if not resume_text or len(resume_text.strip()) < 10:
        return ["python", "data structures", "oop"]

    # Normalize text
    text = resume_text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)

    skill_scores = {}

    for skill, keywords in SKILL_KEYWORDS.items():
        count = 0
        for kw in keywords:
            count += len(re.findall(rf"\b{re.escape(kw)}\b", text))
        if count > 0:
            skill_scores[skill] = count

    # If nothing found → fallback core CS skills
    if not skill_scores:
        return ["python", "data structures", "oop"]

    # Sort by frequency (most relevant first)
    ranked = sorted(skill_scores, key=skill_scores.get, reverse=True)

    # Return top 5 skills
    return ranked[:5]