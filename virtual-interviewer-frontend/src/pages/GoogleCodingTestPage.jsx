import { useNavigate, useParams } from "react-router-dom";
import CodingChallengePage from "../components/CodingChallengePage";
import googleQuestions from "../data/coding/google.json";

export default function GoogleCodingTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  return (
    <CodingChallengePage
      title="GOOGLE CODING TEST"
      questions={googleQuestions}
      storageKey={`google-progress-${testId}`}
      analyticsContext={{ track: "google", topic: "google", testId }}
      onExit={() => navigate("/practice/google")}
      onTestSubmit={() => navigate("/practice/google")}
    />
  );
}
