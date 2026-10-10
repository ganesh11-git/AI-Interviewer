import { useNavigate, useParams } from "react-router-dom";
import CodingChallengePage from "../components/CodingChallengePage";
import amazonQuestions from "../data/coding/amazon.json";

export default function AmazonCodingTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  return (
    <CodingChallengePage
      title="AMAZON CODING TEST"
      questions={amazonQuestions}
      storageKey={`amazon-progress-${testId}`}
      analyticsContext={{ track: "amazon", topic: "amazon", testId }}
      onExit={() => navigate("/practice/amazon")}
      onTestSubmit={() => navigate("/practice/amazon")}
    />
  );
}
