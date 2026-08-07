import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    register(name, email, password);
    navigate('/dashboard/overview');
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
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Input 
            label="Email Address" 
            placeholder="john@example.com" 
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
            Register
          </Button>
        </form>
        <div className="mt-4 text-center text-xs text-slate-500">
          Already have an account? <span className="text-teal-600 hover:underline cursor-pointer" onClick={() => navigate('/login')}>Login</span>
        </div>
      </Card>
    </div>
  );
}
