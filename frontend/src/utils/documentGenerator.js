/**
 * Document Generator Utility for MedAssist AI
 * Generates and triggers browser downloads for:
 * 1. Appointment Booking Confirmation Slips
 * 2. AI Clinical Symptom Analysis & Triage Reports
 * 3. Patient Medical History Summaries
 */

export const downloadAppointmentSlip = (appointment) => {
  const {
    id = `APP-${Math.floor(100000 + Math.random() * 900000)}`,
    patientName = 'Patient',
    doctorName = 'Dr. Specialist',
    specialty = 'General Medicine',
    hospitalName = 'Apollo Care Hospital, Visakhapatnam',
    date = 'Upcoming',
    time = '10:30 AM',
    mode = 'In-person Consultation',
    reason = 'Routine Health Consultation'
  } = appointment;

  const content = `
================================================================================
                    MEDASSIST AI - CLINICAL APPOINTMENT SLIP
                        Authorized Digital Health Record
================================================================================

APPOINTMENT IDENTIFIER: ${id}
DATE GENERATED        : ${new Date().toLocaleString()}
STATUS                : CONFIRMED

--------------------------------------------------------------------------------
PATIENT INFORMATION:
--------------------------------------------------------------------------------
Patient Full Name     : ${patientName}
Consultation Mode     : ${mode}
Reason for Visit      : ${reason}

--------------------------------------------------------------------------------
HEALTHCARE PROVIDER DETAILS:
--------------------------------------------------------------------------------
Consulting Doctor     : ${doctorName}
Specialization        : ${specialty}
Hospital / Center     : ${hospitalName}
Appointment Schedule  : ${date} at ${time}

--------------------------------------------------------------------------------
PATIENT INSTRUCTIONS:
--------------------------------------------------------------------------------
1. Please arrive at ${hospitalName} 15 minutes prior to your scheduled time (${time}).
2. Present this appointment confirmation slip or show the ID (${id}) at the reception.
3. Bring previous prescriptions, lab reports, and photo identification.
4. For online consultations, the video consultation room link will be active 10 minutes prior.

--------------------------------------------------------------------------------
CLINICAL HELPLINE & EMERGENCY SUPPORT:
--------------------------------------------------------------------------------
Hospital Contact      : +91 891 278 9000 / +91 891 256 7890
Emergency Ambulance   : 108 / 102
MedAssist AI Support  : support@medassist.ai | https://medassist-ai-eight.vercel.app

================================================================================
          This is a computer-generated document. No signature required.
================================================================================
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `MedAssist_Appointment_${id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadSymptomAnalysisReport = ({ selectedSymptoms = [], analysisResult = {} }) => {
  const reportId = `TRIAGE-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleString();

  const conditionsList = (analysisResult.conditions || [])
    .map((c, i) => `   ${i + 1}. ${c}`)
    .join('\n');

  const symptomsList = selectedSymptoms
    .map((s, i) => `   - ${typeof s === 'string' ? s : s.label || s.id}`)
    .join('\n');

  const content = `
================================================================================
               MEDASSIST AI - CLINICAL SYMPTOM TRIAGE REPORT
                       AI-Powered Diagnostic Assistance
================================================================================

REPORT IDENTIFIER     : ${reportId}
DATE OF ANALYSIS      : ${dateStr}
TRIAGE RISK LEVEL     : ${analysisResult.riskLevel || 'Standard'}
RECOMMENDED SPECIALIST: ${analysisResult.specialist || 'General Physician'}

--------------------------------------------------------------------------------
REPORTED SYMPTOMS (${selectedSymptoms.length} Identified):
--------------------------------------------------------------------------------
${symptomsList || '   - General malaise'}

--------------------------------------------------------------------------------
DIFFERENTIAL TRIAGE ASSESSMENT (POSSIBLE CONDITIONS):
--------------------------------------------------------------------------------
${conditionsList || '   1. Viral or Non-Specific Clinical Presentation'}

Urgency Assessment    : ${analysisResult.urgency || 'Schedule a routine consultation'}

--------------------------------------------------------------------------------
RECOMMENDED NEXT STEPS:
--------------------------------------------------------------------------------
1. Schedule a clinical consultation with a certified ${analysisResult.specialist || 'General Physician'}.
2. Monitor symptoms. If high fever, acute chest pain, or severe breathlessness occurs, seek emergency care immediately.
3. Stay hydrated and avoid self-medicating with unverified antibiotics.

--------------------------------------------------------------------------------
IMPORTANT MEDICAL DISCLAIMER:
--------------------------------------------------------------------------------
This document is generated by MedAssist AI for informational and triage
purposes only. It DOES NOT constitute a confirmed medical diagnosis or prescription.
Always seek the direct guidance of a licensed physician for clinical diagnosis.

================================================================================
MedAssist AI Healthcare Systems | https://medassist-ai-eight.vercel.app
================================================================================
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `MedAssist_Symptom_Triage_${reportId}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
