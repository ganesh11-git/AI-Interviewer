import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodingChallengePage from "../components/CodingChallengePage";
import commonQuestions from "../data/coding/common.json";

function selectQuestions(topic, level) {
  if (topic === "coding-patterns") {
    return commonQuestions["coding-patterns"]?.[level] || commonQuestions["coding-patterns"]?.advanced || [];
  }
  const dataStructures = commonQuestions["data-structures"];
  if (Array.isArray(dataStructures)) return dataStructures;
  return dataStructures?.[level] || dataStructures?.advanced || [];
}

export default function CodingTestPage({ fixedTopic }) {
  const { topic: routeTopic, level, testId } = useParams();
  const navigate = useNavigate();
  const topic = fixedTopic || routeTopic || "data-structures";
  const questions = useMemo(() => selectQuestions(topic, level), [topic, level]);

  return (
    <CodingChallengePage
      title={topic === "coding-patterns" ? "CODING PATTERNS TEST" : "DATA STRUCTURES TEST"}
      questions={questions}
      storageKey={`test-progress-${topic}-${level}-${testId}`}
      analyticsContext={{ track: topic, topic, level, testId }}
      onExit={() => navigate(`/practice/${topic}/${level}`)}
      onTestSubmit={() => navigate(`/practice/${topic}/${level}`)}
      showAnswered
    />
  );
}
