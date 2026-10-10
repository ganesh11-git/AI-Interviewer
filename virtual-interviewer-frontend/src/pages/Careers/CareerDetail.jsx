import { useParams, useNavigate } from "react-router-dom";
import "./careerDetail.css";

const careerData = {
  "software-engineer": {
    title: "Software Engineer",
    desc: `Software Engineers design, develop, test, and maintain software applications and systems. 
They work on building scalable web applications, backend services, distributed systems, and enterprise-level software solutions. 
Software engineers collaborate with product managers, designers, and other engineers to solve real-world problems using programming, system design, and algorithms. 
This role requires strong problem-solving skills, coding expertise, and knowledge of data structures, databases, and system architecture.`,

    skills: ["DSA", "System Design", "React", "Node.js", "Databases"],
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    salary: "$90K - $250K per year"
  },

  "data-scientist": {
    title: "Data Scientist",
    desc: `Data Scientists analyze structured and unstructured data to extract meaningful insights and build predictive models. 
They use statistics, machine learning, and data visualization techniques to help organizations make data-driven decisions. 
Data scientists work closely with business analysts and engineers to develop models for forecasting, recommendation systems, and AI-powered analytics.`,

    skills: ["Python", "Statistics", "Machine Learning", "SQL", "Deep Learning"],
    companies: ["Netflix", "IBM", "Meta", "Google"],
    salary: "$80K - $220K per year"
  },

  "cybersecurity-analyst": {
    title: "Cybersecurity Analyst",
    desc: `Cybersecurity Analysts protect computer systems, networks, and data from cyber threats and attacks. 
They monitor security systems, analyze vulnerabilities, respond to incidents, and implement security measures to safeguard organizations from hackers and malware. 
This role requires strong knowledge of networking, cryptography, security protocols, and ethical hacking techniques.`,

    skills: ["Networking", "Linux", "Ethical Hacking", "SIEM", "Cryptography"],
    companies: ["Cisco", "Palo Alto", "CrowdStrike"],
    salary: "$70K - $200K per year"
  },
  "cloud-engineer": {
    title: "Cloud Engineer",
    desc: `Cloud Engineers design and manage cloud infrastructure for applications and services. 
They deploy systems on cloud platforms like AWS, Azure, and Google Cloud, ensuring scalability, reliability, and security. 
They work on virtualization, containers, storage systems, and cloud networking.`,
    skills: ["AWS", "Azure", "Google Cloud", "Docker", "Linux"],
    companies: ["Amazon AWS", "Google Cloud", "Microsoft Azure"],
    salary: "$75K - $230K per year"
  },
  "devops-engineer": {
    title: "DevOps Engineer",
    desc: `DevOps Engineers automate software development and deployment processes. 
They build CI/CD pipelines, manage infrastructure, and ensure fast and reliable software delivery. 
They bridge the gap between development and operations teams using automation and monitoring tools.`,
    skills: ["Docker", "Kubernetes", "Jenkins", "Terraform", "Linux"],
    companies: ["Netflix", "Google", "Spotify", "Amazon"],
    salary: "$85K - $240K per year"
  },
  "ui-ux-designer": {
    title: "UI/UX Designer",
    desc: `UI/UX Designers create intuitive and visually appealing user interfaces and experiences. 
They research user behavior, design wireframes, prototypes, and ensure usability and accessibility. 
They collaborate with developers and product teams to improve user satisfaction.`,
    skills: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping"],
    companies: ["Apple", "Google", "Airbnb", "Adobe"],
    salary: "$60K - $160K per year"
  }
};

export default function CareerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const career = careerData[id];

  if (!career) return <h2 style={{ color: "white" }}>Career Not Found</h2>;

  return (
    <div className="career-detail-page">

      
      <button className="back-btn" onClick={() => navigate("/careers")}>
        ← Back to Careers
      </button>

     
      <h1 className="career-title">{career.title}</h1>

      
      <p className="career-long-desc">{career.desc}</p>

      <div className="career-layout">

        
        <div className="career-left">

          <div className="detail-card">
            <h3>Required Skills</h3>
            <div className="skill-list">
              {career.skills.map((skill, i) => (
                <div className="skill-bar" key={i}>
                  <span>{skill}</span>
                  <div className="progress">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-card">
            <h3>Top Hiring Companies</h3>
            <div className="company-tags">
              {career.companies.map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </div>
          </div>

        </div>

        
        <div className="career-right">
          <div className="salary-box">
            <h3>Global Salary Range</h3>
            <p>{career.salary}</p>
          </div>

          

          <button className="interview-btn">
            🎤 Start AI Interview
          </button>
        </div>

      </div>
    </div>
  );
}
