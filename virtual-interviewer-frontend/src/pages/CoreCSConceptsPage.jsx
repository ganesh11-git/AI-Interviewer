import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= CORE CS QUESTIONS ================= */

const CORE_CS = {
  OS: [
    {
      question: "What is an Operating System?",
      answer:
        "An Operating System is system software that manages hardware resources and provides services to applications like process management, memory management, and file handling.",
    },
    {
      question: "What is a process?",
      answer:
        "A process is a program in execution along with its allocated resources such as memory, registers, and CPU time.",
    },
    {
      question: "What is multithreading?",
      answer:
        "Multithreading allows multiple threads within a process to execute concurrently to improve performance.",
    },
    {
      question: "What is deadlock?",
      answer:
        "Deadlock is a situation where two or more processes are waiting for each other to release resources.",
    },
    {
      question: "What is virtual memory?",
      answer:
        "Virtual memory allows the system to use disk space as additional memory.",
    },
  ],

  DBMS: [
    {
      question: "What is DBMS?",
      answer:
        "DBMS is a software that allows users to store, retrieve, and manage data efficiently.",
    },
    {
      question: "What is normalization?",
      answer:
        "Normalization organizes data to reduce redundancy.",
    },
    {
      question: "What is a primary key?",
      answer:
        "A primary key uniquely identifies each record.",
    },
    {
      question: "What is indexing?",
      answer:
        "Indexing improves data retrieval speed.",
    },
    {
      question: "SQL vs NoSQL?",
      answer:
        "SQL uses structured tables while NoSQL is flexible and scalable.",
    },
  ],

  CN: [
    {
      question: "What is a computer network?",
      answer:
        "A network connects multiple devices to share resources.",
    },
    {
      question: "What is TCP/IP?",
      answer:
        "TCP/IP is a protocol suite for internet communication.",
    },
    {
      question: "What is latency?",
      answer:
        "Latency is transmission delay.",
    },
    {
      question: "What is bandwidth?",
      answer:
        "Bandwidth is maximum data transfer rate.",
    },
    {
      question: "HTTP vs HTTPS?",
      answer:
        "HTTPS is encrypted, HTTP is not.",
    },
  ],

  OOPS: [
    {
      question: "What is OOPS?",
      answer:
        "Object Oriented Programming is based on objects.",
    },
    {
      question: "Encapsulation?",
      answer:
        "Binding data and methods together.",
    },
    {
      question: "Inheritance?",
      answer:
        "Acquiring properties of another class.",
    },
    {
      question: "Polymorphism?",
      answer:
        "Same function behaves differently.",
    },
    {
      question: "Abstraction?",
      answer:
        "Hiding implementation details.",
    },
  ],
};

/* ===================================================== */

export default function CoreCSConceptsPage() {

  const navigate = useNavigate();

  const [openSection, setOpenSection] = useState("OS");
  const [openQuestion, setOpenQuestion] = useState(null);

  const sections = ["OS", "DBMS", "CN", "OOPS"];

  return (
    <div className="corecs-page">

      {/* HEADER */}
      <div className="core-header">

        <div>
          <h1>Core CS Concepts</h1>
          <p>OS, DBMS, Computer Networks & OOPS</p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/practice")}
        >
          Back to Practice
        </button>

      </div>

      {/* TABS */}
      <div className="core-tabs">
        {sections.map(sec => (
          <button
            key={sec}
            className={`tab ${openSection === sec ? "active" : ""}`}
            onClick={() => {
              setOpenSection(sec);
              setOpenQuestion(null);
            }}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* QUESTIONS */}
      <div className="core-questions">

        {CORE_CS[openSection].map((q, i) => (
          <div className="question-card" key={i}>

            <button
              className="question-btn"
              onClick={() =>
                setOpenQuestion(openQuestion === i ? null : i)
              }
            >
              <div className="question-left">
                <div className="number-circle">{i + 1}</div>
                {q.question}
              </div>

              <span className="toggle-icon">
                {openQuestion === i ? "−" : "+"}
              </span>
            </button>

            {openQuestion === i && (
              <div className="answer-box">
                {q.answer}
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}
