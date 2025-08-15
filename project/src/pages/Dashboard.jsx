import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  X,
  Plus,
  ArrowLeft,
  Briefcase,
  Target,
  BrainCircuit,
  BarChart2,
  Menu,
  LogOut,
  Sun,
  Moon,
  UploadCloud
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
const ResumeCard = ({ resume, onSelect, onDelete }) => (
  <motion.div
    layoutId={`resume-card-${resume.id}`}
    onClick={() => onSelect(resume)}
    className="bg-white dark:bg-slate-800 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow overflow-hidden group"
    whileHover={{ y: -5 }}
  >
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{resume.title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">Last updated: {resume.lastUpdated}</p>
    </div>
    <div className="p-4 flex-grow flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
      <FileText size={48} />
    </div>
    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Target size={14} className="text-indigo-600 dark:text-indigo-400" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{resume.atsScore}% ATS Score</span>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(resume.id); }}
        className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600"
      >
        <X size={16} />
      </button>
    </div>
  </motion.div>
);

const SidebarButton = ({ item, isActive, isBack = false }) => {
    const navigate = useNavigate();
    const baseClasses = "flex items-center space-x-3 w-full p-3 rounded-lg transition-colors text-sm font-medium";
    const activeClasses = "bg-slate-900 text-white";
    const inactiveClasses = "text-slate-300 hover:bg-slate-700 hover:text-white";
    const backClasses = "bg-slate-700 text-white hover:bg-slate-600";
    
    return (
        <button 
            onClick={() => isBack ? item.action() : navigate(item.path)}
            className={`${baseClasses} ${isBack ? backClasses : isActive ? activeClasses : inactiveClasses}`}
        >
            <item.icon size={20} />
            <span className="truncate">{item.label}</span>
        </button>
    );
};

const UserProfile = ({ user }) => (
    <div className="flex items-center gap-3">
        <img src={user?.pic || 'https://placehold.co/40x40/E2E8F0/475569?text=U'} alt="User" className="w-10 h-10 rounded-full object-cover" />
        <div>
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-slate-400">Free Plan</p>
        </div>
    </div>
);

const Sidebar = ({ items, brandName = "ResumeAI", user, isOpen, setIsOpen, onBackClick, theme, toggleTheme }) => {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const backButton = onBackClick ? [{ icon: ArrowLeft, label: 'Back to Resumes', action: onBackClick }] : [];

    return (
        <>
            <aside className={`fixed lg:relative z-40 inset-y-0 left-0 w-64 bg-slate-800 text-slate-300 p-4 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-between flex-shrink-0 mb-10">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <BrainCircuit size={32} className="text-indigo-400 flex-shrink-0"/>
                        <span className="text-xl font-bold text-white truncate">{brandName}</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <nav className="flex-1 flex flex-col space-y-2">
                    {onBackClick && <SidebarButton item={backButton[0]} isBack={true} />}
                    {items.map(item => <SidebarButton key={item.label} item={item} isActive={location.pathname.startsWith(item.path)} />)}
                </nav>

                <div className="p-2 border-t border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                         <UserProfile user={user} />
                         <button onClick={toggleTheme} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>
                    <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-3 rounded-lg transition-colors text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>}
        </>
    );
};

const Header = ({ title, subtitle, onMenuClick }) => (
    <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">{title}</h1>
            {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md bg-white dark:bg-slate-800 shadow-sm">
            <Menu size={24} />
        </button>
    </div>
);

// --- Main Dashboard Component ---
const Dashboard = () => {
  const { user } = useAuth();
  const [theme, toggleTheme] = useTheme();
  const [resumes, setResumes] = useState([
    { id: 1, title: 'Senior Software Engineer', lastUpdated: '2 days ago', atsScore: 92 },
    { id: 2, title: 'Lead Product Manager', lastUpdated: '1 week ago', atsScore: 85 },
    { id: 3, title: 'UX/UI Designer v2', lastUpdated: '3 hours ago', atsScore: 88 },
  ]);
  
  const [view, setView] = useState('grid');
  const [selectedResume, setSelectedResume] = useState(null);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDeleteResume = (id) => setResumes(prev => prev.filter(resume => resume.id !== id));
  
  const handleAddResume = (e) => {
    e.preventDefault();
    if (!newResumeTitle.trim()) return;
    const newId = resumes.length > 0 ? Math.max(...resumes.map(r => r.id)) + 1 : 1;
    const newResume = {
      id: newId,
      title: newResumeTitle,
      lastUpdated: 'Just now',
      atsScore: Math.floor(Math.random() * (95 - 70 + 1) + 70),
    };
    setResumes(prev => [newResume, ...prev]);
    setNewResumeTitle('');
    setView('grid');
  };

  const handleSelectResume = (resume) => {
    setSelectedResume(resume);
    setView('detail');
  };

  const handleBackToGrid = () => {
    setView('grid');
    setTimeout(() => setSelectedResume(null), 300);
  };
  
  const mainSidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  ];
  
  const detailSidebarItems = [
    { icon: FileText, label: 'Main', path: '/resume/main' },
    { icon: Briefcase, label: 'Job Finder', path: '/resume/jobs' },
    { icon: Target, label: 'ATS score', path: '/resume/ats-score' },
    { icon: BrainCircuit, label: 'Ask AI', path: '/resume/ask-ai' },
  ];
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      <Sidebar 
        key={view}
        items={view === 'detail' ? detailSidebarItems : mainSidebarItems} 
        brandName={view === 'detail' && selectedResume ? selectedResume.title : "SkillHire"}
        user={user}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onBackClick={view === 'detail' ? handleBackToGrid : null}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-1 p-4 sm:p-8 flex flex-col overflow-y-auto">
        <Header
            title={
                view === 'grid' ? `Welcome back, ${user?.name?.split(' ')[0] || 'Guest'}!` :
                view === 'detail' ? 'Resume Details' :
                'Add New Resume'
            }
            subtitle={view === 'grid' ? "Here's your resume dashboard." : null}
            onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {view === 'grid' && (
                <div key="grid" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {resumes.map(resume => (
                      <ResumeCard key={resume.id} resume={resume} onSelect={handleSelectResume} onDelete={handleDeleteResume} />
                    ))}
                  </div>
                  <button onClick={() => setView('add')} className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-indigo-700 hover:scale-110 transition-all z-20" aria-label="Add New Resume"><Plus size={28} /></button>
                </div>
              )}

              {view === 'detail' && selectedResume && (
                <motion.div key="detail" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 sm:p-8 max-w-4xl mx-auto">
                         <div className="flex flex-col sm:flex-row justify-between items-start">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">{selectedResume.title}</h1>
                                <p className="text-slate-500 dark:text-slate-400 mb-6">ATS Score: {selectedResume.atsScore}%</p>
                            </div>
                            <button className="w-full sm:w-auto mt-4 sm:mt-0 px-6 py-2 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-lg hover:bg-slate-700 dark:hover:bg-indigo-500 transition-colors">UPDATE</button>
                         </div>
                        <div className="w-full h-[50vh] sm:h-[60vh] bg-slate-50 dark:bg-slate-900/50 rounded-md border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center mt-4">
                            <p className="text-slate-400 dark:text-slate-500">Full resume preview would appear here.</p>
                        </div>
                    </div>
                </motion.div>
              )}

              {view === 'add' && (
                <motion.div key="add" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} className="max-w-3xl mx-auto">
                  <form onSubmit={handleAddResume} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg space-y-6">
                    <div>
                      <label htmlFor="resumeTitle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Resume Title</label>
                      <input type="text" id="resumeTitle" value={newResumeTitle} onChange={(e) => setNewResumeTitle(e.target.value)} placeholder="e.g., Senior Software Engineer"
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Upload File</label>
                      <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 px-6 py-10">
                        <div className="text-center">
                          <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                          <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-400 justify-center">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-indigo-600 dark:text-indigo-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 hover:text-indigo-500">
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-slate-500 dark:text-slate-500">PDF, DOCX up to 10MB</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                      <button type="button" onClick={() => setView('grid')} className="px-6 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition">Cancel</button>
                      <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">Save Resume</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
