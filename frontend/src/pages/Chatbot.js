import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Volume2, Mic, Bot, User } from "lucide-react";
import { Textarea } from "../components/ui/Textarea";
import { ScrollArea } from "../components/ui/Scrollarea";
import "../styles/theme.css"; // Import the custom CSS

import { globalSpeakText as speakText } from "../context/SettingsContext";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm your medicine assistant. I can answer questions about your medications, dosages, and general medicine info. Always consult your healthcare provider for personalized advice. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const speakText = (text) => {
  //   if ("speechSynthesis" in window) {
  //     const utterance = new SpeechSynthesisUtterance(text);
  //     utterance.rate = 0.9;
  //     utterance.pitch = 1;
  //     window.speechSynthesis.speak(utterance);
  //   }
  // };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        role: "assistant",
        content:
          "Thanks for your question. I can provide general info about medicines, but always consult your healthcare provider for personalized advice.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      speakText(aiResponse.content);
    }, 1000);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speakText("Voice input is not supported in your browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      speakText("Listening...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      speakText("Voice input failed. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="chatbot-page">
      {/* Header */}
      <header className="chatbot-header">
        <div className="container">
          <Link to="/dashboard" className="chatbot-back-btn">
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-12 flex flex-col" style={{ maxWidth: '1280px' }}>
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
          {/* Title */}
          <div className="chatbot-title-section">
            <h1 className="chatbot-title">Medicine Chatbot</h1>
            <p className="chatbot-subtitle">
              Ask questions about your medicines with voice support
            </p>
          </div>

          {/* Disclaimer */}
          <Card className="chatbot-disclaimer">
            <CardContent>
              ⚕️ Medical Disclaimer: This chatbot provides general information
              only and is not a substitute for professional medical advice.
              Always consult your healthcare provider.
            </CardContent>
          </Card>

          {/* Chat Card */}
          <Card className="chatbot-card">
            {/* Header */}
            <CardHeader className="chatbot-card-header">
              <Bot className="w-10 h-10" />
              Medicine Assistant
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Scroll Area */}
              <div className="chatbot-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex flex-col gap-1 max-w-[70%]">
                      <Card className={`message ${message.role}`}>
                        <CardContent>
                          {message.content}
                        </CardContent>
                      </Card>

                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.role === "assistant" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(message.content)}
                            className="h-8 w-8 p-0"
                            aria-label="Play message audio"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Dummy div to scroll into view */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="chatbot-input-area">
                <Textarea
                  placeholder="Type your question about medicines..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="chatbot-textarea"
                  rows={1}
                />
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className="chatbot-btn voice"
                >
                  <Mic className={`w-6 h-6 ${isListening ? "animate-pulse" : ""}`} />
                  {isListening ? "Listening..." : "Voice"}
                </Button>
                <Button
                  variant="medical"
                  size="lg"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="chatbot-btn"
                >
                  <Send className="w-6 h-6" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;