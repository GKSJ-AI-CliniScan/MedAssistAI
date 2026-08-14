import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  User, Mail, Phone, MapPin, Calendar, HeartPulse, Activity,
  Pill, AlertCircle, Save, Edit3, ShieldCheck, CheckCircle2, Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RippleButton from '../../components/ui/RippleButton';

export const PatientProfilePage = () => {
  const { user } = useAuth();

  const savedProfile = (() => {
    try {
      const saved = localStorage.getItem('medassist_patient_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.full_name || user?.name || savedProfile?.name || 'Ramesh Varma',
    dob: savedProfile?.dob || '1992-05-14',
    gender: savedProfile?.gender || 'Male',
    email: user?.email || savedProfile?.email || 'patient@medassist.ai',
    phone: savedProfile?.phone || '+91 98765 43210',
    address: savedProfile?.address || 'Plot 42, Lawson’s Bay Colony, Visakhapatnam',
    bloodGroup: savedProfile?.bloodGroup || 'O+',
    allergies: savedProfile?.allergies || 'Penicillin, Dust Mites',
    conditions: savedProfile?.conditions || 'Mild Hypertension',
    medications: savedProfile?.medications || 'Telmisartan 40mg (Once daily)',
    emergencyContact: savedProfile?.emergencyContact || 'Smt. Lakshmi (+91 98765 11223)'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('medassist_patient_profile', JSON.stringify(formData));
    setIsEditing(false);
    toast.success('Patient medical record updated successfully!', { icon: '🏥' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* ── Profile Header ── */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/8 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-glow-primary">
            {formData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <button
            onClick={() => toast.info('Profile picture upload available in next version.')}
            className="absolute bottom-0 right-0 p-2 rounded-xl bg-slate-900 border border-white/10 text-cyan-400 hover:text-white transition-colors"
          >
            <Camera size={14} />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-white">{formData.name}</h1>
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                <span>Patient ID: PAT-92841</span>
                <span>•</span>
                <span className="text-cyan-400 font-bold">Blood Group: {formData.bloodGroup}</span>
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all self-center sm:self-auto"
            >
              <Edit3 size={13} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Registered Patient at MedAssist AI Healthcare Network • Records verified for clinical consultations in Visakhapatnam.
          </p>
        </div>
      </div>

      {/* ── Form Section ── */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/8 space-y-5">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <User size={16} className="text-cyan-400" /> Personal & Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-slate-200 outline-none focus:border-cyan-500/50 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-slate-200 outline-none focus:border-cyan-500/50 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-slate-200 outline-none focus:border-cyan-500/50 disabled:opacity-70"
              >
                <option value="Male" className="bg-slate-900">Male</option>
                <option value="Female" className="bg-slate-900">Female</option>
                <option value="Other" className="bg-slate-900">Other</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-slate-200 outline-none focus:border-cyan-500/50 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Mobile Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-slate-200 outline-none focus:border-cyan-500/50 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Residential Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-slate-200 outline-none focus:border-cyan-500/50 disabled:opacity-70"
              />
            </div>
          </div>
        </div>

        {/* Medical Background */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/8 space-y-5">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <HeartPulse size={16} className="text-emerald-400" /> Medical Background & Emergency Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-slate-200 outline-none focus:border-cyan-500/50 disabled:opacity-70"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg} className="bg-slate-900">{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Emergency Contact Details</label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-slate-200 outline-none focus:border-cyan-500/50 disabled:opacity-70"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-400 font-semibold block mb-1.5">Known Allergies</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-slate-200 outline-none focus:border-cyan-500/50 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Existing Medical Conditions</label>
              <input
                type="text"
                name="conditions"
                value={formData.conditions}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-slate-200 outline-none focus:border-cyan-500/50 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Current Medications</label>
              <input
                type="text"
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-slate-200 outline-none focus:border-cyan-500/50 disabled:opacity-70"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <RippleButton
              type="submit"
              variant="primary"
              className="px-6 py-2.5 text-xs font-bold gap-2"
            >
              <Save size={14} /> Save Patient Profile
            </RippleButton>
          </div>
        )}
      </form>
    </div>
  );
};

export default PatientProfilePage;
