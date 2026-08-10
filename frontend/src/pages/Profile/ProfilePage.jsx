import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  User, Heart, Activity, Phone, Shield,
  Edit3, Save, X, Check, Camera, Droplets,
  Ruler, Weight, Calendar, Mail, MapPin,
  Cigarette, Wine, Dumbbell, Apple, Users,
  AlertTriangle, Plus, Trash2, ChevronRight,
  Stethoscope, ClipboardList, Star
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

/* ─── Tab definitions ──────────────────────────────────────── */
const TABS = [
  { id: 'personal',   label: 'Personal',        icon: User },
  { id: 'lifestyle',  label: 'Lifestyle',        icon: Activity },
  { id: 'allergies',  label: 'Allergies',        icon: AlertTriangle },
  { id: 'emergency',  label: 'Emergency',        icon: Phone },
  { id: 'family',     label: 'Family History',   icon: Users },
];

/* ─── Reusable profile field ───────────────────────────────── */
const ProfileField = ({ label, value, icon: Icon, editMode, inputProps, type = 'text', children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
      {Icon && <Icon size={11} />} {label}
    </label>
    {editMode ? (
      children || (
        <input
          type={type}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200"
          {...inputProps}
        />
      )
    ) : (
      <span className="text-sm font-semibold text-slate-200 bg-white/3 border border-white/5 rounded-xl px-4 py-2.5">
        {value || '—'}
      </span>
    )}
  </div>
);

/* ─── Stat badge ────────────────────────────────────────────── */
const StatBadge = ({ icon: Icon, label, value, color = 'cyan' }) => {
  const colors = {
    cyan:    'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
    rose:    'bg-rose-500/10 border-rose-500/25 text-rose-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    amber:   'bg-amber-500/10 border-amber-500/25 text-amber-400',
    indigo:  'bg-indigo-500/10 border-indigo-500/25 text-indigo-400',
  };
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border ${colors[color]} group`}>
      <Icon size={16} />
      <div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</div>
        <div className="text-sm font-extrabold text-slate-200 mt-0.5">{value || '—'}</div>
      </div>
    </div>
  );
};

/* ─── Allergen chip ─────────────────────────────────────────── */
const AllergenChip = ({ name, onRemove, editMode }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold"
  >
    <AlertTriangle size={11} />
    {name}
    {editMode && (
      <button onClick={() => onRemove(name)} className="text-rose-400 hover:text-rose-200 ml-0.5 focus:outline-none">
        <X size={12} />
      </button>
    )}
  </motion.div>
);

/* ─── Family history row ────────────────────────────────────── */
const FamilyRow = ({ relation, condition, editMode, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 10 }}
    className="flex items-center justify-between p-3.5 rounded-xl bg-white/3 border border-white/8 group"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
        <Users size={14} className="text-indigo-400" />
      </div>
      <div>
        <span className="text-xs font-bold text-slate-200">{relation}</span>
        <p className="text-[10px] text-slate-500 mt-0.5">{condition}</p>
      </div>
    </div>
    {editMode && (
      <button onClick={onRemove} className="text-slate-600 hover:text-rose-400 transition-colors p-1 focus:outline-none">
        <Trash2 size={14} />
      </button>
    )}
  </motion.div>
);

/* ─── Section wrapper ───────────────────────────────────────── */
const SectionCard = ({ title, subtitle, children, icon: Icon, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="glass-card rounded-3xl p-6 border border-white/8 space-y-5"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Icon size={17} className="text-cyan-400" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-bold text-slate-200">{title}</h3>
          {subtitle && <p className="text-[10px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════
   Main Profile Page
══════════════════════════════════════════════════════════════ */
export const ProfilePage = () => {
  const { profile, updateProfile } = useUser();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* Allergies state */
  const [allergies, setAllergies] = useState(profile?.allergies || []);
  const [newAllergen, setNewAllergen] = useState('');

  /* Family history state */
  const [familyHistory, setFamilyHistory] = useState([
    { id: 1, relation: 'Father', condition: 'Type 2 Diabetes' },
    { id: 2, relation: 'Mother', condition: 'Hypertension' },
    { id: 3, relation: 'Grandfather', condition: 'Coronary Artery Disease' },
  ]);
  const [newFamily, setNewFamily] = useState({ relation: '', condition: '' });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: profile?.name,
      email: profile?.email,
      age: profile?.age,
      gender: profile?.gender,
      bloodType: profile?.bloodType,
      height: profile?.height,
      weight: profile?.weight,
      smoking: profile?.lifestyle?.smoking,
      alcohol: profile?.lifestyle?.alcohol,
      activityLevel: profile?.lifestyle?.activityLevel,
      dietType: profile?.lifestyle?.dietType,
      ecName: profile?.emergencyContact?.name,
      ecRelation: profile?.emergencyContact?.relation,
      ecPhone: profile?.emergencyContact?.phone,
    }
  });

  const onSave = async (data) => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 900));
    updateProfile({
      name: data.name,
      email: data.email,
      age: Number(data.age),
      gender: data.gender,
      bloodType: data.bloodType,
      height: data.height,
      weight: data.weight,
      allergies,
      lifestyle: {
        smoking: data.smoking,
        alcohol: data.alcohol,
        activityLevel: data.activityLevel,
        dietType: data.dietType,
      },
      emergencyContact: {
        name: data.ecName,
        relation: data.ecRelation,
        phone: data.ecPhone,
      }
    });
    setIsSaving(false);
    setEditMode(false);
    toast.success('Profile updated successfully!', { icon: '✅' });
  };

  const onCancel = () => {
    reset();
    setAllergies(profile?.allergies || []);
    setEditMode(false);
    toast.info('Changes discarded.', { icon: 'ℹ️' });
  };

  const addAllergen = () => {
    if (newAllergen.trim() && !allergies.includes(newAllergen.trim())) {
      setAllergies(prev => [...prev, newAllergen.trim()]);
      setNewAllergen('');
    }
  };

  const removeAllergen = (name) => setAllergies(prev => prev.filter(a => a !== name));

  const addFamilyHistory = () => {
    if (newFamily.relation.trim() && newFamily.condition.trim()) {
      setFamilyHistory(prev => [...prev, { id: Date.now(), ...newFamily }]);
      setNewFamily({ relation: '', condition: '' });
    }
  };

  const removeFamilyHistory = (id) => setFamilyHistory(prev => prev.filter(f => f.id !== id));

  const tabVariants = {
    hidden: { opacity: 0, x: 12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -12, transition: { duration: 0.2 } }
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6 pb-8">
      {/* ── Header ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Patient Profile</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage your clinical health record</p>
        </div>

        <div className="flex items-center gap-3">
          {editMode ? (
            <>
              <motion.button
                type="button" onClick={onCancel}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all focus:outline-none"
              >
                <X size={14} /> Discard
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSaving}
                whileHover={{ scale: isSaving ? 1 : 1.03 }} whileTap={{ scale: isSaving ? 1 : 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all focus:outline-none"
              >
                {isSaving ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : <Save size={14} />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </>
          ) : (
            <motion.button
              type="button"
              onClick={() => setEditMode(true)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all focus:outline-none"
            >
              <Edit3 size={14} /> Edit Profile
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* ── Avatar + Quick Stats ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-6 border border-white/8 relative overflow-hidden"
      >
        {/* Shimmer line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar — shows Google profile photo or fallback initials */}
          <div className="relative shrink-0">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={profile?.name}
                className="w-24 h-24 rounded-3xl object-cover border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/30 to-indigo-600/30 border-2 border-cyan-500/30 flex items-center justify-center text-4xl font-extrabold text-white shadow-lg shadow-cyan-500/20">
                {(profile?.name || user?.full_name || 'U')[0].toUpperCase()}
              </div>
            )}
            {editMode && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cyan-500 border-2 border-slate-900 flex items-center justify-center text-white focus:outline-none hover:bg-cyan-400 transition-colors"
              >
                <Camera size={14} />
              </motion.button>
            )}
          </div>

          {/* Name & role */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-xl font-extrabold text-white">{profile?.name}</h2>
            <p className="text-slate-400 text-sm">{profile?.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                <Star size={10} /> Patient
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <Check size={10} /> Verified
              </span>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <StatBadge icon={Droplets}  label="Blood Type"    value={profile?.bloodType} color="rose" />
            <StatBadge icon={Ruler}     label="Height"        value={profile?.height}    color="cyan" />
            <StatBadge icon={Weight}    label="Weight"        value={profile?.weight}    color="indigo" />
            <StatBadge icon={Calendar}  label="Age"           value={`${profile?.age} yrs`} color="amber" />
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 focus:outline-none
              ${activeTab === id
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 border border-cyan-500/30 text-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* ── PERSONAL ── */}
        {activeTab === 'personal' && (
          <motion.div key="personal" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
            <SectionCard title="Personal Information" subtitle="Core demographic details" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileField label="Full Name" value={profile?.name} icon={User} editMode={editMode}
                  inputProps={{ ...register('name', { required: true }), placeholder: 'Full name' }} />
                <ProfileField label="Email Address" value={profile?.email} icon={Mail} editMode={editMode}
                  inputProps={{ ...register('email'), placeholder: 'Email', type: 'email' }} />
                <ProfileField label="Age" value={`${profile?.age} years`} icon={Calendar} editMode={editMode} type="number"
                  inputProps={{ ...register('age'), placeholder: 'Age', type: 'number', min: 0, max: 120 }} />
                <ProfileField label="Gender" value={profile?.gender} editMode={editMode}>
                  {editMode && (
                    <select {...register('gender')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-all">
                      <option value="Male" className="bg-slate-900">Male</option>
                      <option value="Female" className="bg-slate-900">Female</option>
                      <option value="Non-binary" className="bg-slate-900">Non-binary</option>
                      <option value="Prefer not to say" className="bg-slate-900">Prefer not to say</option>
                    </select>
                  )}
                </ProfileField>
                <ProfileField label="Blood Type" value={profile?.bloodType} icon={Droplets} editMode={editMode}>
                  {editMode && (
                    <select {...register('bloodType')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-all">
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => (
                        <option key={b} value={b} className="bg-slate-900">{b}</option>
                      ))}
                    </select>
                  )}
                </ProfileField>
                <ProfileField label="Height" value={profile?.height} icon={Ruler} editMode={editMode}
                  inputProps={{ ...register('height'), placeholder: 'e.g. 180 cm' }} />
                <ProfileField label="Weight" value={profile?.weight} icon={Weight} editMode={editMode}
                  inputProps={{ ...register('weight'), placeholder: 'e.g. 75 kg' }} />
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* ── LIFESTYLE ── */}
        {activeTab === 'lifestyle' && (
          <motion.div key="lifestyle" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
            <SectionCard title="Lifestyle & Habits" subtitle="Daily habits and activity patterns" icon={Activity}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileField label="Smoking Status" value={profile?.lifestyle?.smoking} icon={Cigarette} editMode={editMode}>
                  {editMode && (
                    <select {...register('smoking')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-all">
                      {['Never','Former','Occasional','Regular'].map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
                    </select>
                  )}
                </ProfileField>
                <ProfileField label="Alcohol Consumption" value={profile?.lifestyle?.alcohol} icon={Wine} editMode={editMode}>
                  {editMode && (
                    <select {...register('alcohol')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-all">
                      {['Never','Occasional','Moderate','Frequent'].map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
                    </select>
                  )}
                </ProfileField>
                <ProfileField label="Physical Activity" value={profile?.lifestyle?.activityLevel} icon={Dumbbell} editMode={editMode}>
                  {editMode && (
                    <select {...register('activityLevel')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-all">
                      {['Sedentary','Light','Moderate','Active','Very Active'].map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
                    </select>
                  )}
                </ProfileField>
                <ProfileField label="Diet Type" value={profile?.lifestyle?.dietType} icon={Apple} editMode={editMode}>
                  {editMode && (
                    <select {...register('dietType')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-all">
                      {['Balanced','Vegetarian','Vegan','Keto','Paleo','Mediterranean','Low-sodium'].map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
                    </select>
                  )}
                </ProfileField>
              </div>

              {/* Lifestyle Risk Indicators */}
              {!editMode && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5">
                  {[
                    { label: 'Smoking Risk',  value: profile?.lifestyle?.smoking === 'Never' ? 'Low' : profile?.lifestyle?.smoking === 'Former' ? 'Medium' : 'High', icon: Cigarette },
                    { label: 'Alcohol Risk',  value: profile?.lifestyle?.alcohol === 'Never' ? 'Low' : 'Moderate', icon: Wine },
                    { label: 'Activity',      value: profile?.lifestyle?.activityLevel || 'Moderate', icon: Dumbbell },
                    { label: 'Diet Quality',  value: profile?.lifestyle?.dietType || 'Balanced', icon: Apple },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-white/3 border border-white/8 rounded-xl p-3 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                        <Icon size={10} /> {label}
                      </div>
                      <span className="text-xs font-bold text-slate-300">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </motion.div>
        )}

        {/* ── ALLERGIES ── */}
        {activeTab === 'allergies' && (
          <motion.div key="allergies" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
            <SectionCard title="Known Allergies" subtitle="Medications, foods, or environmental triggers" icon={AlertTriangle}>
              {/* Warning banner */}
              <div className="flex items-start gap-3 bg-rose-500/8 border border-rose-500/20 rounded-2xl p-4">
                <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-300 leading-relaxed">
                  <strong>Medical Alert:</strong> The following allergens are flagged in your clinical record and will be considered in disease predictions and treatment recommendations.
                </p>
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                <AnimatePresence>
                  {allergies.length === 0 ? (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-slate-500 italic">
                      No allergies recorded
                    </motion.p>
                  ) : (
                    allergies.map(a => (
                      <AllergenChip key={a} name={a} editMode={editMode} onRemove={removeAllergen} />
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Add allergen */}
              {editMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 pt-2"
                >
                  <input
                    type="text"
                    value={newAllergen}
                    onChange={e => setNewAllergen(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                    placeholder="Type an allergen and press Enter"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                  <motion.button
                    type="button" onClick={addAllergen}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/30 transition-all focus:outline-none"
                  >
                    <Plus size={16} />
                  </motion.button>
                </motion.div>
              )}
            </SectionCard>
          </motion.div>
        )}

        {/* ── EMERGENCY ── */}
        {activeTab === 'emergency' && (
          <motion.div key="emergency" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
            <SectionCard title="Emergency Contact" subtitle="Who to contact in a medical emergency" icon={Phone}>
              <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4 mb-2">
                <Shield size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300 leading-relaxed">
                  This contact will be shared with first responders in an emergency. Please ensure the information is accurate and up to date.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProfileField label="Contact Name" value={profile?.emergencyContact?.name} icon={User} editMode={editMode}
                  inputProps={{ ...register('ecName'), placeholder: 'Full name' }} />
                <ProfileField label="Relationship" value={profile?.emergencyContact?.relation} editMode={editMode}>
                  {editMode && (
                    <select {...register('ecRelation')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-all">
                      {['Spouse','Parent','Child','Sibling','Friend','Colleague','Other'].map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
                    </select>
                  )}
                </ProfileField>
                <ProfileField label="Phone Number" value={profile?.emergencyContact?.phone} icon={Phone} editMode={editMode}
                  inputProps={{ ...register('ecPhone'), placeholder: '+1 (555) 000-0000', type: 'tel' }} />
              </div>

              {!editMode && (
                <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-300 font-semibold">Emergency contact on file and verified</p>
                </div>
              )}
            </SectionCard>
          </motion.div>
        )}

        {/* ── FAMILY HISTORY ── */}
        {activeTab === 'family' && (
          <motion.div key="family" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
            <SectionCard title="Family Medical History" subtitle="Hereditary conditions and genetic risk factors" icon={Users}>
              <div className="flex items-start gap-3 bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-4">
                <ClipboardList size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-300 leading-relaxed">
                  Family history significantly influences disease prediction accuracy. Add known conditions in your immediate family.
                </p>
              </div>

              <AnimatePresence>
                <div className="space-y-2">
                  {familyHistory.map(({ id, relation, condition }) => (
                    <FamilyRow key={id} relation={relation} condition={condition} editMode={editMode} onRemove={() => removeFamilyHistory(id)} />
                  ))}
                </div>
              </AnimatePresence>

              {editMode && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-3 border-t border-white/8 space-y-3"
                >
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest">Add Entry</p>
                  <div className="flex items-center gap-2">
                    <select
                      value={newFamily.relation}
                      onChange={e => setNewFamily(p => ({ ...p, relation: e.target.value }))}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-all"
                    >
                      <option value="" className="bg-slate-900">Select relation</option>
                      {['Father','Mother','Sibling','Grandparent','Uncle','Aunt','Cousin'].map(r => (
                        <option key={r} value={r} className="bg-slate-900">{r}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newFamily.condition}
                      onChange={e => setNewFamily(p => ({ ...p, condition: e.target.value }))}
                      placeholder="Condition (e.g. Diabetes)"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all"
                    />
                    <motion.button
                      type="button" onClick={addFamilyHistory}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/30 transition-all focus:outline-none"
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default ProfilePage;
