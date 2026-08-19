import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ModTag from '../../../components/ui/ModTag';
import EmptyState from '../../../components/ui/EmptyState';
import { Users, Loader2, AlertCircle, Search, Mail, Calendar, Phone, MapPin } from 'lucide-react';
import { getAllPatients } from '../../../services/api/patient';

export default function ManagePatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search to fetch results without unmounting
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchPatients();
  }, [debouncedSearchTerm]);

  const fetchPatients = async () => {
    try {
      if (patients.length > 0) {
        setSearching(true);
      } else {
        setLoading(true);
      }
      const data = await getAllPatients(0, 100, debouncedSearchTerm);
      setPatients(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Unable to load patients. Please try again later.');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            Manage Patients
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            System-wide master patient index & health records directory
          </p>
        </div>
        <ModTag variant="brand">Patient Index Desk</ModTag>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={fetchPatients} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      <Card title="Patient Administration" subtitle="Master Patient Records Directory">
        <div className="space-y-4">
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark leading-relaxed">
            Search master patient records, review clinical demographics, and audit security access.
          </p>

          {/* Search bar with continuous focus */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clinical-mutedLight dark:text-clinical-mutedDark" />
            <input
              type="text"
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark focus:outline-none focus:border-[#06B6D4]"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#06B6D4] animate-spin" />
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
            </div>
          ) : patients.length === 0 ? (
            <EmptyState 
              icon={Users}
              title={searchTerm ? 'No patients found' : 'No patients registered'}
              description={searchTerm ? 'Try different search terms.' : 'Enrolled patient profiles will appear here.'}
              className="py-10"
            />
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {patients.map((patient) => {
                const patName = patient.user?.fullname || patient.fullname || `Patient #${patient.id}`;
                const patEmail = patient.user?.email || patient.email || 'N/A';
                const patRegDate = patient.created_at || patient.user?.created_at;

                return (
                  <div 
                    key={patient.id} 
                    className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/30 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#06B6D4]" />
                          <span className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">
                            {patName}
                          </span>
                          {patient.blood_group && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20">
                              {patient.blood_group}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark flex-wrap">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <span>{patEmail}</span>
                          </div>
                          {patient.age && (
                            <div>
                              Age: <strong className="text-clinical-textLight dark:text-clinical-textDark">{patient.age}</strong>
                            </div>
                          )}
                          {patient.gender && (
                            <div>
                              Gender: <strong className="text-clinical-textLight dark:text-clinical-textDark">{patient.gender}</strong>
                            </div>
                          )}
                          {patient.contact_number && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#06B6D4]" />
                              <span>{patient.contact_number}</span>
                            </div>
                          )}
                        </div>

                        {patRegDate && (
                          <div className="flex items-center gap-1 text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark">
                            <Calendar className="w-3 h-3 text-[#06B6D4]" />
                            <span>Registered: {new Date(patRegDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <ModTag variant="success">Active</ModTag>
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
