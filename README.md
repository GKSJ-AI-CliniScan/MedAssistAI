## Backend Development

The MedAssist-AI backend was developed using **FastAPI** and provides REST APIs for authentication, patient management, doctor management, appointments, disease prediction, health reports, and analytics.

The backend follows a modular architecture consisting of:

- Routers for API endpoints
- Services for business logic
- Models for database entities
- Schemas for request and response validation
- Utilities for authentication and authorization
- Machine Learning modules for prediction and health assessment

---

## Backend Modules

### Authentication & Authorization

Implemented secure authentication using JWT-based access tokens and role-based authorization.

Supported roles:

- Patient
- Doctor
- Admin

Main endpoints:

```text
POST /auth/register
POST /auth/login
GET  /auth/me
