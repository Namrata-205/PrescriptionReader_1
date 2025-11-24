// // src/services/settings_service.js
// import axios from "axios"; //

// const API_BASE_URL = "http://127.0.0.1:8000/api";

// const getTokenConfig = () => {
//     const token = localStorage.getItem("token"); // Assuming JWT is stored here after login
//     return {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//         },
//     };
// };

// /**
//  * Fetches the user's current settings from the backend.
//  * @returns {Promise<Object>} - User settings object.
//  */
// export const fetchSettings = async () => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/settings`, getTokenConfig());
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching settings:", error);
//         throw error;
//     }
// };

// /**
//  * Sends updated settings to the backend.
//  * @param {Object} settingsData - The settings object to save.
//  * @returns {Promise<Object>} - The saved settings object.
//  */
// export const saveSettings = async (settingsData) => {
//     try {
//         const response = await axios.put(`${API_BASE_URL}/settings`, settingsData, getTokenConfig());
//         return response.data;
//     } catch (error) {
//         console.error("Error saving settings:", error);
//         throw error;
//     }
// };



// src/services/settings_service.js
import axios from "axios"; 

const API_BASE_URL = "https://prescriptionreader-4x86.onrender.com/api";

const getTokenConfig = () => {
    const token = localStorage.getItem("token"); // Assuming JWT is stored here after login
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

/**
 * Fetches the user's current settings from the backend.
 * @returns {Promise<Object>} - User settings object.
 */
export const fetchSettings = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/settings`, getTokenConfig());
        return response.data;
    } catch (error) {
        console.error("Error fetching settings:", error);
        throw error;
    }
};

/**
 * Sends updated settings to the backend.
 * @param {Object} settingsData - The settings object to save.
 * @returns {Promise<Object>} - The saved settings object.
 */
export const saveSettings = async (settingsData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/settings`, settingsData, getTokenConfig());
        return response.data;
    } catch (error) {
        console.error("Error saving settings:", error);
        throw error;
    }
};

/**
 * Fetches all user data for export (PDF/Text Report).
 * @returns {Promise<Response>} - The full axios response object containing the file blob.
 */
export const fetchExportData = async () => {
    try {
        // Configure axios to expect a blob (file content)
        const config = { 
            headers: { 
                Authorization: getTokenConfig().headers.Authorization 
            },
            responseType: 'blob', // Crucial for downloading binary data (PDF/file)
        };

        const response = await axios.get(`${API_BASE_URL}/settings/export`, config);
        return response; // Return the full response to access headers
    } catch (error) {
        console.error("Error fetching export data:", error);
        throw error;
    }
};
