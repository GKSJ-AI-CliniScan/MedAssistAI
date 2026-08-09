import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Droplet,
  Ruler,
  Weight,
  HeartPulse,
  AlertCircle,
  Contact,
  Save,
  Camera,
  Loader2,
  Activity,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/common/Avatar';
import { userApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { calcBMI, bmiCategory, formatDate } from '../../utils/helpers';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'male',
    blood_group: 'O+',
    height: '',
    weight: '',
    allergies: '',
    conditions: '',
    emergency_name: '',
    emergency_phone: '',
    emergency_relation: '',
    avatar: null,
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    userApi
      .getProfile()
      .then((d) => {
    const u = d.user ?? d;

    console.log("API DATA:", u);
    console.log("API CREATED:", u.created_at);
    console.log("USER FROM API:", u);

    const merged = {
        created_at: u.created_at || "",
        name: u.name || user?.name || "",
        email: u.email || user?.email || "",
        phone: u.phone || "",
        dob: u.date_of_birth || "",
        gender: u.gender || "male",
        blood_group: u.blood_group || "O+",
        height: u.height_cm || "",
        weight: u.weight_kg || "",
        allergies: u.allergies || "",
        conditions: u.medical_conditions || "",
        emergency_name: u.emergency_contact?.name || "",
        emergency_phone: u.emergency_contact?.phone || "",
        emergency_relation: u.emergency_contact?.relation || "",
        avatar: u.avatar || null,
    };

    console.log("MERGED:", merged);

    setForm(merged);
})
      .catch(() => {
        // Fallback to cached user
        if (user) {
          setForm((f) => ({ ...f, name: user.name || '', email: user.email || '', avatar: user.avatar || null }));
        }
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const bmi = calcBMI(Number(form.weight), Number(form.height));
  const bmiCat = bmiCategory(bmi);

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
  name: form.name,
  email: form.email,
  phone: form.phone,
  date_of_birth: form.dob,
  gender: form.gender,
  blood_group: form.blood_group,
  height_cm: Number(form.height),
  weight_kg: Number(form.weight),
  allergies: form.allergies,
  medical_conditions: form.conditions,
  emergency_contact: {
    name: form.emergency_name,
    phone: form.emergency_phone,
    relation: form.emergency_relation,
  }
};
      const res = await userApi.updateProfile(payload);
      const updated = res.user || res || { ...user, ...payload };
      updateUser(updated);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (e) {
      toast.error(e.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ---- Header card ---- */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-soft"
      >
        <div className="h-36 gradient-brand" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="rounded-full ring-4 ring-white">
                  <Avatar name={form.name} src={form.avatar} size={96} />
                </div>
                {editing && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft ring-2 ring-ink-100 hover:bg-ink-50"
                  >
                    <Camera className="h-4 w-4 text-ink-600" />
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </div>
              <div className="pt-6">
                <h1 className="text-2xl font-bold text-ink-900">{form.name || 'Your Profile'}</h1>
                <p className="text-sm text-ink-500">{form.email}</p>
              </div>
            </div>
            <div className="pt-6">
              {editing ? (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button variant="gradient" loading={saving} onClick={handleSave}>
                    <Save className="h-4 w-4" /> Save
                  </Button>
                </div>
              ) : (
                <Button variant="secondary" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* BMI quick stats */}
<div className="mt-6 grid grid-cols-3 gap-3">
  <Stat label="BMI" value={bmi ?? "—"} icon={Activity} tone="brand" />
  <Stat
    label="BMI Status"
    value={bmiCat.label}
    icon={Activity}
    tone={bmiCat.tone === "success"
      ? "emerald"
      : bmiCat.tone === "warning"
      ? "amber"
      : "error"}
  />
  <Stat
    label="Blood Group"
    value={form.blood_group}
    icon={Droplet}
    tone="rose"
  />
</div>

</div>
</motion.div>

      {/* ---- Personal Information ---- */}
      <Section title="Personal Information" icon={User}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full name" icon={User} value={form.name} onChange={set('name')} disabled={!editing} />
          <Input label="Email" icon={Mail} value={form.email} onChange={set('email')} disabled />
          <Input label="Phone" icon={Phone} value={form.phone} onChange={set('phone')} disabled={!editing} />
          <Input label="Date of birth" icon={Calendar} type="date" value={form.dob} onChange={set('dob')} disabled={!editing} />
          <Select
            label="Gender"
            value={form.gender}
            onChange={set('gender')}
            disabled={!editing}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <Select
            label="Blood group"
            value={form.blood_group}
            onChange={set('blood_group')}
            disabled={!editing}
            options={bloodGroups.map((b) => ({ value: b, label: b }))}
          />
        </div>
      </Section>

      {/* ---- Medical Information ---- */}
      <Section title="Medical Information" icon={HeartPulse}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Height (cm)" icon={Ruler} type="number" value={form.height} onChange={set('height')} disabled={!editing} />
          <Input label="Weight (kg)" icon={Weight} type="number" value={form.weight} onChange={set('weight')} disabled={!editing} />
          <Input label="Allergies" icon={AlertCircle} value={form.allergies} onChange={set('allergies')} disabled={!editing} placeholder="Peanuts, pollen…" />
          <Input label="Existing conditions" icon={HeartPulse} value={form.conditions} onChange={set('conditions')} disabled={!editing} placeholder="Diabetes, hypertension…" />
        </div>
      </Section>

      {/* ---- Emergency Contact ---- */}
      <Section title="Emergency Contact" icon={Contact}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input label="Contact name" icon={User} value={form.emergency_name} onChange={set('emergency_name')} disabled={!editing} />
          <Input label="Phone" icon={Phone} value={form.emergency_phone} onChange={set('emergency_phone')} disabled={!editing} />
          <Input label="Relationship" icon={Contact} value={form.emergency_relation} onChange={set('emergency_relation')} disabled={!editing} placeholder="Spouse, parent…" />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-ink-200/70 bg-white p-6 shadow-soft"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
          <Icon className="h-4 w-4 text-brand-600" />
        </div>
        <h2 className="text-base font-semibold text-ink-900">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function Stat({ label, value, icon: Icon, tone = 'neutral' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald2-50 text-emerald2-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    neutral: 'bg-ink-100 text-ink-500',
  };
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm font-semibold text-ink-900">{value}</p>
      </div>
    </div>
  );
}
