import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ModTag from '../../../components/ui/ModTag';
import { Settings, Shield, User, Key, Mail, CheckCircle2, AlertCircle, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { updateAccountProfile, changePassword } from '../../../services/api/auth';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [profileForm, setProfileForm] = useState({
    fullname: user?.name || '',
    email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleUpdateProfile = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      setStatusMessage({ type: '', text: '' });
      await updateAccountProfile({
        fullname: profileForm.fullname,
        email: profileForm.email,
      });
      setStatusMessage({ type: 'success', text: 'Admin profile updated successfully.' });
    } catch (err) {
      console.error('Error updating admin profile:', err);
      const msg = err.response?.data?.detail || 'Failed to update profile.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
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
      setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    
    try {
      setLoading(true);
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setStatusMessage({ type: 'success', text: 'Admin security password changed successfully.' });
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error changing admin password:', err);
      const msg = err.response?.data?.detail || 'Current password incorrect or update failed.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
          Admin Settings & Platform Security
        </h1>
        <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
          Master administrative credentials & system configuration
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

      <div className="flex gap-2">
        <Button 
          variant={activeTab === 'account' ? 'primary' : 'outline'} 
          size="small"
          onClick={() => { setActiveTab('account'); setStatusMessage({ type: '', text: '' }); }}
          className="gap-1.5"
        >
          <User className="w-3.5 h-3.5" />
          <span>Account Profile</span>
        </Button>
        <Button 
          variant={activeTab === 'security' ? 'primary' : 'outline'} 
          size="small"
          onClick={() => { setActiveTab('security'); setStatusMessage({ type: '', text: '' }); }}
          className="gap-1.5"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Passwords</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'account' && (
            <Card title="Administrative Identity" subtitle="Master Account Settings">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullname}
                    onChange={(e) => setProfileForm({...profileForm, fullname: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading} 
                  className="gap-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
                >
                  <Settings className="w-4 h-4" />
                  <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </Button>
              </form>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card title="Security & Authentication" subtitle="Admin Password Controls">
              <div className="space-y-4">
                <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark leading-relaxed">
                  Update administrative authentication credentials to safeguard platform telemetry and user data.
                </p>

                {!showPasswordForm ? (
                  <Button 
                    variant="primary" 
                    onClick={() => setShowPasswordForm(true)} 
                    className="gap-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
                  >
                    <Key className="w-4 h-4" />
                    <span>Change Admin Password</span>
                  </Button>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-3 p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15">
                    <h3 className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-[#06B6D4]" />
                      Update Master Password
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
                      <Button type="submit" variant="primary" size="small" disabled={loading}>
                        {loading ? 'Updating Password...' : 'Save New Password'}
                      </Button>
                      <Button type="button" variant="outline" size="small" onClick={() => setShowPasswordForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card title="System Telemetry" subtitle="Platform Engine Status">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">API Backend</span>
                <ModTag variant="success">Online (FastAPI)</ModTag>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">PostgreSQL DB</span>
                <ModTag variant="success">Connected</ModTag>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">ML Classifier</span>
                <ModTag variant="ai">Ensemble Preloaded</ModTag>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">Security Engine</span>
                <ModTag variant="brand">JWT + Bcrypt</ModTag>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
