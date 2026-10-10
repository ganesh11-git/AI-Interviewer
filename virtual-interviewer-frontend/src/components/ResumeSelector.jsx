import { useState } from "react";
import "../styles/resumeUpload.css";

const ResumeSelector = ({ onSelect }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Use resume already stored in profile (TEMP text for now)
  const useProfileResume = () => {
    const dummyResumeText = `
      Skills: Python, JavaScript, React, Node.js
      Experience: Full Stack Developer Intern
      Projects: AI Interviewer, Attendance System
    `;

    onSelect("profile", dummyResumeText);
  };

  // 2️⃣ Upload resume PDF → backend → extract text
  const uploadResume = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8001/resume/upload", {
  method: "POST",
  body: formData,
});



      const data = await res.json();

      // data.text MUST come from backend
      onSelect("upload", data.text);
    } catch (err) {
      alert("Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-modal">
      <div className="resume-card">
        <h2>Select Resume</h2>
        <p>Choose how you want to proceed</p>

        <button
          className="resume-profile"
          onClick={useProfileResume}
        >
          Use Resume from Profile
        </button>

        <div className="divider">OR</div>
        <br />

        <label className="upload-box">
          Upload Resume from PC
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        <br></br>
        {file && (
          <button
            className="resume-btn"
            onClick={uploadResume}
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeSelector;