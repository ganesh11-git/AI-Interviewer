import { useNavigate } from "react-router-dom";
import { FaCode, FaChartBar, FaShieldAlt, FaCloud, FaTools, FaPalette } from "react-icons/fa";
import "./careers.css";

const careerList = [
  { id: "software-engineer", title: "Software Engineer", icon: <FaCode /> },
  { id: "data-scientist", title: "Data Scientist", icon: <FaChartBar /> },
  { id: "cybersecurity-analyst", title: "Cybersecurity Analyst", icon: <FaShieldAlt /> },
  { id: "cloud-engineer", title: "Cloud Engineer", icon: <FaCloud /> },
  { id: "devops-engineer", title: "DevOps Engineer", icon: <FaTools /> },
  { id: "ui-ux-designer", title: "UI/UX Designer", icon: <FaPalette /> },
];

export default function Careers() {
  const navigate = useNavigate();

  return (
    
    <div className="career-page">
      
      <button 
        className="ai-advisor-btn"
        onClick={() => navigate("/career-advisor")}
      >
        🤖 Ask AI Career Advisor
      </button>

      
      <h1 className="career-title">CAREER PATHWAYS</h1>
      <p className="career-subtitle">
        Select your domain and explore industry requirements, skills, and AI interview preparation.
      </p>

     
      <div className="career-grid">
        {careerList.map((career) => (
          <div className="career-card-futuristic" key={career.id}>

            <div className="career-icon">{career.icon}</div>

            <h2>{career.title}</h2>

            <p className="career-desc">
              Explore skills, companies, salary insights, and prepare for AI-based interviews.
            </p>

            <button onClick={() => navigate(`/careers/${career.id}`)}>
              SELECT PATH →
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}
