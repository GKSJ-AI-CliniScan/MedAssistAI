/**
 * PDF Document Generator for MedAssist AI
 * Generates and downloads professional PDF medical documents:
 * 1. Appointment Booking Confirmation Slips (PDF)
 * 2. Clinical Symptom Analysis & Triage Reports (PDF)
 * 3. Patient Health Summary Reports (PDF)
 */

const printOrDownloadPdf = (title, htmlBody) => {
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (!printWindow) {
    alert('Please allow popups to download/print your PDF document.');
    return;
  }

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${title}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          background: #ffffff;
          margin: 0;
          padding: 24px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #0284c7;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .logo {
          font-size: 24px;
          font-weight: 900;
          color: #0284c7;
          letter-spacing: 1px;
        }
        .badge {
          display: inline-block;
          background: #e0f2fe;
          color: #0369a1;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .doc-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
          font-size: 13px;
        }
        .meta-item strong {
          color: #475569;
          font-size: 11px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 2px;
        }
        .section-title {
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #0369a1;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 6px;
          margin: 20px 0 12px 0;
        }
        .card-box {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 14px;
          background: #ffffff;
        }
        .disclaimer {
          background: #fffbeb;
          border: 1px solid #fef3c7;
          color: #92400e;
          font-size: 11px;
          padding: 12px;
          border-radius: 8px;
          margin-top: 24px;
          line-height: 1.4;
        }
        .footer {
          margin-top: 36px;
          border-top: 1px dashed #cbd5e1;
          padding-top: 12px;
          font-size: 11px;
          color: #64748b;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .print-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #0284c7;
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
        }
        @media print {
          .print-btn { display: none; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">MEDASSIST AI</div>
          <div style="font-size: 11px; color: #64748b;">Clinical Healthcare Intelligence Network</div>
        </div>
        <div style="text-align: right;">
          <span class="badge">Official Health Document</span>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Issued: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      ${htmlBody}

      <div class="disclaimer">
        <strong>⚠️ Medical Advisory & Compliance Notice:</strong> This digital health summary document is generated via MedAssist AI. For medical emergencies across Andhra Pradesh, dial 108 or 102 immediately.
      </div>

      <div class="footer">
        <div>MedAssist AI Healthcare Systems • Andhra Pradesh Clinical Network</div>
        <div>Verification Token: MA-${Math.random().toString(36).substring(2, 9).toUpperCase()}</div>
      </div>

      <button class="print-btn" onclick="window.print()">🖨️ Save as PDF / Print</button>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(fullHtml);
  printWindow.document.close();
};

export const downloadAppointmentSlip = (appointment) => {
  const {
    id = `APP-${Math.floor(100000 + Math.random() * 900000)}`,
    patientName = 'Patient',
    doctorName = 'Dr. Specialist',
    specialty = 'General Physician',
    hospitalName = 'Apollo Care Hospital, Visakhapatnam',
    date = 'Upcoming',
    time = '10:30 AM',
    mode = 'In-person Consultation',
    reason = 'General Clinical Review'
  } = appointment;

  const body = `
    <h1 class="doc-title">Clinical Appointment Confirmation Slip</h1>
    <div style="color: #64748b; font-size: 12px; margin-bottom: 16px;">Booking Reference Number: <strong style="color: #0284c7;">#${id}</strong></div>

    <div class="meta-grid">
      <div class="meta-item">
        <strong>Patient Full Name</strong>
        <span style="font-size: 14px; font-weight: 700;">${patientName}</span>
      </div>
      <div class="meta-item">
        <strong>Consultation Format</strong>
        <span style="color: #0369a1; font-weight: 600;">${mode}</span>
      </div>
      <div class="meta-item">
        <strong>Consulting Physician</strong>
        <span style="font-size: 14px; font-weight: 700;">${doctorName}</span>
      </div>
      <div class="meta-item">
        <strong>Clinical Department</strong>
        <span>${specialty}</span>
      </div>
      <div class="meta-item">
        <strong>Hospital / Medical Facility</strong>
        <span style="font-weight: 600;">${hospitalName}</span>
      </div>
      <div class="meta-item">
        <strong>Scheduled Date & Slot</strong>
        <span style="color: #059669; font-weight: 700;">${date} • ${time}</span>
      </div>
    </div>

    <div class="section-title">Reason for Consultation</div>
    <div class="card-box">
      <p style="margin: 0; font-size: 13px; color: #334155;">${reason}</p>
    </div>

    <div class="section-title">Patient Attendance Instructions</div>
    <div class="card-box" style="font-size: 12px; color: #334155; line-height: 1.6;">
      <div>1. Please report at <strong>${hospitalName}</strong> reception 15 minutes before <strong>${time}</strong>.</div>
      <div>2. Carry this printed PDF appointment slip or present digital ID <strong>${id}</strong> on your mobile.</div>
      <div>3. Bring all previous medical records, diagnostic lab reports, and current medication lists.</div>
      <div>4. For online consultations, join using the secure video consultation link sent to your registered contact.</div>
    </div>
  `;

  printOrDownloadPdf(`Appointment_Slip_${id}`, body);
};

export const downloadSymptomAnalysisReport = ({ selectedSymptoms = [], analysisResult = {} }) => {
  const reportId = `TRIAGE-${Math.floor(100000 + Math.random() * 900000)}`;

  const symptomsListHtml = selectedSymptoms.length > 0
    ? selectedSymptoms.map(s => `<li style="margin-bottom: 4px;"><strong>${typeof s === 'string' ? s : s.label || s.id}</strong></li>`).join('')
    : '<li>General physiological malaise reported</li>';

  const conditionsListHtml = (analysisResult.conditions || []).map((c, i) => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: ${i === 0 ? '#eff6ff' : '#f8fafc'}; border: 1px solid ${i === 0 ? '#bfdbfe' : '#e2e8f0'}; border-radius: 8px; margin-bottom: 6px;">
      <span style="font-size: 13px; font-weight: ${i === 0 ? '700' : '500'}; color: #0f172a;">${i + 1}. ${c}</span>
      ${i === 0 ? '<span style="font-size: 10px; font-weight: 700; color: #1d4ed8; background: #dbeafe; padding: 2px 8px; border-radius: 99px;">Primary Match</span>' : ''}
    </div>
  `).join('');

  const body = `
    <h1 class="doc-title">AI Clinical Symptom Triage Report</h1>
    <div style="color: #64748b; font-size: 12px; margin-bottom: 16px;">Triage Reference ID: <strong style="color: #0284c7;">#${reportId}</strong></div>

    <div class="meta-grid">
      <div class="meta-item">
        <strong>Triage Risk Assessment</strong>
        <span style="color: ${analysisResult.riskLevel === 'High' ? '#dc2626' : analysisResult.riskLevel === 'Moderate' ? '#d97706' : '#059669'}; font-weight: 800; font-size: 14px;">${analysisResult.riskLevel || 'Standard'} Risk</span>
      </div>
      <div class="meta-item">
        <strong>Recommended Specialist</strong>
        <span style="color: #0284c7; font-weight: 700; font-size: 14px;">${analysisResult.specialist || 'General Physician'}</span>
      </div>
      <div class="meta-item">
        <strong>Total Symptoms Analyzed</strong>
        <span>${selectedSymptoms.length} Reported Symptom(s)</span>
      </div>
      <div class="meta-item">
        <strong>Urgency Protocol</strong>
        <span>${analysisResult.urgency || 'Schedule routine consultation'}</span>
      </div>
    </div>

    <div class="section-title">Patient Reported Symptoms</div>
    <div class="card-box">
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155;">
        ${symptomsListHtml}
      </ul>
    </div>

    <div class="section-title">Differential Triage (Possible Conditions)</div>
    <div style="margin-bottom: 16px;">
      ${conditionsListHtml}
    </div>

    <div class="section-title">Clinical Next Steps</div>
    <div class="card-box" style="font-size: 12px; color: #334155; line-height: 1.6;">
      <div>1. Consult a certified <strong>${analysisResult.specialist || 'General Physician'}</strong> for formal physical examination and diagnostic lab testing.</div>
      <div>2. If you experience severe chest pain, shortness of breath, or sudden weakness, report to an emergency department immediately.</div>
      <div>3. Do not start antibiotic or prescription medication without physician oversight.</div>
    </div>
  `;

  printOrDownloadPdf(`Symptom_Triage_${reportId}`, body);
};

export const downloadHealthSummaryPdf = (patientData = {}) => {
  const docId = `MED-REC-${Math.floor(100000 + Math.random() * 900000)}`;

  const body = `
    <h1 class="doc-title">Comprehensive Patient Health Record Summary</h1>
    <div style="color: #64748b; font-size: 12px; margin-bottom: 16px;">Record ID: <strong style="color: #0284c7;">#${docId}</strong></div>

    <div class="meta-grid">
      <div class="meta-item">
        <strong>Patient Name</strong>
        <span style="font-weight: 700; font-size: 14px;">${patientData.name || 'Yamini Lakshmi'}</span>
      </div>
      <div class="meta-item">
        <strong>Blood Group</strong>
        <span style="color: #dc2626; font-weight: 800;">${patientData.bloodGroup || 'O+'}</span>
      </div>
      <div class="meta-item">
        <strong>Gender & Age</strong>
        <span>${patientData.gender || 'Female'} • ${patientData.age || '28'} Years</span>
      </div>
      <div class="meta-item">
        <strong>Primary Location</strong>
        <span>${patientData.city || 'Andhra Pradesh, India'}</span>
      </div>
    </div>

    <div class="section-title">Known Allergies & Medical Conditions</div>
    <div class="card-box" style="font-size: 13px; color: #334155;">
      <div><strong>Existing Conditions:</strong> ${patientData.conditions || 'None reported (Healthy baseline)'}</div>
      <div style="margin-top: 6px;"><strong>Known Drug Allergies:</strong> ${patientData.allergies || 'No known drug allergies (NKDA)'}</div>
      <div style="margin-top: 6px;"><strong>Current Maintenance Medications:</strong> ${patientData.medications || 'None'}</div>
    </div>

    <div class="section-title">Emergency Contact Information</div>
    <div class="card-box" style="font-size: 13px; color: #334155;">
      <div><strong>Contact Person:</strong> ${patientData.emergencyContact || 'Immediate Family Contact'}</div>
      <div><strong>Contact Phone:</strong> +91 98765 43210</div>
    </div>
  `;

  printOrDownloadPdf(`Health_Summary_${docId}`, body);
};
