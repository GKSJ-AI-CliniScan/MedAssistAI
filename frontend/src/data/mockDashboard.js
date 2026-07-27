// Mock Dashboard Data — MedAssist AI
export const mockPatients = [
  { id: 'P001', name: 'Arjun Mehta', age: 45, gender: 'Male', avatar: 'AM', visitDate: '2026-07-17', symptoms: ['Chest Pain', 'Fatigue'], disease: 'Hypertension', risk: 'high', status: 'critical', doctor: 'Dr. Patel' },
  { id: 'P002', name: 'Priya Sharma', age: 32, gender: 'Female', avatar: 'PS', visitDate: '2026-07-17', symptoms: ['Fever', 'Cough'], disease: 'Viral Flu', risk: 'low', status: 'stable', doctor: 'Dr. Yamini' },
  { id: 'P003', name: 'Rohan Das', age: 58, gender: 'Male', avatar: 'RD', visitDate: '2026-07-17', symptoms: ['Blurred Vision', 'Thirst'], disease: 'Diabetes Type 2', risk: 'high', status: 'monitoring', doctor: 'Dr. Kumar' },
  { id: 'P004', name: 'Sunita Reddy', age: 27, gender: 'Female', avatar: 'SR', visitDate: '2026-07-16', symptoms: ['Headache', 'Dizziness'], disease: 'Migraine', risk: 'medium', status: 'stable', doctor: 'Dr. Yamini' },
  { id: 'P005', name: 'Kiran Nair', age: 61, gender: 'Male', avatar: 'KN', visitDate: '2026-07-16', symptoms: ['Breathlessness', 'Edema'], disease: 'Heart Failure', risk: 'critical', status: 'critical', doctor: 'Dr. Patel' },
  { id: 'P006', name: 'Meera Joshi', age: 38, gender: 'Female', avatar: 'MJ', visitDate: '2026-07-16', symptoms: ['Joint Pain', 'Swelling'], disease: 'Rheumatoid Arthritis', risk: 'medium', status: 'monitoring', doctor: 'Dr. Kumar' },
  { id: 'P007', name: 'Vijay Gupta', age: 52, gender: 'Male', avatar: 'VG', visitDate: '2026-07-15', symptoms: ['Abdominal Pain', 'Nausea'], disease: 'Gastritis', risk: 'low', status: 'discharged', doctor: 'Dr. Yamini' },
  { id: 'P008', name: 'Ananya Singh', age: 24, gender: 'Female', avatar: 'AS', visitDate: '2026-07-15', symptoms: ['Rash', 'Itching'], disease: 'Eczema', risk: 'low', status: 'stable', doctor: 'Dr. Patel' },
];

export const mockAppointments = [
  { id: 'A001', doctor: 'Dr. Yamini', doctorSpecialty: 'General Physician', patient: 'Priya Sharma', time: '09:00 AM', date: 'Today', priority: 'normal', status: 'confirmed', avatarDoctor: 'YK', avatarPatient: 'PS' },
  { id: 'A002', doctor: 'Dr. Patel', doctorSpecialty: 'Cardiologist', patient: 'Kiran Nair', time: '10:30 AM', date: 'Today', priority: 'urgent', status: 'confirmed', avatarDoctor: 'DP', avatarPatient: 'KN' },
  { id: 'A003', doctor: 'Dr. Kumar', doctorSpecialty: 'Endocrinologist', patient: 'Rohan Das', time: '12:00 PM', date: 'Today', priority: 'normal', status: 'pending', avatarDoctor: 'SK', avatarPatient: 'RD' },
  { id: 'A004', doctor: 'Dr. Yamini', doctorSpecialty: 'General Physician', patient: 'Sunita Reddy', time: '02:30 PM', date: 'Today', priority: 'low', status: 'confirmed', avatarDoctor: 'YK', avatarPatient: 'SR' },
  { id: 'A005', doctor: 'Dr. Patel', doctorSpecialty: 'Cardiologist', patient: 'Arjun Mehta', time: '04:00 PM', date: 'Tomorrow', priority: 'urgent', status: 'pending', avatarDoctor: 'DP', avatarPatient: 'AM' },
];

export const mockMedications = [
  { id: 'M001', patient: 'Rohan Das', medicine: 'Metformin 500mg', time: '08:00 AM', dosage: '1 tablet', taken: true, type: 'diabetes' },
  { id: 'M002', patient: 'Kiran Nair', medicine: 'Furosemide 40mg', time: '09:00 AM', dosage: '1 tablet', taken: true, type: 'cardiac' },
  { id: 'M003', patient: 'Sunita Reddy', medicine: 'Sumatriptan 50mg', time: '11:00 AM', dosage: '1 tablet', taken: false, type: 'neuro' },
  { id: 'M004', patient: 'Meera Joshi', medicine: 'Methotrexate 10mg', time: '01:00 PM', dosage: '2 tablets', taken: false, type: 'arthritis' },
  { id: 'M005', patient: 'Arjun Mehta', medicine: 'Amlodipine 5mg', time: '06:00 PM', dosage: '1 tablet', taken: false, type: 'cardiac' },
];

export const mockActivities = [
  { id: 1, type: 'registration', icon: 'UserPlus', text: 'New patient Ananya Singh registered', time: '2 mins ago', color: 'cyan' },
  { id: 2, type: 'prediction', icon: 'Brain', text: 'AI predicted Diabetes Type 2 for Rohan Das (94% confidence)', time: '12 mins ago', color: 'indigo' },
  { id: 3, type: 'risk', icon: 'ShieldAlert', text: 'High risk alert updated for Kiran Nair', time: '28 mins ago', color: 'rose' },
  { id: 4, type: 'report', icon: 'FileText', text: 'Lab report PDF generated for Priya Sharma', time: '45 mins ago', color: 'emerald' },
  { id: 5, type: 'appointment', icon: 'CalendarDays', text: 'Appointment confirmed — Dr. Patel & Arjun Mehta', time: '1 hr ago', color: 'amber' },
  { id: 6, type: 'medication', icon: 'Pill', text: 'Medication reminder sent to Rohan Das', time: '2 hrs ago', color: 'purple' },
  { id: 7, type: 'discharge', icon: 'LogOut', text: 'Vijay Gupta discharged successfully', time: '3 hrs ago', color: 'slate' },
];

export const mockAIInsights = [
  { id: 1, title: 'Diabetes Cases Rising', message: 'Diabetes probability increased by 12% this week across monitored patients.', severity: 'warning', confidence: 94, icon: 'TrendingUp', tag: 'Trend Alert' },
  { id: 2, title: 'Most Common Symptom', message: 'Fever reported in 68% of today\'s consultations. Possible seasonal viral trend.', severity: 'info', confidence: 97, icon: 'Thermometer', tag: 'Symptom Intel' },
  { id: 3, title: 'Heart Disease Risk Up', message: '4 patients show elevated cardiac markers. Immediate specialist consultation advised.', severity: 'critical', confidence: 91, icon: 'HeartPulse', tag: 'Critical Alert' },
  { id: 4, title: 'Asthma Predictions Down', message: 'Asthma-related predictions decreased by 8% — improved air quality correlation.', severity: 'success', confidence: 88, icon: 'TrendingDown', tag: 'Positive Trend' },
  { id: 5, title: 'High-Risk Patients', message: '12 patients flagged as high-risk. Early intervention recommended within 24hrs.', severity: 'warning', confidence: 96, icon: 'ShieldAlert', tag: 'Risk Monitor' },
  { id: 6, title: 'AI Accuracy Peak', message: 'Prediction model reached 98.2% accuracy today — highest recorded this month.', severity: 'success', confidence: 98, icon: 'Sparkles', tag: 'AI Performance' },
];

export const mockNotifications = [
  { id: 1, type: 'emergency', title: 'Emergency Alert', message: 'Patient Kiran Nair requires immediate ICU attention.', time: '2 mins ago', read: false, color: 'rose' },
  { id: 2, type: 'lab', title: 'Lab Report Ready', message: 'Complete blood panel for Priya Sharma is available.', time: '15 mins ago', read: false, color: 'cyan' },
  { id: 3, type: 'appointment', title: 'Appointment Reminder', message: 'Consultation with Dr. Patel at 10:30 AM today.', time: '30 mins ago', read: true, color: 'indigo' },
  { id: 4, type: 'health', title: 'Health Alert', message: 'Rohan Das blood sugar levels critically high — 340 mg/dL.', time: '1 hr ago', read: false, color: 'amber' },
];

// Charts Data
export const diseaseDistributionData = [
  { name: 'Diabetes', value: 28, color: '#06b6d4' },
  { name: 'Hypertension', value: 22, color: '#6366f1' },
  { name: 'Cardiac', value: 18, color: '#f43f5e' },
  { name: 'Asthma', value: 14, color: '#10b981' },
  { name: 'Arthritis', value: 10, color: '#f59e0b' },
  { name: 'Others', value: 8, color: '#8b5cf6' },
];

export const weeklyPatientsData = [
  { day: 'Mon', patients: 42, predictions: 38, recovered: 31 },
  { day: 'Tue', patients: 55, predictions: 49, recovered: 40 },
  { day: 'Wed', patients: 48, predictions: 44, recovered: 37 },
  { day: 'Thu', patients: 63, predictions: 58, recovered: 51 },
  { day: 'Fri', patients: 71, predictions: 66, recovered: 58 },
  { day: 'Sat', patients: 38, predictions: 34, recovered: 29 },
  { day: 'Sun', patients: 25, predictions: 22, recovered: 19 },
];

export const riskCategoryData = [
  { name: 'Low Risk', value: 45, color: '#10b981' },
  { name: 'Medium Risk', value: 30, color: '#f59e0b' },
  { name: 'High Risk', value: 18, color: '#f97316' },
  { name: 'Critical', value: 7, color: '#f43f5e' },
];

export const monthlyTrendData = [
  { month: 'Jan', patients: 210, accuracy: 91 },
  { month: 'Feb', patients: 245, accuracy: 93 },
  { month: 'Mar', patients: 268, accuracy: 92 },
  { month: 'Apr', patients: 312, accuracy: 94 },
  { month: 'May', patients: 289, accuracy: 95 },
  { month: 'Jun', patients: 334, accuracy: 96 },
  { month: 'Jul', patients: 358, accuracy: 98 },
];

export const mockStats = {
  patientsToday: 74,
  consultations: 52,
  aiPredictions: 48,
  pendingReports: 11,
  criticalCases: 4,
  avgHealthScore: 79,
  recoveryRate: 87,
  predictionAccuracy: 98,
};

export const mockHealthTips = [
  { id: 1, tip: 'Encourage patients with hypertension to monitor blood pressure twice daily.', category: 'Cardiology' },
  { id: 2, tip: 'Diabetic patients should maintain HbA1c below 7% for optimal control.', category: 'Endocrinology' },
  { id: 3, tip: 'Regular spirometry for asthma patients improves long-term outcomes by 34%.', category: 'Pulmonology' },
];
