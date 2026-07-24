import os

from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf(report_data, report_id):

    # ==========================================
    # Create reports folder
    # ==========================================

    os.makedirs("reports", exist_ok=True)

    pdf_path = f"reports/{report_id}.pdf"

    doc = SimpleDocTemplate(pdf_path)

    styles = getSampleStyleSheet()

    story = []

    # ==========================================
    # Title
    # ==========================================

    story.append(
        Paragraph(
            "<b><font size=20>MedAssist AI Health Report</font></b>",
            styles["Title"]
        )
    )

    story.append(Spacer(1, 0.30 * inch))

    # ==========================================
    # Report Information
    # ==========================================

    story.append(
        Paragraph("<b>REPORT INFORMATION</b>", styles["Heading2"])
    )

    story.append(
        Paragraph(
            f"<b>Report ID :</b> {report_id}",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Prediction ID :</b> {report_data['prediction']['prediction_id']}",
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 0.20 * inch))

    # ==========================================
    # Patient Information
    # ==========================================

    patient = report_data["patient"]

    story.append(
        Paragraph("<b>PATIENT INFORMATION</b>", styles["Heading2"])
    )

    story.append(
        Paragraph(f"<b>Patient ID :</b> {patient['patient_id']}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Name :</b> {patient['patient_name']}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Age :</b> {patient['age']}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Gender :</b> {patient['gender']}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Blood Group :</b> {patient['blood_group']}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Email :</b> {patient['email']}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Phone :</b> {patient['phone']}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Address :</b> {patient['address']}", styles["Normal"])
    )

    story.append(
        Paragraph(
            f"<b>Emergency Contact :</b> {patient['emergency_contact']}",
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 0.25 * inch))

    # ==========================================
    # Prediction
    # ==========================================

    prediction = report_data["prediction"]

    story.append(
        Paragraph("<b>DISEASE PREDICTION</b>", styles["Heading2"])
    )

    story.append(
        Paragraph(
            f"<b>Disease :</b> {prediction['disease']}",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Confidence :</b> {prediction['confidence']} %",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Symptoms :</b> {prediction['symptoms']}",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Prediction Date :</b> {prediction['prediction_date']}",
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 0.25 * inch))

    # ==========================================
    # Risk Assessment
    # ==========================================

    risk = report_data["risk"]

    story.append(
        Paragraph("<b>RISK ASSESSMENT</b>", styles["Heading2"])
    )

    story.append(
        Paragraph(
            f"<b>Risk Score :</b> {risk['risk_score']}",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Risk Level :</b> {risk['risk_level']}",
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 0.25 * inch))

    # ==========================================
    # Recommendation
    # ==========================================

    recommendation = report_data["recommendation"]

    story.append(
        Paragraph("<b>TREATMENT RECOMMENDATION</b>", styles["Heading2"])
    )

    story.append(
        Paragraph(
            f"<b>Disease :</b> {recommendation['Disease']}",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Description :</b><br/>{recommendation['Description']}",
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 0.15 * inch))

    story.append(
        Paragraph("<b>Precautions</b>", styles["Heading3"])
    )

    for item in recommendation["Precautions"]:
        story.append(
            Paragraph(f"• {item}", styles["Normal"])
        )

    story.append(Spacer(1, 0.15 * inch))

    story.append(
        Paragraph("<b>Diet Recommendation</b>", styles["Heading3"])
    )

    for item in recommendation["Diet"]:
        story.append(
            Paragraph(f"• {item}", styles["Normal"])
        )

    story.append(Spacer(1, 0.15 * inch))

    story.append(
        Paragraph("<b>Medications</b>", styles["Heading3"])
    )

    for item in recommendation["Medications"]:
        story.append(
            Paragraph(f"• {item}", styles["Normal"])
        )

    story.append(Spacer(1, 0.15 * inch))

    story.append(
        Paragraph("<b>Workout / Lifestyle</b>", styles["Heading3"])
    )

    for item in recommendation["Workout"]:
        story.append(
            Paragraph(f"• {item}", styles["Normal"])
        )

    story.append(Spacer(1, 0.15 * inch))

    story.append(
        Paragraph(
            f"<b>Severity Category :</b> {recommendation['Severity Category']}",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Severity Weight :</b> {recommendation['Severity Weight']}",
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 0.15 * inch))

    story.append(
        Paragraph(
            f"<b>Doctor Advice :</b><br/>{recommendation['Doctor Advice']}",
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 0.40 * inch))

    story.append(
        Paragraph(
            "<b>Generated by MedAssist AI</b>",
            styles["Heading2"]
        )
    )

    story.append(
        Paragraph(
            "This report is AI-generated and should not replace professional medical advice.",
            styles["Italic"]
        )
    )

    doc.build(story)

    return pdf_path