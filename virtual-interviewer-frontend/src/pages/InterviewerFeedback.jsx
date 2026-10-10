import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "../styles/feedback.css";

export default function InterviewFeedback() {

  const [report, setReport] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [showButton, setShowButton] = useState(false);

  /* ---------------- LOAD REPORT ---------------- */

  useEffect(() => {
    const stored = localStorage.getItem("feedbackReport");

    if (stored) {
      try {
        setReport(JSON.parse(stored));
      } catch (err) {
        console.error("Invalid report data", err);
      }
    }
  }, []);

  /* ---------------- SCORE ANIMATION ---------------- */

  useEffect(() => {

    if (!report) return;

    let start = 0;
    const end = report?.overall_score || 0;

    const duration = 1500;
    const stepTime = 20;
    const increment = end / (duration / stepTime);

    const timer = setInterval(() => {

      start += increment;

      if (start >= end) {
        start = end;
        clearInterval(timer);
        setShowButton(true);
      }

      setDisplayScore(start);

    }, stepTime);

    return () => clearInterval(timer);

  }, [report]);

  /* ---------------- SCROLL FUNCTION ---------------- */

  const scrollToReport = () => {

    const section = document.getElementById("report-section");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth"
      });
    }

  };

  /* ---------------- LOADING STATE ---------------- */

  if (!report) {
    return (
      <div style={{ padding: "120px", textAlign: "center" }}>
        <h2>Generating Feedback Report...</h2>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
  <div className="feedback-page">

    {/* HERO SCORE SECTION */}

    <section className="score-hero">

      <div className="score-card">

        <h1>Interview Score</h1>

        <div className="circle-wrap">
          <CircularProgressbar
            value={displayScore}
            text={`${displayScore.toFixed(1)}%`}
            styles={buildStyles({
              textColor: "#00e0c6",
              pathColor: "#00e0c6",
              trailColor: "#12364d",
              textSize: "18px"
            })}
          />
        </div>

      </div>

      

    </section>


    {/* REPORT SECTION */}

    <section id="report-section" className="report-section">

      <div className="overall-feedback">
        <h2>Overall Feedback</h2>
        <p>{report?.feedback}</p>
      </div>

      <div className="analysis-grid">

        <div className="analysis-card strong">
          <h3>Strong Areas</h3>
          <ul>
            {report?.strong_areas?.map((item, i) => (
              <li key={i}>✔ {item}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-card weak">
          <h3>Weak Areas</h3>
          <ul>
            {report?.weak_areas?.map((item, i) => (
              <li key={i}>⚠ {item}</li>
            ))}
          </ul>
        </div>

      </div>

      <div className="analysis-card suggestions">
        <h3>Suggestions for Improvement</h3>
        <ul>
          {report?.suggestions?.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>

    </section>

  </div>
);

}