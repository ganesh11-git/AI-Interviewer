import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { getJudge0Health, runJudge0 } from "../services/judge0";
import { emitAssessmentEvent } from "../utils/analytics";
import {
  loadProgressWithServer,
  saveProgressWithServer,
} from "../utils/progressStorage";
import {
  buildOutputText,
  handleTabIndent,
  hasExecutionError,
  isOutputMatch,
  validateBeforeRun,
} from "../utils/codingRuntime";

const STORAGE_VERSION = 2;

function loadState(storageKey) {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey));
    if (!raw) return {};
    if (raw.v === STORAGE_VERSION) return raw;
    if (raw.v == null) {
      return {
        v: STORAGE_VERSION,
        current: raw.current || 0,
        language: raw.language || "python",
        visited: raw.visited || {},
        answered: raw.answered || {},
        codeByQuestion: raw.codeByQuestion || {},
        customInputs: raw.customInputs || {},
      };
    }
    return {};
  } catch {
    return {};
  }
}

function mapStatusLabel(result) {
  const status = (result?.status?.description || "").toLowerCase();
  if (status.includes("accepted")) return "Accepted";
  if (status.includes("wrong answer")) return "Wrong Answer";
  if (status.includes("compilation error")) return "Compilation Error";
  if (status.includes("runtime error")) return "Runtime Error";
  if (status.includes("time limit exceeded")) return "Time Limit Exceeded";
  if (status.includes("memory limit exceeded")) return "Memory Limit Exceeded";
  if (status) return result.status.description;
  return "Unknown";
}

function requiresStdin(code, language) {
  if (!code.trim()) return false;

  if (language === "python") {
    return /\binput\s*\(/.test(code);
  }

  if (language === "c") {
    return /\bscanf\s*\(|\bfgets\s*\(|\bgetchar\s*\(/.test(code);
  }

  if (language === "java") {
    return /\bScanner\s*\(|\.next(?:Int|Long|Double|Float|Line|Short|Byte|Boolean)?\s*\(/.test(code);
  }

  return false;
}

export default function CodingChallengePage({
  title,
  questions,
  storageKey,
  analyticsContext,
  onAnalyticsEvent,
  onExit,
  onTestSubmit,
  showAnswered = false,
}) {
  const startTsRef = useRef(Date.now());
  const openedRef = useRef(false);
  const saved = loadState(storageKey);
  const [current, setCurrent] = useState(saved.current || 0);
  const [language, setLanguage] = useState(saved.language || "python");
  const [visited, setVisited] = useState(saved.visited || {});
  const [answered, setAnswered] = useState(saved.answered || {});
  const [codeByQuestion, setCodeByQuestion] = useState(saved.codeByQuestion || {});
  const [customInputs, setCustomInputs] = useState(saved.customInputs || {});
  const [running, setRunning] = useState(false);
  const [, setHealth] = useState({ status: "checking", baseUrl: "" });
  const [resultPanel, setResultPanel] = useState({
    mode: "idle",
    title: "Output",
    text: "",
    tests: null,
  });

  const q = questions[current];
  const context = analyticsContext || {};
  const emit = (payload) =>
    emitAssessmentEvent(
      {
        ts: Date.now(),
        ...context,
        ...payload,
      },
      onAnalyticsEvent
    );

  useEffect(() => {
    if (!questions.length || openedRef.current) return;
    openedRef.current = true;
    emit({
      type: "test_opened",
      testId: context.testId || storageKey,
    });
  }, [questions.length, context.testId, storageKey]);

  useEffect(() => {
    if (!q) return;
    emit({
      type: "question_changed",
      testId: context.testId || storageKey,
      questionId: q.id || `q-${current + 1}`,
      index: current,
    });
  }, [current, q, context.testId, storageKey]);
  const currentCode = q?.id ? codeByQuestion[q.id] || "" : "";
  const customInput = useMemo(() => (q?.id ? customInputs[q.id] || "" : ""), [customInputs, q]);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches;

  useEffect(() => {
    const state = {
      v: STORAGE_VERSION,
      current,
      language,
      visited,
      answered,
      codeByQuestion,
      customInputs,
    };
    const timer = setTimeout(() => {
      saveProgressWithServer(storageKey, state);
    }, 250);
    return () => clearTimeout(timer);
  }, [storageKey, current, language, visited, answered, codeByQuestion, customInputs]);

  useEffect(() => {
    let active = true;
    loadProgressWithServer(storageKey).then((serverState) => {
      if (!active || !serverState || typeof serverState !== "object") return;
      if (Number.isInteger(serverState.current)) {
        setCurrent(Math.min(serverState.current, questions.length - 1));
      }
      if (typeof serverState.language === "string") setLanguage(serverState.language);
      if (serverState.visited && typeof serverState.visited === "object") setVisited(serverState.visited);
      if (serverState.answered && typeof serverState.answered === "object") setAnswered(serverState.answered);
      if (serverState.codeByQuestion && typeof serverState.codeByQuestion === "object") {
        setCodeByQuestion(serverState.codeByQuestion);
      }
      if (serverState.customInputs && typeof serverState.customInputs === "object") {
        setCustomInputs(serverState.customInputs);
      }
    });

    return () => {
      active = false;
    };
  }, [storageKey, questions.length]);

  useEffect(() => {
    setVisited((prev) => ({ ...prev, [current]: true }));
    setResultPanel({ mode: "idle", title: "Output", text: "", tests: null });
  }, [current]);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      const status = await getJudge0Health();
      if (active) setHealth(status);
    };
    poll();
    const timer = setInterval(poll, 20000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  if (!q) {
    return (
      <div className="coding-container">
        <div className="coding-topbar">
          <h1>No Questions Found</h1>
          <button className="submit-btn" onClick={onExit}>Back</button>
        </div>
      </div>
    );
  }

  const setCurrentCode = (value) => {
    setCodeByQuestion((prev) => ({ ...prev, [q.id]: value }));
  };

  const setCustomInput = (value) => {
    setCustomInputs((prev) => ({ ...prev, [q.id]: value }));
  };

  const validate = () => {
    const msg = validateBeforeRun({ language, code: currentCode });
    if (!msg) return "";
    setResultPanel({
      mode: "error",
      title: msg.toLowerCase().includes("warning") ? "Code Warning" : "Validation Failed",
      text: msg,
      tests: null,
    });
    return msg.toLowerCase().includes("warning") ? "" : msg;
  };

  const handleRun = async () => {
    if (validate()) return;
    emit({
      type: "run_clicked",
      testId: context.testId || storageKey,
      questionId: q.id || `q-${current + 1}`,
      language,
    });
    try {
      setRunning(true);
      setResultPanel({
        mode: "running",
        title: "Running...",
        text: "Compiling and executing your code.",
        tests: null,
      });
      const autoInput =
        requiresStdin(currentCode, language) && !customInput.trim()
          ? q.sampleInput || ""
          : customInput || "";
      const result = await runJudge0({
        languageKey: language,
        source: currentCode,
        stdin: autoInput,
      });
      setResultPanel({
        mode: "run",
        title: "Run Output",
        text: buildOutputText(result, language) || "No output returned.",
        tests: null,
      });
    } catch (error) {
      setResultPanel({
        mode: "error",
        title: "Run Failed",
        text: error.message || "Failed to run code.",
        tests: null,
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (validate()) return;
    emit({
      type: "submit_clicked",
      testId: context.testId || storageKey,
      questionId: q.id || `q-${current + 1}`,
      language,
    });
    try {
      setRunning(true);
      setResultPanel({
        mode: "running",
        title: "Submitting...",
        text: "Running test cases. This can take a moment.",
        tests: null,
      });

      const hasCustomInput = customInput.trim().length > 0;
      const cases = hasCustomInput
        ? [{ type: "custom", input: customInput }, ...q.hiddenTestCases.map((t) => ({ ...t, type: "default" }))]
        : q.hiddenTestCases.map((t) => ({ ...t, type: "default" }));

      let defaultCounter = 0;
      const tests = [];
      for (let i = 0; i < cases.length; i += 1) {
        const testCase = cases[i];
        const result = await runJudge0({
          languageKey: language,
          source: currentCode,
          stdin: testCase.input || "",
        });

        const hasError = hasExecutionError(result);
        const passed =
          testCase.type === "custom"
            ? !hasError
            : !hasError && isOutputMatch(testCase.output || "", result.stdout || "", q.comparator || "relaxed");
        if (testCase.type === "default") defaultCounter += 1;

        tests.push({
          index: i + 1,
          label: testCase.type === "custom" ? "Custom Test" : `Test Case ${defaultCounter}`,
          passed,
          kind: testCase.type,
          status: mapStatusLabel(result),
          actual: result.stdout || "",
          stderr: result.stderr || "",
          compile: result.compile_output || "",
        });
      }

      const defaultTests = tests.filter((t) => t.kind === "default");
      const defaultPassed = defaultTests.filter((t) => t.passed).length;
      setResultPanel({
        mode: "submit",
        title: `Results (${defaultPassed}/${defaultTests.length} default passed)`,
        text: "",
        tests,
      });
      if (showAnswered) {
        setAnswered((prev) => ({ ...prev, [current]: defaultPassed === defaultTests.length }));
      }
    } catch (error) {
      setResultPanel({
        mode: "error",
        title: "Submission Failed",
        text: error.message || "Failed to submit code.",
        tests: null,
      });
    } finally {
      setRunning(false);
    }
  };

  const renderEditor = () => {
    if (isMobile) {
      return (
        <textarea
          value={currentCode}
          onChange={(e) => setCurrentCode(e.target.value)}
          onKeyDown={handleTabIndent}
          className="company-textarea"
          placeholder="Write your code"
          aria-label="Code editor"
        />
      );
    }
    return (
      <Editor
        height="40vh"
        theme="vs-dark"
        language={language === "python" ? "python" : language}
        value={currentCode}
        onChange={(value) => setCurrentCode(value || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          tabSize: 2,
          ariaLabel: "Code editor",
        }}
      />
    );
  };

  return (
    <div className="coding-container">
      <div className="coding-topbar">
        <h1>{title}</h1>
        <div className="top-buttons">
          <button className="pause-btn" aria-label="Back to tests" onClick={onExit}>||</button>
          <button
            className="submit-btn"
            onClick={() => {
              emit({
                type: "test_completed",
                testId: context.testId || storageKey,
                total: questions.length,
                durationSec: Math.round((Date.now() - startTsRef.current) / 1000),
              });
              (onTestSubmit || onExit)?.();
            }}
          >
            Submit Test
          </button>
        </div>
      </div>

      <div className="coding-body">
        <div className="question-nav" aria-label="Question navigation">
          {questions.map((_, i) => (
            <button
              key={questions[i].id || i}
              onClick={() => setCurrent(i)}
              className={`nav-btn ${current === i ? "active" : ""} ${visited[i] ? "visited" : ""} ${showAnswered && answered[i] ? "answered" : ""}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="question-panel">
          <div className="question-count">Question {current + 1} / {questions.length}</div>
          <h2>{q.title}</h2>
          <pre className="statement-box">{q.statement}</pre>
          <div className="io-grid">
            <div className="io-box"><b>Input Format</b><div>{q.inputFormat}</div></div>
            <div className="io-box"><b>Constraints</b><div>{q.constraints}</div></div>
            <div className="io-box"><b>Sample Input</b><div>{q.sampleInput}</div></div>
            <div className="io-box"><b>Sample Output</b><div>{q.sampleOutput}</div></div>
          </div>
          <div className="explanation-box"><b>Explanation</b><p>{q.explanation}</p></div>
        </div>

        <div className="editor-panel">
          <div className="editor-header">
            <span>
              Fill your code here ({language === "python" ? "Python 3.x" : language.toUpperCase()})
            </span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Language">
              <option value="python">Python</option>
              <option value="c">C</option>
              <option value="java">Java</option>
            </select>
          </div>

          {renderEditor()}

          <div className="custom-input-panel">
            <div className="output-header"><span>Console Input (stdin)</span></div>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Optional: leave empty to auto-use sample input on Run"
              aria-label="Custom input"
            />
          </div>

          <div className="output-panel">
            <div className="output-header">
              <span>{resultPanel.title}</span>
              {resultPanel.mode === "running" && <span className="output-tag">Running</span>}
              {resultPanel.mode === "error" && <span className="output-tag danger">Error</span>}
              {resultPanel.mode === "submit" && <span className="output-tag success">Results</span>}
            </div>
            <div className="output-body">
              {resultPanel.text && <pre className="output-pre">{resultPanel.text}</pre>}
              {Array.isArray(resultPanel.tests) && (
                <div className="test-results">
                  {resultPanel.tests.map((test) => (
                    <div key={`${test.label}-${test.index}`} className={`test-row ${test.passed ? "pass" : "fail"}`}>
                      <div className="test-row-header">
                        <strong>{test.label}</strong>
                        <span>{test.passed ? "Passed" : "Failed"}</span>
                      </div>
                      <div className="test-row-body">
                        {test.status && <div><b>Status:</b> {test.status}</div>}
                        {test.actual && <div><b>Your Output:</b> {test.actual}</div>}
                        {test.stderr && <div><b>Error:</b> {test.stderr}</div>}
                        {test.compile && <div><b>Compile:</b> {test.compile}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="editor-footer">
            <div>
              <button className="clear-btn" onClick={() => setCurrentCode("")} disabled={running}>Clear</button>
              <button className="run-btn" onClick={handleRun} disabled={running}>
                {running ? "Running..." : "Run"}
              </button>
              <button className="submit-code-btn" onClick={handleSubmit} disabled={running}>
                {running ? "Submitting..." : "Submit"}
              </button>
            </div>
            <div>
              <button className="prev-btn" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>Prev</button>
              <button className="next-btn" disabled={current === questions.length - 1} onClick={() => setCurrent((c) => c + 1)}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
