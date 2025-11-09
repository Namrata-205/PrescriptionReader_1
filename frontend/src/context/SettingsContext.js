// src/context/SettingsContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. Create Context
export const SettingsContext = createContext();

const API_BASE_URL = "http://127.0.0.1:8000/api";

const getTokenConfig = () => {
    const token = localStorage.getItem("token"); 
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

// Default settings based on the initial state in Settings.js and backend service defaults
const defaultSettings = {
    font_size: "medium",
    //high_contrast: false,
    auto_play_tts: true,
    voice_speed: 1.0,
    voice_pitch: 1.0,
};

// 2. Create Provider Component
export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    // C. Applies font size class to the body (Fixes Font Issue)
    const applyFontClass = (fontSize) => {
        // Remove existing font classes to prevent conflict
        document.body.className = document.body.className
            .split(' ')
            .filter(c => !c.startsWith('font-size-'))
            .join(' ');
            
        // Add the new class, e.g., 'font-size-large'
        document.body.classList.add(`font-size-${fontSize}`);
    };
    
    // A. Fetches and initializes settings
    const fetchAndApplySettings = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setSettings(defaultSettings);
                localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
                applyFontClass(defaultSettings.font_size);
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/settings`, getTokenConfig());
            const loadedSettings = response.data;
            const cleanedSettings = {
                font_size: loadedSettings.font_size,
                auto_play_tts: loadedSettings.auto_play_tts,
                voice_speed: loadedSettings.voice_speed,
                voice_pitch: loadedSettings.voice_pitch,
            };
            setSettings(cleanedSettings);
            
            // Critical step: update localStorage for direct access in speakText utility (Fixes Audio Issue)
            localStorage.setItem('userSettings', JSON.stringify(cleanedSettings));
            
            applyFontClass(cleanedSettings.font_size);
        } catch (error) {
            console.error("Error loading settings. Using defaults.", error);
            setSettings(defaultSettings);
            localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
            applyFontClass(defaultSettings.font_size);
        } finally {
            setIsLoaded(true);
        }
    };
    
    // B. Saves settings to the backend and updates local state/storage
    const saveSettingsToBackend = async (newSettings) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/settings`, newSettings, getTokenConfig());
            
            const updatedSettings = response.data;
            const cleanedUpdatedSettings = {
                font_size: updatedSettings.font_size,
                auto_play_tts: updatedSettings.auto_play_tts,
                voice_speed: updatedSettings.voice_speed,
                voice_pitch: updatedSettings.voice_pitch,
            };  

            setSettings(cleanedUpdatedSettings);
            localStorage.setItem('userSettings', JSON.stringify(cleanedUpdatedSettings));
            applyFontClass(cleanedUpdatedSettings.font_size);
            
            return cleanedUpdatedSettings;
        } catch (error) {
            console.error("Error saving settings:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchAndApplySettings();
    }, []); 

    return (
        <SettingsContext.Provider value={{ settings, isLoaded, setSettings, saveSettingsToBackend }}>
            {children}
        </SettingsContext.Provider>
    );
};

// 3. Create Custom Hook for use in components
export const useSettings = () => useContext(SettingsContext);

// 4. Create Global SpeakText Utility (exported for use on ALL pages - Fixes Audio Issue)
export const globalSpeakText = (text) => {
    if ("speechSynthesis" in window) {
        // Read from localStorage directly for maximum accessibility/reliability on all components
        const settingsJson = localStorage.getItem('userSettings');
        const currentSettings = settingsJson ? JSON.parse(settingsJson) : defaultSettings;
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Apply saved settings
        utterance.rate = currentSettings.voice_speed || 1.0;
        utterance.pitch = currentSettings.voice_pitch || 1.0;
        
        // Clear queue and speak
        window.speechSynthesis.cancel(); 
        window.speechSynthesis.speak(utterance);
    }
};