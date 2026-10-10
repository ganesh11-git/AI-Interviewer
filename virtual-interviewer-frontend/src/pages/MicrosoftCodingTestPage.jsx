import { useNavigate, useParams } from "react-router-dom";
import CodingChallengePage from "../components/CodingChallengePage";
import microsoftQuestions from "../data/coding/microsoft.json";

export default function MicrosoftCodingTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  return (
    <CodingChallengePage
      title="MICROSOFT CODING TEST"
      questions={microsoftQuestions}
      storageKey={`microsoft-progress-${testId}`}
      analyticsContext={{ track: "microsoft", topic: "microsoft", testId }}
      onExit={() => navigate("/practice/microsoft")}
      onTestSubmit={() => navigate("/practice/microsoft")}
    />
  );
}
