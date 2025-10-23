import React from "react";
import { useNavigate } from "react-router-dom";
import { Pill, Settings, LogOut, Upload, Volume2, Book, User } from "lucide-react";
import { Button } from "../components/ui/Button";
import "../styles/theme.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Upload, title: "Upload Prescription", desc: "Scan or upload your prescription for text recognition", path: "/upload" },
    { icon: Volume2, title: "Voice Assistant", desc: "Scan and hear details of your medicines", path: "/scan" },
    { icon: Book, title: "Chatbot", desc: "Get detailed guidance about your prescribed medicines", path: "/chatbot" },
    { icon: User, title: "My Medicines", desc: "Manage your all medicines", path: "/mymedicines" },
  ];

  const handleLogout = () => {
    // Optional: clear any auth data here if needed
    navigate("/"); // redirect to landing page
  };

  const handleAudio = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  const handleOpen = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="header-title">Voice-Assisted Prescription Reader</h1>
        <div className="header-actions">
          <div
            className="action-item"
            title="Settings"
            onClick={() => navigate("/settings")}
          >
            <Settings className="action-icon" />
            <span>Settings</span>
          </div>
          <div className="action-item logout-btn" title="Logout" onClick={handleLogout}>
            <LogOut className="action-icon" />
            <span>Logout</span>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <h2 className="dashboard-subtitle">Welcome Back!</h2>
        <p className="dashboard-description">
          Choose an action below to get started.
        </p>

        <div className="dashboard-card-grid">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="dashboard-card">
                <div className="dashboard-card-icon">
                  <Icon size={48} color="#0f4c5c" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="card-buttons">
                  <Button
                    variant="medical"
                    size="lg"
                    className="dashboard-card-btn"
                    onClick={() => handleOpen(item.path)}
                  >
                    Open
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="dashboard-card-btn audio-btn"
                    onClick={() => handleAudio(`${item.title}. ${item.desc}`)}
                  >
                    <Volume2 size={20} style={{ marginRight: "8px" }} />
                    Listen
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
