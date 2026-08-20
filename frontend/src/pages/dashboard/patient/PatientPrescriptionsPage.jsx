import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import { 
  Pill, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileText, 
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { getMyPrescriptions } from '../../../services/api/prescriptions';

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await getMyPrescriptions();
      setPrescriptions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError('Unable to load medications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = statusFilter === 'all'
    ? prescriptions
    : prescriptions.filter(p => (p.status || 'active').toLowerCase() === statusFilter);

  const getStatusBadge = (status) => {
    const s = (status || 'active').toLowerCase();
    switch (s) {
      case 'completed':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50';
      case 'discontinued':
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/50';
      case 'active':
      default:
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            My Medications & Prescriptions
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            Active medication schedules and prescription logs issued by certified physicians
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
          >
            <option value="all">All Medications ({prescriptions.length})</option>
            <option value="active">Active Only</option>
            <option value="completed">Completed</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={fetchPrescriptions} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Main List */}
      <Card title="Prescribed Regimens" subtitle="Dosage, frequency, and administration instructions">
        <div className="space-y-4">
          {filteredPrescriptions.length === 0 ? (
            <EmptyState
              icon={Pill}
              title="No prescriptions found"
              description={statusFilter === 'all' ? "You have no prescribed medications on record. Consultations with your doctor will appear here." : `No prescriptions with status: ${statusFilter.toUpperCase()}`}
              className="py-12"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrescriptions.map((rx) => {
                const docName = rx.doctor?.user?.fullname || rx.doctor?.fullname || `Doctor #${rx.doctor_id}`;
                const docSpec = rx.doctor?.specialization || 'General Practitioner';
                const dateStr = rx.created_at ? new Date(rx.created_at).toLocaleDateString() : 'Recent';

                return (
                  <div
                    key={rx.id}
                    className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/30 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-[#06B6D4]/10 text-[#06B6D4] mt-0.5">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">
                            {rx.medicine}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
                            <span className="font-semibold text-clinical-textLight dark:text-clinical-textDark">{rx.dosage}</span>
                            <span>•</span>
                            <span>{rx.frequency}</span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(rx.status)}`}>
                        {rx.status || 'Active'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-white/60 dark:bg-black/20 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-clinical-mutedLight dark:text-clinical-mutedDark">Duration:</span>
                        <span className="font-medium text-clinical-textLight dark:text-clinical-textDark">{rx.duration}</span>
                      </div>
                      {rx.instructions && (
                        <div className="pt-1 border-t border-slate-100 dark:border-slate-800/60">
                          <span className="text-clinical-mutedLight dark:text-clinical-mutedDark block text-[11px]">Instructions:</span>
                          <p className="text-clinical-textLight dark:text-clinical-textDark italic text-[11px] mt-0.5">
                            "{rx.instructions}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark pt-1">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-[#06B6D4]" />
                        <span>Prescribed by {docName} ({docSpec})</span>
                      </div>
                      <span>{dateStr}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
