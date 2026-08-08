import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Droplet,
  Ruler,
  Weight,
  ArrowRight,
  ArrowLeft,
  Check,
  HeartPulse,
  Stethoscope,
  ShieldCheck,
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Progress from '../../components/ui/Progress';
import { authApi } from '../../services/api';
import { setToken, setUser } from '../../utils/auth';
import { isEmail, required, minLength, matches, passwordStrength } from '../../utils/validation';

const steps = [
  { id: 1, label: 'Personal', icon: User },
  { id: 2, label: 'Medical', icon: HeartPulse },
  { id: 3, label: 'Security', icon: ShieldCheck },
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
    password: '',
    confirm: '',
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (required(form.name)) e.name = 'Full name is required';
      if (!isEmail(form.email)) e.email = 'Enter a valid email';
      if (form.phone && !/^[0-9+\-\s]{8,15}$/.test(form.phone)) e.phone = 'Enter a valid phone';
      if (required(form.dob)) e.dob = 'Date of birth is required';
    }
    if (s === 2) {
      if (form.height && (Number(form.height) < 50 || Number(form.height) > 250))
        e.height = 'Height (cm) seems off';
      if (form.weight && (Number(form.weight) < 20 || Number(form.weight) > 300))
        e.weight = 'Weight (kg) seems off';
    }
    if (s === 3) {
      if (minLength(form.password, 8, 'Password')) e.password = 'Min 8 characters';
      if (matches(form.confirm, form.password, 'Confirm password')) e.confirm = 'Passwords do not match';
      if (!form.agree) e.agree = 'You must accept the terms';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setLoading(true);
    try {
      const names = form.name.trim().split(" ");

const payload = {
  first_name: names[0] || "",
  last_name: names.slice(1).join(" ") || "-",
  email: form.email,
  password: form.password,
  role: "patient",
};
      const res = await authApi.register(payload);
      const token = res.access_token || res.token;
      if (token) {
        setToken(token);
        setUser(res.user || res);
        toast.success('Account created! Welcome to MedAssist AI.');
        navigate('/dashboard', { replace: true });
      } else {
        toast.success('Account created. Please sign in.');
        navigate('/login', { replace: true });
      }
    } catch (e) {
  console.error(e.response?.data);

  let message = "Registration failed.";

  if (Array.isArray(e.response?.data?.detail)) {
    message = e.response.data.detail
      .map(err => `${err.loc.join(" → ")}: ${err.msg}`)
      .join("\n");
  } else if (typeof e.response?.data?.detail === "string") {
    message = e.response.data.detail;
  } else if (e.message) {
    message = e.message;
  }

  console.log(e.response?.data);

if (Array.isArray(e.response?.data?.detail)) {
  console.log(e.response.data.detail);
}

toast.error(
  typeof message === "string"
    ? message
    : JSON.stringify(message)
);
} finally {
      setLoading(false);
    }
  };

  const pw = passwordStrength(form.password);

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* ---- Left: illustration ---- */}
      <div className="relative hidden w-[42%] overflow-hidden gradient-hero lg:block">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex h-full flex-col justify-center px-12 xl:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <Stethoscope className="h-3.5 w-3.5" /> Join MedAssist AI
            </div>
            <h2 className="mt-6 text-4xl font-bold leading-tight text-white">
              Start your health journey today.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Create an account to access AI-powered symptom analysis, personalized recommendations, and a complete health dashboard.
            </p>
            <div className="mt-10 space-y-4">
              {[
                'AI symptom checker & disease prediction',
                'Personalized health recommendations',
                'Track and download your medical reports',
                'Bank-grade security for your health data',
              ].map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-white/90">{t}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ---- Right: form ---- */}
      <div className="flex w-full flex-col px-6 py-8 sm:px-10 lg:w-[58%] lg:px-16 xl:px-24">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <p className="text-sm text-ink-500">
            Have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <h1 className="text-3xl font-bold tracking-tight text-ink-900">Create your account</h1>
            <p className="mt-2 text-ink-500">It takes less than 2 minutes.</p>

            {/* Stepper */}
            <div className="mt-8 flex items-center">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const active = step === s.id;
                const done = step > s.id;
                return (
                  <div key={s.id} className="flex flex-1 items-center last:flex-none">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all ${
                          done
                            ? 'border-emerald2-500 bg-emerald2-500 text-white'
                            : active
                              ? 'border-brand-600 bg-brand-600 text-white shadow-glow'
                              : 'border-ink-200 bg-white text-ink-400'
                        }`}
                      >
                        {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </div>
                      <div className="hidden sm:block">
                        <p className={`text-xs font-medium ${active || done ? 'text-ink-900' : 'text-ink-400'}`}>
                          Step {s.id}
                        </p>
                        <p className={`text-sm font-semibold ${active || done ? 'text-ink-800' : 'text-ink-400'}`}>
                          {s.label}
                        </p>
                      </div>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`mx-3 h-0.5 flex-1 rounded-full ${done ? 'bg-emerald2-500' : 'bg-ink-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <Progress value={(step / 3) * 100} className="mt-4" />

            <div className="mt-8">
              <AnimatePresence mode="wait">
                {/* ---- Step 1: Personal ---- */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <Input label="Full name" icon={User} placeholder="John Doe" value={form.name} onChange={set('name')} error={errors.name} required />
                    <Input label="Email" icon={Mail} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} required />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input label="Phone" icon={Phone} placeholder="+1 555 000 0000" value={form.phone} onChange={set('phone')} error={errors.phone} />
                      <Input label="Date of birth" icon={Calendar} type="date" value={form.dob} onChange={set('dob')} error={errors.dob} required />
                    </div>
                    <Select
                      label="Gender"
                      value={form.gender}
                      onChange={set('gender')}
                      options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'other', label: 'Other' },
                      ]}
                    />
                    <div className="flex justify-end pt-2">
                      <Button variant="gradient" size="lg" onClick={next}>
                        Continue <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ---- Step 2: Medical ---- */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Select
                        label="Blood group"
                        value={form.blood_group}
                        onChange={set('blood_group')}
                        options={bloodGroups.map((b) => ({ value: b, label: b }))}
                      />
                      <Input label="Height (cm)" icon={Ruler} type="number" placeholder="170" value={form.height} onChange={set('height')} error={errors.height} />
                      <Input label="Weight (kg)" icon={Weight} type="number" placeholder="65" value={form.weight} onChange={set('weight')} error={errors.weight} />
                    </div>
                    <Input label="Known allergies" icon={Droplet} placeholder="Peanuts, pollen, none…" value={form.allergies} onChange={set('allergies')} />
                    <Input label="Existing conditions" icon={HeartPulse} placeholder="Diabetes, hypertension, none…" value={form.conditions} onChange={set('conditions')} />
                    <div className="flex justify-between pt-2">
                      <Button variant="secondary" size="lg" onClick={back}>
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button variant="gradient" size="lg" onClick={next}>
                        Continue <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ---- Step 3: Security ---- */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <Input label="Password" icon={Lock} type="password" placeholder="Create a strong password" value={form.password} onChange={set('password')} error={errors.password} required />
                    {form.password && (
                      <div className="space-y-1.5">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-colors ${
                                i <= pw.score
                                  ? pw.tone === 'error'
                                    ? 'bg-red-500'
                                    : pw.tone === 'warning'
                                      ? 'bg-amber-500'
                                      : 'bg-emerald2-500'
                                  : 'bg-ink-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${pw.tone === 'success' ? 'text-emerald2-600' : pw.tone === 'warning' ? 'text-amber-600' : 'text-red-500'}`}>
                          Strength: {pw.label}
                        </p>
                      </div>
                    )}
                    <Input label="Confirm password" icon={Lock} type="password" placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} required />
                    <label className="flex cursor-pointer items-start gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        checked={form.agree}
                        onChange={set('agree')}
                        className="mt-0.5 h-5 w-5 cursor-pointer rounded-md border border-ink-300 text-brand-600 focus:ring-brand-200"
                      />
                      <span className="text-sm text-ink-600">
                        I agree to the <span className="font-medium text-brand-600">Terms</span> and{' '}
                        <span className="font-medium text-brand-600">Privacy Policy</span>.
                      </span>
                    </label>
                    {errors.agree && <p className="text-xs font-medium text-red-500">{errors.agree}</p>}
                    <div className="flex justify-between pt-2">
                      <Button variant="secondary" size="lg" onClick={back}>
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button variant="gradient" size="lg" loading={loading} onClick={handleSubmit}>
                        Create account <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
