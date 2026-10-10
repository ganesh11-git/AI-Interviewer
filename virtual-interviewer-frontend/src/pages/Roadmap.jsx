import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { roadmapData } from "../data/roadmapData";
import PhaseCard from "../components/PhaseCard";
import "../styles/roadmap.css";

export default function Roadmap() {
  const [selected, setSelected] = useState("Full Stack Developer");
  const [data, setData] = useState(roadmapData);
  const navigate = useNavigate();

  /* ===== OVERALL PROGRESS ===== */
  const allTopics = data[selected].flatMap(phase => phase.topics);
  const completed = allTopics.filter(t => t.done).length;
  const total = allTopics.length;
  const overallProgress = total
    ? Math.round((completed / total) * 100)
    : 0;

  return (
    <div className="roadmap-page">

      {/* ===== PAGE HEADER ===== */}
      <h1 className="heading">🚀 Learning Roadmap</h1>

      {/* ===== OVERALL PROGRESS ===== */}
      <div className="overall-box">
        <h2>Overall Progress</h2>
        <p>{completed} / {total} topics completed</p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <p>{overallProgress}% Completed</p>
      </div>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="roadmap-layout">

        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="selector-box">
          <h3>Select Roadmap</h3>

          {Object.keys(data).map(role => (
            <button
              key={role}
              className={selected === role ? "active" : ""}
              onClick={() => setSelected(role)}
            >
              {role}
            </button>
          ))}

          <button
            className="ai-main-btn"
            onClick={() => navigate("/ai-roadmap")}
          >
            🤖 AI Personalized Roadmap
          </button>
        </aside>

        {/* ===== ROADMAP CONTENT ===== */}
        <section className="timeline">
          <h2>{selected} Path</h2>

          {data[selected].map((phase, index) => (
            <PhaseCard
              key={index}
              phase={phase}
              phaseIndex={index}
              data={data}
              setData={setData}
              selected={selected}
            />
          ))}
        </section>

      </div>
    </div>
  );
}