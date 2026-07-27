"""
Email Service

Production-ready email service using SMTP. Supports HTML templates
for transactional emails: registration confirmations, password resets,
appointment notifications, and report delivery.
"""
import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@medassist.ai")
FROM_NAME = os.getenv("FROM_NAME", "MedAssist AI")


def _build_html_wrapper(title: str, body_content: str) -> str:
    """Wrap email body content in a professional HTML template."""
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><title>{title}</title></head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f4f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
            <tr>
                <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:32px 40px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">MedAssist AI</h1>
                    <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Intelligent Healthcare Platform</p>
                </td>
            </tr>
            <tr>
                <td style="padding:32px 40px;">
                    {body_content}
                </td>
            </tr>
            <tr>
                <td style="background:#f8f9fb;padding:20px 40px;text-align:center;border-top:1px solid #e8ecf1;">
                    <p style="margin:0;color:#888;font-size:12px;">&copy; 2024 MedAssist AI. All rights reserved.</p>
                    <p style="margin:4px 0 0;color:#aaa;font-size:11px;">This is an automated message. Please do not reply directly.</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


def send_email(
    to_email: str,
    subject: str,
    html_body: str,
    text_body: Optional[str] = None,
) -> bool:
    """
    Send an email via SMTP.
    Returns True on success, False on failure (logs errors without raising).
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning(
            "SMTP credentials not configured. Email to '%s' skipped. "
            "Set SMTP_USER and SMTP_PASSWORD environment variables.",
            to_email,
        )
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
    msg["To"] = to_email

    if text_body:
        msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, to_email, msg.as_string())
        logger.info("Email sent successfully to %s", to_email)
        return True
    except Exception as exc:
        logger.error("Failed to send email to %s: %s", to_email, exc)
        return False


def send_welcome_email(to_email: str, full_name: str) -> bool:
    """Send a welcome email after registration."""
    body = f"""
    <h2 style="color:#333;margin:0 0 16px;">Welcome, {full_name}!</h2>
    <p style="color:#555;line-height:1.6;">
        Thank you for joining MedAssist AI. Your account is now active and you can
        begin using our AI-powered healthcare features:
    </p>
    <ul style="color:#555;line-height:1.8;">
        <li>Symptom analysis and disease prediction</li>
        <li>Risk assessments and health monitoring</li>
        <li>Doctor appointments and medical reports</li>
    </ul>
    <p style="color:#555;">Get started by logging into your dashboard.</p>
    """
    html = _build_html_wrapper("Welcome to MedAssist AI", body)
    return send_email(to_email, "Welcome to MedAssist AI", html)


def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """Send a password reset link."""
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"
    body = f"""
    <h2 style="color:#333;margin:0 0 16px;">Password Reset Request</h2>
    <p style="color:#555;line-height:1.6;">
        We received a request to reset your password. Click the button below
        to create a new password:
    </p>
    <div style="text-align:center;margin:24px 0;">
        <a href="{reset_link}"
           style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
            Reset Password
        </a>
    </div>
    <p style="color:#888;font-size:13px;">
        If you did not request this, please ignore this email.
        This link expires in 1 hour.
    </p>
    """
    html = _build_html_wrapper("Reset Your Password", body)
    return send_email(to_email, "MedAssist AI – Password Reset", html)


def send_appointment_confirmation(
    to_email: str, patient_name: str, doctor_name: str, date_time: str
) -> bool:
    """Send appointment booking confirmation."""
    body = f"""
    <h2 style="color:#333;margin:0 0 16px;">Appointment Confirmed</h2>
    <p style="color:#555;line-height:1.6;">
        Hi {patient_name}, your appointment has been confirmed:
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:8px 0;color:#888;width:120px;">Doctor</td><td style="padding:8px 0;color:#333;font-weight:600;">{doctor_name}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Date & Time</td><td style="padding:8px 0;color:#333;font-weight:600;">{date_time}</td></tr>
    </table>
    <p style="color:#555;">You can manage your appointment from the dashboard.</p>
    """
    html = _build_html_wrapper("Appointment Confirmation", body)
    return send_email(to_email, "MedAssist AI – Appointment Confirmed", html)


def send_report_ready_email(to_email: str, patient_name: str, report_id: int) -> bool:
    """Notify the patient that their medical report is ready."""
    body = f"""
    <h2 style="color:#333;margin:0 0 16px;">Your Report is Ready</h2>
    <p style="color:#555;line-height:1.6;">
        Hi {patient_name}, your medical report (#{report_id}) has been generated
        and is ready for download from your dashboard.
    </p>
    <p style="color:#555;">
        Please review your results and consult with your healthcare provider
        for any follow-up actions.
    </p>
    """
    html = _build_html_wrapper("Medical Report Ready", body)
    return send_email(to_email, "MedAssist AI – Report Ready", html)
