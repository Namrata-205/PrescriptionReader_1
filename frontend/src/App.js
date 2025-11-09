import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadPrescription from "./pages/UploadPrescription";
import Chatbot from "./pages/Chatbot";
import ScanMedicine from "./pages/ScanMedicine";
import MyMedicines from "./pages/MyMedicines";
import Settings from "./pages/Settings";
// --- NEW IMPORT ---
import { SettingsProvider } from "./context/SettingsContext"; // NEW
// ------------------

function App() {
  return (
    //-----
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPrescription />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/scan" element={<ScanMedicine />} />
          <Route path="/mymedicines" element={<MyMedicines />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </SettingsProvider>
    //--------
  );
}

export default App;
