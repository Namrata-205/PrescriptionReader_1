import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Upload, ArrowLeft, Volume2, RotateCw, Check, Edit, Loader2 } from "lucide-react";
import { Progress } from "../components/ui/Progress";
import "../styles/theme.css";

const UploadPrescription = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedMedicines, setExtractedMedicines] = useState([]);
  const [processingStep, setProcessingStep] = useState(0);

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakMedicine = (medicine) => {
    const text = `${medicine.name}, ${medicine.dosage}, ${medicine.frequency}. Confidence: ${medicine.confidence} percent.`;
    speakText(text);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        speakText("Image uploaded successfully. Click Process to extract prescription information.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    setProcessingStep(0);

    const stages = [
      "Preprocessing image...",
      "Running OCR...",
      "Extracting medicine names...",
      "Matching with database...",
      "Complete!"
    ];

    for (let i = 0; i < stages.length; i++) {
      setProcessingStep((i + 1) * 20);
      speakText(stages[i]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setExtractedMedicines([
      { id: 1, name: "Paracetamol", dosage: "500mg", frequency: "Twice daily", confidence: 95 },
      { id: 2, name: "Amoxicillin", dosage: "250mg", frequency: "Three times daily", confidence: 88 }
    ]);

    setIsProcessing(false);
    speakText("Prescription processed successfully. Review the extracted medicines below.");
  };

  return (
    <div className="upload-page">
      {/* Back Button */}
      <Button variant="outline" size="sm" className="back-btn" onClick={() => navigate("/dashboard")}>
        <ArrowLeft size={18} /> Back
      </Button>

      {/* Page Title */}
      <h1 className="upload-title">Upload Prescription</h1>

      <main className="upload-main">
        {/* Upload Card */}
        {!uploadedImage && (
          <Card className="upload-card">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="upload-file" />
            <label htmlFor="upload-file" className="upload-label">
              <Upload size={64} className="upload-icon" />
              <h3 className="upload-text">Upload File</h3>
              <p className="upload-desc">Select prescription image from your device</p>
            </label>
          </Card>
        )}

        {/* Preview & Process */}
        {uploadedImage && !isProcessing && extractedMedicines.length === 0 && (
          <Card className="preview-card">
            <img src={uploadedImage} alt="Preview" className="preview-image" />
            <div className="preview-buttons">
              <Button variant="medical" size="lg" onClick={handleProcess}>
                <RotateCw size={18} /> Process
              </Button>
              <Button variant="outline" size="lg" onClick={() => setUploadedImage(null)}>Upload New</Button>
            </div>
          </Card>
        )}

        {/* Processing */}
        {isProcessing && (
          <Card className="processing-card">
            <Loader2 size={48} className="loader" />
            <h3>Processing...</h3>
            <Progress value={processingStep} className="progress-bar" />
            <p>{processingStep}% Complete</p>
          </Card>
        )}

        {/* Extracted Medicines */}
        {extractedMedicines.length > 0 && (
          <div className="medicines-grid">
            {extractedMedicines.map((medicine) => (
              <Card key={medicine.id} className="medicine-card">
                <div>
                  <h4>{medicine.name}</h4>
                  <p><strong>Dosage:</strong> {medicine.dosage}</p>
                  <p><strong>Frequency:</strong> {medicine.frequency}</p>
                  <p><strong>Confidence:</strong> {medicine.confidence}%</p>
                </div>
                <div className="medicine-actions">
                  <Button variant="outline" size="icon" onClick={() => speakMedicine(medicine)}><Volume2 size={18} /></Button>
                  <Button variant="outline" size="icon"><Edit size={18} /></Button>
                  <Button variant="success" size="icon"><Check size={18} /></Button>
                </div>
              </Card>
            ))}
            <Button variant="medical" size="lg" className="save-btn">
              <Check size={18} /> Save All
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default UploadPrescription;
