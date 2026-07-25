import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ROLE } from '../../constants/roles';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLE.PATIENT);
  const [error, setError] = useState('');
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case ROLE.ADMIN:
          navigate('/admin', { replace: true });
          break;
        case ROLE.DOCTOR:
          navigate('/doctor', { replace: true });
          break;
        case ROLE.PATIENT:
          navigate('/patient', { replace: true });
          break;
        case ROLE.STAFF:
          navigate('/staff', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      // TODO: Replace Development Mode with backend authentication API.
      const loggedInUser = await login(email, password, selectedRole);
      switch (loggedInUser.role) {
        case ROLE.ADMIN:
          navigate('/admin');
          break;
        case ROLE.DOCTOR:
          navigate('/doctor');
          break;
        case ROLE.PATIENT:
          navigate('/patient');
          break;
        case ROLE.STAFF:
          navigate('/staff');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Login</h1>
      <Card 
        title="Sign In" 
        subtitle="Access the clinical portal with your credentials."
        className="w-full max-w-sm"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <Input 
            label="Email Address" 
            placeholder="your-email@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            fullWidth
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            fullWidth
          />
          
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="role-select" className="text-xs font-semibold text-slate-700">
              Role (Development Mode)
            </label>
            <select
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={loading}
              className="px-3 py-2 border border-slate-300 rounded text-sm bg-white text-slate-900 outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed w-full"
            >
              <option value={ROLE.PATIENT}>Patient</option>
              <option value={ROLE.DOCTOR}>Doctor</option>
              <option value={ROLE.ADMIN}>Admin</option>
              <option value={ROLE.STAFF}>Staff</option>
            </select>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </form>
        <div className="mt-4 text-center text-xs text-slate-500">
          Need an account? <span className="text-teal-600 hover:underline cursor-pointer" onClick={() => navigate('/register')}>Register</span>
        </div>
      </Card>
    </div>
  );
}

