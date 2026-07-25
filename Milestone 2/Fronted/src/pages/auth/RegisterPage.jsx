import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ROLE } from '../../constants/roles';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, user, loading } = useAuth();
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // TODO: Replace Development Mode with backend authentication API.
    setError('Registration functionality will be available after backend integration.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Register</h1>
      <Card 
        title="Create Account" 
        subtitle="This page will register new clinical users after backend integration."
        className="w-full max-w-sm"
      >
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            fullWidth
          />
          <Input 
            label="Email Address" 
            placeholder="john@example.com" 
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
          <Button type="submit" variant="primary" className="w-full mt-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>
        <div className="mt-4 text-center text-xs text-slate-500">
          Already have an account? <span className="text-teal-600 hover:underline cursor-pointer" onClick={() => navigate('/login')}>Login</span>
        </div>
      </Card>
    </div>
  );
}

