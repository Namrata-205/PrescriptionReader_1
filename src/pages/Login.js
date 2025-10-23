import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Volume2, Mail, Lock, ArrowLeft, User } from "lucide-react";
import "../styles/theme.css"; // import the CSS

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    speakText("Logging in...");
    console.log("Login Data:", formData);
    // TODO: Implement login API
    navigate("/dashboard");
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

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>

      <div className="footer">
        <p>
          Don't have an account?{" "}
          <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
