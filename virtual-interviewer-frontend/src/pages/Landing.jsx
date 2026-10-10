import { Link } from "react-router-dom";
import "../styles/landing.css";

function Landing() {
  return (
    <div className="landing-page">
      <div className="navbar">
        <h2>VIRTUAL INTERVIEWER</h2>
        <div className="nav-links">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="signup-btn">Sign Up</Link>
        </div>
      </div>

      <div className="hero">
        <h1>SKILL-ASSESS AI</h1>
        <h3>AI-POWERED INTERVIEW MASTERY</h3>

        <p>
          Step into the future of interview preparation. Experience AI-driven
          mock interviews, instant feedback, and become industry-ready.
        </p>

        <div className="hero-actions">
          <button className="prim-btn">INITIALIZE TRAINING</button>
          <button className="sec-btn">ACCESS PORTAL</button>
        </div>
      </div>
    </div>
  );
}

export default Landing;