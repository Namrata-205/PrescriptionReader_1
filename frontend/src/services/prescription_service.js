// src/services/prescription_service.js
import axios from "axios";

// Set your backend base URL
const API_BASE_URL = "http://127.0.0.1:8000/api"; // or your deployed backend URL

/**
 * Upload a prescription image to the backend
 * @param {File} file - the uploaded image
 * @returns {Promise<Object>} - returns { medicines: [...] }
 */
export const uploadPrescription = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE_URL}/prescriptions/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // should contain { medicines: [...] }
  } catch (error) {
    console.error("Error uploading prescription:", error);
    throw error;
  }
};
