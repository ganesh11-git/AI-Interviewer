import { useNavigate, useParams } from "react-router-dom";
import CodingChallengePage from "../components/CodingChallengePage";
import appleQuestions from "../data/coding/apple.json";

export default function AppleCodingTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  return (
    <CodingChallengePage
      title="APPLE CODING TEST"
      questions={appleQuestions}
      storageKey={`apple-progress-${testId}`}
      analyticsContext={{ track: "apple", topic: "apple", testId }}
      onExit={() => navigate("/practice/apple")}
      onTestSubmit={() => navigate("/practice/apple")}
    />
  );
}
