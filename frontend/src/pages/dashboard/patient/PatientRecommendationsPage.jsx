import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import { Sparkles, Loader2, AlertCircle, Brain, ShieldCheck, RefreshCw } from 'lucide-react';
import { getMyReports } from '../../../services/api/reports';

export default function PatientRecommendationsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getMyReports();
      setReports(data || []);
      setError(null);
    } catch (err) {
      setError('Unable to load recommendations. Please try again later.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLatestRecommendation = () => {
    if (reports.length === 0) return null;
    return reports[0]; // Most recent
  };

  const latestRecommendation = getLatestRecommendation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-clinical-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
          Recommendations
        </h1>
        <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
          Personalized clinical guidance & lifestyle actions
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={fetchReports} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      <Card 
        title="Personalized Health Protocol" 
        subtitle="AI Clinical Action Guidance"
        variant="ai"
      >
        <div className="space-y-4">
          <p className="text-sm text-clinical-textLight dark:text-clinical-textDark leading-relaxed">
            Review recommendations generated based on your symptoms, historical diagnostic tests, and treatment plans.
          </p>

          {latestRecommendation ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-clinical-violet dark:text-clinical-violetDark shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark">Latest Recommendation</span>
                      <span className="text-[10px] text-clinical-mutedLight dark:text-clinical-mutedDark">
                        {new Date(latestRecommendation.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-clinical-textLight dark:text-clinical-textDark leading-relaxed">
                      {latestRecommendation.recommendations}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-clinical-green dark:text-clinical-greenDark" />
                    <span className="text-[10px] font-bold text-clinical-textLight dark:text-clinical-textDark">Related Condition</span>
                  </div>
                  <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">
                    {latestRecommendation.predicted_disease}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-clinical-teal dark:text-clinical-tealDark" />
                    <span className="text-[10px] font-bold text-clinical-textLight dark:text-clinical-textDark">Risk Level</span>
                  </div>
                  <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">
                    {latestRecommendation.risk_level?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="primary" onClick={() => navigate('/patient/symptoms')} className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>New Assessment</span>
                </Button>
                <Button variant="outline" onClick={() => navigate('/patient/reports')}>
                  View Full Report
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState 
              icon={Sparkles}
              title="No recommendations yet"
              description="Complete an assessment to receive personalized recommendations."
              actionLabel="Start Symptom Checker"
              onActionClick={() => navigate('/patient/symptoms')}
              className="py-8"
            />
          )}
        </div>
      </Card>
    </div>
  );
}
