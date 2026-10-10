import { useNavigate } from "react-router-dom";
import "../styles/practice.css";

const topics = [
  { title: "ALGORITHMS", icon: "</>", path: "algorithms" },
  { title: "DATA STRUCTURES", icon: "\u{1F4DA}", path: "data-structures" },
  { title: "SYSTEM DESIGN", icon: "\u{1F9E0}", path: "system-design" },
  { title: "CODING PATTERNS", icon: "\u{1F4BB}", path: "coding-patterns" },
  { title: "BEHAVIORAL", icon: "\u{1F4AC}", path: "behavioral" },
  { title: "HR QUESTIONS", icon: "\u{1F4BC}", path: "hr" },
  { title: "APTITUDE", icon: "\u{1F6E1}\u{FE0F}", path: "aptitude" },
  { title: "CS CORE CONCEPTS QUESTIONS", icon: "\u{2699}\u{FE0F}", path: "cs-concepts" },
];

function Practice() {
  const navigate = useNavigate();

  return (
    <div className="practice-container">
      <h1 className="main-title">PRACTICE ARENA</h1>
      <p className="subtitle">Sharpen your skills with targeted practice sessions</p>

      <h2 className="section-title">TOPIC-BASED TRAINING</h2>

      <div className="topic-grid">
        {topics.map((topic, index) => (
          <div
            key={index}
            onClick={() => navigate(`/practice/${topic.path}`)}
            className="topic-card"
          >
            <span className="icon">{topic.icon}</span>
            <p>{topic.title}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">COMPANY-SPECIFIC PREP</h2>

      <div className="company-grid">
        {companyCard("GOOGLE", "247 questions", "blue", () => navigate("/practice/google"))}
        {companyCard("AMAZON", "312 questions", "orange", () => navigate("/practice/amazon"))}
        {companyCard("MICROSOFT", "198 questions", "sky", () => navigate("/practice/microsoft"))}
        {companyCard("META", "276 questions", "purple", () => navigate("/practice/meta"))}
        {companyCard("APPLE", "165 questions", "gray", () => navigate("/practice/apple"))}
        {companyCard("NETFLIX", "143 questions", "red", () => navigate("/practice/netflix"))}
      </div>
    </div>
  );
}

function companyCard(name, count, color, onClick) {
  return (
    <div className={`company-card ${color}`}>
      <h3>{name}</h3>
      <p>{count}</p>
      <button onClick={onClick}>START PREP</button>
    </div>
  );
}

export default Practice;
