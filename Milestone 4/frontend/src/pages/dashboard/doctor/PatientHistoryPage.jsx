import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import { History, Users, Loader2, AlertCircle, Brain, Calendar, Activity, Pill, User, Clock, ArrowLeft } from 'lucide-react';
import { getPatientHistory, getAllPatients } from '../../../services/api/patient';
import { getPatientPrescriptions } from '../../../services/api/prescriptions';

export default function PatientHistoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(location.state?.patientId || '');
  const [history, setHistory] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatientList();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      loadPatientDetails(selectedPatientId);
    }
  }, [selectedPatientId]);

  const fetchPatientList = async () => {
    try {
      const data = await getAllPatients(0, 100);
      const list = Array.isArray(data) ? data : [];
      setPatients(list);
      if (!selectedPatientId && list.length > 0) {
        setSelectedPatientId(list[0].id);
      }
    } catch (err) {
      console.error('Error loading patient list:', err);
    }
  };

  const loadPatientDetails = async (patientId) => {
    try {
      setLoading(true);
      const [historyData, rxData] = await Promise.all([
        getPatientHistory(patientId),
        getPatientPrescriptions(patientId).catch(() => [])
      ]);
      setHistory(historyData);
      setPrescriptions(Array.isArray(rxData) ? rxData : []);
      setError(null);
    } catch (err) {
      setError('Unable to load clinical history for this patient.');
      console.error('Error fetching patient history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            Patient Clinical Dossier
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            Comprehensive diagnostic history, consultation timeline & active medications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small" onClick={() => navigate('/doctor/patients')} className="gap-1.5 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Roster Desk</span>
          </Button>
        </div>
      </div>

      {/* Patient Selector Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-[#06B6D4]" />
          <div>
            <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Active Patient Record</span>
            <span className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">
              {history?.patient?.fullname || 'Select a patient'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark shrink-0">Switch Patient:</label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark font-medium"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.user?.fullname || p.fullname} ({p.user?.email || 'N/A'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={() => loadPatientDetails(selectedPatientId)} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
        </div>
      ) : !history ? (
        <EmptyState 
          icon={History}
          title="No patient selected"
          description="Select a patient from the dropdown above to view their diagnostic timeline."
          className="py-12"
        />
      ) : (
        <div className="space-y-6">
          {/* Demographics Card */}
          <Card title="Patient Profile & Demographics" subtitle="Basic health indicators">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-clinical-mutedLight dark:text-clinical-mutedDark block text-[10px] uppercase font-bold">Age</span>
                <span className="text-clinical-textLight dark:text-clinical-textDark font-bold text-sm">{history.patient.age || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-clinical-mutedLight dark:text-clinical-mutedDark block text-[10px] uppercase font-bold">Gender</span>
                <span className="text-clinical-textLight dark:text-clinical-textDark font-bold text-sm">{history.patient.gender || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-clinical-mutedLight dark:text-clinical-mutedDark block text-[10px] uppercase font-bold">Blood Group</span>
                <span className="text-[#06B6D4] font-bold text-sm">{history.patient.blood_group || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-clinical-mutedLight dark:text-clinical-mutedDark block text-[10px] uppercase font-bold">Registration Date</span>
                <span className="text-clinical-textLight dark:text-clinical-textDark font-bold text-xs">{new Date(history.patient.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {history.patient.medical_history && (
              <div className="mt-3 p-3 rounded-lg bg-white/40 dark:bg-white/5 border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Chronic History & Allergies</span>
                <p className="text-xs text-clinical-textLight dark:text-clinical-textDark mt-1">{history.patient.medical_history}</p>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Reports Column */}
            <Card title={`Diagnostic Reports (${history.total_reports || 0})`} subtitle="AI symptom assessments & disease probabilities">
              {(!history.reports || history.reports.length === 0) ? (
                <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark py-4">No diagnostic reports logged yet.</p>
              ) : (
                <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                  {history.reports.map((report) => (
                    <div key={report.id} className="p-3 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark">{report.predicted_disease}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20">
                          {report.risk_level} Risk
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark">
                        <span>Confidence: {report.confidence?.toFixed(1)}%</span>
                        <span>{new Date(report.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Prescriptions Column */}
            <Card title={`Active Medications (${prescriptions.length})`} subtitle="Clinical prescriptions on file">
              {prescriptions.length === 0 ? (
                <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark py-4">No active prescriptions on file.</p>
              ) : (
                <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                  {prescriptions.map((rx) => (
                    <div key={rx.id} className="p-3 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark">{rx.medicine}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          rx.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {rx.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark">
                        {rx.dosage} • {rx.frequency} • {rx.duration}
                      </div>
                      {rx.instructions && (
                        <div className="text-[10px] text-clinical-mutedLight dark:text-clinical-mutedDark italic">
                          "{rx.instructions}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

          </div>

          {/* Consultation History */}
          <Card title={`Consultation Timeline (${history.total_appointments || 0})`} subtitle="Past clinic appointments & outcomes">
            {(!history.appointments || history.appointments.length === 0) ? (
              <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark py-4">No previous appointments found.</p>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {history.appointments.map((apt) => (
                  <div key={apt.id} className="p-3 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark">{apt.reason || 'General Consultation'}</span>
                      <span className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark block">
                        {new Date(apt.appointment_date).toLocaleString()} {apt.doctor ? `• Dr. ${apt.doctor.user?.fullname || apt.doctor.fullname}` : ''}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
