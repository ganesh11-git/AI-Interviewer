import { useNavigate, useParams } from "react-router-dom";
import CodingChallengePage from "../components/CodingChallengePage";
import netflixQuestions from "../data/coding/netflix.json";

export default function NetflixCodingTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  return (
    <CodingChallengePage
      title="NETFLIX CODING TEST"
      questions={netflixQuestions}
      storageKey={`netflix-progress-${testId}`}
      analyticsContext={{ track: "netflix", topic: "netflix", testId }}
      onExit={() => navigate("/practice/netflix")}
      onTestSubmit={() => navigate("/practice/netflix")}
    />
  );
}
