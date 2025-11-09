// src/services/medicine_service.js
import axios from "axios";

// Set your backend base URL
const API_BASE_URL = "http://127.0.0.1:8000/api";

// const getTokenConfig = () => {
//     const token = localStorage.getItem("token"); // Assuming JWT is stored here
//     return {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//         },
//     };
// };


const getTokenConfig = () => {
    const token = localStorage.getItem("token"); // Assuming JWT is stored here
    return {
        headers: {
            Authorization: `Bearer ${token}`, // Correctly prepends "Bearer "
            "Content-Type": "application/json",
        },
    };
};


/**
 * Saves the extracted structured medicine data after user review/editing.
 * @param {Object} data - { raw_text: string, medicines: [{...}] }
 * @returns {Promise<Object>} - Success message
 */
export const savePrescriptionData = async (data) => {
  try {
    // Calls the new POST /api/prescriptions/save endpoint
    const response = await axios.post(`${API_BASE_URL}/prescriptions/save`, data, getTokenConfig());
    return response.data;
  } catch (error) {
    console.error("Error saving prescription data:", error);
    throw error;
  }
};

/**
 * Fetches all saved medicines for the current user.
 * @returns {Promise<Array>} - List of medicine objects
 */
export const fetchMyMedicines = async () => {
  try {
    // Calls the new GET /api/prescriptions/ endpoint
    const response = await axios.get(`${API_BASE_URL}/prescriptions/`, getTokenConfig());
    return response.data.medicines || [];
  } catch (error) {
    console.error("Error fetching my medicines:", error);
    throw error;
  }
};