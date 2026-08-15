# MedAssistAI - AI-Powered Healthcare Frontend

MedAssistAI is an AI-powered symptom analysis and disease prediction system frontend. This redesigned version features a premium medical AI aesthetic with flowing animated backgrounds, modern navigation, and a comprehensive healthcare dashboard.

## Project Purpose

MedAssistAI provides intelligent healthcare insights through:
- Symptom analysis with AI-powered insights
- Disease prediction based on symptoms
- Health risk assessment and severity analysis
- Medical recommendations and health reports
- Role-based access for Patients, Doctors, Admin, and Staff

## Technologies

- **React 19** - UI framework
- **Vite 8** - Build tool and dev server
- **React Router DOM 7** - Client-side routing
- **TailwindCSS 3** - Utility-first CSS framework
- **Framer Motion 11** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client for API calls

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Frontend Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── landing/           # Landing page components
│   ├── layout/            # Dashboard layout components
│   ├── prediction/        # Prediction-related components
│   ├── recommendations/   # Recommendation components
│   ├── reports/           # Report components
│   ├── risk/              # Risk assessment components
│   ├── symptoms/          # Symptom checker components
│   └── ui/                # Reusable UI components
├── context/               # React contexts (Auth, Theme)
├── hooks/                 # Custom React hooks
├── pages/
│   ├── auth/              # Login and Register pages
│   ├── dashboard/         # Role-specific dashboard pages
│   │   ├── admin/         # Admin dashboard pages
│   │   ├── doctor/        # Doctor dashboard pages
│   │   ├── patient/       # Patient dashboard pages
│   │   └── staff/         # Staff dashboard pages
│   └── landing/           # Landing page
├── routes/                # Application routing
├── services/              # API service layer
│   ├── api/               # API client and endpoints
│   └── mock/              # Mock data services
├── styles/                # Global styles and CSS variables
└── constants/             # Application constants (roles, etc.)
```

## Major Redesign Changes

### New Features
- **Premium Landing Page**: Cinematic full-screen landing with flowing medical AI background
- **Animated Background**: DNA helix, molecular structures, particles, and ECG animations
- **Modern Navigation**: Story, Expertise, Studios, Feedback sections with smooth scrolling
- **Mobile-First Design**: Responsive hamburger menu and stacked sections

### Visual Improvements
- **Dark Medical AI Theme**: Deep navy (#061426) with cyan (#06B6D4) and purple (#7C3AED) accents
- **Glassmorphism Effects**: Subtle backdrop blur and transparency
- **Premium Typography**: Clean, modern sans-serif fonts with strong hierarchy
- **Framer Motion Animations**: Fade-in, slide-up, staggered cards, and smooth transitions

### Component Updates
- **Login/Register Pages**: Redesigned with flowing background and premium styling
- **Dashboard Layout**: Updated sidebar and top bar with new dark theme
- **UI Components**: Input, Button, and Card components updated to match new theme
- **Navigation**: Premium navbar with mobile menu support

### Preserved Functionality
- **Authentication**: Login, logout, registration, and protected routes
- **Role-Based Access**: Patient, Doctor, Admin, and Staff roles
- **Dashboard Features**: All existing dashboard pages and functionality
- **API Services**: Complete API service structure preserved
- **Routing**: All existing routes maintained

## Dependencies Added

- `framer-motion@^11.0.0` - For smooth animations and transitions

## Testing Performed

- ✅ `npm install` completed successfully
- ✅ `npm run build` completed without errors
- ✅ `npm run dev` server started successfully on http://localhost:5173/
- ✅ Landing page loads with animated background
- ✅ Navigation and smooth scrolling work
- ✅ Login and registration pages render with new design
- ✅ Dashboard layout updated with new theme
- ✅ Responsive design verified for mobile and desktop

## Existing Functionality Preserved

- Authentication context and user session management
- Role-based routing and protected routes
- All dashboard pages for Admin, Doctor, Patient, and Staff
- API service structure for backend integration
- Symptom checker, prediction, risk assessment, recommendations, and reports
- Appointment management and patient history
- Profile management for all user types

## Notes

- This is a frontend-only redesign. No backend modifications were made.
- The application uses development mode authentication with localStorage.
- Backend API integration is ready but requires actual FastAPI backend.
- The landing page redirects unauthenticated users to the new cinematic landing experience.
- Public registration is limited to Patient role only, as per the finalized architecture.
