import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ACTIVE_TOPICS = [
  "algorithms",
  "data-structures",
  "coding-patterns",
  "aptitude",
];

export default function LevelTests() {
  const navigate = useNavigate();
  const { topic } = useParams();
  const ready = Boolean(topic);

  useEffect(() => {
    if (!ready) navigate("/practice");
  }, [ready, navigate]);

  if (!ready) return null;

  const formattedTopic = topic
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");

  if (!ACTIVE_TOPICS.includes(topic)) {
    return (
      <div className="level-wrapper center">
        <div className="coming-box">
          <h1>{formattedTopic}</h1>
          <p>This section is under development</p>
          <button onClick={() => navigate("/practice")}>Back to Practice</button>
        </div>
      </div>
    );
  }

  const topicText = {
    algorithms: {
      basic: "Fundamental concepts and simple algorithms",
      intermediate: "Common patterns and optimization techniques",
      advanced: "Complex algorithms and data structures",
    },
    "data-structures": {
      basic: "Arrays, Strings, Linked Lists, Stacks and Queues",
      intermediate: "Trees, Heaps, Hashing, Binary Search Trees",
      advanced: "Graphs, Tries, Advanced Trees and Complex Structures",
    },
    "coding-patterns": {
      basic: "Two Pointers, Sliding Window, Prefix Sum",
      intermediate: "Fast & Slow Pointers, Merge Intervals, Cyclic Sort",
      advanced: "Dynamic Programming, Backtracking, Bit Manipulation",
    },
    aptitude: {
      basic: "Numbers, Percentages, Ratio & Proportion",
      intermediate: "Time & Work, Speed & Distance, Averages",
      advanced: "Probability, Permutation & Combination, Data Interpretation",
    },
  };

  const descriptions = topicText[topic];

  return (
    <div className="level-wrapper">
      <div className="level-header">
        <button onClick={() => navigate("/practice")} className="back-btn">←</button>
        <div>
          <h1>{formattedTopic}</h1>
          <p>Select difficulty level</p>
        </div>
      </div>

      <h2 className="section-title">SELECT DIFFICULTY</h2>

      <div className="level-grid">
        <div className="level-card basic" onClick={() => navigate(`/practice/${topic}/basic`)}>
          <div className="emoji">🎯</div>
          <span>BASIC</span>
          <p>{descriptions.basic}</p>
        </div>

        <div className="level-card intermediate" onClick={() => navigate(`/practice/${topic}/intermediate`)}>
          <div className="emoji">🔥</div>
          <span>INTERMEDIATE</span>
          <p>{descriptions.intermediate}</p>
        </div>

        <div className="level-card advanced" onClick={() => navigate(`/practice/${topic}/advanced`)}>
          <div className="emoji">🏆</div>
          <span>ADVANCED</span>
          <p>{descriptions.advanced}</p>
        </div>
      </div>
    </div>
  );
}
