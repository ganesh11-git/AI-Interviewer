import { NavLink } from "react-router-dom";
import "../styles/learning.css"; 

export default function LanguageNavbar() {
  return (
    <div className="language-navbar">
      <NavLink to="/learning/java/overview">JAVA</NavLink>
      <NavLink to="/learning/python/overview">PYTHON</NavLink>
      <NavLink to="/learning/cpp/overview">C++</NavLink>
      <NavLink to="/learning/javascript/overview">JAVASCRIPT</NavLink>
    </div>
  );
}
