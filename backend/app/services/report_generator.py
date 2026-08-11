"""
MedAssist AI – PDF Report Generator using ReportLab
Generates a professional clinical AI diagnostic summary report.
"""
import os
import datetime
from typing import Dict, Any, Optional

def generate_pdf_report(
    prediction: Any,
    patient: Any,
    user: Any,
    risk: Optional[Any],
    recommendation: Optional[Any],
    output_dir: str = "reports",
) -> str:
    """
    Generates a PDF clinical report and saves it to output_dir.
    Returns the absolute file path.
    """
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib import colors
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib.enums import TA_CENTER, TA_LEFT
    except ImportError:
        # Fallback: write a minimal text file if ReportLab is not installed
        os.makedirs(output_dir, exist_ok=True)
        fname = f"report_{prediction.id}_{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}.txt"
        fpath = os.path.join(output_dir, fname)
        with open(fpath, "w") as f:
            f.write(f"MedAssist AI – Clinical Diagnostic Report\n")
            f.write(f"Patient: {user.full_name}\n")
            f.write(f"Top Diagnosis: {prediction.top_disease}\n")
            f.write(f"Confidence: {prediction.top_confidence * 100:.1f}%\n")
            f.write(f"Generated: {datetime.datetime.utcnow().isoformat()}\n")
        return fpath

    os.makedirs(output_dir, exist_ok=True)
    fname = f"MedAssist_Report_{prediction.id}_{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}.pdf"
    fpath = os.path.join(output_dir, fname)

    doc = SimpleDocTemplate(
        fpath,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    primary = colors.HexColor("#0ea5e9")
    danger = colors.HexColor("#ef4444")
    warning = colors.HexColor("#f59e0b")
    success = colors.HexColor("#22c55e")
    dark = colors.HexColor("#1e293b")

    title_style = ParagraphStyle("title", parent=styles["Title"], textColor=primary, fontSize=20, spaceAfter=6)
    subtitle_style = ParagraphStyle("subtitle", parent=styles["Normal"], textColor=dark, fontSize=11, spaceAfter=12, alignment=TA_CENTER)
    section_style = ParagraphStyle("section", parent=styles["Heading2"], textColor=primary, fontSize=13, spaceBefore=14, spaceAfter=6)
    body_style = ParagraphStyle("body", parent=styles["Normal"], fontSize=10, spaceAfter=4, leading=14)
    disclaimer_style = ParagraphStyle("disc", parent=styles["Normal"], fontSize=8, textColor=colors.gray, spaceAfter=6, leading=11)

    story = []

    # ── Header ──────────────────────────────────────────────────────────
    story.append(Paragraph("🏥 MedAssist AI", title_style))
    story.append(Paragraph("Clinical AI Diagnostic Summary Report", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=primary))
    story.append(Spacer(1, 0.4 * cm))

    generated = datetime.datetime.utcnow().strftime("%B %d, %Y at %H:%M UTC")
    story.append(Paragraph(f"<b>Report ID:</b> RPT-{prediction.id:05d} &nbsp;&nbsp; <b>Generated:</b> {generated}", body_style))
    story.append(Paragraph(f"<b>Disclaimer:</b> This report is AI-generated for educational/preliminary screening only and does not replace professional medical advice.", disclaimer_style))
    story.append(Spacer(1, 0.3 * cm))

    # ── Patient Information ──────────────────────────────────────────────
    story.append(Paragraph("Patient Information", section_style))
    pat_data = [
        ["Full Name", user.full_name, "Gender", getattr(patient, "gender", "N/A")],
        ["Age", f"{getattr(patient, 'age', 'N/A')} years", "Blood Type", getattr(patient, "blood_type", "N/A")],
        ["Height / Weight", f"{getattr(patient, 'height', 'N/A')} / {getattr(patient, 'weight', 'N/A')}", "BMI", f"{getattr(patient, 'bmi', 'N/A'):.1f}"],
        ["Blood Pressure", f"{getattr(patient, 'bp_systolic', 'N/A')}/{getattr(patient, 'bp_diastolic', 'N/A')} mmHg", "Fasting Sugar", f"{getattr(patient, 'fasting_sugar', 'N/A')} mg/dL"],
        ["Smoking", getattr(patient, "smoking", "N/A"), "Alcohol", getattr(patient, "alcohol", "N/A")],
    ]
    pat_table = Table(pat_data, colWidths=[4 * cm, 6 * cm, 4 * cm, 4 * cm])
    pat_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#e0f2fe")),
        ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#e0f2fe")),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.HexColor("#f8fafc"), colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(pat_table)
    story.append(Spacer(1, 0.3 * cm))

    # ── Symptom Input ──────────────────────────────────────────────────
    story.append(Paragraph("Reported Symptoms", section_style))
    symptoms_str = ", ".join(prediction.symptoms_input) if prediction.symptoms_input else "None recorded"
    story.append(Paragraph(f"<b>Symptoms:</b> {symptoms_str}", body_style))
    story.append(Paragraph(f"<b>Severity:</b> {prediction.severity_input.capitalize()} &nbsp;&nbsp; <b>Duration:</b> {prediction.duration_input} day(s)", body_style))
    if prediction.notes_input:
        story.append(Paragraph(f"<b>Notes:</b> {prediction.notes_input}", body_style))
    story.append(Spacer(1, 0.3 * cm))

    # ── AI Predictions ──────────────────────────────────────────────────
    story.append(Paragraph("AI Disease Predictions (Top 5)", section_style))
    if prediction.predicted_diseases:
        pred_header = [["#", "Disease Name", "Confidence", "Risk Level", "Specialist"]]
        pred_rows = []
        for i, d in enumerate(prediction.predicted_diseases[:5], 1):
            pred_rows.append([
                str(i),
                d.get("name", "Unknown"),
                d.get("probability", "N/A"),
                d.get("riskLevel", "N/A"),
                d.get("doctor", "GP"),
            ])
        pred_data = pred_header + pred_rows
        pred_table = Table(pred_data, colWidths=[1 * cm, 6.5 * cm, 3 * cm, 3 * cm, 4.5 * cm])
        pred_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), primary),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8fafc"), colors.white]),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("ALIGN", (2, 0), (2, -1), "CENTER"),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(pred_table)
    story.append(Spacer(1, 0.3 * cm))

    # ── Risk Assessment ──────────────────────────────────────────────────
    if risk:
        story.append(Paragraph("Risk Assessment Summary", section_style))
        risk_hex = "#ef4444" if getattr(risk, "risk_level", "") in ("Critical", "High") else ("#f59e0b" if getattr(risk, "risk_level", "") == "Medium" else "#22c55e")
        story.append(Paragraph(f"<b>Risk Level:</b> <font color='{risk_hex}'>{getattr(risk, 'risk_level', 'N/A')}</font> &nbsp;&nbsp; <b>Risk Score:</b> {getattr(risk, 'risk_score', 'N/A')}/100 &nbsp;&nbsp; <b>Health Score:</b> {getattr(risk, 'health_score', 'N/A')}/100", body_style))
        if risk.emergency_alert:
            story.append(Paragraph("⚠️ EMERGENCY ALERT: Immediate medical attention is recommended.", ParagraphStyle("emerg", parent=body_style, textColor=danger, fontSize=11, fontName="Helvetica-Bold")))
        story.append(Paragraph(risk.message or "", body_style))
        story.append(Spacer(1, 0.3 * cm))

    # ── Recommendations ──────────────────────────────────────────────────
    if recommendation:
        story.append(Paragraph("Treatment Recommendations", section_style))
        story.append(Paragraph(f"<b>Recommended Specialist:</b> {recommendation.doctor}", body_style))
        story.append(Paragraph(f"<b>Lifestyle:</b> {recommendation.lifestyle}", body_style))
        story.append(Paragraph(f"<b>Diet:</b> {recommendation.diet}", body_style))
        story.append(Paragraph(f"<b>Exercise:</b> {recommendation.exercise}", body_style))
        story.append(Paragraph(f"<b>Water Intake:</b> {recommendation.water_intake}", body_style))
        story.append(Paragraph(f"<b>Sleep:</b> {recommendation.sleep}", body_style))
        story.append(Paragraph(f"<b>Follow-Up:</b> {recommendation.follow_up}", body_style))

        if recommendation.medicines:
            story.append(Spacer(1, 0.2 * cm))
            story.append(Paragraph("<b>General Medicine Guidance (NOT a Prescription):</b>", body_style))
            med_header = [["Medicine", "Dosage", "Purpose"]]
            med_rows = [[m.get("name", ""), m.get("dosage", ""), m.get("purpose", "")] for m in recommendation.medicines]
            med_table = Table(med_header + med_rows, colWidths=[5 * cm, 6 * cm, 7 * cm])
            med_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0284c7")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f0f9ff"), colors.white]),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#bae6fd")),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ]))
            story.append(med_table)

    # ── Disclaimer Footer ─────────────────────────────────────────────
    story.append(Spacer(1, 0.5 * cm))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1")))
    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph(
        "⚕️ MEDICAL DISCLAIMER: This AI-generated report is for educational and preliminary screening purposes only. "
        "It does NOT constitute a medical diagnosis or prescription. Always consult a qualified and licensed physician "
        "before making any medical decisions. MedAssist AI is not liable for any clinical decisions made based on this report.",
        disclaimer_style,
    ))
    story.append(Paragraph(f"© {datetime.datetime.utcnow().year} MedAssist AI – Powered by Artificial Intelligence", disclaimer_style))

    doc.build(story)
    return fpath
