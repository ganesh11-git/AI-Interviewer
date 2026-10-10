import os
import requests
import json
from dotenv import load_dotenv


# -------- SIMPLE RESEARCH FRIENDLY SCORING -------- #

load_dotenv()

def evaluate_knowledge(question, answer, expected_concepts=None):
    if not answer or len(answer.strip()) < 5:
        return {"knowledge_score": 10}
    return {"knowledge_score": min(len(answer.split()) * 2, 100)}


def fluency_score(answer):
    if not answer:
        return 10
    return min(len(answer.split()), 100)


def tone_analysis(answer):
    return {"confidence": 0.7}


def resume_match_score(answer, resume_text=""):
    return {"resume_match_score": 60}


# -------- AGGREGATION -------- #

def aggregate_final_score(knowledge, fluency, tone, resume):

    final_score = (
        0.4 * knowledge["knowledge_score"]
        + 0.2 * fluency
        + 0.15 * resume["resume_match_score"]
        + 0.15 * (tone["confidence"] * 100)
    )

    return {
        "final_score": round(final_score, 2),
        "breakdown": {
            "knowledge": knowledge["knowledge_score"],
            "fluency": fluency,
            "resume_match": resume["resume_match_score"],
            "tone_confidence": tone["confidence"]
        }
    }


# -------- MAIN ENTRY -------- #

def evaluate_answer(question, answer, resume_text=""):

    knowledge = evaluate_knowledge(question, answer)
    fluency = fluency_score(answer)
    tone = tone_analysis(answer)
    resume = resume_match_score(answer, resume_text)

    return aggregate_final_score(knowledge, fluency, tone, resume)


# ================= LLM FEEDBACK GENERATION ================= #

import re

def generate_llm_feedback(transcript, resume_text=""):

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    prompt = f"""
You are an expert technical interviewer.

Analyze the following interview transcript and provide feedback.

Return ONLY valid JSON. Do not include markdown.

Format:

{{
 "feedback": "overall evaluation",
 "strong_areas": [],
 "weak_areas": [],
 "suggestions": []
}}

Resume:
{resume_text}

Transcript:
{transcript}
"""

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3
            }
        )

        data = response.json()

        print("GROQ RAW RESPONSE:", data)

        result = data["choices"][0]["message"]["content"]

        # Remove markdown if present
        clean = re.sub(r"```json|```", "", result).strip()

        return json.loads(clean)

    except Exception as e:

        print("LLM FEEDBACK ERROR:", e)

        # Safe fallback so UI never breaks
        return {
            "feedback": "The candidate demonstrated moderate understanding of the discussed concepts.",
            "strong_areas": ["Basic conceptual understanding"],
            "weak_areas": ["Depth of explanation", "Technical clarity"],
            "suggestions": [
                "Provide more detailed explanations",
                "Practice more real-world examples"
            ]
        }

# ================= FINAL INTERVIEW REPORT ================= #

def generate_final_feedback(transcript, resume_text=""):

    scores = []

    for qa in transcript:

        q = qa["question"]
        a = qa["answer"]

        result = evaluate_answer(q, a, resume_text)

        scores.append(result["final_score"])

    overall = sum(scores) / len(scores) if scores else 0

    llm_feedback = generate_llm_feedback(transcript, resume_text)

    return {

        "overall_score": round(overall, 2),

        "feedback": llm_feedback["feedback"],

        "strong_areas": llm_feedback["strong_areas"],

        "weak_areas": llm_feedback["weak_areas"],

        "suggestions": llm_feedback["suggestions"]
    }