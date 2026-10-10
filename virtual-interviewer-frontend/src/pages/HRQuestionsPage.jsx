import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QUESTIONS = [
  {
    question: "Tell me about yourself.",
    answer:
      "I am a motivated individual with strong problem-solving skills and a passion for technology.",
  },
  {
    question: "Why do you want this job?",
    answer:
      "I want this role because it aligns with my skills and provides opportunities to grow.",
  },
  {
    question: "What are your strengths?",
    answer:
      "My strengths include adaptability, teamwork, and a positive learning attitude.",
  },
  {
    question: "What are your weaknesses?",
    answer:
      "Sometimes I focus too much on details, but I am learning to balance speed and accuracy.",
  },
  {
    question: "Where do you see yourself in 5 years?",
    answer:
      "I see myself as a skilled professional taking on more responsibilities and leadership roles.",
  },
];

export default function HRQuestionsPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  return (
    <div className="qa-page">

      {/* HEADER */}
      <div className="qa-header">

        <div>
          <h1 className="qa-title">
            HR Questions
          </h1>
          <p className="qa-subtitle">
            Click a question to view answer
          </p>
        </div>

        <button
          onClick={() => navigate("/practice")}
          className="qa-back-btn"
        >
          Back to Practice
        </button>

      </div>

      {/* QUESTIONS LIST */}
      <div className="qa-list">

        {QUESTIONS.map((q, i) => (
          <div
            key={i}
            className="qa-card"
          >

            {/* QUESTION */}
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="qa-toggle"
            >

              <div className="qa-left">

                <div className="qa-index">
                  {i + 1}
                </div>

                <p className="qa-question">
                  {q.question}
                </p>

              </div>

              <span className="qa-icon">
                {open === i ? "−" : "+"}
              </span>

            </button>

            {/* ANSWER */}
            {open === i && (
              <div className="qa-answer">
                {q.answer}
              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}
