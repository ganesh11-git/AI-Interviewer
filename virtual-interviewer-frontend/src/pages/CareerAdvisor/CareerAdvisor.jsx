import { useState } from "react";
import "./careerAdvisor.css";
import axios from "axios";

export default function CareerAdvisor() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/career-advisor/ask", {
        message,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("AI Error");
    }

    setLoading(false);
  };

  return (
    <div className="career-container">
      <h2 className="career-title">🤖 AI Career Advisor</h2>

      <textarea
        className="career-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell me your skills (React, Java, DSA, MongoDB)..."
      />

      <button className="career-btn" onClick={sendMessage}>
        {loading ? "Analyzing..." : "Get Career Advice"}
      </button>

      
      {result && (
        <div className="career-result-card">
          <h3>🎯 Best Career: {result.bestCareer}</h3>
          <p>Suitability Score: <b>{result.score}/10</b></p>
          <p>Reason: {result.reason}</p>

          <h4>🔥 Alternative Careers</h4>
          <ul>
            {result.alternatives?.map((alt, index) => (
              <li key={index}>
                <b>{alt.career}</b> — Score: {alt.score}/10  
                <br /> {alt.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}