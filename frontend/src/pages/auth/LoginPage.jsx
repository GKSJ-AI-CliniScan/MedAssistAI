import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@medassist.ai');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
    navigate('/dashboard/overview');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Login</h1>
      <Card 
        title="Sign In" 
        subtitle="This page will handle user authentication in the future."
        className="w-full max-w-sm"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            label="Email Address" 
            placeholder="demo@medassist.ai" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="primary" className="w-full mt-2">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-xs text-slate-500">
          Need an account? <span className="text-teal-600 hover:underline cursor-pointer" onClick={() => navigate('/register')}>Register</span>
        </div>
      </Card>
    </div>
  );
}
