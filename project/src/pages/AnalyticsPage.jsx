import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Briefcase, 
  Award,
  ArrowUp,
  ArrowDown,
  CalendarCheck2,
  ArrowLeft,
  Sun,
  Moon,
  Loader2,
  CheckCircle,
  AlertCircle,
  Wrench
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  PieChart, 
  Pie, 
  Cell, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// --- API Configuration ---
const api = axios.create({
  baseURL: 'http://backend:3000/api',
});
const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#6b7280'];

// --- Custom Hook for Theme Management ---
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  return [theme, toggleTheme];
};

// --- Reusable Components ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="label text-sm font-bold text-slate-800 dark:text-slate-200">{`${label}`}</p>
        {payload.map((pld, index) => (
          <p key={index} style={{ color: pld.color }} className="text-xs">{`${pld.name}: ${pld.value}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Main Analytics Page Component ---
const AnalyticsPage = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();
  const { token } = useAuth();

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#6b7280'];

  // Fetch all resumes on component mount
  useEffect(() => {
    const fetchResumes = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const { data } = await api.get('/resumes', { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                setResumes(data.resumes);
            }
        } catch (err) {
            setError("Failed to fetch your resume data.");
        } finally {
            setLoading(false);
        }
    };
    fetchResumes();
  }, [token]);

  // Process data whenever resumes or the selected filter changes
  useEffect(() => {
    if (resumes.length === 0) return;

    const processData = () => {
        const targetResumes = selectedResumeId === 'all' 
            ? resumes 
            : resumes.filter(r => r._id === selectedResumeId);

        if (targetResumes.length === 0) return;

        // --- Calculate Key Metrics ---
        const avgAtsScore = targetResumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / targetResumes.length;
        const topPredictedRole = targetResumes[0]?.analyticsData?.bert_result?.predicted_label || 'N/A';

        const keyMetrics = [
            { title: 'Average ATS Score', value: `${Math.round(avgAtsScore)}%`, icon: Target, color: 'text-indigo-500' },
            { title: 'Top Predicted Role', value: topPredictedRole.replace(/_/g, ' '), icon: Award, color: 'text-green-500' },
        ];

        // --- Aggregate Top Skills ---
        const skillsCount = {};
        targetResumes.forEach(r => {
            const skills = r.analyticsData?.ner_result?.Skills;
            if (skills) {
                // Simple cleaning: join and split by common delimiters, filter out short words
                const cleanedSkills = skills.join(' ').split(/[\s,:]+/).filter(s => s.length > 1 && !'()-'.includes(s));
                cleanedSkills.forEach(skill => {
                    const s = skill.toLowerCase();
                    skillsCount[s] = (skillsCount[s] || 0) + 1;
                });
            }
        });
        const topSkills = Object.entries(skillsCount).sort(([,a],[,b]) => b-a).slice(0, 5).map(([name, count]) => ({ name, count }));

        // --- Aggregate Predicted Roles ---
        const roleDistribution = {};
        targetResumes.forEach(r => {
            const probabilities = r.analyticsData?.bert_result?.all_probabilities;
            if (probabilities) {
                for (const [role, prob] of Object.entries(probabilities)) {
                    if (!roleDistribution[role]) {
                        roleDistribution[role] = 0;
                    }
                    roleDistribution[role] += prob;
                }
            }
        });

        const topRoles = Object.entries(roleDistribution)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, value]) => ({ name: name.replace(/_/g, ' '), value: parseFloat((value * 100 / targetResumes.length).toFixed(2)) }));
        
        // --- Aggregate Missing Fields ---
        const missingFieldsCount = {};
        targetResumes.forEach(r => {
            const missing = r.analyticsData?.ats_result?.missing_fields;
            if (missing) {
                missing.forEach(field => {
                    missingFieldsCount[field] = (missingFieldsCount[field] || 0) + 1;
                });
            }
        });
        const commonMissingFields = Object.entries(missingFieldsCount).sort(([,a],[,b]) => b-a).slice(0, 4).map(([name]) => name);

        setAnalyticsData({
            keyMetrics,
            topSkills,
            topRoles,
            commonMissingFields
        });
    };

    processData();
  }, [resumes, selectedResumeId]);

  if (loading) {
      return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
  }
  if (error) {
      return <div className="p-8 text-center text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <div className="space-y-8 p-4 sm:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="md" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Dashboard
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Performance Analytics</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">AI-powered insights from your resumes.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <select value={selectedResumeId} onChange={(e) => setSelectedResumeId(e.target.value)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">All Resumes</option>
                        {resumes.map(r => <option key={r._id} value={r._id}>{r.ResumeTitle}</option>)}
                    </select>
                    <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </header>

            {analyticsData ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {analyticsData.keyMetrics.map((metric, index) => (
                        <motion.div key={metric.title} variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: index * 0.1, duration: 0.5 }}>
                            <Card className="p-5 dark:bg-slate-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-3 rounded-full bg-slate-100 dark:bg-slate-700 ${metric.color}`}><metric.icon size={22} /></div>
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{metric.title}</p>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2 truncate">{metric.value}</p>
                            </Card>
                        </motion.div>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4, duration: 0.5 }}>
                            <Card className="p-6 dark:bg-slate-800">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Top Detected Skills</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={analyticsData.topSkills} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={80} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" name="Frequency" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </motion.div>

                        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.5, duration: 0.5 }}>
                            <Card className="p-6 h-full dark:bg-slate-800">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Predicted Role Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={analyticsData.topRoles} cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#8884d8" paddingAngle={5} dataKey="value" nameKey="name">
                                    {analyticsData.topRoles.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                                </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </motion.div>
                        
                        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.6, duration: 0.5 }} className="lg:col-span-2">
                            <Card className="p-6 h-full dark:bg-slate-800">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Actionable Insights</h3>
                                <div className="space-y-4">
                                    {analyticsData.commonMissingFields.length > 0 ? analyticsData.commonMissingFields.map((field) => (
                                        <div key={field} className="flex items-start gap-4 p-4 rounded-lg bg-slate-100/70 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-700">
                                            <div className="flex-shrink-0 p-2 rounded-full bg-orange-200 text-orange-700"><AlertCircle size={20} /></div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800 dark:text-white">Missing Section: {field}</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-300">Your resume(s) are missing a '{field}' section. Adding this can significantly improve completeness.</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-green-100/70 dark:bg-green-700/50 border border-green-200/80 dark:border-green-700">
                                            <div className="flex-shrink-0 p-2 rounded-full bg-green-200 text-green-700"><CheckCircle size={20} /></div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800 dark:text-white">Great Job!</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-300">Your resumes are well-structured with all key information present.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </motion.div>

                    </div>
                </>
            ) : (
                <div className="text-center p-8 text-slate-500">No data to display. Please upload a resume to see your analytics.</div>
            )}
        </div>
    </div>
  );
};

export default AnalyticsPage;
