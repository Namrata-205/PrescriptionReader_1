// import { useState } from "react";
// import { Button } from "../components/ui/Button";
// import { Card, CardContent } from "../components/ui/Card";
// import { Link } from "react-router-dom";
// import { ArrowLeft, Volume2, Edit, Trash2, Pill, Calendar, Clock } from "lucide-react";
// import { Input } from "../components/ui/Input";
// import "../styles/theme.css";

// import { globalSpeakText as speakText } from "../context/SettingsContext";

// const MyMedicines = () => {
//   const [searchQuery, setSearchQuery] = useState("");

//   // Mock medicine data
//   const medicines = [
//     {
//       id: 1,
//       name: "Paracetamol",
//       brandName: "Tylenol",
//       dosage: "500mg",
//       frequency: "Twice daily",
//       prescriptionDate: "2025-01-15",
//       notes: "Take with food"
//     },
//     {
//       id: 2,
//       name: "Amoxicillin",
//       brandName: "Amoxil",
//       dosage: "250mg",
//       frequency: "Three times daily",
//       prescriptionDate: "2025-01-10",
//       notes: "Complete full course"
//     },
//     {
//       id: 3,
//       name: "Lisinopril",
//       brandName: "Prinivil",
//       dosage: "10mg",
//       frequency: "Once daily in morning",
//       prescriptionDate: "2024-12-20",
//       notes: "For blood pressure"
//     },
//   ];

//   const filteredMedicines = medicines.filter(
//     (med) =>
//       med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       med.brandName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // const speakText = (text) => {
//   //   if ("speechSynthesis" in window) {
//   //     const utterance = new SpeechSynthesisUtterance(text);
//   //     utterance.rate = 0.9;
//   //     utterance.pitch = 1;
//   //     window.speechSynthesis.speak(utterance);
//   //   }
//   // };

//   const speakMedicine = (medicine) => {
//     const text = `${medicine.name}, also known as ${medicine.brandName}. Dosage: ${medicine.dosage}. Frequency: ${medicine.frequency}. ${medicine.notes ? "Note: " + medicine.notes : ""}`;
//     speakText(text);
//   };

//   return (
//     <div className="medicines-page">
//       {/* Header */}
//       <header className="medicines-header">
//         <Link to="/dashboard" className="medicines-back-btn">
//           <ArrowLeft size={20} /> Back to Dashboard
//         </Link>
//       </header>

//       <div className="medicines-content">
//         {/* Page Title */}
//         <div className="medicines-title-section">
//           <h1 className="medicines-title">My Medicines</h1>
//           <p className="medicines-subtitle">
//             {medicines.length} medicine{medicines.length !== 1 ? 's' : ''} in your list
//           </p>
//         </div>

//         {/* Search */}
//         <div className="medicines-search-card">
//           <div className="medicines-search-wrapper">
//             <input
//               type="text"
//               placeholder="Search medicines by name or brand..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="medicines-search-input"
//             />
//             <button
//               className="medicines-search-audio-btn"
//               onClick={() => speakText("Search medicines by name or brand")}
//             >
//               <Volume2 size={24} />
//             </button>
//           </div>
//         </div>

//         {/* Medicine Cards */}
//         <div className="medicines-grid">
//           {filteredMedicines.length === 0 ? (
//             <div className="medicines-empty-card">
//               <Pill className="medicines-empty-icon" />
//               <h3 className="medicines-empty-title">No medicines found</h3>
//               <p className="medicines-empty-text">
//                 {searchQuery 
//                   ? "Try a different search term" 
//                   : "Start by uploading a prescription or scanning a medicine"}
//               </p>
//             </div>
//           ) : (
//             filteredMedicines.map((medicine) => (
//               <div key={medicine.id} className="medicine-card">
//                 {/* Icon */}
//                 <div className="medicine-icon-wrapper">
//                   <Pill className="medicine-icon" />
//                 </div>

//                 {/* Details */}
//                 <div className="medicine-details">
//                   <div>
//                     <h3 className="medicine-name">{medicine.name}</h3>
//                     <p className="medicine-brand">Brand: {medicine.brandName}</p>
//                   </div>
                  
//                   <div className="medicine-info-grid">
//                     <div className="medicine-info-item">
//                       <Pill className="medicine-info-icon" />
//                       <span>{medicine.dosage}</span>
//                     </div>
//                     <div className="medicine-info-item">
//                       <Clock className="medicine-info-icon" />
//                       <span>{medicine.frequency}</span>
//                     </div>
//                     <div className="medicine-info-item">
//                       <Calendar className="medicine-info-icon" />
//                       <span>{medicine.prescriptionDate}</span>
//                     </div>
//                   </div>
                  
//                   {medicine.notes && (
//                     <div className="medicine-notes">{medicine.notes}</div>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 <div className="medicine-actions">
//                   <button 
//                     className="medicine-action-btn audio" 
//                     onClick={() => speakMedicine(medicine)}
//                   >
//                     <Volume2 className="medicine-action-icon" />
//                   </button>
//                   <button className="medicine-action-btn edit">
//                     <Edit className="medicine-action-icon" />
//                   </button>
//                   <button className="medicine-action-btn delete">
//                     <Trash2 className="medicine-action-icon" />
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Add New Medicine */}
//         <div className="medicines-add-section">
//           <Link to="/upload" className="medicines-add-btn">
//             Add New Medicine
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyMedicines;


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, Edit, Trash2, Pill, Calendar, Clock, Loader2 } from "lucide-react"; // Added Loader2
import "../styles/theme.css";
import { globalSpeakText as speakText } from "../context/SettingsContext";
import { fetchMyMedicines } from "../services/medicine_service"; // NEW IMPORT

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
}


const MyMedicines = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]); // Live data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // NEW: Fetch medicines on component mount
  useEffect(() => {
    const loadMedicines = async () => {
        try {
            setLoading(true);
            const data = await fetchMyMedicines();
            setMedicines(data);
        } catch (err) {
            console.error("Failed to load medicines:", err);
            setError("Failed to load your medicines. Please ensure you are logged in and the server is running.");
            speakText("Failed to load your medicines.");
        } finally {
            setLoading(false);
        }
    };
    loadMedicines();
  }, []);

  const speakMedicine = (medicine) => {
    // Note: The fetched data uses medicine_name, instructions, etc.
    const text = `${medicine.medicine_name}. Dosage: ${medicine.dosage}. Frequency: ${medicine.frequency}. ${medicine.instructions ? "Instructions: " + medicine.instructions : ""}`;
    speakText(text);
  };

  const filteredMedicines = medicines.filter(
    (med) =>
      med.medicine_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.dosage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.frequency.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Show loading state
  if (loading) {
      return (
          <div className="medicines-page" style={{ textAlign: 'center', padding: '100px' }}>
              <Loader2 size={48} color="#0f4c5c" className="animate-spin mx-auto mb-4" />
              <h1 className="medicines-title">Loading Medicines...</h1>
              <p className="medicines-subtitle">Fetching your saved prescription data.</p>
          </div>
      );
  }
  
  // Show error state
  if (error) {
       return (
          <div className="medicines-page" style={{ textAlign: 'center', padding: '100px' }}>
              <h1 className="medicines-title" style={{ color: '#ef4444' }}>Error</h1>
              <p className="medicines-subtitle">{error}</p>
               <div className="medicines-add-section">
                  <Link to="/dashboard" className="medicines-add-btn">
                      Go to Dashboard
                  </Link>
              </div>
          </div>
      );
  }


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
            {medicines.length} medicine{medicines.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {/* Search */}
        <div className="medicines-search-card">
          <div className="medicines-search-wrapper">
            <input
              type="text"
              placeholder="Search medicines by name or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="medicines-search-input"
            />
            <button
              className="medicines-search-audio-btn"
              onClick={() => speakText("Search medicines by name or details")}
            >
              <Volume2 size={24} />
            </button>
          </div>
        </div>

        {/* Medicine Cards */}
        <div className="medicines-grid">
          {filteredMedicines.length === 0 && searchQuery === "" ? (
            <div className="medicines-empty-card">
              <Pill className="medicines-empty-icon" />
              <h3 className="medicines-empty-title">No medicines saved yet</h3>
              <p className="medicines-empty-text">
                Start by <Link to="/upload" style={{color: '#0f4c5c', fontWeight: 'bold'}}>uploading a prescription</Link> to save your first medicine.
              </p>
            </div>
          ) : filteredMedicines.length === 0 ? (
             <div className="medicines-empty-card">
              <Pill className="medicines-empty-icon" />
              <h3 className="medicines-empty-title">No results found</h3>
              <p className="medicines-empty-text">
                Try a different search term or check your spelling.
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
                    <h3 className="medicine-name">{medicine.medicine_name}</h3>
                    {/* BrandName is not stored in DB, using duration as a secondary detail */}
                    {medicine.duration && <p className="medicine-brand">Duration: {medicine.duration}</p>}
                  </div>
                  
                  <div className="medicine-info-grid">
                    <div className="medicine-info-item">
                      <Pill className="medicine-info-icon" />
                      <span>{medicine.dosage || 'N/A'}</span>
                    </div>
                    <div className="medicine-info-item">
                      <Clock className="medicine-info-icon" />
                      <span>{medicine.frequency || 'N/A'}</span>
                    </div>
                    <div className="medicine-info-item">
                      <Calendar className="medicine-info-icon" />
                      <span>Prescribed: {formatDate(medicine.prescription_date)}</span>
                    </div>
                  </div>
                  
                  {/* Using instructions for notes area */}
                  {medicine.instructions && (
                    <div className="medicine-notes">{medicine.instructions}</div>
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
            Add New Prescription
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyMedicines;