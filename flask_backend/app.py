import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret')
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/medassist_ai')

# Enable CORS for frontend integration
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Import database initialization
from db import init_db
init_db(app)

# Import routes
from routes.auth_routes import auth_bp
from routes.gemini_routes import gemini_bp
from routes.user_routes import user_bp
from routes.report_routes import report_bp
from routes.appointment_routes import appointment_bp
from routes.hospital_routes import hospital_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(gemini_bp, url_prefix='/api/gemini')
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(report_bp, url_prefix='/api/reports')
app.register_blueprint(appointment_bp, url_prefix='/api/appointments')
app.register_blueprint(hospital_bp, url_prefix='/api/hospital')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "MedAssistAI Flask Backend"})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
