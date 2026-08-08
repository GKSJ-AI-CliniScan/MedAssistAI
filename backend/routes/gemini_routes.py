import os
from flask import Blueprint, request, jsonify
from groq import Groq
from utils.auth import token_required
import json

gemini_bp = Blueprint('gemini', __name__)

# Configure Groq
api_key = os.getenv("GROQ_API_KEY")
if api_key and api_key != "YOUR_GROQ_API_KEY_HERE":
    client = Groq(api_key=api_key)
    # Using Llama 3.1 8b as default fast model
    model_name = "llama-3.1-8b-instant"
else:
    client = None
    model_name = None

@gemini_bp.route('/chat', methods=['POST'])
@token_required
def chat(current_user):
    if not client:
        return jsonify({
            'success': False, 
            'message': 'Groq API is not configured. Please add GROQ_API_KEY to the .env file.'
        }), 500
        
    data = request.get_json()
    prompt = data.get('prompt')
    
    if not prompt:
        return jsonify({'success': False, 'message': 'Prompt is required'}), 400
        
    try:
        chat_context = "You are MedAssistAI, a helpful AI healthcare assistant. Please provide helpful, safe medical information. Always advise users to consult a real doctor for serious conditions.\n\n"
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": chat_context
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=model_name,
        )
        
        return jsonify({
            'success': True,
            'response': chat_completion.choices[0].message.content
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@gemini_bp.route('/predict', methods=['POST'])
@token_required
def predict_disease(current_user):
    if not client:
        # Fallback to mock data if no API key is provided
        return jsonify({
            'success': True,
            'predictions': [
                {'disease': 'Common Cold', 'confidence': 0.85, 'risk': 'Low', 'specialist': 'General Practitioner'},
                {'disease': 'Seasonal Allergies', 'confidence': 0.72, 'risk': 'Low', 'specialist': 'Allergist'}
            ],
            'tests': ['Complete Blood Count (CBC)'],
            'precautions': ['Rest', 'Stay hydrated'],
            'recommendations': ['Over-the-counter pain relievers']
        }), 200
        
    data = request.get_json()
    symptoms = data.get('symptoms', [])
    
    if not symptoms:
        return jsonify({'success': False, 'message': 'Symptoms are required'}), 400
        
    try:
        prompt = f"""
        Given the following symptoms: {', '.join(symptoms)}
        Please provide a JSON response with the following structure:
        {{
            "predictions": [
                {{"disease": "Name", "confidence": 0.0-1.0, "risk": "Low/Medium/High", "specialist": "Specialist Type"}}
            ],
            "tests": ["test1", "test2"],
            "precautions": ["precaution1", "precaution2"],
            "recommendations": ["recommendation1", "recommendation2"]
        }}
        Make sure the response is valid JSON only, without markdown code blocks.
        """
        
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model=model_name,
        )
        
        text = chat_completion.choices[0].message.content.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.endswith('```'):
            text = text[:-3]
            
        result = json.loads(text)
        
        return jsonify({
            'success': True,
            **result
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

def extract_text_from_pdf(file_path):
    from pypdf import PdfReader
    try:
        reader = PdfReader(file_path)
        if reader.is_encrypted:
            raise Exception("PDF is password protected or encrypted.")
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        raise Exception(f"Corrupted or invalid PDF: {str(e)}")

def extract_text_from_image(file_path):
    import requests
    try:
        url = "https://api.ocr.space/parse/image"
        with open(file_path, 'rb') as f:
            payload = {
                'apikey': 'helloworld',
                'language': 'eng',
                'isOverlayRequired': False
            }
            files = {'file': f}
            response = requests.post(url, data=payload, files=files, timeout=20)
            
        if response.status_code != 200:
            raise Exception(f"OCR server returned status {response.status_code}")
            
        data = response.json()
        parsed_results = data.get("ParsedResults", [])
        if parsed_results:
            text = parsed_results[0].get("ParsedText", "")
            return text
        else:
            raise Exception("No text detected in the image.")
    except Exception as e:
        raise Exception(f"OCR analysis failed: {str(e)}")

def check_if_medical_report(text):
    text_lower = text.lower()
    
    # 1. Strong heuristic safeguard
    strong_medical_keywords = [
        "patient", "doctor", "clinic", "hospital", "laboratory", "prescription", 
        "diagnostic", "findings", "symptoms", "treatment", "medicine", "medication",
        "blood", "urine", "cbc", "hba1c", "hemoglobin", "cholesterol", "glucose", "thyroid"
    ]
    has_rx = "rx" in text_lower
    matched_keywords = [kw for kw in strong_medical_keywords if kw in text_lower]
    
    # If it contains "rx" and patient/doctor/hospital/medication, or at least 2 strong keywords, it's medical
    if (has_rx and len(matched_keywords) >= 1) or len(matched_keywords) >= 2:
        return True
        
    if not client:
        return False
        
    try:
        prompt = f"""
        Analyze the following text extracted from an uploaded document.
        Determine if this document is a medical report, laboratory test, health summary, clinic note, or prescription.
        Exclude documents like resumes, ID cards, notes, tickets, bills, movie texts, etc.
        
        Document Text:
        \"\"\"{text[:2000]}\"\"\"
        
        Respond strictly in JSON format (no markdown code blocks, no backticks, just raw JSON):
        {{
            "is_medical_report": true or false,
            "reason": "Brief explanation"
        }}
        """
        
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=model_name,
            response_format={"type": "json_object"}
        )
        
        res_text = chat_completion.choices[0].message.content.strip()
        result = json.loads(res_text)
        return bool(result.get("is_medical_report", False))
        
    except Exception as e:
        print(f"Error in check_if_medical_report LLM classification: {e}")
        return len(matched_keywords) >= 1

@gemini_bp.route('/analyze_report', methods=['POST'])
@token_required
def analyze_report(current_user):
    extracted_text = ""
    
    # 1. Handle file upload (multipart/form-data)
    if 'file' in request.files:
        file = request.files['file']
        if not file or file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected for upload'}), 400
            
        filename = file.filename
        ext = os.path.splitext(filename)[1].lower()
        
        # Check upload format validation
        if ext not in ['.pdf', '.png', '.jpg', '.jpeg']:
            return jsonify({
                'success': False, 
                'message': 'Unsupported file format. Please upload a PDF, PNG, JPG, or JPEG file.'
            }), 400
            
        try:
            uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'uploads'))
            os.makedirs(uploads_dir, exist_ok=True)
            from werkzeug.utils import secure_filename
            import datetime
            timestamp = int(datetime.datetime.now().timestamp())
            secure_name = f"{timestamp}_{secure_filename(filename)}"
            temp_path = os.path.join(uploads_dir, secure_name)
            file.save(temp_path)
            
            # Extract text
            if ext == '.pdf':
                extracted_text = extract_text_from_pdf(temp_path)
            else:
                extracted_text = extract_text_from_image(temp_path)
                
            # Delete temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
        except Exception as e:
            if 'temp_path' in locals() and os.path.exists(temp_path):
                os.remove(temp_path)
            return jsonify({
                'success': False, 
                'message': f'Failed to process file: {str(e)}'
            }), 400
            
    # 2. Handle JSON payload (backward compatibility)
    else:
        data = request.get_json(silent=True) or {}
        extracted_text = data.get('reportText', '')
        
    if not extracted_text or len(extracted_text.strip()) < 10:
        return jsonify({
            'success': False, 
            'message': 'The uploaded file could not be read, is empty, or password-protected. Please ensure it is a valid document.'
        }), 400
        
    try:
        # Check if the document is a medical report
        is_medical = check_if_medical_report(extracted_text)
        if not is_medical:
            return jsonify({
                'success': False,
                'message': 'The uploaded file is not recognized as a valid medical report. Please upload a healthcare-related report.'
            }), 400
            
        if not client:
            # Fallback to mock data if no API key is provided
            return jsonify({
                'success': True,
                'summary': "Patient is a 35-year-old male with mild anemia and slightly elevated white blood cell count.",
                'medicalTerms': [
                    {"term": "Hemoglobin", "explanation": "A protein in red blood cells that carries oxygen."}
                ],
                'abnormalValues': [
                    {"test": "Hemoglobin", "value": "11.2", "normal": "12-16", "status": "Low"}
                ],
                'recommendations': ["Follow up with GP in 2 weeks"],
                'healthAssessment': "Mild anemia."
            }), 200

        prompt = f"""
        Analyze this medical report and provide:
        1. A comprehensive summary of the report in simple English
        2. Explanation of difficult medical terms in simple language
        3. Highlight any abnormal values or concerning findings
        4. Generate specific supportive health recommendations based on the results (e.g. consult physician, specialist clinic, lifestyle/diet changes)
        5. Overall health assessment. You MUST include a "Risk Assessment" (Low, Medium, or High Risk, explaining why) and a "Disease Prediction" (possible diseases/conditions like Diabetes, Hypertension, Anemia, Fatty Liver, Thyroid, Infection, Kidney Disease, etc.) ONLY when sufficient evidence exists.
        
        Medical Report Content:
        {extracted_text}
        
        Provide the response strictly in JSON format (no markdown code blocks, no backticks, just raw JSON):
        {{
            "summary": "String summary of the report",
            "medicalTerms": [
                {{"term": "Term Name", "explanation": "Explanation in simple language"}}
            ],
            "abnormalValues": [
                {{"test": "Test Name", "value": "Result", "normal": "Normal Range", "status": "High/Low/Abnormal"}}
            ],
            "recommendations": [
                "Recommendation 1",
                "Recommendation 2"
            ],
            "healthAssessment": "Overall health assessment including Risk Assessment and Disease Prediction with evidence."
        }}
        """
        
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model=model_name,
            response_format={"type": "json_object"}
        )
        
        res_text = chat_completion.choices[0].message.content.strip()
        result = json.loads(res_text)
        
        return jsonify({
            'success': True,
            **result
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

