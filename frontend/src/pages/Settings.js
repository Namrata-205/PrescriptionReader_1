// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "../components/ui/Button";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
// import { Label } from "../components/ui/Label";
// import { RadioGroup, RadioGroupItem } from "../components/ui/RadioGroup";
// import { Switch } from "../components/ui/Switch";
// import { Slider } from "../components/ui/Slider";
// import { ArrowLeft, Type, Contrast, Volume2, Download } from "lucide-react";

// const Settings = () => {
//   const [fontSize, setFontSize] = useState("medium");
//   const [highContrast, setHighContrast] = useState(false);
//   const [autoPlayTTS, setAutoPlayTTS] = useState(true);
//   const [voiceSpeed, setVoiceSpeed] = useState([1]);
//   const [voicePitch, setVoicePitch] = useState([1]);

//   const speakText = (text) => {
//     if ("speechSynthesis" in window) {
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = voiceSpeed[0];
//       utterance.pitch = voicePitch[0];
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const testVoice = () => {
//     speakText("This is a test of your voice settings. Adjust speed and pitch using sliders above.");
//   };

//   return (
//     <div className="settings-page">
//       {/* Header */}
//       <header className="settings-header">
//         <Link to="/dashboard" className="settings-header">
//             <button className="full-btn back-btn">
//                 <ArrowLeft className="btn-icon" />
//                 Back to Dashboard
//             </button>
//         </Link>
//         <h1 className="settings-title">Settings</h1>
//       </header>

//       {/* Main Grid */}
//       <main className="settings-container">
//         {/* Font Size */}
//         <Card className="settings-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-3">
//               <Type className="icon" />
//               Font Size
//             </CardTitle>
//             <CardDescription>Choose a comfortable text size</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <RadioGroup value={fontSize} onValueChange={setFontSize}>
//               <div className="radio-grid">
//                 <div className="radio-item">
//                   <RadioGroupItem value="small" id="small" />
//                   <Label htmlFor="small">Small (16px)</Label>
//                 </div>
//                 <div className="radio-item">
//                   <RadioGroupItem value="medium" id="medium" />
//                   <Label htmlFor="medium">Medium (18px) - Default</Label>
//                 </div>
//                 <div className="radio-item">
//                   <RadioGroupItem value="large" id="large" />
//                   <Label htmlFor="large">Large (24px)</Label>
//                 </div>
//                 <div className="radio-item">
//                   <RadioGroupItem value="xlarge" id="xlarge" />
//                   <Label htmlFor="xlarge">Extra Large (32px)</Label>
//                 </div>
//               </div>
//             </RadioGroup>
//           </CardContent>
//         </Card>

//         {/* High Contrast */}
//         <Card className="settings-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-3">
//               <Contrast className="icon" /> High Contrast
//             </CardTitle>
//             <CardDescription>Enhance UI element visibility</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="switch-item">
//               <div>
//                 <Label htmlFor="contrast">Enable High Contrast</Label>
//                 <p className="small-text">Improves readability of text and elements</p>
//               </div>
//               <Switch id="contrast" checked={highContrast} onCheckedChange={setHighContrast} />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Voice Settings */}
//         <Card className="settings-card voice-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-3">
//               <Volume2 className="icon" /> Voice Settings
//             </CardTitle>
//             <CardDescription>Customize text-to-speech preferences</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* Auto-play TTS */}
//             <div className="switch-item">
//               <div>
//                 <Label htmlFor="autoplay">Auto-Play Audio</Label>
//                 <p className="small-text">Automatically play important messages</p>
//               </div>
//               <Switch id="autoplay" checked={autoPlayTTS} onCheckedChange={setAutoPlayTTS} />
//             </div>

//             {/* Voice Speed */}
//             <div className="slider-item">
//               <Label>Voice Speed: {voiceSpeed[0].toFixed(1)}x</Label>
//               <Slider value={voiceSpeed} onValueChange={setVoiceSpeed} min={0.5} max={2} step={0.1} />
//             </div>

//             {/* Voice Pitch */}
//             <div className="slider-item">
//               <Label>Voice Pitch: {voicePitch[0].toFixed(1)}</Label>
//               <Slider value={voicePitch} onValueChange={setVoicePitch} min={0.5} max={2} step={0.1} />
//             </div>

//             <Button variant="outline" size="lg" className="full-btn" onClick={testVoice}>
//               <Volume2 className="icon-small" /> Test Voice Settings
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Data Export */}
//         <Card className="settings-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-3">
//               <Download className="icon" /> Data Export
//             </CardTitle>
//             <CardDescription>Download your medicine & prescription history</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button variant="outline" size="lg" className="full-btn">
//               <Download className="icon-small" /> Export My Data
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Save Settings */}
//         <Button variant="medical" size="lg" className="full-btn save-btn">
//           Save Settings
//         </Button>
//       </main>
//     </div>
//   );
// };

// export default Settings;


// till sundayyy-------------------------------







// // src/pages/Settings.js - UPDATED CODE
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "../components/ui/Button";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
// import { Label } from "../components/ui/Label";
// import { RadioGroup, RadioGroupItem } from "../components/ui/RadioGroup";
// import { Switch } from "../components/ui/Switch";
// import { Slider } from "../components/ui/Slider";
// import { ArrowLeft, Type, Volume2, Download } from "lucide-react"; 
// import { useSettings, globalSpeakText } from "../context/SettingsContext"; 

// const Settings = () => {
//   const { settings, isLoaded, saveSettingsToBackend } = useSettings(); 

//   const [fontSize, setFontSize] = useState(settings.font_size);
//   const [autoPlayTTS, setAutoPlayTTS] = useState(settings.auto_play_tts);
//   const [voiceSpeed, setVoiceSpeed] = useState([settings.voice_speed]); 
//   const [voicePitch, setVoicePitch] = useState([settings.voice_pitch]);
  
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState(null); 
  
//   useEffect(() => {
//       if (isLoaded) {
//           setFontSize(settings.font_size);
//           setAutoPlayTTS(settings.auto_play_tts);
//           setVoiceSpeed([settings.voice_speed]);
//           setVoicePitch([settings.voice_pitch]);
//       }
//   }, [settings, isLoaded]);

//   const testVoice = () => {
//     globalSpeakText("This is a test of your voice settings. Adjust speed and pitch using sliders above.");
//   };

//   const handleSaveSettings = async () => {
//     setIsSaving(true);
//     setError(null);
//     globalSpeakText("Saving settings...");
    
//     const settingsData = {
//       font_size: fontSize,
//       auto_play_tts: autoPlayTTS,
//       voice_speed: voiceSpeed[0], 
//       voice_pitch: voicePitch[0], 
//     };

//     try {
//       await saveSettingsToBackend(settingsData); 
//       globalSpeakText("Settings saved successfully!");
//       alert("Settings saved successfully!");
//     } catch (err) {
//       setError("Failed to save settings. Please try again.");
//       globalSpeakText("Error saving settings. Please try again.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (!isLoaded) {
//     return (
//       <div className="settings-page" style={{ textAlign: 'center', padding: '100px' }}>
//         <h1 className="settings-title">Loading Settings...</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="settings-page">
//       {/* Header */}
//       <header className="settings-header">
//         <Link to="/dashboard" className="settings-header">
//             <button className="full-btn back-btn">
//                 <ArrowLeft className="btn-icon" />
//                 Back to Dashboard
//             </button>
//         </Link>
//         <h1 className="settings-title">Settings</h1>
//       </header>

//       {error && <p className="text-red-600 text-center mb-4">{error}</p>}

//       {/* Main Grid */}
//       <main className="settings-container">
//         {/* Font Size */}
//         <Card className="settings-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-3">
//               <Type className="icon" />
//               Font Size
//             </CardTitle>
//             <CardDescription>Choose a comfortable text size</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* The name prop is removed from RadioGroup and applied directly to RadioGroupItem to fix mutual exclusion */}
//             <RadioGroup value={fontSize} onValueChange={setFontSize}>
//               <div className="radio-grid">
//                 <div className="radio-item">
//                   <RadioGroupItem value="small" id="small" name="font-size" />
//                   <Label htmlFor="small">Small (16px)</Label>
//                 </div>
//                 <div className="radio-item">
//                   <RadioGroupItem value="medium" id="medium" name="font-size" />
//                   <Label htmlFor="medium">Medium (18px) - Default</Label>
//                 </div>
//                 <div className="radio-item">
//                   <RadioGroupItem value="large" id="large" name="font-size" />
//                   <Label htmlFor="large">Large (24px)</Label>
//                 </div>
//                 <div className="radio-item">
//                   <RadioGroupItem value="xlarge" id="xlarge" name="font-size" />
//                   <Label htmlFor="xlarge">Extra Large (32px)</Label>
//                 </div>
//               </div>
//             </RadioGroup>
//           </CardContent>
//         </Card>

//         {/* Voice Settings */}
//         <Card className="settings-card voice-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-3">
//               <Volume2 className="icon" /> Voice Settings
//             </CardTitle>
//             <CardDescription>Customize text-to-speech preferences</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* Auto-play TTS */}
//             <div className="switch-item">
//               <div>
//                 <Label htmlFor="autoplay">Auto-Play Audio</Label>
//                 <p className="small-text">Automatically play important messages</p>
//               </div>
//               <Switch id="autoplay" checked={autoPlayTTS} onCheckedChange={setAutoPlayTTS} />
//             </div>

//             {/* Voice Speed */}
//             <div className="slider-item">
//               <Label>Voice Speed: {voiceSpeed[0].toFixed(1)}x</Label>
//               <Slider value={voiceSpeed} onValueChange={setVoiceSpeed} min={0.5} max={2} step={0.1} />
//             </div>

//             {/* Voice Pitch */}
//             <div className="slider-item">
//               <Label>Voice Pitch: {voicePitch[0].toFixed(1)}</Label>
//               <Slider value={voicePitch} onValueChange={setVoicePitch} min={0.5} max={2} step={0.1} />
//             </div>

//             <Button variant="outline" size="lg" className="full-btn" onClick={testVoice}>
//               <Volume2 className="icon-small" /> Test Voice Settings
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Data Export */}
//         <Card className="settings-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-3">
//               <Download className="icon" /> Data Export
//             </CardTitle>
//             <CardDescription>Download your medicine & prescription history</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button variant="outline" size="lg" className="full-btn">
//               <Download className="icon-small" /> Export My Data
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Save Settings */}
//         <Button 
//           variant="medical" 
//           size="lg" 
//           className="full-btn save-btn"
//           onClick={handleSaveSettings}
//           disabled={isSaving}
//         >
//           {isSaving ? "Saving..." : "Save Settings"}
//         </Button>
//       </main>
//     </div>
//   );
// };

// export default Settings;

// src/pages/Settings.js - UPDATED CODE
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { RadioGroup, RadioGroupItem } from "../components/ui/RadioGroup";
import { Switch } from "../components/ui/Switch";
import { Slider } from "../components/ui/Slider";
import { ArrowLeft, Type, Volume2, Download } from "lucide-react"; 
import { useSettings, globalSpeakText } from "../context/SettingsContext"; 
import { fetchExportData } from "../services/settings_service"; // NEW IMPORT

const Settings = () => {
  const { settings, isLoaded, saveSettingsToBackend } = useSettings(); 

  const [fontSize, setFontSize] = useState(settings.font_size);
  const [autoPlayTTS, setAutoPlayTTS] = useState(settings.auto_play_tts);
  const [voiceSpeed, setVoiceSpeed] = useState([settings.voice_speed]); 
  const [voicePitch, setVoicePitch] = useState([settings.voice_pitch]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null); 
  
  useEffect(() => {
      if (isLoaded) {
          setFontSize(settings.font_size);
          setAutoPlayTTS(settings.auto_play_tts);
          setVoiceSpeed([settings.voice_speed]);
          setVoicePitch([settings.voice_pitch]);
      }
  }, [settings, isLoaded]);

  const testVoice = () => {
    globalSpeakText("This is a test of your voice settings. Adjust speed and pitch using sliders above.");
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setError(null);
    globalSpeakText("Saving settings...");
    
    const settingsData = {
      font_size: fontSize,
      auto_play_tts: autoPlayTTS,
      voice_speed: voiceSpeed[0], 
      voice_pitch: voicePitch[0], 
    };

    try {
      await saveSettingsToBackend(settingsData); 
      globalSpeakText("Settings saved successfully!");
      alert("Settings saved successfully!");
    } catch (err) {
      setError("Failed to save settings. Please try again.");
      globalSpeakText("Error saving settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
    
  // NEW FUNCTION: Handle Data Export
  const handleExportData = async () => {
      globalSpeakText("Preparing data for PDF export.");
      try {
          // Call the service to fetch the file blob and response details
          const response = await fetchExportData();
          
          // 1. Extract Filename from Content-Disposition header
          const contentDisposition = response.headers['content-disposition'];
          let filename = `prescription_report_${new Date().toISOString()}.pdf`; 
  
          if (contentDisposition) {
              // Regex to find filename="example.pdf"
              const filenameMatch = contentDisposition.match(/filename="(.+)"/i);
              if (filenameMatch && filenameMatch.length === 2) {
                  filename = filenameMatch[1];
              }
          }
  
          // 2. Create a Blob URL and trigger download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename); // Set the file name
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url); // Clean up the URL
          
          globalSpeakText("PDF report download started. Check your downloads folder.");
          
      } catch (err) {
          console.error("Export Error:", err);
          setError("Failed to export data. Please check if you are logged in and the server is running.");
          globalSpeakText("Error exporting data. Please try again.");
      }
  };


  if (!isLoaded) {
    return (
      <div className="settings-page" style={{ textAlign: 'center', padding: '100px' }}>
        <h1 className="settings-title">Loading Settings...</h1>
      </div>
    );
  }

  return (
    <div className="settings-page">
      {/* Header */}
      <header className="settings-header">
        <Link to="/dashboard" className="settings-header">
            <button className="full-btn back-btn">
                <ArrowLeft className="btn-icon" />
                Back to Dashboard
            </button>
        </Link>
        <h1 className="settings-title">Settings</h1>
      </header>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Main Grid */}
      <main className="settings-container">
        {/* Font Size */}
        <Card className="settings-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Type className="icon" />
              Font Size
            </CardTitle>
            <CardDescription>Choose a comfortable text size</CardDescription>
          </CardHeader>
          <CardContent>
            {/* The name prop is removed from RadioGroup and applied directly to RadioGroupItem to fix mutual exclusion */}
            <RadioGroup value={fontSize} onValueChange={setFontSize}>
              <div className="radio-grid">
                <div className="radio-item">
                  <RadioGroupItem value="small" id="small" name="font-size" />
                  <Label htmlFor="small">Small (16px)</Label>
                </div>
                <div className="radio-item">
                  <RadioGroupItem value="medium" id="medium" name="font-size" />
                  <Label htmlFor="medium">Medium (18px) - Default</Label>
                </div>
                <div className="radio-item">
                  <RadioGroupItem value="large" id="large" name="font-size" />
                  <Label htmlFor="large">Large (24px)</Label>
                </div>
                <div className="radio-item">
                  <RadioGroupItem value="xlarge" id="xlarge" name="font-size" />
                  <Label htmlFor="xlarge">Extra Large (32px)</Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Voice Settings */}
        <Card className="settings-card voice-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Volume2 className="icon" /> Voice Settings
            </CardTitle>
            <CardDescription>Customize text-to-speech preferences</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Auto-play TTS */}
            <div className="switch-item">
              <div>
                <Label htmlFor="autoplay">Auto-Play Audio</Label>
                <p className="small-text">Automatically play important messages</p>
              </div>
              <Switch id="autoplay" checked={autoPlayTTS} onCheckedChange={setAutoPlayTTS} />
            </div>

            {/* Voice Speed */}
            <div className="slider-item">
              <Label>Voice Speed: {voiceSpeed[0].toFixed(1)}x</Label>
              <Slider value={voiceSpeed} onValueChange={setVoiceSpeed} min={0.5} max={2} step={0.1} />
            </div>

            {/* Voice Pitch */}
            <div className="slider-item">
              <Label>Voice Pitch: {voicePitch[0].toFixed(1)}</Label>
              <Slider value={voicePitch} onValueChange={setVoicePitch} min={0.5} max={2} step={0.1} />
            </div>

            <Button variant="outline" size="lg" className="full-btn" onClick={testVoice}>
              <Volume2 className="icon-small" /> Test Voice Settings
            </Button>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card className="settings-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Download className="icon" /> Data Export
            </CardTitle>
            <CardDescription>Download your medicine & prescription history</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
                variant="outline" 
                size="lg" 
                className="full-btn"
                onClick={handleExportData}
            >
              <Download className="icon-small" /> Export My Data
            </Button>
          </CardContent>
        </Card>

        {/* Save Settings */}
        <Button 
          variant="medical" 
          size="lg" 
          className="full-btn save-btn"
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </main>
    </div>
  );
};

export default Settings;