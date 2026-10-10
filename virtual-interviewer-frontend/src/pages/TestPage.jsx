import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMcqQuestions } from "../data/mcq/questions";
import { emitAssessmentEvent } from "../utils/analytics";
import {
  getTestProgressKey,
  loadProgress,
  loadProgressWithServer,
  saveProgressWithServer,
} from "../utils/progressStorage";

export default function TestPage() {
  const { topic, level, testId } = useParams();
  const navigate = useNavigate();

  const ready = Boolean(topic && level && testId);
  const QUESTIONS = useMemo(() => (topic ? getMcqQuestions(topic) : []), [topic]);
  const storageKey = ready ? getTestProgressKey(topic, level, testId) : "";
  const saved = ready ? loadProgress(storageKey) : {};

  const safeInitialIndex =
    QUESTIONS.length > 0
      ? Math.min(saved.current || 0, QUESTIONS.length - 1)
      : 0;

  const [current, setCurrent] = useState(safeInitialIndex);
  const [answers, setAnswers] = useState(saved.answers || {});
  const [visited, setVisited] = useState(
    saved.visited || (QUESTIONS.length > 0 ? { [safeInitialIndex]: true } : {})
  );
  const [submitted, setSubmitted] = useState(Boolean(saved.submitted));
  const openedRef = useRef(false);
  const completedRef = useRef(Boolean(saved.submitted));
  const startTsRef = useRef(Date.now());
  const q = QUESTIONS[current];

  const emit = (payload) =>
    emitAssessmentEvent({
      ts: Date.now(),
      track: "mcq",
      topic,
      level,
      testId,
      ...payload,
    });

  useEffect(() => {
    if (!ready) navigate("/practice");
  }, [ready, navigate]);

  useEffect(() => {
    if (!ready) return;
    let active = true;

    loadProgressWithServer(storageKey).then((serverState) => {
      if (!active || !serverState || typeof serverState !== "object") return;
      setCurrent((prev) =>
        Number.isInteger(serverState.current) && QUESTIONS.length > 0
          ? Math.min(serverState.current, QUESTIONS.length - 1)
          : prev
      );
      if (serverState.answers && typeof serverState.answers === "object") {
        setAnswers(serverState.answers);
      }
      if (serverState.visited && typeof serverState.visited === "object") {
        setVisited(serverState.visited);
      }
      setSubmitted(Boolean(serverState.submitted));
    });

    return () => {
      active = false;
    };
  }, [ready, storageKey, QUESTIONS.length]);

  useEffect(() => {
    if (!ready || !QUESTIONS.length || openedRef.current) return;
    openedRef.current = true;
    emit({
      type: "test_opened",
    });
  }, [ready, QUESTIONS.length]);

  useEffect(() => {
    if (!ready || !q) return;
    emit({
      type: "question_changed",
      questionId: q.id || `q-${current + 1}`,
      index: current,
    });
  }, [ready, current, q]);

  useEffect(() => {
    if (!ready) return;
    const state = { current, answers, visited, submitted };
    const timer = setTimeout(() => {
      saveProgressWithServer(storageKey, state);
      localStorage.setItem(`last-test-${topic}-${level}`, testId);
    }, 250);

    return () => clearTimeout(timer);
  }, [ready, storageKey, current, answers, visited, submitted, topic, level, testId]);

  if (!ready) return null;
  if (!q) return null;

  const goToQuestion = (index) => {
    setVisited((prev) => ({ ...prev, [index]: true }));
    setCurrent(index);
  };

  const handlePause = () => {
    if (!window.confirm("Go back to Test List?")) return;
    navigate(`/practice/${topic}/${level}`);
  };

  const handleSubmitTest = () => {
    emit({
      type: "submit_clicked",
      questionId: q.id || `q-${current + 1}`,
      language: "mcq",
    });
    setSubmitted(true);
  };

  const score = Object.keys(answers).filter(
    (i) => answers[i] === QUESTIONS[i].correct
  ).length;

  useEffect(() => {
    if (!submitted || completedRef.current) return;
    completedRef.current = true;
    emit({
      type: "test_completed",
      score,
      total: QUESTIONS.length,
      durationSec: Math.round((Date.now() - startTsRef.current) / 1000),
    });
  }, [submitted, score, QUESTIONS.length]);

  return (
    <div className="test-container">
      <div className="test-topbar">
        <p>Question {current + 1} / {QUESTIONS.length}</p>
        <button className="pause-btn" onClick={handlePause}>||</button>
      </div>

      <div className="test-layout">
        <div className="test-nav">
          <div className="nav-nums">
            {QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => goToQuestion(i)}
                className={`nav-btn ${current === i ? "active" : ""} ${answers[i] !== undefined ? "answered" : ""} ${visited[i] ? "visited" : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="nav-legend">
            <div><span className="dot green"></span> Answered {Object.keys(answers).length}/{QUESTIONS.length}</div>
            <div><span className="dot orange"></span> Skipped {Object.keys(visited).length - Object.keys(answers).length}/{QUESTIONS.length}</div>
            <div><span className="dot gray"></span> Not Viewed {QUESTIONS.length - Object.keys(visited).length}/{QUESTIONS.length}</div>
            <div><span className="dot blue"></span> Saved in Browser</div>
          </div>
        </div>

        <div className="question-panel">
          <h2>{q.title}</h2>
          <p className="question-text">{q.question}</p>
          {q.code && <pre className="code-box">{q.code}</pre>}
        </div>

        <div className="answer-panel">
          <h3>Answer here</h3>
          {q.options.map((opt, i) => (
            <label key={i} className={`option-box ${answers[current] === i ? "selected" : ""}`}>
              <input
                type="radio"
                checked={answers[current] === i}
                onChange={() => setAnswers({ ...answers, [current]: i })}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {!submitted && (
        <div className="bottom-nav">
          <button
            disabled={current === 0}
            onClick={() => goToQuestion(current - 1)}
            className="nav-control"
          >
            Previous
          </button>

          {current < QUESTIONS.length - 1 ? (
            <button onClick={() => goToQuestion(current + 1)} className="nav-control primary">
              Next
            </button>
          ) : (
            <button onClick={handleSubmitTest} className="nav-control submit">
              Submit Test
            </button>
          )}
        </div>
      )}

      {submitted && (
        <div className="result-box">
          <h2>Score : {score} / {QUESTIONS.length}</h2>
          {QUESTIONS.map((question, i) => (
            <div key={i} className="result-item">
              <p><b>Q{i + 1}.</b> {question.question}</p>
              <p>
                Your Answer :
                <span className={answers[i] === question.correct ? "correct" : "wrong"}>
                  {question.options[answers[i]] || "Not Answered"}
                </span>
              </p>
              <p className="correct">Correct : {question.options[question.correct]}</p>
              <p className="explanation">{question.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
