import "../styles/navbar.css";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name"); 

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="logo">VI PLATFORM</div>

      <div className="nav-links">
        <NavLink to="/home" className="nav-btn">Home</NavLink>
        <NavLink to="/careers" className="nav-btn">Careers</NavLink>
        <NavLink to="/practice" className="nav-btn">Practice</NavLink>
        <NavLink to="/interviewer" className="nav-btn">Interviewer</NavLink>
        <NavLink to="/roadmap" className="nav-btn">Roadmap</NavLink>
        <NavLink to="/profile" className="nav-btn">Profile</NavLink>
      </div>

      <div className="nav-user">
        <span className="user-name">{name}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
