import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/authPage.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

   
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    alert("Signup successful! Please login.");

    navigate("/login"); 
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>SIGN UP</h2>

        <form onSubmit={handleSignup}>
          <input className="auth-input" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="auth-input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="auth-input" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />

          <button className="sign-btn" type="submit">CREATE ACCOUNT</button>
        </form>

        <p className="auth-footer">
          Already have an account? <span onClick={()=>navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
