import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  ArrowLeft,
  ExternalLink,
  Bookmark,
  Sun,
  Moon,
  Briefcase,
  Star,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/* =========================
   API CONFIG
========================= */
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

/* =========================
   THEME HOOK
========================= */
const useTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setTheme(saved);
    } catch {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  return [theme, toggleTheme];
};

/* =========================
   BUTTON
========================= */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as = 'button',
  ...props
}) => {
  const Comp = as;
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline:
      'bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-blue-500',
    ghost:
      'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <Comp className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Comp>
  );
};

/* =========================
   JOB CARD
========================= */
const JobCard = ({ job, onClick, isSelected, isSaved }) => {
  const title = job?.job_title || 'Untitled Role';
  const company = job?.employer_name || 'Unknown Company';
  const city = job?.job_city || '';
  const state = job?.job_state || '';
  const logo =
    job?.employer_logo ||
    `https://placehold.co/60x60/E2E8F0/475569?text=${(company?.[0] || '?')
      .toString()
      .toUpperCase()}`;

  return (
    <motion.div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
      className={`p-4 rounded-xl cursor-pointer shadow-sm mb-2 transition-colors border ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-slate-800'
          : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50'
      }`}
      whileHover={{ scale: 1.01 }}
      layout
    >
      <div className="flex items-start gap-4">
        <img
          src={logo}
          alt={`${company} logo`}
          className="w-12 h-12 rounded-lg object-contain flex-shrink-0 bg-white"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/60x60/E2E8F0/475569?text=${(company?.[0] || '?')
              .toString()
              .toUpperCase()}`;
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{company}</p>
          {(city || state) && (
            <p className="text-xs text-slate-500 mt-1 truncate">
              {city}
              {city && state ? ', ' : ''}
              {state}
            </p>
          )}
        </div>
        {isSaved && (
          <span className="shrink-0" title="Saved">
            <Star className="text-yellow-400" size={18} />
          </span>
        )}
      </div>
    </motion.div>
  );
};

/* =========================
   JOB DETAILS
========================= */
const JobDetails = ({ job, onBack, onToggleSave, isSaved }) => {
  if (!job) return null;

  const title = job?.job_title || 'Untitled Role';
  const company = job?.employer_name || 'Unknown Company';
  const city = job?.job_city || '';
  const state = job?.job_state || '';
  const country = job?.job_country || '';
  const desc = job?.job_description || 'No description available.';
  const applyLink = job?.job_apply_link || '#';
  const logo =
    job?.employer_logo ||
    `https://placehold.co/80x80/E2E8F0/475569?text=${(company?.[0] || '?')
      .toString()
      .toUpperCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto space-y-6"
    >
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="md"
          className="!px-0 text-slate-600 dark:text-slate-300"
          onClick={onBack}
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to jobs
        </Button>
      </div>

      <div className="flex items-start gap-4">
        <img
          src={logo}
          alt={`${company} logo`}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-contain flex-shrink-0 bg-white"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/80x80/E2E8F0/475569?text=${(company?.[0] || '?')
              .toString()
              .toUpperCase()}`;
          }}
        />
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white break-words">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 break-words">
            {company}
          </p>
          {(city || state || country) && (
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <MapPin size={14} />
              <span className="truncate">
                {[city, state, country].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sticky action bar on mobile too */}
      <div className="flex gap-3 sticky top-0 py-2 z-10 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur rounded">
        <Button as="a" href={applyLink} target="_blank" rel="noopener noreferrer" size="lg">
          <ExternalLink size={16} className="mr-2" />
          Apply Now
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => onToggleSave(job)}
          aria-pressed={!!isSaved}
        >
          <Bookmark
            size={16}
            className={`mr-2 ${isSaved ? 'fill-current text-blue-600' : ''}`}
          />
          {isSaved ? 'Saved' : 'Save Job'}
        </Button>
      </div>

      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
        <h4 className="font-semibold">Job Description</h4>
        <p>{desc}</p>
      </div>
    </motion.div>
  );
};

/* =========================
   SKELETON
========================= */
const SkeletonLoader = () => (
  <div className="p-4 space-y-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

/* =========================
   MAIN PAGE
========================= */
const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('Software Developer in India');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Saved jobs: store map of id -> job object for persistence & offline viewing
  const [savedMap, setSavedMap] = useState(() => {
    try {
      const raw = localStorage.getItem('savedJobsMap');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Tab: All vs Saved
  const [tab, setTab] = useState('all'); // 'all' | 'saved'

  const { token } = useAuth() || {};
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();

  const safeJobId = (job, idx) => job?.job_id ?? job?.id ?? `idx-${idx}`;

  const fetchJobs = useCallback(
    async (page = 1, signal) => {
      setLoading(true);
      setError(null);
      try {
        const config = {
          params: { query: searchQuery, page },
          signal,
        };
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }
        const { data } = await api.get('/jobs/search', config);

        const list = Array.isArray(data?.data) ? data.data : [];
        setJobs(list);

        const tp =
          Number(data?.totalPages) ||
          Number(data?.meta?.totalPages) ||
          (data?.data?.length ? 10 : 1);
        setTotalPages(isFinite(tp) && tp > 0 ? tp : 1);

        setCurrentPage(page);

        // Auto-select first job on fresh search
        if (list.length > 0 && page === 1) {
          setSelectedJob(list[0]);
        } else if (list.length === 0) {
          setSelectedJob(null);
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError('Failed to fetch jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, token]
  );

  // Initial load
  useEffect(() => {
    const controller = new AbortController();
    fetchJobs(1, controller.signal);
    return () => controller.abort();
  }, [fetchJobs]);

  // Persist saved map
  useEffect(() => {
    try {
      localStorage.setItem('savedJobsMap', JSON.stringify(savedMap));
    } catch {}
  }, [savedMap]);

  const handleSearch = (e) => {
    e?.preventDefault?.();
    setCurrentPage(1);
    const controller = new AbortController();
    fetchJobs(1, controller.signal);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      const controller = new AbortController();
      fetchJobs(newPage, controller.signal);
    }
  };

  const isSaved = (job) => {
    if (!job) return false;
    const key = job.job_id ?? job.id;
    return key ? !!savedMap[key] : false;
  };

  const toggleSave = (job) => {
    if (!job) return;
    const key = job.job_id ?? job.id;
    if (!key) return;
    setSavedMap((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = job;
      return next;
    });
  };

  const savedList = useMemo(() => Object.values(savedMap), [savedMap]);

  const displayedJobs = useMemo(() => {
    if (tab === 'saved') return savedList;
    return jobs;
  }, [tab, jobs, savedList]);

  // Keep selection consistent when switching tabs
  useEffect(() => {
    if (!selectedJob) return;
    const exists =
      tab === 'saved'
        ? savedList.some((j) => (j.job_id ?? j.id) === (selectedJob.job_id ?? selectedJob.id))
        : jobs.some((j) => (j.job_id ?? j.id) === (selectedJob.job_id ?? selectedJob.id));
    if (!exists) {
      // Pick first available
      if (displayedJobs.length > 0) setSelectedJob(displayedJobs[0]);
      else setSelectedJob(null);
    }
  }, [tab, displayedJobs, jobs, savedList, selectedJob]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* HEADER */}
      <header className="flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/dashboard')}
            className="!p-2 sm:!px-3"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline ml-2">Dashboard</span>
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Job Finder
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented control: All / Saved */}
          <div className="hidden sm:flex items-center rounded-xl border border-slate-200 dark:border-slate-800 p-1 bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setTab('all')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                tab === 'all'
                  ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTab('saved')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
                tab === 'saved'
                  ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Bookmark size={16} className="mr-1.5" />
              Saved
            </button>
          </div>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-[420px_1fr] min-h-0 overflow-hidden">
        {/* LEFT: LIST */}
        <div className="flex flex-col h-full border-r border-slate-200 dark:border-slate-800 min-h-0">
          {/* Search + Tabs (sticky) */}
          <div className="p-3 sm:p-4 sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by title, keywords, location…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
            </form>

            {/* Mobile tabs */}
            <div className="mt-3 flex sm:hidden gap-2">
              <Button
                variant={tab === 'all' ? 'primary' : 'outline'}
                size="md"
                className="flex-1"
                onClick={() => setTab('all')}
              >
                All
              </Button>
              <Button
                variant={tab === 'saved' ? 'primary' : 'outline'}
                size="md"
                className="flex-1"
                onClick={() => setTab('saved')}
              >
                <Bookmark size={16} className="mr-2" />
                Saved
              </Button>
            </div>
          </div>

          {/* List */}
          <div className="flex-grow overflow-y-auto px-2 sm:px-3 min-h-0">
            {loading && <SkeletonLoader />}
            {error && <div className="p-4 text-center text-red-500">{error}</div>}

            {!loading && !error && displayedJobs.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                {tab === 'saved' ? 'No saved jobs yet.' : 'No jobs found.'}
              </div>
            )}

            {!loading &&
              !error &&
              displayedJobs.map((job, idx) => {
                const key = safeJobId(job, idx);
                return (
                  <JobCard
                    key={key}
                    job={job}
                    onClick={() => setSelectedJob(job)}
                    isSelected={(selectedJob?.job_id ?? selectedJob?.id) === (job?.job_id ?? job?.id)}
                    isSaved={isSaved(job)}
                  />
                );
              })}
          </div>

          {/* Pagination (hidden on Saved tab) */}
          {tab === 'all' && (
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex justify-center sticky bottom-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">Page {currentPage}</span>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: DETAILS */}
        <div className="h-full min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedJob ? (
              <JobDetails
                key={selectedJob?.job_id ?? selectedJob?.id ?? 'details'}
                job={selectedJob}
                onBack={() => setSelectedJob(null)}
                onToggleSave={toggleSave}
                isSaved={isSaved(selectedJob)}
              />
            ) : (
              !loading && (
                <div className="flex flex-col h-full items-center justify-center p-8 text-slate-500">
                  <Briefcase size={48} className="mx-auto text-slate-400" />
                  <p className="mt-3 text-center max-w-sm">
                    {tab === 'saved'
                      ? 'Open a saved job from the list to view details.'
                      : 'Select a job from the list to see details.'}
                  </p>
                </div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
