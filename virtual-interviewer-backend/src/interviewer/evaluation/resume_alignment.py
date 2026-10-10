from .preprocess import preprocess

def resume_answer_alignment(answer: str, resume_skills: list) -> dict:
    """
    Computes how well the answer aligns with claimed resume skills.
    """

    if not answer or not resume_skills:
        return {
            "resume_match_score": 0.0,
            "matched_skills": [],
            "missing_skills": resume_skills
        }

    answer_clean = preprocess(answer)

    matched = []
    missing = []

    for skill in resume_skills:
        if skill.lower() in answer_clean:
            matched.append(skill)
        else:
            missing.append(skill)

    match_ratio = len(matched) / len(resume_skills)
    score = round(match_ratio * 100, 2)

    return {
        "resume_match_score": score,
        "matched_skills": matched,
        "missing_skills": missing
    }