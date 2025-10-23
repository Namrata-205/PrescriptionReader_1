import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, Edit, Trash2, Pill, Calendar, Clock } from "lucide-react";
import { Input } from "../components/ui/Input";
import "../styles/theme.css";

const MyMedicines = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock medicine data
  const medicines = [
    {
      id: 1,
      name: "Paracetamol",
      brandName: "Tylenol",
      dosage: "500mg",
      frequency: "Twice daily",
      prescriptionDate: "2025-01-15",
      notes: "Take with food"
    },
    {
      id: 2,
      name: "Amoxicillin",
      brandName: "Amoxil",
      dosage: "250mg",
      frequency: "Three times daily",
      prescriptionDate: "2025-01-10",
      notes: "Complete full course"
    },
    {
      id: 3,
      name: "Lisinopril",
      brandName: "Prinivil",
      dosage: "10mg",
      frequency: "Once daily in morning",
      prescriptionDate: "2024-12-20",
      notes: "For blood pressure"
    },
  ];

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakMedicine = (medicine) => {
    const text = `${medicine.name}, also known as ${medicine.brandName}. Dosage: ${medicine.dosage}. Frequency: ${medicine.frequency}. ${medicine.notes ? "Note: " + medicine.notes : ""}`;
    speakText(text);
  };

  return (
    <div className="medicines-page">
      {/* Header */}
      <header className="medicines-header">
        <Link to="/dashboard" className="medicines-back-btn">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </header>

      <div className="medicines-content">
        {/* Page Title */}
        <div className="medicines-title-section">
          <h1 className="medicines-title">My Medicines</h1>
          <p className="medicines-subtitle">
            {medicines.length} medicine{medicines.length !== 1 ? 's' : ''} in your list
          </p>
        </div>

        {/* Search */}
        <div className="medicines-search-card">
          <div className="medicines-search-wrapper">
            <input
              type="text"
              placeholder="Search medicines by name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="medicines-search-input"
            />
            <button
              className="medicines-search-audio-btn"
              onClick={() => speakText("Search medicines by name or brand")}
            >
              <Volume2 size={24} />
            </button>
          </div>
        </div>

        {/* Medicine Cards */}
        <div className="medicines-grid">
          {filteredMedicines.length === 0 ? (
            <div className="medicines-empty-card">
              <Pill className="medicines-empty-icon" />
              <h3 className="medicines-empty-title">No medicines found</h3>
              <p className="medicines-empty-text">
                {searchQuery 
                  ? "Try a different search term" 
                  : "Start by uploading a prescription or scanning a medicine"}
              </p>
            </div>
          ) : (
            filteredMedicines.map((medicine) => (
              <div key={medicine.id} className="medicine-card">
                {/* Icon */}
                <div className="medicine-icon-wrapper">
                  <Pill className="medicine-icon" />
                </div>

                {/* Details */}
                <div className="medicine-details">
                  <div>
                    <h3 className="medicine-name">{medicine.name}</h3>
                    <p className="medicine-brand">Brand: {medicine.brandName}</p>
                  </div>
                  
                  <div className="medicine-info-grid">
                    <div className="medicine-info-item">
                      <Pill className="medicine-info-icon" />
                      <span>{medicine.dosage}</span>
                    </div>
                    <div className="medicine-info-item">
                      <Clock className="medicine-info-icon" />
                      <span>{medicine.frequency}</span>
                    </div>
                    <div className="medicine-info-item">
                      <Calendar className="medicine-info-icon" />
                      <span>{medicine.prescriptionDate}</span>
                    </div>
                  </div>
                  
                  {medicine.notes && (
                    <div className="medicine-notes">{medicine.notes}</div>
                  )}
                </div>

                {/* Actions */}
                <div className="medicine-actions">
                  <button 
                    className="medicine-action-btn audio" 
                    onClick={() => speakMedicine(medicine)}
                  >
                    <Volume2 className="medicine-action-icon" />
                  </button>
                  <button className="medicine-action-btn edit">
                    <Edit className="medicine-action-icon" />
                  </button>
                  <button className="medicine-action-btn delete">
                    <Trash2 className="medicine-action-icon" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add New Medicine */}
        <div className="medicines-add-section">
          <Link to="/upload" className="medicines-add-btn">
            Add New Medicine
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyMedicines;