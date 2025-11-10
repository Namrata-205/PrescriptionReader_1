# backend/app/services/medicine_scanner.py
import os
import google.generativeai as genai
from PIL import Image
import json

class MedicineScanner:
    def __init__(self, api_key=None):
        # NOTE: Keeping hardcoded key as requested, but highly discouraged for production!
        self.api_key = os.getenv("GEMINI_API_KEY") 

        if not self.api_key:
            raise ValueError("Gemini API key not found.")
        print(f"OCR Initialized. Key starts with: {self.api_key[:4]}***")

        # Configure the API client
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def process_label(self, image_path):
        try:
            img = Image.open(image_path)
            prompt = """
            You are an expert drug label reader. Extract the drug label name and expiry date from this medicine package/bottle.
            
            Return the result in JSON format with two keys: 
            - "drug_name" (string): The complete medicine name
            - "expiry_date" (string): The expiry date in YYYY-MM-DD format
            
            Example: {"drug_name": "Paracetamol 500mg", "expiry_date": "2025-12-31"}
            
            If you cannot find either field, use "Not Found" as the value.
            """
            response = self.model.generate_content(
                [prompt, img],
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=2048
                )
            )

            # Get raw text response
            raw_text = response.text.strip()
            print("OCR Raw Response:\n", raw_text)

            # Clean up response (removes ```json...``` fences if present)
            json_text = raw_text
            if json_text.startswith("```"):
                # Remove markdown code fences
                lines = json_text.split('\n')
                json_text = '\n'.join(lines[1:-1]) if len(lines) > 2 else json_text
                json_text = json_text.replace('```json', '').replace('```', '').strip()

            # Parse the JSON string into a Python dictionary
            structured_data = json.loads(json_text)
            
            # Validate structure
            if "drug_name" not in structured_data:
                structured_data["drug_name"] = "Not Found"
            if "expiry_date" not in structured_data:
                structured_data["expiry_date"] = "Not Found"
            
            # Return BOTH raw_text and structured_data (as expected by router)
            return raw_text, structured_data

        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e}")
            print(f"Attempted to parse: {json_text}")
            # Return error structure
            return response.text.strip(), {
                "drug_name": "Error parsing response",
                "expiry_date": "Not Found",
                "error": "Failed to parse JSON response"
            }
        except Exception as e:
            print("Error during processing:", str(e))
            return "", {
                "drug_name": "Processing Error",
                "expiry_date": "Not Found",
                "error": str(e)
            }