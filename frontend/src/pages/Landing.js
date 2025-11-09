import React from "react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { Volume2, Pill, Camera, MessageSquare, Shield } from "lucide-react";
import "../styles/theme.css";

import { globalSpeakText as speakText } from "../context/SettingsContext";

const features = [
  { icon: Camera, title: "Scan Prescriptions", desc: "Upload or photograph prescriptions for instant OCR text extraction" },
  { icon: Volume2, title: "Voice Guidance", desc: "Every action has clear voice feedback and audio playback" },
  { icon: Pill, title: "Medicine Database", desc: "Visual recognition and cross-verification with medicine database" },
  { icon: MessageSquare, title: "AI Chatbot", desc: "Ask questions about your medicines with voice support" },
];

const Landing = () => {
  // const speakText = (text) => {
  //   if ("speechSynthesis" in window) {
  //     const utterance = new SpeechSynthesisUtterance(text);
  //     utterance.rate = 0.9;
  //     utterance.pitch = 1;
  //     window.speechSynthesis.speak(utterance);
  //   }
  // };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #f0f4f8, #c9e4f6)", position: "relative" }}>
      
      {/* Decorative floating circles */}
      <div style={{
        position: "absolute", top: "80px", left: "40px",
        width: "280px", height: "280px",
        backgroundColor: "rgba(15,76,92,0.05)",
        borderRadius: "50%", filter: "blur(80px)",
        animation: "float 6s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute", bottom: "80px", right: "40px",
        width: "384px", height: "384px",
        backgroundColor: "rgba(201,228,246,0.1)",
        borderRadius: "50%", filter: "blur(100px)",
        animation: "float 6s ease-in-out infinite",
        animationDelay: "1s"
      }} />

      {/* Hero Section */}
      <main className="container" style={{ textAlign: "center", padding: "80px 0", position: "relative", zIndex: 10 }}>
        <div>
          <div style={{
            display: "inline-block",
            padding: "24px",
            background: "linear-gradient(to bottom right, #0f4c5c33, #0f4c5c1a)",
            borderRadius: "50%",
            marginBottom: "16px"
          }}>
            <Pill style={{ width: "80px", height: "80px", color: "#0f4c5c" }} />
          </div>

          <h1 style={{
            fontSize: "4rem",
            fontWeight: "bold",
            background: "linear-gradient(to right, #0f4c5c, #0f4c5c)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginBottom: "16px"
          }}>
            Voice-Assisted Prescription Reader
          </h1>

          <p style={{ fontSize: "1.5rem", maxWidth: "720px", margin: "0 auto 32px auto" }}>
            Designed for partially-visually-impaired users. Read prescriptions with confidence using voice assistance and high-contrast visuals.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/signup">
              <Button variant="medical" className="landing-btn-medical" onMouseEnter={() => speakText("Get Started")}>
                <Volume2 style={{ marginRight: "8px" }} /> Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="landing-btn-outline" onMouseEnter={() => speakText("Login")}>
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        {/* Features Grid (2x2) */}
      <div className="landing-cards-container">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="landing-card" onMouseEnter={() => speakText(item.title)}>
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "80px",
                height: "80px",
                margin: "0 auto 16px auto",
                borderRadius: "16px",
                background: "linear-gradient(to bottom right, #0f4c5c33, #0f4c5c1a)"
              }}>
                <Icon style={{ width: "40px", height: "40px", color: "#0f4c5c" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "8px" }}>{item.title}</h3>
              <p style={{ fontSize: "1rem", color: "#555" }}>{item.desc}</p>
            </div>
          );
        })}
      </div>


        {/* Accessibility banner */}
        <div style={{
          marginTop: "64px",
          padding: "32px",
          background: "linear-gradient(to bottom right, #0f4c5c33, #c9e4f633)",
          borderRadius: "24px",
          border: "2px solid rgba(15,76,92,0.3)",
          maxWidth: "960px",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          gap: "24px"
        }}>
          <Shield style={{ width: "56px", height: "56px", color: "#0f4c5c" }} />
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "16px" }}>Built for Accessibility</h3>
            <ul style={{ fontSize: "1rem", listStyle: "none", paddingLeft: "0", lineHeight: "1.8" }}>
              <li>✓ Extra large buttons and text (minimum 56px touch targets)</li>
              <li>✓ High contrast deep teal theme optimized for low vision</li>
              <li>✓ Complete keyboard navigation support</li>
              <li>✓ Screen reader compatible with ARIA labels</li>
              <li>✓ Voice input and audio feedback throughout</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: "48px", textAlign: "center", maxWidth: "720px", marginLeft: "auto", marginRight: "auto" }}>
          <p style={{ fontSize: "1rem", padding: "16px", background: "#e0e0e0", borderRadius: "12px", border: "1px solid rgba(15,76,92,0.2)" }}>
            <strong>Medical Disclaimer:</strong> This app is an assistive tool and does not provide medical advice. Always consult your healthcare provider for medical guidance.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Landing;
