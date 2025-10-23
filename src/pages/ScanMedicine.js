import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { ArrowLeft, Volume2, Check } from "lucide-react";
import "../styles/theme.css";

const ScanMedicine = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [scannedMedicine, setScannedMedicine] = useState(null);

  // Get list of video input devices
  useEffect(() => {
    const getDevices = async () => {
      const deviceInfos = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceInfos.filter(d => d.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices[0]) setSelectedDeviceId(videoDevices[0].deviceId);
    };
    getDevices();
  }, []);

  // Start camera whenever selectedDeviceId changes
  useEffect(() => {
    if (!selectedDeviceId) return;

    const startCamera = async () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } }
        });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error("Camera access denied", err);
        alert("Cannot access camera. Please allow camera permissions.");
      }
    };
    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [selectedDeviceId]);

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);
      speakText("Image captured. Ready to scan.");
    }
  };

  const handleScan = async () => {
    speakText("Scanning medicine. Please hold steady.");
    await new Promise(resolve => setTimeout(resolve, 2000));

    setScannedMedicine({
      name: "Paracetamol",
      brandName: "Tylenol",
      strength: "500mg",
      form: "Tablet",
      confidence: 92,
      matchedPrescription: true,
      prescriptionDetails: {
        dosage: "500mg",
        frequency: "Twice daily",
        prescriptionDate: "2025-01-15"
      }
    });
    speakText("Medicine recognized. Paracetamol, 500 milligrams. Match found in your prescriptions.");
  };

  const speakMedicineDetails = () => {
    if (!scannedMedicine) return;
    const med = scannedMedicine;
    const text = `${med.name}, also known as ${med.brandName}. Strength: ${med.strength}, Form: ${med.form}. Dosage: ${med.prescriptionDetails.dosage}, Frequency: ${med.prescriptionDetails.frequency}. Confidence: ${med.confidence} percent.`;
    speakText(text);
  };

  return (
    <div className="scan-container">
      <div className="scan-back-button">
        <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} /> Back
        </Button>
      </div>

      <div className="scan-heading">
        <h1>Scan Medicine</h1>
        <p>Use your camera to scan and recognize medicine bottles or packages</p>
      </div>

      <div className="scan-main">
        {!capturedImage && (
          <Card className="card-scan">
            <CardHeader>
              <CardTitle>Camera Scanner</CardTitle>
              <CardDescription>Select a camera and capture photo</CardDescription>
            </CardHeader>
            <CardContent className="scan-content">
              <select
                className="camera-select"
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
              >
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId}`}
                  </option>
                ))}
              </select>

              <div className="camera-preview">
                <video ref={videoRef} autoPlay playsInline className="video-feed" />
              </div>

              <Button variant="medical" size="lg" className="scan-button" onClick={capturePhoto}>
                Capture Photo
              </Button>
            </CardContent>
          </Card>
        )}

        {capturedImage && !scannedMedicine && (
          <Card className="card-scan">
            <CardHeader>
              <CardTitle>Preview & Scan</CardTitle>
              <CardDescription>Review the captured image and start scan</CardDescription>
            </CardHeader>
            <CardContent className="scan-content">
              <img src={capturedImage} alt="Captured" className="preview-image" />
              <Button variant="medical" size="lg" className="scan-button" onClick={handleScan}>
                Scan Medicine
              </Button>
              <Button variant="outline" size="lg" className="scan-button" onClick={() => setCapturedImage(null)}>
                Retake
              </Button>
            </CardContent>
          </Card>
        )}

        {scannedMedicine && (
          <Card className="card-scan-result">
            <CardHeader>
              <CardTitle>
                {scannedMedicine.name}
                {scannedMedicine.matchedPrescription && (
                  <span className="prescription-badge">
                    <Check size={16} /> Prescription Match
                  </span>
                )}
              </CardTitle>
              <CardDescription>Medicine details and prescription information</CardDescription>
            </CardHeader>
            <CardContent className="scan-content">
              <div className="medicine-info">
                <p><strong>Brand:</strong> {scannedMedicine.brandName}</p>
                <p><strong>Strength:</strong> {scannedMedicine.strength}</p>
                <p><strong>Form:</strong> {scannedMedicine.form}</p>
                <p><strong>Confidence:</strong> {scannedMedicine.confidence}%</p>
              </div>

              {scannedMedicine.matchedPrescription && (
                <Card className="prescription-details-card">
                  <CardContent>
                    <h4>Prescription Details</h4>
                    <p><strong>Dosage:</strong> {scannedMedicine.prescriptionDetails.dosage}</p>
                    <p><strong>Frequency:</strong> {scannedMedicine.prescriptionDetails.frequency}</p>
                    <p><strong>Date:</strong> {scannedMedicine.prescriptionDetails.prescriptionDate}</p>
                  </CardContent>
                </Card>
              )}

              <div className="scan-action-buttons">
                <Button variant="medical" size="lg" onClick={() => { speakText("Medicine saved"); setScannedMedicine(null); setCapturedImage(null); }}>
                  <Check size={18} /> Save to My Medicines
                </Button>
                <Button variant="outline" size="lg" onClick={() => { setScannedMedicine(null); setCapturedImage(null); speakText("Ready to scan again"); }}>
                  Scan Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default ScanMedicine;
