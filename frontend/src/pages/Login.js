import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Volume2, Mail, Lock, ArrowLeft, User } from "lucide-react";
import "../styles/theme.css";

import { globalSpeakText as speakText } from "../context/SettingsContext";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const speakText = (text) => {
  //   if ("speechSynthesis" in window) {
  //     const utterance = new SpeechSynthesisUtterance(text);
  //     utterance.rate = 0.9;
  //     utterance.pitch = 1;
  //     window.speechSynthesis.speak(utterance);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    speakText("Logging in...");

    try {
      // Create FormData for OAuth2PasswordRequestForm
      const formPayload = new URLSearchParams();
      formPayload.append("username", formData.email); // backend expects username field
      formPayload.append("password", formData.password);

      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formPayload,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Invalid credentials");
      }

      // Save JWT token
      localStorage.setItem("token", data.access_token);

      speakText("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message);
      speakText("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <Link to="/" className="back-btn">
        <ArrowLeft size={20} />
        Back to Home
      </Link>

      <div className="header">
        <div style={{ marginBottom: "15px" }}>
          <User size={50} color="#0f4c5c" />
        </div>
        <h1>Login</h1>
        <p>Access your voice-assisted prescription reader</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <Mail className="icon-left" size={20} />
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              aria-label="Email address input"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="volume-btn"
              onClick={() => speakText("Enter your email address")}
              aria-label="Read email field"
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <Lock className="icon-left" size={20} />
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              aria-label="Password input"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="volume-btn"
              onClick={() => speakText("Enter your password")}
              aria-label="Read password field"
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="footer">
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;