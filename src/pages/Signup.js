import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Volume2, Mail, Lock, ArrowLeft, User } from "lucide-react";
import "../styles/theme.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (formData.password !== formData.confirmPassword) {
      speakText("Passwords do not match!");
      alert("Passwords do not match!");
      return;
    }
    speakText("Signing up...");
    console.log("Signup Data:", formData);
    // TODO: Implement signup API
    navigate("/login");
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
        <h1>Sign Up</h1>
        <p>Create your account for voice-assisted prescription reader</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <div className="input-wrapper">
            <User className="icon-left" size={20} />
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              aria-label="Full name input"
              required
            />
            <button
              type="button"
              className="volume-btn"
              onClick={() => speakText("Enter your full name")}
              aria-label="Read name field"
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>

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

        {/* Confirm Password */}
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-wrapper">
            <Lock className="icon-left" size={20} />
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              aria-label="Confirm password input"
              required
            />
            <button
              type="button"
              className="volume-btn"
              onClick={() => speakText("Confirm your password")}
              aria-label="Read confirm password field"
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Sign Up
        </button>
      </form>

      <div className="footer">
        <p>
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
