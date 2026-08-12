import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Activity,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';
import { authApi } from '../../services/api';
import { setToken, setUser } from '../../utils/auth';
import { isEmail, required } from '../../utils/validation';

const features = [
  { icon: Stethoscope, title: 'AI Symptom Analysis', desc: 'Get instant insights from your symptoms' },
  { icon: Activity, title: 'Health Monitoring', desc: 'Track your vitals and health trends' },
  { icon: ShieldCheck, title: 'Private & Secure', desc: 'Your health data stays encrypted' },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!isEmail(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authApi.login({
        email: form.email,
        password: form.password,
      });
      const token = res.access_token;

      if (!token) {
        throw new Error("No access token returned by the server");
      }

      setToken(token);

      // Get logged-in user details
      toast.success("Login Successful!");

navigate("/dashboard");

    } catch (e) {
      toast.error(e.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
  setGoogleLoading(true);

  try {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    const res = await authApi.googleLogin({
      email: user.email,
      name: user.displayName,
      uid: user.uid,
    });

    // SAVE LOGIN
    setToken(res.access_token);
    setUser(res.user);

    localStorage.setItem("medassist_token", res.access_token);
    localStorage.setItem("medassist_user", JSON.stringify(res.user));

    toast.success("Google Login Successful");

    window.location.href = "/dashboard";
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Google Login Failed");
  } finally {
    setGoogleLoading(false);
  }
};


  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* ---- Left: form ---- */}
      <div className="flex w-full flex-col px-6 py-8 sm:px-10 lg:w-[55%] lg:px-16 xl:px-24">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <p className="text-sm text-ink-500">
            New here?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Create account
            </Link>
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-ink-900">Welcome back</h1>
              <p className="mt-2 text-ink-500">Sign in to your AI healthcare assistant.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email address"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                error={errors.email}
                autoComplete="email"
                required
              />
              <div>
                <Input
                  label="Password"
                  icon={Lock}
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={set('password')}
                  error={errors.password}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember me"
                  checked={form.remember}
                  onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))}
                />
                
              </div>

              <Button type="submit" variant="gradient" size="lg" loading={loading} className="w-full">
                Sign in <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-ink-200" />
              <span className="text-xs font-medium text-ink-400">OR CONTINUE WITH</span>
              <div className="h-px flex-1 bg-ink-200" />
            </div>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              loading={googleLoading}
              onClick={handleGoogle}
              className="w-full"
            >
              <GoogleIcon /> Google
            </Button>

            <p className="mt-6 text-center text-xs text-ink-400">
              By signing in you agree to our{' '}
              <span className="font-medium text-ink-600">Terms</span> and{' '}
              <span className="font-medium text-ink-600">Privacy Policy</span>.
            </p>
          </motion.div>
        </div>

        <p className="text-center text-xs text-ink-400">
          © {new Date().getFullYear()} MedAssist AI. All rights reserved.
        </p>
      </div>

      {/* ---- Right: illustration panel ---- */}
      <div className="relative hidden overflow-hidden gradient-hero lg:block lg:w-[45%]">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Healthcare
            </div>
            <h2 className="mt-6 text-4xl font-bold leading-tight text-white">
              Your personal AI health companion.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Analyze symptoms, predict diseases, and get personalized recommendations — all in one place.
            </p>

            {/* Animated illustration */}
            <div className="mt-10 flex items-center gap-6">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-md"
              >
                <HeartPulse className="h-12 w-12 text-white" />
              </motion.div>
              <div className="flex-1 space-y-4">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{f.title}</p>
                        <p className="text-xs text-white/70">{f.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
