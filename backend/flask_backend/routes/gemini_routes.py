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

@gemini_bp.route('/analyze_report', methods=['POST'])
@token_required
def analyze_report(current_user):
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
        
    data = request.get_json()
    report_text = data.get('reportText', '')
    
    if not report_text:
        return jsonify({'success': False, 'message': 'Report text is required'}), 400
        
    try:
        prompt = f"""
        Analyze this medical report and provide:
        1. A comprehensive summary of the report
        2. Explanation of difficult medical terms in simple language
        3. Highlight any abnormal values or concerning findings
        4. Generate specific health recommendations based on the results
        5. Overall health assessment
        
        Medical Report Content:
        {report_text}
        
        Provide response strictly in JSON format:
        {{
            "summary": "String summary",
            "medicalTerms": [{{"term": "Term Name", "explanation": "Explanation"}}],
            "abnormalValues": [{{"test": "Test Name", "value": "Result", "normal": "Normal Range", "status": "High/Low/Abnormal"}}],
            "recommendations": ["Recommendation 1", "Recommendation 2"],
            "healthAssessment": "Overall string assessment"
        }}
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
