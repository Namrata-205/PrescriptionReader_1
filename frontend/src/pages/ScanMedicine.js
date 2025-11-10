import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { ArrowLeft, Volume2, Check, Upload } from "lucide-react";
import "../styles/theme.css";


// Define the API endpoint URL
const API_URL = "http://127.0.0.1:8000/api/scan/upload";


const ScanMedicine = ({ loggedInUser }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [scannedMedicine, setScannedMedicine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Get video devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = deviceInfos.filter(d => d.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices[0]) setSelectedDeviceId(videoDevices[0].deviceId);
      } catch (err) {
        console.error("Error getting devices:", err);
      }
    };
    getDevices();
  }, []);


  // Start camera when selectedDeviceId changes
  useEffect(() => {
    const startCamera = async () => {
      if (selectedDeviceId === "upload") return;
      if (stream) stream.getTracks().forEach(track => track.stop());
      try {
        const constraints = selectedDeviceId
          ? { video: { deviceId: selectedDeviceId } }
          : { video: true };


        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        alert("Unable to access camera. Please allow permissions and refresh.");
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


  const sendImageToBackend = async (imageDataURL) => {
    setLoading(true);
    setError(null);
    speakText("Sending image to server for recognition.");


    try {
      // Convert Data URL to Blob
      const response = await fetch(imageDataURL);
      const blob = await response.blob();
      const imageFile = new File([blob], "medicine_label.png", { type: "image/png" });
     
      // Create FormData payload
      const formData = new FormData();
      formData.append("file", imageFile);


      // Send to FastAPI Backend
      const apiResponse = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });


      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${apiResponse.statusText}`);
      }


      const result = await apiResponse.json();
     
      console.log("Backend Scan Result:", result);


      // Check for errors in the response
      if (result.structured_data?.error) {
        throw new Error(result.structured_data.error);
      }


      // Extract drug_name and expiry_date from structured_data
      const { drug_name, expiry_date } = result.structured_data;


      setScannedMedicine({
        medicinesDetected: [{
          name: drug_name || "Not Found",
          expiry: expiry_date || "Not Found",
          ocr_line: drug_name || "Not Found"
        }],
        ocrText: result.raw_text,
        matchedPrescription: [],
      });


      // FIXED: Announce medicine name and expiry date separately with delay
      let speechText = "Scan complete. ";
     
      if (drug_name && drug_name !== "Not Found") {
        speechText += `Detected medicine: ${drug_name}.`;
      } else {
        speechText += "Could not detect medicine name clearly.";
      }
     
      speakText(speechText);
     
      // Add delay before announcing expiry date
      setTimeout(() => {
        let expiryText = "";
        if (expiry_date && expiry_date !== "Not Found") {
          expiryText = `Expiry date: ${expiry_date}.`;
        } else {
          expiryText = "Expiry date not found.";
        }
        speakText(expiryText);
      }, 2000); // 2 second delay
     
    } catch (err) {
      console.error("API scan error:", err);
      setError(err.message);
      speakText("Scan failed. Please try again.");
      alert(`Failed to scan medicine. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  const handleScan = async () => {
    if (!capturedImage) return;
    await sendImageToBackend(capturedImage);
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
        {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            color: '#c00'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}


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
                onChange={(e) => {
                  setSelectedDeviceId(e.target.value);
                  if (e.target.value !== "upload") {
                    setCapturedImage(null);
                  }
                }}
              >
                <option value="">Select Camera</option>
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId}`}
                  </option>
                ))}
                <option value="upload">Upload Image (From Gallery/Files)</option>
              </select>


              {selectedDeviceId === "upload" ? (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
                  <Card className="upload-card" style={{ maxWidth: '500px', width: '100%' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCapturedImage(reader.result);
                            speakText("Image uploaded. Ready to scan.");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="upload-file"
                    />
                    <label htmlFor="upload-file" className="upload-label">
                      <Upload size={64} className="upload-icon" />
                      <h3 className="upload-text">Upload File</h3>
                      <p className="upload-desc">Select medicine image from your device</p>
                    </label>
                  </Card>
                </div>
              ) : (
                <>
                  <div className="camera-preview">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="video-feed"
                    />
                  </div>
                  <Button variant="medical" size="lg" className="scan-button" onClick={capturePhoto}>
                    Capture Photo
                  </Button>
                </>
              )}
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
              <Button
                variant="medical"
                size="lg"
                className="scan-button"
                onClick={handleScan}
                disabled={loading}
              >
                {loading ? "Scanning..." : "Scan Medicine"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="scan-button"
                onClick={() => {
                  setCapturedImage(null);
                  setError(null);
                }}
              >
                Retake
              </Button>
            </CardContent>
          </Card>
        )}


        {scannedMedicine && (
          <Card className="card-scan-result">
            <CardHeader>
              <CardTitle>Detected Medicines</CardTitle>
              <CardDescription>OCR results and matched prescriptions</CardDescription>
            </CardHeader>
            <CardContent className="scan-content">
              {scannedMedicine?.medicinesDetected?.length > 0 ? (
                scannedMedicine.medicinesDetected.map((med, idx) => (
                  <div key={idx} className="medicine-info">
                    <p><strong>Name:</strong> {med.name || med.ocr_line}</p>
                    <p><strong>Expiry:</strong> {med.expiry}</p>
                  </div>
                ))
              ) : (
                <p>No medicines detected.</p>
              )}


              {scannedMedicine.matchedPrescription.length > 0 && (
                <Card className="prescription-details-card">
                  <CardContent>
                    <h4>Prescription Matches</h4>
                    {scannedMedicine.matchedPrescription.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </CardContent>
                </Card>
              )}


              <div className="scan-action-buttons">
                <Button
                  variant="medical"
                  size="lg"
                  onClick={() => {
                    speakText("Medicine saved");
                    setScannedMedicine(null);
                    setCapturedImage(null);
                    setError(null);
                  }}
                >
                  <Check size={18} /> Save to My Medicines
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setScannedMedicine(null);
                    setCapturedImage(null);
                    setError(null);
                    speakText("Ready to scan again");
                  }}
                >
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