from resume_alignment import resume_answer_alignment

answer = """
Normalization reduces data redundancy using primary keys.
SQL queries retrieve structured data efficiently.
"""

resume_skills = [
    "database normalization",
    "sql",
    "indexing",
    "primary key"
]

print(resume_answer_alignment(answer, resume_skills))