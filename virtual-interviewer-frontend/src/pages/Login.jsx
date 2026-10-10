import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/authPage.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const savedEmail = localStorage.getItem("userEmail");
    const savedPass = localStorage.getItem("userPassword");

    if (email !== savedEmail || password !== savedPass) {
      alert("Wrong email or password");
      return;
    }

    localStorage.setItem("token", "loggedin"); 

    navigate("/home"); 
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>LOGIN</h2>

        <form onSubmit={handleLogin}>
          <input className="auth-input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="auth-input" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />

          <button className="log-btn" type="submit">LOGIN</button>
        </form>

        <p className="auth-footer">
          New user? <span onClick={()=>navigate("/signup")}>Signup</span>
        </p>
      </div>
    </div>
  );
}
