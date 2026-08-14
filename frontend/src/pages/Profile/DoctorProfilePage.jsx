import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Stethoscope, Award, GraduationCap, Building2, MapPin, Phone,
  Mail, Calendar, Clock, Star, ShieldCheck, Check, DollarSign, Globe,
  Edit3, Save, Video, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RippleButton from '../../components/ui/RippleButton';

export const DoctorProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const savedProfile = (() => {
    try {
      const saved = localStorage.getItem('medassist_doctor_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.full_name || user?.name || savedProfile?.name || 'Dr. Rahul Sharma',
    specialization: savedProfile?.specialization || 'Cardiologist',
    qualification: savedProfile?.qualification || 'MBBS, MD, DM (Cardiology), FACC',
    experience: savedProfile?.experience || 12,
    hospital: savedProfile?.hospital || 'MedLife Multispeciality Hospital',
    location: savedProfile?.city || 'Visakhapatnam, Andhra Pradesh',
    consultationFee: savedProfile?.consultationFee || 900,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    availableTime: '09:30 AM - 05:00 PM',
    consultationType: savedProfile?.consultationType || 'Both (In-person & Online)',
    languages: ['English', 'Telugu', 'Hindi'],
    phone: savedProfile?.phone || '+91 891 255 8899',
    email: user?.email || savedProfile?.email || 'dr.rahul@medassist.ai',
    medRegNo: savedProfile?.medRegNo || 'AP-MCI-88942',
    bio: 'Dr. Rahul Sharma is a senior interventional cardiologist with over 12 years of specialized clinical experience in coronary interventions, hypertension management, preventive cardiac wellness, and cardiac electrophysiology.',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 210
  });

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('medassist_doctor_profile', JSON.stringify(profile));
    setIsEditing(false);
    toast.success('Doctor practice profile updated successfully!', { icon: '🩺' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* ── Doctor Hero Card ── */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative shrink-0">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-indigo-500/30 shadow-glow-secondary"
          />
          <span className="absolute bottom-1 right-1 p-1 rounded-full bg-emerald-500 text-slate-950 shadow">
            <Check size={12} strokeWidth={3} />
          </span>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Verified Doctor
                </span>
              </div>
              <p className="text-xs text-cyan-400 font-bold mt-0.5">{profile.specialization} • {profile.qualification}</p>
            </div>

            <div className="flex items-center gap-2 self-center md:self-auto">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Edit3 size={13} /> {isEditing ? 'Cancel Edit' : 'Edit Practice Profile'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <Building2 size={13} className="text-cyan-400" /> {profile.hospital}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-indigo-400" /> {profile.location}
            </span>
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Star size={13} className="fill-amber-400 text-amber-400" /> {profile.rating} ({profile.reviews} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* ── Practice Overview & Details ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Quick Stats & Booking Card */}
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-6 border border-white/8 space-y-4 text-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Consultation Overview</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/3 border border-white/5">
                <span className="text-slate-400">Consultation Fee</span>
                <span className="text-sm font-black text-emerald-400">₹{profile.consultationFee}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/3 border border-white/5">
                <span className="text-slate-400">Experience</span>
                <span className="font-bold text-white">{profile.experience}+ Years</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/3 border border-white/5">
                <span className="text-slate-400">Mode</span>
                <span className="font-bold text-cyan-300">{profile.consultationType}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/3 border border-white/5">
                <span className="text-slate-400">License ID</span>
                <span className="font-bold text-slate-300">{profile.medRegNo}</span>
              </div>
            </div>

            <RippleButton
              variant="primary"
              className="w-full py-3 text-xs font-bold gap-2"
              onClick={() => navigate('/appointments')}
            >
              <Calendar size={14} /> Book Consultation
            </RippleButton>
          </div>
        </div>

        {/* Right Column: Bio, Schedule & Languages */}
        <div className="md:col-span-2 space-y-6">
          {/* Biography */}
          <div className="glass-card rounded-3xl p-6 border border-white/8 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Award size={14} /> About Practitioner
            </h3>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50"
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed">{profile.bio}</p>
            )}
          </div>

          {/* Schedule & Days */}
          <div className="glass-card rounded-3xl p-6 border border-white/8 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Clock size={14} /> Available Consultation Schedule
            </h3>

            <div className="space-y-2 text-xs">
              <p className="text-slate-400 font-semibold">Available Working Days:</p>
              <div className="flex flex-wrap gap-2">
                {profile.availableDays.map(day => (
                  <span key={day} className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <Clock size={13} className="text-indigo-400" />
              <span>Timing: <strong className="text-slate-200 font-bold">{profile.availableTime}</strong></span>
            </div>
          </div>

          {/* Languages */}
          <div className="glass-card rounded-3xl p-6 border border-white/8 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Globe size={14} className="text-indigo-400" /> Languages Spoken
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map(lang => (
                <span key={lang} className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <RippleButton
                type="button"
                variant="primary"
                className="px-6 py-2.5 text-xs font-bold gap-2"
                onClick={handleSave}
              >
                <Save size={14} /> Save Changes
              </RippleButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
