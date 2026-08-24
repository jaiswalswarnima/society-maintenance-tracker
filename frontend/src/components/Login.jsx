import { useState } from "react";
import { login } from "../api/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@society.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);

      onLogin(data);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🏢</div>

        <h1>SocietyTrack</h1>

        <p className="login-subtitle">
          Society Maintenance Manager
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
          />

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-demo">
          <strong>Admin Demo</strong>
          <span>admin@society.com</span>
          <span>admin123</span>
        </div>
      </div>
    </div>
  );
}

export default Login;