import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ModTag from '../../../components/ui/ModTag';
import { 
  User, 
  Mail, 
  Stethoscope, 
  Award, 
  Key, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Lock,
  Clock
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getDoctorProfile, updateDoctorProfile } from '../../../services/api/doctor';
import { changePassword } from '../../../services/api/auth';

export default function DoctorProfilePage() {
  const { user } = useAuth();
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    specialization: '',
    qualification: '',
    experience_years: '',
    contact_number: '',
    clinic_address: '',
    is_available: true,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const data = await getDoctorProfile();
      setDoctorData(data);
      setFormData({
        specialization: data.specialization || '',
        qualification: data.qualification || '',
        experience_years: data.experience_years !== null && data.experience_years !== undefined ? String(data.experience_years) : '0',
        contact_number: data.contact_number || '',
        clinic_address: data.clinic_address || '',
        is_available: data.is_available ?? true,
      });
      setError(null);
    } catch (err) {
      setError('Unable to load profile information. Please try again later.');
      console.error('Error fetching doctor profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e?.preventDefault();
    try {
      setUpdating(true);
      setStatusMessage({ type: '', text: '' });

      const payload = {
        specialization: formData.specialization || 'General Medicine',
        qualification: formData.qualification || null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years, 10) : 0,
        contact_number: formData.contact_number || null,
        clinic_address: formData.clinic_address || null,
        is_available: Boolean(formData.is_available),
      };

      const updated = await updateDoctorProfile(payload);
      setDoctorData(updated);
      setEditing(false);
      setStatusMessage({ type: 'success', text: 'Physician credentials updated successfully.' });
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      setStatusMessage({ type: 'error', text: 'Failed to update credentials. Please verify fields.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e?.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!passwordForm.currentPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    
    try {
      setUpdating(true);
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setStatusMessage({ type: 'success', text: 'Physician account password updated successfully.' });
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error changing password:', err);
      const msg = err.response?.data?.detail || 'Current password incorrect or update failed.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
          Clinician Profile
        </h1>
        <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
          Physician credentials, specialty registry & security settings
        </p>
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
            <Button variant="primary" size="small" onClick={fetchDoctorProfile} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card title="Physician Credentials" subtitle="Verified Medical Specialty License">
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Physician Name</span>
                  <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark mt-0.5 block truncate">
                    {doctorData?.user?.fullname || user?.name || 'Dr. Physician'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Clinical Email</span>
                  <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark mt-0.5 block truncate">
                    {doctorData?.user?.email || user?.email || 'doctor@medassist.ai'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Specialization</span>
                  <span className="text-xs font-bold text-[#06B6D4] mt-0.5 block truncate">
                    {doctorData?.specialization || 'General Medicine'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Clinical Experience</span>
                  <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark mt-0.5 block">
                    {doctorData?.experience_years || 0} years
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Qualification</span>
                  <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark mt-0.5 block truncate">
                    {doctorData?.qualification || 'MD / MBBS'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Consultation Status</span>
                  <span className={`text-xs font-bold mt-0.5 block ${doctorData?.is_available ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {doctorData?.is_available ? 'Accepting Patients' : 'Off-Duty'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
                <Button 
                  variant="primary" 
                  size="medium" 
                  onClick={() => { setEditing(!editing); setShowPasswordForm(false); }}
                  className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
                >
                  {editing ? 'Close Edit Form' : 'Update Credentials'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="medium" 
                  onClick={() => { setShowPasswordForm(!showPasswordForm); setEditing(false); }} 
                  className="gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </Button>
              </div>

              {/* Edit Credentials Form */}
              {editing && (
                <form onSubmit={handleUpdateProfile} className="mt-4 p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 space-y-3">
                  <h3 className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">Edit Physician Credentials</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Specialization</label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Experience (Years)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.experience_years}
                        onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Qualifications / Degrees</label>
                      <input
                        type="text"
                        placeholder="e.g. MD, DM Cardiology, FACC"
                        value={formData.qualification}
                        onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Availability Status</label>
                      <select
                        value={formData.is_available ? 'true' : 'false'}
                        onChange={(e) => setFormData({...formData, is_available: e.target.value === 'true'})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      >
                        <option value="true">Available (Accepting Consultations)</option>
                        <option value="false">Off-Duty / Unavailable</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" variant="primary" size="small" disabled={updating}>
                      {updating ? 'Saving...' : 'Save Credentials'}
                    </Button>
                    <Button type="button" variant="outline" size="small" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Password Change Form */}
              {showPasswordForm && (
                <form onSubmit={handleChangePassword} className="mt-4 p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 space-y-3">
                  <h3 className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#06B6D4]" />
                    Change Account Password
                  </h3>
                  <div>
                    <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Current Password *</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">New Password (min 6 chars) *</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Confirm New Password *</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" variant="primary" size="small" disabled={updating}>
                      {updating ? 'Updating Password...' : 'Update Password'}
                    </Button>
                    <Button type="button" variant="outline" size="small" onClick={() => setShowPasswordForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card title="Clinical Badges" subtitle="Verified License Status">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">Role</span>
                <ModTag variant="brand">DOCTOR</ModTag>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">Medical Board</span>
                <ModTag variant="success">Board Certified</ModTag>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">E-Prescribing</span>
                <ModTag variant="ai">Authorized</ModTag>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
