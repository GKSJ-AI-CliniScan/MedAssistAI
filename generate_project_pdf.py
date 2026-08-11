import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Draw header (pages > 1)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0f172a"))
            self.drawString(54, 11 * inch - 36, "MedAssist AI — Complete Project Documentation & Technical Specification")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)

        # Draw footer (all pages)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        footer_text = "MedAssist AI Clinical Diagnostic & Healthcare Intelligence Platform"
        self.drawString(54, 30, footer_text)
        
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * inch - 54, 30, page_text)
        
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 42, 8.5 * inch - 54, 42)
        
        self.restoreState()

def build_pdf(filename="MedAssist_AI_Complete_Project_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#0284c7") # Sky blue / Cyan accent
    secondary_color = colors.HexColor("#0f172a") # Slate 900
    dark_accent = colors.HexColor("#1e293b")
    text_color = colors.HexColor("#334155")
    bg_light = colors.HexColor("#f8fafc")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=30,
        textColor=secondary_color,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=16,
        textColor=primary_color,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=secondary_color,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=text_color,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'Code',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#0f172a"),
        backColor=bg_light,
        borderColor=colors.HexColor("#cbd5e1"),
        borderWidth=0.5,
        borderPadding=6,
        spaceAfter=8
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=text_color
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell_style,
        fontName='Helvetica-Bold',
        textColor=secondary_color
    )

    story = []

    # Title Block
    story.append(Paragraph("MedAssist AI — Comprehensive Project Architecture & Specification", title_style))
    story.append(Paragraph("End-to-End Technical Documentation from Scratch | Clinical Diagnostic Platform", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceAfter=15))

    # 1. Executive Summary & Overview
    story.append(Paragraph("1. Project Overview & Clinical Mission", h1_style))
    story.append(Paragraph(
        "<b>MedAssist AI</b> is a full-stack, AI-powered healthcare intelligence platform designed to assist both patients and healthcare providers in preliminary symptom analysis, machine learning-driven disease prediction, clinical risk stratification, treatment recommendations, and automated medical report generation.",
        body_style
    ))
    story.append(Paragraph("<b>Key Problems Solved:</b>", body_style))
    story.append(Paragraph("• <b>Diagnostic Guidance:</b> Provides rapid, evidence-backed preliminary disease probability assessments based on patient symptom profiles.", bullet_style))
    story.append(Paragraph("• <b>Risk Stratification:</b> Categorizes clinical cases into Low, Moderate, High, or Critical urgency tiers based on symptom duration and severity.", bullet_style))
    story.append(Paragraph("• <b>Actionable Treatment Plans:</b> Offers structured medical recommendations, medications, diet guidelines, and lifestyle precautions.", bullet_style))
    story.append(Paragraph("• <b>Automated Clinical Reporting:</b> Generates downloadable, publication-grade PDF medical reports complete with patient history and diagnostic summaries.", bullet_style))
    story.append(Paragraph("• <b>Seamless Authentication:</b> Provides multi-channel user authentication featuring JWT, OAuth 2.0 (Google & Microsoft), and interactive fallback capabilities.", bullet_style))

    story.append(Spacer(1, 10))

    # 2. Technology Stack
    story.append(Paragraph("2. System Architecture & Technology Stack", h1_style))
    
    tech_data = [
        [Paragraph("Layer", table_header_style), Paragraph("Technology / Framework", table_header_style), Paragraph("Version / Tools", table_header_style), Paragraph("Description & Purpose", table_header_style)],
        [Paragraph("Frontend UI", table_cell_bold), Paragraph("React.js", table_cell_style), Paragraph("v18.3.1", table_cell_style), Paragraph("Single Page Application (SPA) with responsive dark-glass UI", table_cell_style)],
        [Paragraph("Build Tool", table_cell_bold), Paragraph("Vite", table_cell_style), Paragraph("v5.4.21", table_cell_style), Paragraph("Lightning-fast frontend bundler & dev server", table_cell_style)],
        [Paragraph("Styling & UX", table_cell_bold), Paragraph("Tailwind CSS", table_cell_style), Paragraph("v3.4.17", table_cell_style), Paragraph("Utility-first styling with custom glassmorphism design tokens", table_cell_style)],
        [Paragraph("Icons & Motion", table_cell_bold), Paragraph("Lucide React & Framer Motion", table_cell_style), Paragraph("Latest", table_cell_style), Paragraph("Modern iconography, smooth page transitions & interactive modals", table_cell_style)],
        [Paragraph("Backend API", table_cell_bold), Paragraph("FastAPI (Python)", table_cell_style), Paragraph("Python 3.14 / FastAPI 0.115+", table_cell_style), Paragraph("Asynchronous REST API framework with automatic OpenAPI docs", table_cell_style)],
        [Paragraph("Database & ORM", table_cell_bold), Paragraph("SQLAlchemy & SQLite", table_cell_style), Paragraph("SQLAlchemy v2.0+", table_cell_style), Paragraph("Relational database schema with repository pattern data access", table_cell_style)],
        [Paragraph("AI / ML Models", table_cell_bold), Paragraph("Scikit-Learn & NumPy", table_cell_style), Paragraph("v1.5+", table_cell_style), Paragraph("Random Forest & Decision Tree classification models for diagnostic prediction", table_cell_style)],
        [Paragraph("Security & Auth", table_cell_bold), Paragraph("PyJWT & Passlib", table_cell_style), Paragraph("v2.9+", table_cell_style), Paragraph("JSON Web Token (JWT) stateless auth with bcrypt password hashing", table_cell_style)],
        [Paragraph("PDF Generator", table_cell_bold), Paragraph("ReportLab", table_cell_style), Paragraph("v5.0.0", table_cell_style), Paragraph("Automated canvas & document generation for medical reports", table_cell_style)]
    ]

    t_tech = Table(tech_data, colWidths=[1.1*inch, 1.4*inch, 1.3*inch, 3.2*inch])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), secondary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_tech)

    story.append(Spacer(1, 15))

    # 3. Directory & File Structure
    story.append(Paragraph("3. Complete Project Directory Structure", h1_style))
    story.append(Paragraph("The project is structured cleanly as a decoupled monorepo containing distinct <b>frontend</b> and <b>backend</b> services:", body_style))

    dir_structure_code = """medassist-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py               # API dependencies (database session, current user JWT validation)
│   │   │   └── routers/
│   │   │       ├── auth.py           # Login, Register, Google & Microsoft OAuth endpoints
│   │   │       ├── dashboard.py      # Health stats & analytical summary endpoints
│   │   │       ├── predictions.py    # Disease prediction submission & history API
│   │   │       ├── recommendations.py# Medication & lifestyle recommendation API
│   │   │       ├── reports.py        # PDF medical report generation & download API
│   │   │       ├── risk.py           # Clinical urgency & risk assessment API
│   │   │       ├── symptoms.py       # Symptom search & catalog endpoints
│   │   │       └── users.py          # User profile management API
│   │   ├── core/
│   │   │   ├── config.py             # Application settings & environment variables
│   │   │   ├── database.py           # SQLAlchemy engine & session factory
│   │   │   └── security.py           # JWT token encoding/decoding & bcrypt hashing
│   │   ├── ml/
│   │   │   ├── predictor.py          # Machine learning model loader & inference engine
│   │   │   ├── recommendation_engine.py # Clinical treatment & medication mapper
│   │   │   └── risk_engine.py        # Risk score calculator & severity classifier
│   │   ├── models/                   # SQLAlchemy ORM Data Models (User, Patient, Symptom, etc.)
│   │   ├── repositories/             # Data Access Layer (UserRepository, PredictionRepository, etc.)
│   │   ├── schemas/                  # Pydantic Request/Response validation schemas
│   │   ├── services/                 # Business logic & ReportLab PDF generator
│   │   └── main.py                   # FastAPI application entry point & CORS configuration
│   ├── migrate_db.py                 # Automatic database migration & schema updater
│   ├── requirements.txt              # Python dependencies specification
│   └── sql_app.db                    # SQLite database instance
├── frontend/
│   ├── src/
│   │   ├── components/               # UI Reusable Primitives (Navbar, Sidebar, RippleButton, etc.)
│   │   ├── context/                  # React Contexts (AuthContext.jsx, ThemeContext.jsx)
│   │   ├── hooks/                    # Custom Hooks (usePrediction.js, useAuth.js)
│   │   ├── pages/
│   │   │   ├── Auth/                 # LoginPage, RegisterPage, Google & Microsoft Modals
│   │   │   ├── Dashboard/            # Dashboard Analytics & Quick Actions
│   │   │   ├── DiseasePrediction/    # Interactive AI Diagnosis Form & Results
│   │   │   ├── Landing/              # Marketing Landing Page & Features Hero
│   │   │   ├── Profile/              # User Profile Settings & Medical History
│   │   │   ├── Recommendations/      # Treatment Plans & Prescriptions View
│   │   │   ├── Reports/              # Downloadable Clinical PDF Reports Center
│   │   │   ├── RiskAssessment/       # Triage & Urgency Assessment View
│   │   │   └── SymptomAnalysis/      # Multi-symptom selector & severity evaluator
│   │   ├── routes/                   # AppRoutes.jsx, ProtectedRoute.jsx, PublicOnlyRoute.jsx
│   │   ├── services/                 # Axios API clients (authService.js, apiService.js)
│   │   ├── App.jsx                   # Application root component
│   │   └── main.jsx                  # Vite React DOM entry point
│   ├── package.json                  # Node.js dependencies & scripts
│   └── vite.config.js                # Vite build configuration
└── README.md                         # Project documentation overview"""

    story.append(Paragraph(dir_structure_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(PageBreak())

    # 4. Detailed Component & Feature Deep Dive
    story.append(Paragraph("4. Key Modules & Functional Workflows", h1_style))

    story.append(Paragraph("A. Authentication & Security Flow", h2_style))
    story.append(Paragraph(
        "• <b>Form-First Layout:</b> The login portal features an intuitive form layout placing Email & Password inputs at the top, followed by the main 'Sign In to Portal' action button, and Social Auth buttons (Google & Microsoft) below.<br/>"
        "• <b>Dual OAuth & Dev Fallback:</b> Supports standard Google/Microsoft OAuth 2.0 logins. In development environments where OAuth Client IDs are pending, integrated fallback account selector modals allow instant testing.<br/>"
        "• <b>Token Persistence:</b> Valid JWT tokens are stored securely in `localStorage` and attached via Axios request interceptors to all protected API calls.",
        body_style
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph("B. AI Symptom Analysis & Disease Prediction", h2_style))
    story.append(Paragraph(
        "• <b>Symptom Search & Selection:</b> Patients select symptoms from a curated clinical database, specifying severity levels (Mild, Moderate, Severe) and duration (in days).<br/>"
        "• <b>Machine Learning Inference:</b> The backend ML engine (`predictor.py`) processes input vectors through pre-trained classification models to predict target medical conditions with calculated confidence scores.<br/>"
        "• <b>Full Flow Integration:</b> Submitting symptom analysis automatically creates linked Database records for Prediction, Risk Assessment, and Recommendations.",
        body_style
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph("C. Clinical Risk Assessment & Triage Engine", h2_style))
    story.append(Paragraph(
        "• <b>Urgency Stratification:</b> Analyzes symptom severity and duration to output a clinical risk tier: <i>Low (Green), Moderate (Yellow), High (Orange), or Critical (Red)</i>.<br/>"
        "• <b>Dynamic Guidance:</b> Recommends specific timeframes for medical consultation (e.g., immediate ER visit vs routine doctor appointment within 48 hours).",
        body_style
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph("D. Treatment & Recommendation Engine", h2_style))
    story.append(Paragraph(
        "• <b>Medication Guidance:</b> Provides over-the-counter and prescription medicine suggestions along with dosage guidelines, indications, and precautions.<br/>"
        "• <b>Holistic Care Plans:</b> Delivers dietary guidelines, fluid intake recommendations, physical activity advice, and specialist doctor referrals.",
        body_style
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph("E. ReportLab PDF Medical Report Generator", h2_style))
    story.append(Paragraph(
        "• <b>Publication-Grade PDF:</b> Built with ReportLab, generating standard formatted PDF medical reports containing patient demographics, diagnostic predictions, risk breakdown, and prescriptions.<br/>"
        "• <b>Direct Browser Download:</b> Accessible directly from the Reports page via backend `/api/v1/reports/download/{id}` endpoint.",
        body_style
    ))

    story.append(Spacer(1, 10))

    # 5. Database Schema Specification
    story.append(Paragraph("5. Relational Database Schema Specification", h1_style))

    db_schema_data = [
        [Paragraph("Table Name", table_header_style), Paragraph("Primary Key", table_header_style), Paragraph("Key Fields", table_header_style), Paragraph("Foreign Keys & Relations", table_header_style)],
        [Paragraph("users", table_cell_bold), Paragraph("id (Integer)", table_cell_style), Paragraph("email, hashed_password, full_name, role, is_active", table_cell_style), Paragraph("One-to-One with patient, One-to-Many with notifications", table_cell_style)],
        [Paragraph("patients", table_cell_bold), Paragraph("id (Integer)", table_cell_style), Paragraph("age, gender, blood_type, height, weight, allergies", table_cell_style), Paragraph("FK -> users.id, One-to-Many with predictions", table_cell_style)],
        [Paragraph("symptoms", table_cell_bold), Paragraph("id (Integer)", table_cell_style), Paragraph("code, name, body_part, severity, synonyms", table_cell_style), Paragraph("Catalog lookup table for ML input matching", table_cell_style)],
        [Paragraph("diseases", table_cell_bold), Paragraph("id (Integer)", table_cell_style), Paragraph("code, name, category, description, specialist", table_cell_style), Paragraph("Catalog table for predicted health conditions", table_cell_style)],
        [Paragraph("predictions", table_cell_bold), Paragraph("id (Integer)", table_cell_style), Paragraph("primary_disease, confidence, symptoms_list", table_cell_style), Paragraph("FK -> patients.id, Has-One Risk & Recommendation", table_cell_style)],
        [Paragraph("risk_assessments", table_cell_bold), Paragraph("id (Integer)", table_cell_style), Paragraph("risk_level, urgency, risk_factors", table_cell_style), Paragraph("FK -> predictions.id", table_cell_style)],
        [Paragraph("recommendations", table_cell_bold), Paragraph("id (Integer)", table_cell_style), Paragraph("medicines, lifestyle, diet, follow_up", table_cell_style), Paragraph("FK -> predictions.id", table_cell_style)],
        [Paragraph("reports", table_cell_bold), Paragraph("id (Integer)", table_cell_style), Paragraph("report_code, pdf_path, generated_at", table_cell_style), Paragraph("FK -> predictions.id, FK -> patients.id", table_cell_style)]
    ]

    t_db = Table(db_schema_data, colWidths=[1.2*inch, 1.1*inch, 2.3*inch, 2.4*inch])
    t_db.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), secondary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_db)

    story.append(Spacer(1, 10))

    # 6. Feature Implementation Matrix
    story.append(Paragraph("6. Implementation Status Matrix", h1_style))

    status_data = [
        [Paragraph("Feature Area", table_header_style), Paragraph("Implementation Status", table_header_style), Paragraph("Details & Capabilities", table_header_style)],
        [Paragraph("Email & Password Auth", table_cell_bold), Paragraph("100% Fully Implemented", table_cell_style), Paragraph("BCrypt password hashing, JWT access token issue & validation", table_cell_style)],
        [Paragraph("Google & Microsoft Sign-In", table_cell_bold), Paragraph("100% Fully Implemented", table_cell_style), Paragraph("OAuth 2.0 flow with interactive modal fallbacks for development", table_cell_style)],
        [Paragraph("Symptom Analysis", table_cell_bold), Paragraph("100% Fully Implemented", table_cell_style), Paragraph("Interactive symptom tag selection, severity and duration input", table_cell_style)],
        [Paragraph("AI Disease Prediction", table_cell_bold), Paragraph("100% Fully Implemented", table_cell_style), Paragraph("Machine Learning classification with confidence score outputs", table_cell_style)],
        [Paragraph("Risk Stratification", table_cell_bold), Paragraph("100% Fully Implemented", table_cell_style), Paragraph("Urgency score, risk matrix calculation, and emergency flags", table_cell_style)],
        [Paragraph("Treatment & Prescriptions", table_cell_bold), Paragraph("100% Fully Implemented", table_cell_style), Paragraph("Medication recommendations, lifestyle, diet, and specialist advice", table_cell_style)],
        [Paragraph("PDF Report Generation", table_cell_bold), Paragraph("100% Fully Implemented", table_cell_style), Paragraph("ReportLab engine PDF export and browser download integration", table_cell_style)],
        [Paragraph("User Dashboard", table_cell_bold), Paragraph("100% Fully Implemented", table_cell_style), Paragraph("Recent predictions summary, health status stats, and quick actions", table_cell_style)]
    ]

    t_status = Table(status_data, colWidths=[1.8*inch, 1.8*inch, 3.4*inch])
    t_status.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), secondary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_status)

    story.append(Spacer(1, 10))

    # 7. Setup & Execution Guide
    story.append(Paragraph("7. Setup & Execution Guide (From Scratch)", h1_style))
    story.append(Paragraph("Follow these exact steps to run the backend and frontend locally from scratch:", body_style))

    setup_code = """# 1. Backend Setup & Run
cd backend
python -m venv venv
# On Windows:
venv\\Scripts\\activate
pip install -r requirements.txt
python migrate_db.py
uvicorn app.main:app --reload --port 8000

# 2. Frontend Setup & Run (in a separate terminal)
cd frontend
npm install
npm run dev

# Access the Web Application at:
http://localhost:5173
# API Documentation (Swagger UI) at:
http://localhost:8000/docs"""

    story.append(Paragraph(setup_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == '__main__':
    output_pdf = sys.argv[1] if len(sys.argv) > 1 else "MedAssist_AI_Complete_Project_Documentation.pdf"
    build_pdf(output_pdf)
