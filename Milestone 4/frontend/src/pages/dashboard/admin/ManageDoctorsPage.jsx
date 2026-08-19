import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ModTag from '../../../components/ui/ModTag';
import EmptyState from '../../../components/ui/EmptyState';
import { UserCog, Plus, Loader2, AlertCircle, Search, Mail, Stethoscope, Award, X, CheckCircle2 } from 'lucide-react';
import { getAllDoctors, createDoctor } from '../../../services/api/doctor';

export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    specialization: 'General Medicine',
    experience_years: ''
  });

  // Debounce search to fetch results without unmounting
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchDoctors();
  }, [debouncedSearchTerm]);

  const fetchDoctors = async () => {
    try {
      if (doctors.length > 0) {
        setSearching(true);
      } else {
        setLoading(true);
      }
      const data = await getAllDoctors(false, 0, 100, debouncedSearchTerm);
      setDoctors(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Unable to load doctors. Please try again later.');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      setStatusMessage({ type: '', text: '' });

      const expNum = parseInt(formData.experience_years, 10);
      const payload = {
        fullname: formData.fullname.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        specialization: formData.specialization || 'General Medicine',
        experience_years: isNaN(expNum) ? 0 : Math.max(0, expNum),
      };

      const result = await createDoctor(payload);
      setShowCreateForm(false);
      const createdName = result.user?.fullname || result.fullname || payload.fullname;
      setStatusMessage({ type: 'success', text: `Physician account created successfully for ${createdName}.` });
      setFormData({
        fullname: '',
        email: '',
        password: '',
        specialization: 'General Medicine',
        experience_years: ''
      });
      await fetchDoctors();
    } catch (err) {
      console.error('Error creating doctor:', err);
      let msg = 'Failed to create doctor account.';
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        msg = detail;
      } else if (Array.isArray(detail)) {
        msg = detail.map(d => d.msg || d.message || JSON.stringify(d)).join('; ');
      }
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            Manage Doctors
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            Physician onboarding, specialty assignments & directory registry
          </p>
        </div>
        <Button 
          variant="primary" 
          size="small" 
          onClick={() => { setShowCreateForm(true); setStatusMessage({ type: '', text: '' }); }} 
          className="gap-1.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Doctor</span>
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
            <Button variant="primary" size="small" onClick={fetchDoctors} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      <Card title="Physician Directory" subtitle="System Doctor Registry & Credentials">
        <div className="space-y-4">
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark leading-relaxed">
            Review certified clinicians, update specialty assignments, and monitor department rosters.
          </p>

          {/* Search bar with continuous focus */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clinical-mutedLight dark:text-clinical-mutedDark" />
            <input
              type="text"
              placeholder="Search doctors by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark focus:outline-none focus:border-[#06B6D4]"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#06B6D4] animate-spin" />
            )}
          </div>

          {showCreateForm && (
            <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">Create New Doctor Account</h3>
                <button onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreateDoctor} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                    placeholder="DR. Full Name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                    placeholder="doctor@medassist.ai"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Password *</label>
                  <input
                    required
                    type="password"
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                    placeholder="Initial password (min 6 characters)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Specialization</label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                    >
                      <option value="General Medicine">General Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Gynecology">Gynecology</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-1">Experience (years)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" variant="primary" size="small" disabled={creating}>
                    {creating ? 'Creating Account...' : 'Create Doctor Account'}
                  </Button>
                  <Button type="button" variant="outline" size="small" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
            </div>
          ) : doctors.length === 0 ? (
            <EmptyState 
              icon={UserCog}
              title={searchTerm ? 'No doctors found' : 'Doctor directory empty'}
              description={searchTerm ? 'Try different search terms.' : 'Approved doctor accounts will be listed here.'}
              className="py-10"
            />
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {doctors.map((doctor) => {
                const docName = doctor.user?.fullname || doctor.fullname || 'Dr. Practitioner';
                const docEmail = doctor.user?.email || doctor.email || 'N/A';
                const docCreated = doctor.created_at || doctor.user?.created_at;

                return (
                  <div key={doctor.id} className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/30 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-[#06B6D4]" />
                          <span className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">
                            {docName}
                          </span>
                          <ModTag variant={doctor.is_available ? 'success' : 'warning'}>
                            {doctor.is_available ? 'Available' : 'Unavailable'}
                          </ModTag>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark flex-wrap">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <span>{docEmail}</span>
                          </div>
                          {doctor.specialization && (
                            <div className="font-semibold text-[#06B6D4]">
                              {doctor.specialization}
                            </div>
                          )}
                          {doctor.experience_years !== undefined && doctor.experience_years !== null && (
                            <div className="flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-amber-500" />
                              <span>{doctor.experience_years} years exp</span>
                            </div>
                          )}
                        </div>

                        {docCreated && (
                          <div className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark">
                            Registered: {new Date(docCreated).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <ModTag variant="brand">DOCTOR</ModTag>
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
