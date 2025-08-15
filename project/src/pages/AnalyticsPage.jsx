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
  Moon
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
  AreaChart,
  Area
} from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

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


// --- Data (can be fetched from an API) ---
const keyMetrics = [
  { title: 'Applications Sent', value: '47', change: '+12%', trend: 'up', icon: Briefcase, color: 'text-blue-500' },
  { title: 'Interview Rate', value: '23%', change: '+5%', trend: 'up', icon: Users, color: 'text-green-500' },
  { title: 'Average ATS Score', value: '89%', change: '+8%', trend: 'up', icon: Target, color: 'text-indigo-500' },
  { title: 'Active Applications', value: '14', change: '-3', trend: 'down', icon: CalendarCheck2, color: 'text-orange-500' }
];

const combinedChartData = [
  { month: 'Jan', applications: 8, interviews: 2, atsScore: 75 },
  { month: 'Feb', applications: 12, interviews: 3, atsScore: 78 },
  { month: 'Mar', applications: 15, interviews: 4, atsScore: 82 },
  { month: 'Apr', applications: 18, interviews: 5, atsScore: 85 },
  { month: 'May', applications: 22, interviews: 8, atsScore: 89 },
];

const industryData = [
  { name: 'Technology', value: 45 },
  { name: 'Finance', value: 25 },
  { name: 'Healthcare', value: 15 },
  { name: 'Education', value: 10 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#6b7280'];

const insights = [
  { title: 'Strong ATS Performance', description: 'Your average score of 89% is in the top 10% of candidates. Great work!', type: 'success', icon: Award },
  { title: 'Interview Rate Improving', description: 'Your interview rate increased by 5% this month. Keep optimizing!', type: 'success', icon: TrendingUp },
  { title: 'Focus on Tech Industry', description: 'You\'re getting the best response from technology companies. Consider expanding your search here.', type: 'info', icon: Target }
];

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <div className="space-y-8 p-4 sm:p-8">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="md" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Dashboard
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Performance Analytics</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your job search progress and optimize your strategy.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <select className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Last 3 months</option>
                        <option>Last 6 months</option>
                        <option>This Year</option>
                    </select>
                    <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </header>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {keyMetrics.map((metric, index) => (
                <motion.div
                    key={metric.title}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                    <Card className="p-5 dark:bg-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-full bg-slate-100 dark:bg-slate-700 ${metric.color}`}>
                            <metric.icon size={22} />
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{metric.title}</p>
                        </div>
                        <div className={`flex items-center text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        <span>{metric.change}</span>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{metric.value}</p>
                    </Card>
                </motion.div>
                ))}
            </div>
            
            {/* 2x2 Grid for Detailed Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ATS Score Trend */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4, duration: 0.5 }}>
                <Card className="p-6 dark:bg-slate-800">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">ATS Score Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={combinedChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                        <linearGradient id="colorAts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey="month" tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                        <YAxis tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }} domain={[70, 'dataMax + 5']} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="atsScore" name="ATS Score" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorAts)" />
                    </AreaChart>
                    </ResponsiveContainer>
                </Card>
                </motion.div>

                {/* Applications vs Interviews */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.5, duration: 0.5 }}>
                <Card className="p-6 dark:bg-slate-800">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Applications vs Interviews</h3>
                    <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={combinedChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey="month" tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                        <YAxis tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                        <Bar dataKey="applications" name="Applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="interviews" name="Interviews" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </Card>
                </motion.div>

                {/* Industry Distribution */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.6, duration: 0.5 }}>
                <Card className="p-6 h-full dark:bg-slate-800">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Industry Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={industryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" nameKey="name">
                        {industryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                    {industryData.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">{item.value}%</span>
                        </div>
                    ))}
                    </div>
                </Card>
                </motion.div>

                {/* Insights & Recommendations */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.7, duration: 0.5 }}>
                <Card className="p-6 h-full dark:bg-slate-800">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Insights & Recommendations</h3>
                    <div className="space-y-4">
                    {insights.map((insight) => (
                        <div key={insight.title} className="flex items-start gap-4 p-4 rounded-lg bg-slate-100/70 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-700">
                        <div className={`flex-shrink-0 p-2 rounded-full ${insight.type === 'success' ? 'bg-green-200 text-green-700' : 'bg-blue-200 text-blue-700'}`}>
                            <insight.icon size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-white">{insight.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{insight.description}</p>
                        </div>
                        </div>
                    ))}
                    </div>
                </Card>
                </motion.div>
            </div>
        </div>
    </div>
  );
};

export default AnalyticsPage;
