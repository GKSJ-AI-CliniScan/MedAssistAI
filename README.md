# 🏥 MedAssist AI — Intelligent Healthcare Assistant

MedAssist AI is an AI-powered healthcare assistant designed for symptom checking, disease prediction, and personalized health insights. It offers a simple, responsive, and user-friendly interface that enables users to input symptoms, receive AI-generated disease predictions with probability metrics, access historical health reports, and manage their personal profiles.

---

## 🌐 Deployment Links

*   **Frontend Web Interface:** [https://medassist-ai-frontend.onrender.com](https://medassist-ai-frontend.onrender.com)
*   **Backend API Service:** [https://medassistai-unpq.onrender.com](https://medassistai-unpq.onrender.com)
*   **Interactive API Documentation:** [https://medassistai-unpq.onrender.com/docs](https://medassistai-unpq.onrender.com/docs)

---

## 🚀 Key Features

*   **Symptom Checker with Medical Specialties:** Overhauled symptom selection form that organizes 117+ symptoms dynamically into structured medical specialty categories (e.g., Cardiology, ENT, Pulmonology, Gastroenterology, Mental Health, General) instead of a flat list.
*   **Real-time AI Disease Prediction:** Displays AI-predicted primary disease, confidence percentages, differential diagnosis weights, severity analysis, and actionable precautions.
*   **Interactive Patient Dashboard:** Visual representation of health trends using **Chart.js**, featuring a Pie Chart for predicted disease distribution and a Line Chart for tracking monthly symptom frequency.
*   **Timezone-Aware Health Reports:** Access previous assessment logs with standard UTC timestamps dynamically formatted to local Indian Standard Time (IST).
*   **Print-Friendly Clinical Reports:** Customized print layouts that format health reports into clean, formal clinical documents, hiding sidebar navigation and actions.
*   **Secure Authentication:** JWT-based user authentication (login and registration pages) securing session state in Local Storage.
*   **Profile Management:** User settings page supporting editable user profiles and real-time profile picture uploads.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework/Tools:** React.js, Vite
*   **Styling:** Tailwind CSS, custom `@media print` stylesheets
*   **Routing:** React Router DOM
*   **Data Visualization:** Chart.js, react-chartjs-2
*   **State & Storage:** React Hooks, Local Storage
*   **HTTP Client:** Axios / Fetch API

### Backend & Database
*   **Framework:** FastAPI (Python)
*   **Database:** MongoDB with Motor (async driver) and a local JSON fallback implementation for seamless offline development
*   **Authentication:** JWT (JSON Web Tokens) with Python-jose and Passlib (bcrypt)
*   **Utilities:** ReportLab (for PDF generation), Matplotlib (for script-based diagram drawing)

---

## 📂 Project Structure

```
MedAssistAI/
│
├── backend/
│   ├── app/
│   │   ├── api/             # API Router and Endpoints (auth, history, profile, symptoms)
│   │   ├── core/            # Configuration, Database Setup, Security Utilities
│   │   ├── models/          # MongoDB/JSON Models
│   │   ├── schemas/         # Pydantic Schemas for Validation
│   │   ├── services/        # Prediction logic and Authentication services
│   │   └── main.py          # FastAPI Application Entrance Point
│   ├── data/                # Local database fallback JSON files (users, symptoms, etc.)
│   ├── scripts/             # Seeding and diagram drawing scripts
│   ├── tests/               # API Unit Tests
│   └── requirements.txt     # Python Dependencies
│
├── frontend/
│   ├── public/              # Icons, Favicon, healthcare images
│   ├── src/
│   │   ├── assets/          # Static assets (images, Vite/React SVGs)
│   │   ├── components/      # Common components, charts, layout frames, and routes
│   │   ├── pages/           # Pages (Dashboard, Home, Login, Prediction, Profile, etc.)
│   │   ├── services/        # API Client utilities
│   │   ├── App.jsx          # Main application routing configuration
│   │   └── main.jsx         # React application entry point
│   ├── Dockerfile           # Docker configuration for frontend
│   ├── docker-compose.yml   # Multi-container builder setup
│   └── package.json         # npm dependencies and scripts
│
├── Milestone_1_Contribution_Report.pdf  # Milestone 1 details
├── Milestone_2_Contribution_Report.pdf  # Milestone 2 details
└── README.md                            # Root Documentation (this file)
```

---

## ⚙️ Installation & Local Setup

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will run locally at:* `http://localhost:5173`

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell)
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS
   source venv/bin/activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend API documentation will be interactive at:* `http://localhost:8000/docs`

### Running with Docker
1. Spin up both service containers using Docker Compose:
   ```bash
   docker compose up --build
   ```

---

## 👩‍💻 Developer & Contributions

**AKANKSHA MUMMANA**  
**Role:** Frontend Developer & Data Visualizer  
*Infosys Springboard Internship Project*  

On this branch (`akanksha_mummana`), the following milestone contributions were achieved:

### 🌟 Milestone 1 Contributions (UI/UX Foundation & Data Visualization)
*   **Responsive Patient Dashboard:** Designed and developed the primary patient dashboard with responsive sidebar navigation, statistic cards, and a recent activity log panel.
*   **Interactive Analytics:** Integrated **Chart.js** to display diagnostic trends—specifically a Pie Chart of predicted disease distributions and a Line Chart tracking monthly symptom occurrences.
*   **Timezone Localization:** Developed logic using JavaScript’s `Intl.DateTimeFormat` to convert API ISO UTC timestamps into local Indian Standard Time (IST) for display in patient records.
*   **Routing and Auth UI:** Developed responsive interfaces for the Landing Page, Login, and Registration pages, and structured user flows using React Router DOM.

### 🌟 Milestone 2 Contributions (API Integration & Form Overhaul)
*   **Live Endpoint Integration:** Connected frontend pages (Login, Dashboard, Prediction, Reports, and Profile) to live FastAPI backend API services, replacing mock data.
*   **Symptom Checker Overhaul:** 
    *   Grouped the 117+ symptoms dynamically into specialty tabs (Cardiology, Pulmonology, etc.) to enhance user experience.
    *   Implemented horizontal specialty navigation with active status indicators.
    *   Added real-time badge counts showing selected symptoms per category so users can see active selections across tabs.
    *   Created search overrides displaying matching search results flatly while preserving category states.
*   **Clinical Print Layouts:** Configured `@media print` CSS rules to format report grids into clean, printable patient documents by omitting web interface headers, sidebars, and buttons.
*   **Profile Picture Persistence:** Integrated profile picture edits and details persistence with the live profile backend API and Local Storage.

---

## 💡 Key Challenges & Solutions

*   **Dynamic Grouping Performance:** Grouping 117 symptoms on the fly was causing slight UI lags. This was resolved by using JavaScript `.reduce()` to compute and cache the grouped categories when the application first loads.
*   **Chart Responsiveness:** Chart.js canvas elements were breaking responsive grids on small screen sizes. Fixed by applying responsive config wrappers and setting `maintainAspectRatio: false` in the Chart options.
*   **Formal Print Layouts:** Default window prints included UI chrome (navbars, sidebars). Fixed by implementing CSS print rules to hide web headers/navigation and stylize the reports container.

---

## 📜 License

This project was developed as part of the MedAssist AI internship milestone and is intended for educational and demonstration purposes.
