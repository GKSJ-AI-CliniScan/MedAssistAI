import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ModTag from '../../../components/ui/ModTag';
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Loader2, 
  Phone, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getPatientProfile, updatePatientProfile } from '../../../services/api/patient';
import { changePassword } from '../../../services/api/auth';

export default function PatientProfilePage() {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    blood_group: '',
    contact_number: '',
    address: '',
    medical_history: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      setLoading(true);
      const data = await getPatientProfile();
      setPatientData(data);
      setFormData({
        age: data.age !== null && data.age !== undefined ? String(data.age) : '',
        gender: data.gender || '',
        blood_group: data.blood_group || '',
        contact_number: data.contact_number || '',
        address: data.address || '',
        medical_history: data.medical_history || ''
      });
      setError(null);
    } catch (err) {
      setError('Unable to load profile information. Please try again later.');
      console.error('Error fetching patient profile:', err);
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
        age: formData.age ? parseInt(formData.age, 10) : null,
        gender: formData.gender || null,
        blood_group: formData.blood_group || null,
        contact_number: formData.contact_number || null,
        address: formData.address || null,
        medical_history: formData.medical_history || null
      };

      const updated = await updatePatientProfile(payload);
      setPatientData(updated);
      setEditing(false);
      setStatusMessage({ type: 'success', text: 'Profile demographic records updated successfully.' });
    } catch (err) {
      console.error('Error updating profile:', err);
      setStatusMessage({ type: 'error', text: 'Failed to update profile. Please verify your entries.' });
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
      setStatusMessage({ type: 'success', text: 'Account password changed successfully.' });
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
          Patient Clinical Profile
        </h1>
        <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
          Personal demographics, emergency health record & security credentials
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
            <Button variant="primary" size="small" onClick={fetchPatientProfile} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Details Panel */}
        <div className="lg:col-span-8 space-y-6">
          <Card title="Demographic & Medical Record" subtitle="Synchronized patient baseline">
            <div className="space-y-4">
              
              {/* Summary Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Full Name</span>
                  <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark mt-0.5 block truncate">
                    {patientData?.user?.fullname || user?.name || 'Verified Patient'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Email Address</span>
                  <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark mt-0.5 block truncate">
                    {patientData?.user?.email || user?.email || 'N/A'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Age</span>
                  <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark mt-0.5 block">
                    {patientData?.age ? `${patientData.age} years` : 'Not specified'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Gender</span>
                  <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark mt-0.5 block">
                    {patientData?.gender || 'Not specified'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Blood Group</span>
                  <span className="text-xs font-bold text-[#06B6D4] mt-0.5 block">
                    {patientData?.blood_group || 'Not specified'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Contact Phone</span>
                  <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark mt-0.5 block">
                    {patientData?.contact_number || 'Not specified'}
                  </span>
                </div>
              </div>

              {/* Address & Medical History Summary */}
              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Residential Address</span>
                  <p className="text-xs text-clinical-textLight dark:text-clinical-textDark mt-1">
                    {patientData?.address || 'No residential address on file.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Chronic Conditions & Medical History</span>
                  <p className="text-xs text-clinical-textLight dark:text-clinical-textDark mt-1">
                    {patientData?.medical_history || 'No prior medical conditions or surgeries recorded.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
                <Button 
                  variant="primary" 
                  size="medium" 
                  onClick={() => { setEditing(!editing); setShowPasswordForm(false); }}
                  className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
                >
                  {editing ? 'Close Edit Form' : 'Update Profile Information'}
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

              {/* Edit Form */}
              {editing && (
                <form onSubmit={handleUpdateProfile} className="mt-4 p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 space-y-3">
                  <h3 className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">Edit Profile Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Age</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Blood Group</label>
                      <select
                        value={formData.blood_group}
                        onChange={(e) => setFormData({...formData, blood_group: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Contact Number</label>
                      <input
                        type="text"
                        placeholder="e.g. +1 555-0199"
                        value={formData.contact_number}
                        onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Residential Address</label>
                      <input
                        type="text"
                        placeholder="e.g. 124 Medical Way, Suite 4"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Medical History & Allergies</label>
                    <textarea
                      placeholder="e.g. Asthma, Penicillin allergy, Hypertension..."
                      value={formData.medical_history}
                      onChange={(e) => setFormData({...formData, medical_history: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" variant="primary" size="small" disabled={updating}>
                      {updating ? 'Saving Changes...' : 'Save Profile Details'}
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

        {/* Right Info Cards */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="Account Badges" subtitle="Access & Permissions">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">Role</span>
                <ModTag variant="brand">PATIENT</ModTag>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">Account Status</span>
                <ModTag variant="success">Active</ModTag>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">AI Access</span>
                <ModTag variant="ai">Enabled</ModTag>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
