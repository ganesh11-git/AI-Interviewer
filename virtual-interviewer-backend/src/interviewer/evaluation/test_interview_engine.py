from interview_engine import run_interview_step

resume = """
Strong in SQL and database normalization.
Worked with indexing and MERN stack.
"""

result = run_interview_step(
    resume_text=resume,
    previous_question="What is SQL and why is it used in databases?",  # 👈 ADD THIS
    current_skill="sql",
    current_level="basic",
    answer="SQL is used to query relational databases and manage data.",
    remaining_skills=["database normalization", "indexing"]
)

print(result["next_question"])
print(result["scores"])
print(result["feedback"])