import { useNavigate, useParams } from "react-router-dom";
import CodingChallengePage from "../components/CodingChallengePage";
import metaQuestions from "../data/coding/meta.json";

export default function MetaCodingTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  return (
    <CodingChallengePage
      title="META CODING TEST"
      questions={metaQuestions}
      storageKey={`meta-progress-${testId}`}
      analyticsContext={{ track: "meta", topic: "meta", testId }}
      onExit={() => navigate("/practice/meta")}
      onTestSubmit={() => navigate("/practice/meta")}
    />
  );
}
