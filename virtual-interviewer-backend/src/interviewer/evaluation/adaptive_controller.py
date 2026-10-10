class AdaptiveInterviewController:
    def __init__(self):
        self.skills = []
        self.current_index = 0
        self.previous_questions = []
        self.max_questions = 3
        self.question_count = 0
        self.opening_done = False

        self.duration = "30"
        self.role = "Software Engineer"
        self.difficulty = "basic"
        self.interview_type = "Technical"


    def start_interview(self, resume_text, interview_type, difficulty, role, duration):
        print("START INTERVIEW CALLED")

        from evaluation.resume_skill_extractor import extract_skills
        from evaluation.question_planner import plan_questions

        # Store config
        self.interview_type = interview_type
        self.difficulty = difficulty
        self.role = role
        self.duration = duration

        # Extract skills safely
        skills = extract_skills(resume_text)
        print("EXTRACTED SKILLS:", skills)

        # HARD FALLBACK
        if not skills or len(skills) == 0:
            print("⚠️ NO SKILLS FOUND - USING DEFAULT SKILLS")
            skills = ["python", "javascript", "data structures", "oop"]

        # Plan questions
        self.skills = plan_questions(skills, role)
        if not self.skills or len(self.skills) == 0:
            print("⚠️ plan_questions failed - using raw skills")
            self.skills = skills

        # Reset counters
        self.current_index = 0
        self.previous_questions = []
        self.question_count = 0
        self.opening_done = False

        # Opening question
        opening = "Hello. Tell me about yourself."
        self.previous_questions.append(opening)

        return {
            "question": opening,
            "current_question": 0,
            "total_questions": self.max_questions
        }

    # ================= PROCESS ANSWER =================
    def process_answer(self, answer):
        print("\nQUESTION COUNT:", self.question_count)
        print("SKILLS:", self.skills)
        print("PROCESS ANSWER:", answer)

        from evaluation.question_generator import generate_question

        # Ensure skills NEVER empty (CRITICAL FIX)
        if not self.skills or len(self.skills) == 0:
            print("⚠️ SKILLS EMPTY DURING INTERVIEW - FORCING FALLBACK")
            self.skills = ["python", "javascript", "data structures", "oop"]

        # Opening handled
        if not self.opening_done:
            self.opening_done = True

            skill = self.skills[0]
            try:
                question = generate_question(skill, self.role, self.difficulty,
                                             self.interview_type, self.duration,
                                             self.skills, self.previous_questions)
            except Exception as e:
                print("GEN ERROR:", e)
                question = f"Explain {skill}."

            self.previous_questions.append(question)
            self.question_count = 1

            return {
                "done": False,
                "question": question,
                "current_question": 1,
                "total_questions": self.max_questions
            }

        # Stop condition
        if self.question_count >= self.max_questions:
            print("✅ INTERVIEW FINISHED")
            return {"done": True}

        # Next question safely
        self.current_index = (self.current_index + 1) % len(self.skills)
        skill = self.skills[self.current_index]

        try:
            question = generate_question(skill, self.role, self.difficulty,
                                         self.interview_type, self.duration,
                                         self.skills, self.previous_questions)
        except Exception as e:
            print("GEN ERROR:", e)
            question = f"Explain {skill}."

        self.previous_questions.append(question)
        self.question_count += 1

        return {
            "done": False,
            "question": question,
            "current_question": self.question_count,
            "total_questions": self.max_questions
        }