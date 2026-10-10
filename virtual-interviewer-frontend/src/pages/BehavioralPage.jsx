import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QUESTIONS = [
  {
    question: "Tell me about a time you faced a challenge at college or work.",
    answer:
      "I faced a challenge when a project deadline was very close and some team members were unavailable. I reorganized the work and ensured we completed it on time.",
  },
  {
    question: "How do you handle pressure or tight deadlines?",
    answer:
      "I stay calm, break tasks into smaller parts, and focus on priorities to complete work efficiently.",
  },
  {
    question: "Describe a situation where you worked in a team.",
    answer:
      "I worked in a team during my final year project where we shared responsibilities and communicated regularly.",
  },
  {
    question: "Tell me about a failure and what you learned.",
    answer:
      "I once misunderstood requirements and had to redo work. I learned the importance of clear communication.",
  },
  {
    question: "How do you accept feedback?",
    answer:
      "I take feedback positively and use it to improve myself.",
  },
];

export default function BehavioralPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  return (
    <div className="qa-page">

      {/* HEADER */}
      <div className="qa-header">

        <div>
          <h1 className="qa-title">
            Behavioral Questions
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
