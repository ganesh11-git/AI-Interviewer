import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMcqQuestions } from "../data/mcq/questions";
import {
  getProgressPercent,
  getTestProgressKey,
  loadProgress,
} from "../utils/progressStorage";

export default function TestList() {
  const { topic, level } = useParams();
  const navigate = useNavigate();
  const ready = Boolean(topic && level);

  const formattedTopic = useMemo(
    () =>
      (topic || "")
        .split("-")
        .map((word) => word.toUpperCase())
        .join(" "),
    [topic]
  );

  const tests = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: `test-${i + 1}`,
        name: `${formattedTopic} Test_${i + 1}`,
        start: `${27 + i} Sep 25`,
        end: "31 May 28",
      })),
    [formattedTopic]
  );

  const [activeId, setActiveId] = useState(() => {
    if (!ready) return tests[0]?.id || "";
    const last = localStorage.getItem(`last-test-${topic}-${level}`);
    if (last && tests.some((t) => t.id === last)) return last;
    return tests[0]?.id || "";
  });

  useEffect(() => {
    if (!ready) navigate("/practice");
  }, [ready, navigate]);

  if (!ready) return null;
  const active = tests.find((t) => t.id === activeId) || tests[0];
  if (!active) return null;

  const storageKey = getTestProgressKey(topic, level, active.id);
  const saved = loadProgress(storageKey);
  const totalQuestions = getMcqQuestions(topic).length || 10;
  const percent = getProgressPercent(saved, totalQuestions);

  const handleStartTest = () => {
    navigate(`/practice/${topic}/${level}/${active.id}`);
  };

  return (
    <div className="testlist-container">
      <div className="testlist-left">
        <input placeholder="Search" className="search-box" />

        <div className="practice-header">
          <h2>{formattedTopic}_Practice</h2>
          <div className="progress-pill">{percent}%</div>
        </div>

        {tests.map((test, i) => (
          <div
            key={test.id}
            onClick={() => setActiveId(test.id)}
            className={`test-item ${active.id === test.id ? "active" : ""}`}
          >
            <p>{i + 1}. {test.name}</p>
            <small>Start : {test.start} | End : {test.end}</small>
          </div>
        ))}
      </div>

      <div className="testlist-right">
        <div className="testlist-topbar">
          <button onClick={() => navigate(`/practice/${topic}`)} className="back-btn">
            Back to Levels
          </button>

          <button
            onClick={handleStartTest}
            className={`testlist-start ${percent > 0 ? "resume-btn" : "start-btn"}`}
          >
            {percent > 0 ? "Resume Test" : "Start Test"}
          </button>
        </div>

        <div className="test-header">
          <h1>{active.name}</h1>
        </div>

        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th className="cell">SNo</th>
                <th>Name</th>
                <th>Questions</th>
                <th>Duration</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="cell">1</td>
                <td>{formattedTopic}</td>
                <td>{totalQuestions}</td>
                <td>Unlimited</td>
                <td>{totalQuestions}</td>
              </tr>
              <tr className="total-row">
                <td className="cell"></td>
                <td>Total</td>
                <td>{totalQuestions}</td>
                <td>Unlimited</td>
                <td>{totalQuestions}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
