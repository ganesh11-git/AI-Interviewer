export default function PhaseCard({ phase, phaseIndex, data, setData, selected }) {

  
  const toggleTopic = (topicIndex) => {
    setData(prev => {
      const newData = { ...prev };

      newData[selected] = prev[selected].map((p, pIdx) => {
        if (pIdx !== phaseIndex) return p;

        return {
          ...p,
          topics: p.topics.map((t, tIdx) =>
            tIdx === topicIndex ? { ...t, done: !t.done } : t
          )
        };
      });

      return newData;
    });
  };

  
  const completed = phase.topics.filter(t => t.done).length;
  const total = phase.topics.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="phase-card">

      <h3>{phase.phase}</h3>
      <p>{completed}/{total} topics completed</p>
      <p>{percent}% Completed</p>

      <ul>
        {phase.topics.map((t, index) => (
          <li key={index} className="topic-item">
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTopic(index)}
            />
            <span>{t.name}</span>
          </li>
        ))}
      </ul>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

    </div>
  );
}