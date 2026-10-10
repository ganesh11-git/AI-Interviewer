import { useState } from "react";
import "../styles/aiRoadmap.css";

export default function AIRoadmapView() {

  
  const [aiRoadmap, setAiRoadmap] = useState(() => {
    const data = JSON.parse(localStorage.getItem("aiRoadmap")) || [];

    return data.map((phase, pIndex) => ({
      ...phase,
      topics: (phase.topics || []).map((t, tIndex) => ({
        id: `${pIndex}-${tIndex}-${Math.random()}`,
        name: typeof t === "string" ? t : t.name,
        description: typeof t === "string" ? "" : t.description || "",
        done: typeof t === "string" ? false : t.done || false
      }))
    }));
  });

  
  const toggleTopic = (phaseIndex, topicIndex) => {
    setAiRoadmap(prev => {
      const newData = prev.map((phase, pIdx) => {
        if (pIdx !== phaseIndex) return phase;

        return {
          ...phase,
          topics: phase.topics.map((t, tIdx) =>
            tIdx === topicIndex ? { ...t, done: !t.done } : t
          )
        };
      });

      localStorage.setItem("aiRoadmap", JSON.stringify(newData));
      return newData;
    });
  };

  
  const allTopics = aiRoadmap.flatMap(p => p.topics);
  const done = allTopics.filter(t => t.done).length;
  const total = allTopics.length;
  const overallProgress = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="ai-roadmap-page">
      <h1>🔥 AI Learning Roadmap</h1>

      
      <div className="overall-ai-box">
        <p>{done}/{total} topics completed</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
        </div>
        <p>{overallProgress}% Completed</p>
      </div>

      
      {aiRoadmap.map((phase, pIndex) => {
        const completed = phase.topics.filter(t => t.done).length;
        const phaseProgress = Math.round((completed / phase.topics.length) * 100);

        return (
          <div key={pIndex} className="ai-phase-card-ui">

            <h3>Phase {pIndex + 1}: {phase.phase}</h3>
            <p>{completed}/{phase.topics.length} topics completed</p>

            <ul>
              {phase.topics.map((t, tIndex) => (
                <li key={t.id} className="ai-topic-item">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTopic(pIndex, tIndex)}
                  />
                  <div>
                    <b>{t.name}</b>
                    {t.description && <p className="ai-topic-desc">{t.description}</p>}
                  </div>
                </li>
              ))}
            </ul>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${phaseProgress}%` }}></div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
