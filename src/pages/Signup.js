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
  const [error, setError] = useState("");

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      speakText("Passwords do not match!");
      setError("Passwords do not match!");
      return;
    }

    speakText("Signing up...");

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email, // send as "email" to match backend UserCreate model
          password: formData.password,
          name: formData.name // optional, if backend uses only username, this can be ignored
        }),

      });

      const data = await res.json(); // parse JSON response

      if (!res.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      speakText("Signup successful!");
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message);
      speakText("Signup failed. Please try again.");
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
              required
            />
            <button
              type="button"
              className="volume-btn"
              onClick={() => speakText("Enter your full name")}
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
              required
            />
            <button
              type="button"
              className="volume-btn"
              onClick={() => speakText("Enter your email address")}
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
              required
            />
            <button
              type="button"
              className="volume-btn"
              onClick={() => speakText("Enter your password")}
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
              required
            />
            <button
              type="button"
              className="volume-btn"
              onClick={() => speakText("Confirm your password")}
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit-btn">
          Sign Up
        </button>
      </form>

      <div className="footer">
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
