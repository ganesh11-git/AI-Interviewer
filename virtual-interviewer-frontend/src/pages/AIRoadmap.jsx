import { useState } from "react";
import { generateAIRoadmap } from "../services/aiApi";
import "../styles/aiRoadmap.css";
import { useNavigate } from "react-router-dom";

export default function AIRoadmap() {
  const [skills, setSkills] = useState("");
  const navigate = useNavigate();

  const generate = async () => {
    if (!skills.trim()) return alert("Enter skills");

    try {
      const res = await generateAIRoadmap(skills);

      localStorage.setItem("aiRoadmap", JSON.stringify(res.data));
      navigate("/ai-roadmap/view");
    } catch (err) {
      console.error(err);
      alert("AI Error");
    }
  };

  return (
    <div className="ai-input-page">
      <div className="ai-input-box">
        <h2>🤖 AI Personalized Roadmap</h2>

        <textarea
          placeholder="Enter skills (HTML, CSS, React...)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <button onClick={generate}>Generate Roadmap</button>
      </div>
    </div>
  );
}
