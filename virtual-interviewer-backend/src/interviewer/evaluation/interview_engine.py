# interview_engine.py

from .resume_skill_extractor import extract_skills
from .question_planner import rank_skills, plan_question_depth
from .question_generator import generate_question

# Research modules (DISCONNECTED from live flow)
# from knowledge_score import evaluate_knowledge
# from fluency import compute_fluency
# from tone import detect_tone
# from resume_alignment import resume_answer_alignment
# from final_evaluation import aggregate_final_score, generate_feedback
# from adaptive_controller import decide_next_step


# ==============================
# LIVE INTERVIEW PIPELINE ENGINE
# ==============================

def run_interview_step(data: dict, previous_context: dict = None):
    """
    Main LIVE interview engine step (Groq-driven).
    """

    # Extract core control variables
    resume_text = data["resumeText"]
    role = data["role"]
    difficulty = data["difficulty"]
    interview_type = data["interviewType"]

    # Extract skills only once
    skills = extract_resume_skills(resume_text)
    ranked_skills = rank_skills(skills, role)

    # Decide next topic (simple rotation)
    if previous_context and "current_index" in previous_context:
        index = (previous_context["current_index"] + 1) % len(ranked_skills)
    else:
        index = 0

    current_skill = ranked_skills[index]
    question_level = plan_question_depth(difficulty)

    # Generate Groq-driven question
    question = generate_question(
        skill=current_skill,
        role=role,
        difficulty=difficulty,
        interview_type=interview_type
    )

    return {
        "question": question,
        "current_skill": current_skill,
        "current_index": index,
        "skills": ranked_skills
    }


# ===================================
# OPTIONAL BACKGROUND EVALUATION ONLY
# ===================================

def run_interview_evaluation(question: str, answer: str, remaining_skills: list):
    """
    Academic evaluation module (NOT blocking interview).
    """

    knowledge = evaluate_knowledge(question, answer, expected_concepts=[])
    fluency = compute_fluency(answer)
    tone = detect_tone(answer)
    resume_match = resume_answer_alignment(answer, remaining_skills)

    final_scores = aggregate_final_score(
        knowledge=knowledge,
        fluency_score=fluency,
        tone=tone,
        resume=resume_match
    )

    feedback = generate_feedback(final_scores)

    return {
        "scores": final_scores,
        "feedback": feedback
    }