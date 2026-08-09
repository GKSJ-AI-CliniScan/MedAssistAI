import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  Stethoscope,
  FileText,
  Activity,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import HealthScoreCard from '../../components/dashboard/HealthScoreCard';
import StatCard from '../../components/dashboard/StatCard';
import DiseaseAnalyticsChart from '../../components/dashboard/DiseaseAnalyticsChart';
import HealthDistributionChart from '../../components/dashboard/HealthDistributionChart';
import QuickActions from '../../components/dashboard/QuickActions';
import AIRecommendations from '../../components/dashboard/AIRecommendations';
import RecentActivity from '../../components/dashboard/RecentActivity';
import RecentReports from '../../components/dashboard/RecentReports';
import ProfileCompletion from '../../components/dashboard/ProfileCompletion';
import { userApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { getGreeting } from '../../utils/helpers';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    userApi
      .getDashboard()
      .then((d) => active && setData(d))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const healthScore = data?.health_score ?? 0;
  const completion = data?.profile_completion ?? 0;
  const reports = data?.recent_reports ?? [];
  const activity = data?.recent_activity ?? [];
  const recommendations = data?.recommendations ?? [];
  const analytics = data?.analytics ?? {};
  const trend = data?.trend ?? 0;

  return (
    <div className="space-y-6">
      {/* ---- AI Greeting header ---- */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <Sparkles className="h-3.5 w-3.5" /> AI Health Assistant
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-1 text-ink-500">Here's your health overview for today.</p>
        </div>
      </motion.div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Couldn't load dashboard data: {error}. Make sure your FastAPI backend is running and the /dashboard endpoint is reachable.
        </div>
      )}

      {/* ---- Top row: health score + completion ---- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HealthScoreCard score={healthScore} trend={trend} loading={loading} />
        </div>
        <ProfileCompletion value={completion} items={data?.completion_items} loading={loading} />
      </div>

      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Stethoscope} label="Symptoms Analyzed" value={data?.stats?.symptoms ?? 0} tone="brand" index={0} loading={loading} />
        <StatCard icon={FileText} label="Reports Generated" value={data?.stats?.reports ?? 0} tone="emerald" index={1} loading={loading} />
        <StatCard icon={Activity} label="Health Score" value={loading ? null : `${healthScore}/100`} tone="amber" index={2} loading={loading} />
        <StatCard icon={TrendingUp} label="Risk Trend" value={loading ? null : `${trend > 0 ? '+' : ''}${trend}%`} tone="rose" index={3} loading={loading} />
      </div>

      {/* ---- Quick actions ---- */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-ink-900">Quick Actions</h2>
        <QuickActions />
      </div>

      {/* ---- Charts row ---- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DiseaseAnalyticsChart labels={analytics.labels} data={analytics.values} loading={loading} />
        </div>
        <HealthDistributionChart data={analytics.distribution} loading={loading} />
      </div>

      {/* ---- Bottom row ---- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <RecentReports reports={reports} loading={loading} />
        <AIRecommendations items={recommendations} loading={loading} />
        <RecentActivity items={activity} loading={loading} />
      </div>
    </div>
  );
}
