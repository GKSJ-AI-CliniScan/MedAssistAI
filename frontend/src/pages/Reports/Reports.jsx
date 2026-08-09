import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FileText,
  Download,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  X,
  Loader2,
  FileDown,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import { reportApi, downloadBlob } from '../../services/api';
import { formatDate, riskTone } from '../../utils/helpers';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    reportApi
      .list()
      .then((d) => {
        if (!active) return;
        const items = Array.isArray(d) ? d : d?.items || d?.reports || [];
        setReports(items);
      })
      .catch((e) => active && setError(e.message || 'Could not load reports.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...reports];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          (
            r.prediction ||
            r.predicted_diseases?.[0]?.disease ||
            ""
          ).toLowerCase().includes(q) ||
          (r.summary || '').toLowerCase().includes(q),
      );
    }
    if (riskFilter !== 'all') {
      list = list.filter((r) => (r.risk_level || '').toLowerCase().includes(riskFilter));
    }
    list.sort((a, b) => {
      const da = new Date(a.date || a.created_at || 0).getTime();
      const db = new Date(b.date || b.created_at || 0).getTime();
      return sortBy === 'newest' ? db - da : da - db;
    });
    return list;
  }, [reports, search, riskFilter, sortBy]);

  const handleDownload = async (report) => {

  console.log(report);

const id = String(
    report.id ||
    report._id ||
    report.report_id
);

  if (!id) {
    toast.error("Missing Report ID");
    return;
  }

  setDownloadingId(id);

  try {

    const pdf = await reportApi.download(id);

    downloadBlob(pdf, "MedAssist_Report.pdf");

    toast.success("Report downloaded successfully.");

  } catch (err) {

    console.error(err);

    toast.error("Unable to download report.");

  } finally {

    setDownloadingId(null);

  }

};

  const handleDelete = async (report) => {

  const id = String(report.id || report._id);

  if (!window.confirm("Are you sure you want to delete this report?")) {
    return;
  }

  try {

    await reportApi.delete(id);

    setReports((prev) =>
      prev.filter(
        (r) => String(r.id || r._id) !== id
      )
    );

    toast.success("Report deleted successfully");

  } catch (err) {

    console.error(err);

    toast.error(err.message || "Delete failed");

  }

};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          <FileText className="h-3.5 w-3.5" /> Medical Reports
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink-900">Your Reports</h1>
        <p className="mt-1 text-ink-500">View, search, and download all your AI-generated health reports.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-ink-200/70 bg-white p-4 shadow-soft sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports…"
            className="input-base h-10 pl-11 text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <Select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All risks' },
              { value: 'low', label: 'Low risk' },
              { value: 'moderate', label: 'Moderate risk' },
              { value: 'high', label: 'High risk' },
            ]}
            className="w-40"
          />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'newest', label: 'Newest first' },
              { value: 'oldest', label: 'Oldest first' },
            ]}
            className="w-40"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-ink-500">
        <Filter className="h-4 w-4" />
        <span>{filtered.length} report{filtered.length !== 1 ? 's' : ''}</span>
        {(search || riskFilter !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setRiskFilter('all');
            }}
            className="text-brand-600 hover:text-brand-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error} Make sure your FastAPI backend is running and the /reports endpoint is reachable.
        </div>
      )}

      {/* Reports list / timeline */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-ink-200/70 bg-white py-16 text-center shadow-soft">
          <FileText className="mx-auto h-12 w-12 text-ink-300" />
          <h3 className="mt-4 text-base font-semibold text-ink-900">No reports found</h3>
          <p className="mt-1 text-sm text-ink-500">
            {search || riskFilter !== 'all' ? 'Try adjusting your filters.' : 'Run a symptom check to generate your first report.'}
          </p>
        </div>
      ) : (
        <div className="relative space-y-4">
          {/* timeline line */}
          <div className="absolute left-[19px] top-2 bottom-2 hidden w-px bg-ink-200 sm:block" />
          <AnimatePresence>
            {filtered.map((r, i) => {
              const tone = riskTone(r.risk_level);
              const dotTone = { success: 'bg-emerald2-500', warning: 'bg-amber-500', error: 'bg-red-500', neutral: 'bg-brand-500' };
              return (
                <motion.div
                  key={r._id || r.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative flex gap-4"
                >
                  <div className="relative hidden sm:block">
                    <span className={`mt-5 h-3 w-3 rounded-full ring-4 ring-white ${dotTone[tone] || dotTone.neutral}`} />
                  </div>
                  <div className="group flex-1 rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft transition-all hover:border-ink-300 hover:shadow-glow">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-ink-900">
                            {
                              r.prediction ||
                              r.predicted_diseases?.[0]?.disease ||
                              "Health Analysis"
                            }
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-400">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" /> {formatDate(r.date || r.created_at)}
                            </span>
                            {r.risk_level && <Badge tone={tone}>{r.risk_level}</Badge>}
                            {r.confidence != null && (
                              <span className="rounded-md bg-ink-100 px-1.5 py-0.5 font-medium text-ink-500">
                                {
                                  r.confidence
                                    ? `${r.confidence}%`
                                    : `${Math.round(r.risk_score || 0)}%`
                                } confidence
                              </span>
                            )}
                          </div>
                          {r.summary && <p className="mt-2 text-sm text-ink-600">{r.summary}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          loading={downloadingId === (r._id || r.id)}
                          onClick={() => handleDownload(r)}
                        >
                          <Download className="h-4 w-4" /> Download
                        </Button>
                        <button
                          onClick={() => handleDelete(r)}
                          className="rounded-lg p-2 text-ink-400 transition-all hover:bg-red-50 hover:text-red-500"
                          aria-label="Delete report"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
