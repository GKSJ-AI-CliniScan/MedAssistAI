from fpdf import FPDF
import datetime

class MilestonePDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font('Helvetica', 'I', 8)
            self.set_text_color(100, 100, 100)
            self.cell(0, 5, 'MedAssist AI: Database, Auth & History Logic - Milestone 1 Report', align='R')
            self.ln(5)
            self.set_draw_color(180, 180, 180)
            self.line(10, 16, 200, 16)
            self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

def create_report():
    pdf = MilestonePDF(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=20)
    
    # ------------------ PAGE 1: COVER PAGE ------------------
    pdf.add_page()
    pdf.set_text_color(0, 0, 0)
    
    pdf.ln(60)
    # Title
    pdf.set_font('Helvetica', 'B', 24)
    pdf.multi_cell(0, 12, 'MedAssist AI: Database Architecture,\nUser Authentication & Patient History Logic', align='C')
    
    pdf.ln(10)
    # Subtitle
    pdf.set_font('Helvetica', '', 14)
    pdf.cell(0, 10, 'Project Milestone 1 Report', align='C')
    pdf.ln(10)
    
    # Push to bottom
    pdf.ln(80)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 6, 'Prepared by: Anbarasan K', align='R')
    pdf.ln(6)
    pdf.set_font('Helvetica', '', 11)
    pdf.cell(0, 6, 'Role: Backend Dev & Database Architect', align='R')
    pdf.ln(6)
    pdf.cell(0, 6, f'Date: {datetime.date.today().strftime("%B %d, %Y")}', align='R')

    # ------------------ PAGE 2: TABLE OF CONTENTS ------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font('Helvetica', 'B', 18)
    pdf.cell(0, 10, 'Contents')
    pdf.ln(15)
    
    toc_items = [
        ("1 Project Description", "3"),
        ("2 Database Architecture & Collections", "3"),
        ("2.1 Collection Schemas", "4"),
        ("3 Environment & Stack Setup", "4"),
        ("4 Authentication & Security Design", "5"),
        ("4.1 Password Hashing", "5"),
        ("4.2 Session Tokenization (JWT)", "5"),
        ("5 Patient History & Consultation Logic", "5"),
        ("6 Resilient Local Database Fallback", "6"),
        ("7 API Endpoints & Verification", "6"),
        ("7.1 Automated Testing Results", "6"),
        ("8 Conclusion & Deployment Integration", "7")
    ]
    
    pdf.set_font('Helvetica', '', 11)
    for title, page in toc_items:
        indent = "   " if title.startswith("2.1") or title.startswith("4.1") or title.startswith("4.2") or title.startswith("7.1") else ""
        dots = "." * (80 - len(title) - len(indent))
        pdf.cell(0, 8, f'{indent}{title} {dots} {page}')
        pdf.ln(8)

    # ------------------ PAGE 3: DESCRIPTION & OVERVIEW ------------------
    pdf.add_page()
    pdf.ln(5)
    
    # 1. Project Description
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 8, '1 Project Description')
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 10.5)
    description_text = (
        "MedAssist AI is a machine learning pipeline designed to predict medical conditions based on "
        "reported patient symptoms. Acting as an advanced differential diagnosis tool, the system analyzes "
        "combinations of symptoms and outputs the top candidate diseases with confidence probabilities. "
        "As the Backend Developer & Database Architect, my role is to build a secure, scalable, and high-performance "
        "server-side foundation. This includes designing the database schemas to support fast symptom lookups "
        "and secure patient records, implementing cryptographically secure User Authentication, "
        "and programming the API logic to record and isolate patient consultation histories while enforcing "
        "role-based access controls."
    )
    pdf.multi_cell(0, 6, description_text)
    pdf.ln(6)

    # 2. Database Architecture & Collections
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 8, '2 Database Architecture & Collections')
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 10.5)
    db_text = (
        "The database is structured to support relational integrity using MongoDB's document-model design. "
        "It consists of five core collections: users, profiles, symptoms, disease_profiles, and consultations. "
        "All collections are designed to maintain fast read speeds using unique indexes on critical lookup fields."
    )
    pdf.multi_cell(0, 6, db_text)
    pdf.ln(6)
    
    # Insert Figure 1 (Architecture Diagram)
    pdf.image("c:/Users/Anbarasan.K/Downloads/mediai/architecture_diagram.png", x=30, w=140)
    pdf.ln(4)
    pdf.set_font('Helvetica', 'I', 9)
    pdf.cell(0, 5, 'Figure 1: MedAssist AI Backend & Database Architecture Flowchart', align='C')
    pdf.ln(10)

    # ------------------ PAGE 4: SCHEMAS & STACK SETUP ------------------
    pdf.add_page()
    pdf.ln(5)
    
    # 2.1 Collection Schemas
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 6, '2.1 Collection Schemas')
    pdf.ln(8)
    pdf.set_font('Helvetica', '', 10.5)
    
    schema_1 = (
        "- Users (users): Stores primary credentials and authorization roles.\n"
        "  Fields: _id (ObjectId), email (unique), hashed_password (string), role (patient/doctor/admin), created_at, updated_at.\n\n"
        "- Patient Profiles (profiles): Contains clinical and demographic information mapped to a user.\n"
        "  Fields: _id (ObjectId), user_id (unique, ref: users), first_name, last_name, date_of_birth, gender, blood_type, height, weight, allergies (array), medical_conditions (array).\n\n"
        "- Symptoms Catalog (symptoms): Holds indexed symptom terms for lookup.\n"
        "  Fields: _id (ObjectId), key (unique), display_name, category.\n\n"
        "- Disease Profiles (disease_profiles): Holds conditional probability mappings for disease predictions.\n"
        "  Fields: _id (ObjectId), disease (unique), symptom_probabilities (dict), base_rate, occurrences.\n\n"
        "- Consultation History (consultations): Logs patient symptom checks, predictions, risk scores, and recommendations.\n"
        "  Fields: _id (ObjectId), patient_id (ref: users), symptoms (array), predicted_diseases (array), risk_level, risk_score, recommendations (array), created_at."
    )
    pdf.multi_cell(0, 5.5, schema_1)
    pdf.ln(8)

    # 3. Environment & Stack Setup
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 8, '3 Environment & Stack Setup')
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 10.5)
    env_text = (
        "A micro-framework stack was selected to ensure rapid execution speed, minimal runtime overhead, and clean dependency management:\n"
        "- Language: Python 3.14\n"
        "- Web Framework: FastAPI (Asynchronous ASGI support, automated OpenAPI/Swagger generation)\n"
        "- ASGI Server: Uvicorn (High-performance event-loop runner)\n"
        "- Database Driver: Motor (Non-blocking, asynchronous MongoDB driver)\n"
        "- Testing Library: Pytest & HTTPX (Automated REST API verification)"
    )
    pdf.multi_cell(0, 6, env_text)
    pdf.ln(6)

    # ------------------ PAGE 5: SECURITY & HISTORY LOGIC ------------------
    pdf.add_page()
    pdf.ln(5)
    
    # 4. Authentication & Security Design
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 8, '4 Authentication & Security Design')
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 10.5)
    sec_intro = (
        "To secure sensitive clinical data, a multi-layer security architecture was implemented. "
        "Authentication is required to access patient data, catalog listings, and prediction logic."
    )
    pdf.multi_cell(0, 6, sec_intro)
    pdf.ln(6)

    # 4.1 Password Hashing
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 6, '4.1 Password Hashing')
    pdf.ln(8)
    pdf.set_font('Helvetica', '', 10.5)
    hashing_text = (
        "Rather than relying on compiled binary wrappers (e.g. bcrypt) which can fail across operating systems, "
        "a native PBKDF2 hashing model was built. It uses hashlib.pbkdf2_hmac with a SHA-256 back-end. "
        "It incorporates a random 16-byte hex-encoded salt and runs 100,000 iterations to defend against brute-force attacks."
    )
    pdf.multi_cell(0, 6, hashing_text)
    pdf.ln(6)

    # 4.2 Session Tokenization (JWT)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 6, '4.2 Session Tokenization (JWT)')
    pdf.ln(8)
    pdf.set_font('Helvetica', '', 10.5)
    jwt_text = (
        "Upon successful authentication, the server signs an HMAC-SHA256 JWT access token containing "
        "the user's ID, email, and role. Token expiration defaults to 60 minutes. "
        "FastAPI dependencies automatically intercept incoming requests to check token signatures and decrypt user payloads."
    )
    pdf.multi_cell(0, 6, jwt_text)
    pdf.ln(8)

    # 5. Patient History & Consultation Logic
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 8, '5 Patient History & Consultation Logic')
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 10.5)
    history_text = (
        "The consultation history backend acts as the bridge between database persistence and prediction algorithms:\n"
        "- Diagnosis Evaluation: When symptoms are submitted via /api/history/check, the backend passes symptoms to the prediction engine, which calculates disease likelihoods and assesses risk levels.\n"
        "- Consultation Record Creation: A consultation document is automatically created with the patient's ID, selected symptoms, top 5 predictions, overall risk score, and system recommendations.\n"
        "- Role Isolation Policy: Patients are strictly restricted to querying only their own consultation records, whereas Doctors and Admins bypass ownership checks to inspect any consultation record for review."
    )
    pdf.multi_cell(0, 6, history_text)
    pdf.ln(6)

    # ------------------ PAGE 6: DATABASE RESILIENCE & API TESTS ------------------
    pdf.add_page()
    pdf.ln(5)
    
    # 6. Resilient Local Database Fallback
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 8, '6 Resilient Local Database Fallback')
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 10.5)
    fallback_text = (
        "To ensure that development, local testing, and staging work even without a live MongoDB instance, "
        "a MockDatabase engine was built. The connection manager attempts a connection to localhost:27017 with a "
        "2-second timeout. If MongoDB is unreachable, it logs a warning and falls back to the local JSON file-based database, "
        "which mimics PyMongo query structures (like find, find_one, insert_one, update_one) and saves structured JSON files "
        "directly inside the backend/data/ directory."
    )
    pdf.multi_cell(0, 6, fallback_text)
    pdf.ln(8)

    # 7. API Endpoints & Verification
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 8, '7 API Endpoints & Verification')
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 10.5)
    api_text = (
        "The backend API exposes a clean routing topology (/api/auth, /api/profile, /api/symptoms, /api/history) "
        "that is fully testable via Swagger. The Swagger documentation serves as the direct link of communication between "
        "the backend developers and the frontend user interface designers."
    )
    pdf.multi_cell(0, 6, api_text)
    pdf.ln(8)

    # 7.1 Automated Testing Results
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 6, '7.1 Automated Testing Results')
    pdf.ln(8)
    pdf.set_font('Helvetica', '', 10.5)
    test_text = (
        "To verify implementation integrity, automated tests were run covering the core API paths. "
        "The test suite succeeded with 100% pass rates:"
    )
    pdf.multi_cell(0, 6, test_text)
    pdf.ln(4)
    
    # Insert Figure 2 (Pytest terminal results)
    pdf.image("c:/Users/Anbarasan.K/Downloads/mediai/test_results.png", x=30, w=140)
    pdf.ln(4)
    pdf.set_font('Helvetica', 'I', 9)
    pdf.cell(0, 5, 'Figure 2: Pytest Automated Suite Execution Terminal Output', align='C')
    pdf.ln(10)

    # ------------------ PAGE 7: CONCLUSION & FUTURE STEPS ------------------
    pdf.add_page()
    pdf.ln(5)
    
    # 8. Conclusion & Deployment Integration
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 8, '8 Conclusion & Deployment Integration')
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 10.5)
    conclusion_text = (
        "All core Backend and Database goals for Milestone 1 are complete. In the next phase:\n"
        "- Handover: The API schemas are documented under /docs to allow the Frontend Developer to begin connecting forms.\n"
        "- Deployment: The backend code is modularized and ready to be containerized in Docker for deployment by the Cloud Engineer."
    )
    pdf.multi_cell(0, 6, conclusion_text)

    # Save to disk
    pdf.output("c:/Users/Anbarasan.K/Downloads/mediai/Milestone1_Report_Backend.pdf")
    print("Report generated successfully as Milestone1_Report_Backend.pdf")

if __name__ == "__main__":
    create_report()
