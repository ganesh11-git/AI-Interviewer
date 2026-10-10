import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

def generate_question(skill, role, difficulty, interview_type, duration, resume_skills=None, previous_questions=None):

    if previous_questions is None:
        previous_questions = []

    if resume_skills is None:
        resume_skills = []

    difficulty_rules = {
        "basic": "Ask a conceptual interview question. No coding.",
        "intermediate": "Ask a coding interview question with a short code snippet.",
        "advanced": "Ask a deep system design or optimization question."
    }

    prev_q_text = "\n".join(previous_questions) if previous_questions else "None"

    prompt = f"""
You are a {interview_type} interviewer.

Candidate Role: {role}
Interview Duration: {duration} minutes
Difficulty Level: {difficulty}
Skill Topic: {skill}

Candidate Resume Skills:
{", ".join(resume_skills)}

Instructions:
{difficulty_rules[difficulty]}

Strict Rules:
- Ask questions relevant to the job role.
- Prioritize resume skills relevant to the role.
- Do not ask unrelated topics.
- Do NOT repeat previous questions.
- Ask ONLY ONE interview question.
- Do NOT add explanations or greetings. Output only the question.

Previous Questions:
{prev_q_text}

Question:
"""

    print("\nPROMPT SENT TO GROQ:\n", prompt)

    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            max_tokens=150
        )

        question = response.choices[0].message.content.strip()
        print("FINAL GENERATED QUESTION:", question)

        # 🔥 Safety fallback
        if not question or len(question) < 5:
            return f"Explain {skill}."

        return question

    except Exception as e:
        print("GROQ ERROR:", e)
        return f"What is {skill}?"