import React, { useState } from "react";
import "../styles/interviewer.css";
import { useNavigate } from "react-router-dom";

const Interviewer = () => {
  const navigate = useNavigate();

  const [interviewType, setInterviewType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("basic");
  const [duration, setDuration] = useState("30");
  const [role, setRole] = useState("Software Engineer");

  const handleStart = () => {
    const config = { interviewType, difficulty, role, duration };

    // ✅ SAVE CONFIG (IMPORTANT)
    localStorage.setItem("interviewConfig", JSON.stringify(config));

    console.log("CONFIG SAVED:", config);

    navigate("/interview/session", {
      state: config
    });
  };

  return (
    <div className="config-container">

      {/* LEFT PANEL */}
      <div className="config-left">
        <h2 className="config-title">CONFIGURE SESSION</h2>

        {/* INTERVIEW TYPE */}
        <div className="config-group">
          <label>INTERVIEW TYPE</label>
          <select onChange={(e) => setInterviewType(e.target.value)}>
            <option value="Technical">Technical</option>
            <option value="HR">HR</option>
            <option value="Behavioral">Behavioral</option>
            <option value="System Design">System Design</option>
          </select>
        </div>

        {/* DIFFICULTY */}
        <div className="config-group">
          <label>DIFFICULTY LEVEL</label>
          <select onChange={(e) => setDifficulty(e.target.value)}>
            <option value="basic">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* DURATION */}
        <div className="config-group">
          <label>DURATION</label>
          <select onChange={(e) => setDuration(e.target.value)}>
            <option value="30">30 Minutes</option>
            <option value="45">45 Minutes</option>
            <option value="60">60 Minutes</option>
          </select>
        </div>

        {/* ROLE */}
        <div className="config-group">
          <label>TARGET ROLE</label>
          <input
            className="target-role"
            type="text"
            placeholder="Enter your preferred role"
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <button className="init-btn" onClick={handleStart}>
          INITIALIZE INTERVIEW
        </button>
      </div>

      {/* RIGHT PANEL (OPTIONAL UI) */}
      <div className="config-right">
        <h2 className="recent-title">RECENT SESSIONS</h2>
      </div>

    </div>
  );
};

export default Interviewer;