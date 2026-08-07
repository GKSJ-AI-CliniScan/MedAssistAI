import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function OverviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'User';

  const quickLinks = [
    { label: 'Symptom Checker', path: '/dashboard/symptoms', desc: 'Run a new diagnostic' },
    { label: 'Prediction Results', path: '/dashboard/prediction', desc: 'View your last AI prediction' },
    { label: 'Risk Assessment', path: '/dashboard/risk', desc: 'Review your risk indicators' },
    { label: 'Recommendations', path: '/dashboard/recommendations', desc: 'Get clinical guidance' },
    ...(user?.role === 'patient' || user?.role === 'admin'
      ? [{ label: 'Reports', path: '/dashboard/reports', desc: 'View & download your reports' }]
      : []),
    ...(user?.role === 'doctor' || user?.role === 'admin'
      ? [{ label: 'Analytics', path: '/dashboard/analytics', desc: 'System-wide health analytics' }]
      : []),
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Overview</h1>

      <Card title={`Welcome, ${user?.fullname || user?.email || 'User'}`} subtitle={`Logged in as ${roleLabel}`}>
        <p className="text-slate-600 mb-4">
          This is the central hub for MedAssist AI. Use the sidebar or the quick links below to navigate.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="text-left p-3 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors"
            >
              <p className="text-sm font-semibold text-teal-700">{link.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Account Information" subtitle="Your registered details">
        <div className="space-y-2 text-sm text-slate-700">
          <div className="flex gap-2">
            <span className="text-slate-500 w-24">Name:</span>
            <span className="font-medium">{user?.fullname || '—'}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 w-24">Email:</span>
            <span className="font-medium">{user?.email || '—'}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 w-24">Role:</span>
            <span className="font-medium capitalize">{user?.role || '—'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
