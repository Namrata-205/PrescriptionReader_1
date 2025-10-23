import google.generativeai as genai
import os
from PIL import Image
import json
import re
from dotenv import load_dotenv

load_dotenv()

#genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class PrescriptionOCR:
    # def __init__(self):
    #     self.model = genai.GenerativeModel("gemini-2.5-flash")
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        
        # --- NEW DEBUGGING LOGIC ---
        if not self.api_key:
            print("FATAL ERROR: GEMINI_API_KEY IS NULL OR EMPTY.")
            # Ensure this raises an exception if the key is missing
            raise ValueError("Gemini API key not found. Set GEMINI_API_KEY environment variable.")
        else:
            print(f"DEBUG: OCR Initialized. Key starts with: {self.api_key[:4]}***")
        # -----------------------------
        
        # Configure the API client
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def process_prescription(self, image_path):
        try:
            img = Image.open(image_path)
            prompt = """
            You are an expert prescription reader. Extract all medicines, dosages, frequency, duration, and instructions.
            Return ONLY JSON in this format:
            {
              "medicines": [
                {
                  "medicine_name": "...",
                  "dosage": "...",
                  "frequency": "...",
                  "duration": "...",
                  "instructions": "..."
                }
              ]
            }
            """
            response = self.model.generate_content(
                [prompt, img],
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=2048
                )
            )
            # Extract JSON
            text = response.text.strip()
            try:
                structured = json.loads(re.search(r'(\{.*\})', text, re.DOTALL).group(1))
            except:
                structured = {"medicines": []}
            return text, structured
        except Exception as e:
            return f"Error: {str(e)}", {"medicines": []}
