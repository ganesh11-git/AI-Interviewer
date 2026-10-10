import { useState } from "react";
import axios from "axios";

export default function Level1Quiz() {
  const [score, setScore] = useState(0);

  const submitQuiz = async () => {
    const userId = localStorage.getItem("userId");

    const res = await axios.post("http://localhost:5000/api/quiz/submit", {
      userId,
      score
    });

    localStorage.setItem("level", res.data.level);

    alert("Your Level: " + res.data.level);
  };

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h2>Level 1 Final Quiz</h2>

    
      <p>Java is platform independent because?</p>
      <button onClick={() => setScore(score + 10)}>Correct Answer</button>

      <h3>Score: {score}</h3>

      <button onClick={submitQuiz} style={{ padding: "10px", background: "cyan" }}>
        Submit Quiz
      </button>
    </div>
  );
}
