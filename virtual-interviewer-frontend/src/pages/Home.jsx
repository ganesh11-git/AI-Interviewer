import Navbar from "../components/Navbar";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const name = localStorage.getItem("userName") || "CANDIDATE";

  return (
    <>
      <Navbar />

      <div className="home">
        <h1 className="welcome">WELCOME {name.toUpperCase()}</h1>

        <p className="subtitle">
          Your neural training session awaits. Let's elevate your performance.
        </p>

        <div className="stats">
          <div className="card">
            <h3>SESSIONS COMPLETED</h3>
            <p className="value">0</p>
            <div className="bar"></div>
          </div>

          <div className="card">
            <h3>SUCCESS RATE</h3>
            <p className="value">0%</p>
            <div className="bar"></div>
          </div>

          <div className="card">
            <h3>SKILLS MASTERED</h3>
            <p className="value">0</p>
            <div className="bar"></div>
          </div>
        </div>

        {/* <h2 className="section-title">QUICK ACCESS MODULES</h2>

        <div className="modules">
          <div className="module cyan" onClick={() => navigate("/interviewer")}>START INTERVIEW</div>
          <div className="module pink" onClick={() => navigate("/practice")}>PRACTICE MODE</div>
          <div className="module green" onClick={() => navigate("/careers")}>VIEW ROADMAP</div>
        </div> */}
      </div>
    </>
  );
}