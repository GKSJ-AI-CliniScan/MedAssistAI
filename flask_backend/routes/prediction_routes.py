from flask import Blueprint, request, jsonify
from utils.disease_predictor import DiseasePredictor

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/predict-disease', methods=['POST'])
def predict_disease():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Invalid request body"}), 400
            
        symptoms = data.get('symptoms', [])
        if not symptoms or not isinstance(symptoms, list):
            return jsonify({"success": False, "message": "Symptoms must be a non-empty list"}), 400
            
        context = {
            "severity": data.get('severity', 'Moderate'),
            "duration": data.get('duration', '3-7 days'),
            "onset": data.get('onset', 'Gradual'),
            "existingDiseases": data.get('existingDiseases', ''),
            "currentMedications": data.get('currentMedications', ''),
            "allergies": data.get('allergies', ''),
            "age": data.get('age', 30),
            "gender": data.get('gender', 'Female')
        }
        
        predictor = DiseasePredictor()
        result = predictor.predict(symptoms, context=context)
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error in predict_disease endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": "An error occurred during disease prediction"}), 500


@prediction_bp.route('/risk-assessment', methods=['POST'])
def risk_assessment():
    try:
        data = request.get_json() or {}
        symptoms = data.get('symptoms', [])
        severity = data.get('severity', 'Moderate')
        duration = data.get('duration', '3-7 days')
        
        predictor = DiseasePredictor()
        result = predictor.predict(symptoms, context=data)
        
        return jsonify({
            "success": True,
            "riskLevel": result.get("risk", "Low"),
            "riskScore": result.get("riskScore", 25),
            "isEmergency": result.get("isEmergency", False),
            "emergencyMessage": result.get("emergencyMessage", ""),
            "severityAssessment": severity,
            "complicationRisks": result.get("complicationRisks", []),
            "precautions": result.get("precautions", [])
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@prediction_bp.route('/treatment-recommendations', methods=['POST'])
def treatment_recommendations():
    try:
        data = request.get_json() or {}
        disease = data.get('disease', 'Viral Upper Respiratory Infection')
        risk_level = data.get('riskLevel', 'Low')
        
        predictor = DiseasePredictor()
        specialist = predictor.get_recommended_specialist(disease)
        tests = predictor.get_suggested_tests(disease)
        precautions = predictor.get_precautions(disease)
        ai_recs = predictor.get_ai_recommendations(disease, risk_level)
        lifestyle = predictor.get_lifestyle_advice(disease, risk_level)
        complications = predictor.get_complication_risks(disease)
        
        return jsonify({
            "success": True,
            "disease": disease,
            "recommendedSpecialist": specialist,
            "suggestedTests": tests,
            "precautions": precautions,
            "aiRecommendations": ai_recs,
            "lifestyleAdvice": lifestyle,
            "complicationRisks": complications
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
