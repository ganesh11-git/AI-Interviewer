import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearAuthSession,
  getApiBaseUrl,
  getAuthToken,
  getAuthUser,
  login,
  me,
  register,
  setAuthSession,
} from "../services/apiClient";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(getAuthUser());

  const isLoggedIn = Boolean(getAuthToken());

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const payload = mode === "register" ? await register(email, password) : await login(email, password);
      setAuthSession(payload.token, payload.user);
      setUser(payload.user);
      setMessage(mode === "register" ? "Registered and signed in." : "Signed in.");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const profile = await me();
      setUser(profile);
      setMessage("Token is valid.");
    } catch (err) {
      setError(err.message || "Session check failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    setMessage("Signed out.");
    setError("");
  };

  return (
    <div className="practice-container">
      <h1 className="main-title">ACCOUNT</h1>
      <p className="subtitle">Sign in to save coding and test progress on server</p>

      <div className="topic-grid" style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div className="topic-card" style={{ width: "100%", cursor: "default" }}>
          <p style={{ marginBottom: "8px" }}>API: {getApiBaseUrl()}</p>
          {user?.email && <p style={{ marginBottom: "8px" }}>Signed in as: {user.email}</p>}
          {!isLoggedIn ? (
            <form onSubmit={handleAuth} style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" onClick={() => setMode("login")} disabled={loading || mode === "login"}>
                  Login
                </button>
                <button type="button" onClick={() => setMode("register")} disabled={loading || mode === "register"}>
                  Register
                </button>
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6)"
                type="password"
                minLength={6}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Please wait..." : mode === "register" ? "Register" : "Login"}
              </button>
            </form>
          ) : (
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={handleVerify} disabled={loading}>Verify Session</button>
              <button onClick={handleLogout} disabled={loading}>Logout</button>
            </div>
          )}

          {message && <p style={{ color: "#1e7f4f", marginTop: "10px" }}>{message}</p>}
          {error && <p style={{ color: "#b42318", marginTop: "10px" }}>{error}</p>}

          <div style={{ marginTop: "16px" }}>
            <button onClick={() => navigate("/practice")}>Back to Practice</button>
          </div>
        </div>
      </div>
    </div>
  );
}
