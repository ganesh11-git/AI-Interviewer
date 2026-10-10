import { useState } from "react";
import Scene from "./Scene";

export default function Interviewer_3d() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const askQuestion = async () => {
    const res = await fetch("http://localhost:5000/api/question");
    const data = await res.json();

    speak(data.question);
  };

  return (
    <div>
      <Scene isSpeaking={isSpeaking} />

      <button onClick={askQuestion}>
        Start Interview
      </button>
    </div>
  );
}