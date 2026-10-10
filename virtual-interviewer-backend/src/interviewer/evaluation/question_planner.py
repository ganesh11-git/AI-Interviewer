# question_planner.py

def plan_questions(resume_skills, role=None):
    """
    Returns an ORDERED LIST of skills to ask questions on.
    Ensures role-based prioritization + fallback ordering.
    """

    # Ensure list type
    if isinstance(resume_skills, str):
        resume_skills = [resume_skills]

    # Fallback if nothing extracted
    if not resume_skills:
        return ["general introduction"]

    # Normalize
    resume_skills = [s.lower() for s in resume_skills]
    role = (role or "").lower()

    # Role-based priority
    role_priority = {
        "data scientist": ["machine learning", "python", "statistics", "sql"],
        "software engineer": ["dsa", "system design", "python", "sql"],
        "full stack": ["mern stack", "javascript", "react", "mongodb", "node"],
        "backend developer": ["node", "databases", "api", "python", "sql"],
    }

    ordered_skills = []

    # 1️⃣ Add role-priority skills first (if present in resume)
    if role in role_priority:
        for skill in role_priority[role]:
            if skill in resume_skills and skill not in ordered_skills:
                ordered_skills.append(skill)

    # 2️⃣ Add remaining resume skills
    for skill in resume_skills:
        if skill not in ordered_skills:
            ordered_skills.append(skill)

    # 3️⃣ Safety fallback
    if not ordered_skills:
        return ["general introduction"]

    return ordered_skills