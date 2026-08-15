import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import { FileText, Plus, Loader2, AlertCircle, Pill, Clock, User, X, CheckCircle2 } from 'lucide-react';
import { getMyPrescriptions, createPrescription, updatePrescription } from '../../../services/api/prescriptions';
import { getAllPatients } from '../../../services/api/patient';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    medicine: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await getMyPrescriptions();
      setPrescriptions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Unable to load prescriptions. Please try again later.');
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await getAllPatients(0, 100);
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    if (!formData.patient_id || !formData.medicine || !formData.dosage || !formData.frequency || !formData.duration) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      setStatusMessage({ type: '', text: '' });
      await createPrescription({
        patient_id: Number(formData.patient_id),
        medicine: formData.medicine,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        instructions: formData.instructions || undefined,
      });

      setShowCreateForm(false);
      setStatusMessage({ type: 'success', text: `Prescription for ${formData.medicine} issued successfully.` });
      setFormData({
        patient_id: '',
        medicine: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
      await fetchPrescriptions();
    } catch (err) {
      console.error('Error creating prescription:', err);
      const msg = err.response?.data?.detail || 'Failed to create prescription.';
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  const handleUpdateStatus = async (prescriptionId, newStatus) => {
    try {
      await updatePrescription(prescriptionId, { status: newStatus });
      await fetchPrescriptions();
    } catch (err) {
      console.error('Error updating prescription:', err);
      alert('Failed to update prescription status.');
    }
  };

  if (loading && prescriptions.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            Prescriptions
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            Clinical medication prescription management & treatment regimens
          </p>
        </div>
        <Button 
          variant="primary" 
          size="small" 
          onClick={() => { setShowCreateForm(true); setStatusMessage({ type: '', text: '' }); }} 
          className="gap-1.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Issue Prescription</span>
        </Button>
      </div>

      {statusMessage.text && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          statusMessage.type === 'success' 
            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
            : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
          )}
          <span className="text-xs font-medium">{statusMessage.text}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={fetchPrescriptions} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      {showCreateForm && (
        <Card title="Issue New Clinical Prescription" subtitle="Medication Regimen Details">
          <form onSubmit={handleCreatePrescription} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Select Patient *</label>
              <select
                required
                value={formData.patient_id}
                onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
              >
                <option value="">Choose Patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.user?.fullname || patient.fullname} ({patient.user?.email || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Medication Name *</label>
              <input
                required
                type="text"
                value={formData.medicine}
                onChange={(e) => setFormData({...formData, medicine: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                placeholder="e.g. Amoxicillin, Atorvastatin, Metformin"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Dosage *</label>
                <input
                  required
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                  placeholder="e.g. 500mg"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Frequency *</label>
                <input
                  required
                  type="text"
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                  placeholder="e.g. Twice daily after meals"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Duration *</label>
                <input
                  required
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                  placeholder="e.g. 10 days"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Instructions / Cautions</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                placeholder="e.g. Take with plenty of water. Avoid direct sun exposure."
                rows={2}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="submit" variant="primary" size="small">
                Issue Prescription
              </Button>
              <Button type="button" variant="outline" size="small" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Prescription Registry" subtitle="Active & Archived Prescriptions Issued by You">
        <div className="space-y-4">
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark leading-relaxed">
            Manage patient medications, track treatment statuses, and update therapy courses.
          </p>

          {prescriptions.length === 0 ? (
            <EmptyState 
              icon={FileText}
              title="No prescriptions issued yet"
              description="Use the Issue Prescription button above to create a clinical regimen for an assigned patient."
              className="py-10"
            />
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {prescriptions.map((prescription) => {
                const patName = prescription.patient?.user?.fullname || prescription.patient?.fullname || `Patient #${prescription.patient_id}`;

                return (
                  <div key={prescription.id} className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/30 transition-all space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Pill className="w-4 h-4 text-[#06B6D4]" />
                          <span className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">
                            {prescription.medicine}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            prescription.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' :
                            prescription.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {prescription.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark flex-wrap">
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <span>Patient: <strong className="text-clinical-textLight dark:text-clinical-textDark">{patName}</strong></span>
                          </div>
                          <div>
                            Dosage: <strong className="text-clinical-textLight dark:text-clinical-textDark">{prescription.dosage}</strong>
                          </div>
                          <div>
                            Frequency: <strong className="text-clinical-textLight dark:text-clinical-textDark">{prescription.frequency}</strong>
                          </div>
                          <div>
                            Duration: <strong className="text-clinical-textLight dark:text-clinical-textDark">{prescription.duration}</strong>
                          </div>
                        </div>

                        {prescription.instructions && (
                          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark italic">
                            Instructions: "{prescription.instructions}"
                          </p>
                        )}

                        <div className="flex items-center gap-1 text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark">
                          <Clock className="w-3 h-3 text-[#06B6D4]" />
                          <span>Prescribed: {new Date(prescription.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {prescription.status === 'active' && (
                          <>
                            <Button variant="outline" size="small" onClick={() => handleUpdateStatus(prescription.id, 'completed')} className="text-xs py-1">
                              Complete
                            </Button>
                            <Button variant="outline" size="small" onClick={() => handleUpdateStatus(prescription.id, 'discontinued')} className="text-xs py-1 text-red-500 border-red-200 dark:border-red-900">
                              Discontinue
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}