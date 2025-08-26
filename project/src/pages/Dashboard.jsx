import React, { useState, useEffect, useRef } from 'react';
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
  UploadCloud,
  Loader2,
  RefreshCw, // Icon for update button
  Save, // Icon for save button
  LifeBuoy
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// --- API Configuration ---
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
});

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

// --- Helper Function to get Cloudinary Thumbnail ---
const getThumbnailUrl = (cloudinaryPath) => {
  if (!cloudinaryPath || !cloudinaryPath.includes('cloudinary.com')) {
    return null;
  }
  return cloudinaryPath.replace(/\.(pdf|docx|doc)$/i, '.jpg').replace('/upload/', '/upload/w_400,pg_1,f_auto,q_auto/');
};


// --- Reusable Components ---
const ResumeCard = ({ resume, onSelect, onDelete }) => {
  const [hasError, setHasError] = useState(false);
  const thumbnailUrl = getThumbnailUrl(resume.cloudinaryPath);

  useEffect(() => {
    setHasError(false);
  }, [resume.cloudinaryPath]);

  return (
    <motion.div
      layoutId={`resume-card-${resume._id}`}
      onClick={() => onSelect(resume)}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow overflow-hidden group flex flex-col h-80"
      whileHover={{ y: -5 }}
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{resume.ResumeTitle}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
        </p>
      </div>
      
      <div className="flex-grow relative bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
        {thumbnailUrl && !hasError ? (
          <img 
            src={thumbnailUrl} 
            alt={`Preview of ${resume.ResumeTitle}`}
            className="w-full h-full object-cover object-top"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-600">
              <FileText size={48} />
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{resume.atsScore}% ATS Score</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(resume._id); }}
          className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

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

const Sidebar = ({ items, brandName = "ResumeAI", user, isOpen, setIsOpen, onBackClick, theme, toggleTheme,resumeId }) => {
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
                    {items.map((item) => {
  let newItem = { ...item };
  let isActive = false;

  if (item.path === '/resume/ask-ai/:resumeId') {
    newItem.path = `/resume/ask-ai/${resumeId}`;
    isActive = location.pathname.startsWith(`/resume/ask-ai/${resumeId}`);
  } 
  else if (item.path === '/resume/jobs') {
    newItem.path = `/resume/jobs/${resumeId}`;
    isActive = location.pathname.startsWith(`/resume/jobs/${resumeId}`);
  } 
  else {
    isActive = location.pathname === item.path;
  }

  return (
    <SidebarButton key={item.label} item={newItem} isActive={isActive} />
  );
})}

                        
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
  const { user, token } = useAuth();
  const [theme, toggleTheme] = useTheme();
  const updateFileRef = useRef(null);
  
  // --- State Management ---
  const [resumes, setResumes] = useState([]);
  const [view, setView] = useState('grid');
  const [selectedResume, setSelectedResume] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  
  // States for creating a new resume
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [newResumeFile, setNewResumeFile] = useState(null);
  
  // States for updating an existing resume
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedFile, setUpdatedFile] = useState(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- Data Fetching ---
  const fetchResumes = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/resumes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setResumes(response.data.resumes);
      }
    } catch (err) {
      setError('Failed to fetch resumes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchResumes();
  }, [token]);


  // --- Event Handlers ---
  const handleDeleteResume = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
        try {
            await api.delete(`/resumes/${resumeId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setResumes(prev => prev.filter(resume => resume._id !== resumeId));
        } catch (err) {
            alert('Failed to delete resume.');
        }
    }
  };
  
  const handleAddResume = async (e) => {
    e.preventDefault();
    if (!newResumeTitle.trim() || !newResumeFile) return;
    
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('title', newResumeTitle);
    formData.append('resume', newResumeFile);

    console.log(token)
    try {
        const response = await api.post('/resumes/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
            setResumes(prev => [response.data.resume, ...prev]);
            setNewResumeTitle('');
            setNewResumeFile(null);
            setView('grid');
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Upload failed.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleUpdateResume = async () => {
    if (!selectedResume) return;

    const hasTitleChanged = updatedTitle.trim() !== selectedResume.ResumeTitle;
    const hasFileChanged = updatedFile !== null;

    if (!hasTitleChanged && !hasFileChanged) {
        alert("No changes to save.");
        return;
    }

    setIsUpdating(true);
    const formData = new FormData();
    if (hasTitleChanged) {
        formData.append('title', updatedTitle.trim());
    }
    if (hasFileChanged) {
        formData.append('resume', updatedFile);
    }

    try {
        // Set loading state BEFORE updating the resume state
        if (hasFileChanged) {
            setIsPreviewLoading(true);
        }

        const response = await api.put(`/resumes/${selectedResume._id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
            const updatedResume = response.data.resume;
            setSelectedResume(updatedResume);
            setResumes(prev => prev.map(r => r._id === updatedResume._id ? updatedResume : r));
            setUpdatedFile(null); // Reset file state after successful upload
            alert("Resume updated successfully!");
        }
    } catch (err) {
        alert(err.response?.data?.message || 'Update failed.');
        // If the update failed, we should turn off the preview loader
        if (hasFileChanged) {
            setIsPreviewLoading(false);
        }
    } finally {
        setIsUpdating(false);
    }
  };

  const handleSelectResume = (resume) => {
    console.log(resume)
    setSelectedResume(resume);
    setUpdatedTitle(resume.ResumeTitle);
    setUpdatedFile(null);
    setIsPreviewLoading(true);
    setView('detail');
  };

  const handleBackToGrid = () => {
    setView('grid');
    setTimeout(() => setSelectedResume(null), 300);
  };
  
  // --- Sidebar Configuration ---
  const mainSidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: LifeBuoy, label: 'Support', path: '/support' }, // Added Support
  ];
  
  const detailSidebarItems = [
    { icon: Briefcase, label: 'Job Finder', path: '/resume/jobs' },
    { icon: BrainCircuit, label: 'Ask AI', path: '/resume/ask-ai/:resumeId' },
  ];
  
  // --- Animation Variants ---
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };
  const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

  const hasChangesToSave = selectedResume && (updatedTitle.trim() !== selectedResume.ResumeTitle || updatedFile !== null);

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      <Sidebar 
        key={view}
        items={view === 'detail' ? detailSidebarItems : mainSidebarItems} 
        resumeId= {selectedResume ? selectedResume._id : null}
        brandName={view === 'detail' && selectedResume ? selectedResume.ResumeTitle : "SkillSnap"}
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
                view === 'grid' ? `Welcome back, ${user?.username || 'Guest'}!` :
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
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64"> <Loader2 className="animate-spin text-indigo-600" size={48} /> </div>
                  ) : error ? (
                    <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</div>
                  ) : resumes.length === 0 ? (
                    <div className="text-center text-slate-500 dark:text-slate-400 p-8"> <p>No resumes found. Click the '+' button to add your first one!</p> </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {resumes.map(resume => ( <ResumeCard key={resume._id} resume={resume} onSelect={handleSelectResume} onDelete={handleDeleteResume} /> ))}
                    </div>
                  )}
                  <button onClick={() => setView('add')} className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-indigo-700 hover:scale-110 transition-all z-20" aria-label="Add New Resume"><Plus size={28} /></button>
                </div>
              )}

              {view === 'detail' && selectedResume && (
                <motion.div key="detail" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 sm:p-8 max-w-8xl mx-auto">
                         <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    value={updatedTitle}
                                    onChange={(e) => setUpdatedTitle(e.target.value)}
                                    className="w-full text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 bg-transparent border-b-2 border-transparent focus:border-indigo-500 outline-none transition duration-300 ease-in-out mb-2"
                                />
                                <p className="text-slate-500 dark:text-slate-400">ATS Score: {selectedResume.atsScore}%</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <input
                                    type="file"
                                    ref={updateFileRef}
                                    onChange={(e) => setUpdatedFile(e.target.files[0])}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                />
                                <button 
                                    onClick={() => updateFileRef.current.click()}
                                    disabled={isUpdating}
                                    className="w-full sm:w-auto px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={16} />
                                    <span className="truncate max-w-xs">{updatedFile ? updatedFile.name : 'Change File'}</span>
                                </button>
                                <button 
                                    onClick={handleUpdateResume}
                                    disabled={!hasChangesToSave || isUpdating}
                                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUpdating ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                         </div>
                        <div className="w-full h-[70vh] bg-slate-50 dark:bg-slate-900/50 rounded-md border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center mt-6 relative">
                            {isPreviewLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 z-10">
                                    <Loader2 className="animate-spin text-indigo-500" size={40} />
                                    <p className="mt-4 text-slate-500 dark:text-slate-400">Loading Preview...</p>
                                </div>
                            )}
                            <iframe
                                // The key is crucial for forcing a reload when the URL changes
                                key={selectedResume.cloudinaryPath + selectedResume.updatedAt}
                                src={selectedResume.cloudinaryPath}
                                className={`w-full h-full rounded-md transition-opacity duration-500 ${isPreviewLoading ? 'opacity-0' : 'opacity-100'}`}
                                title={selectedResume.ResumeTitle}
                                onLoad={() => setIsPreviewLoading(false)}
                                onError={() => setIsPreviewLoading(false)}
                            >
                                Your browser does not support PDFs. Please download the PDF to view it.
                            </iframe>
                        </div>
                    </div>
                </motion.div>
              )}

              {view === 'add' && (
                <motion.div key="add" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} className="max-w-3xl mx-auto">
                  <form onSubmit={handleAddResume} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg space-y-6">
                    {error && <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</div>}
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
                              <span>{newResumeFile ? newResumeFile.name : 'Upload a file'}</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setNewResumeFile(e.target.files[0])} accept=".pdf,.doc,.docx" />
                            </label>
                            {!newResumeFile && <p className="pl-1">or drag and drop</p>}
                          </div>
                          <p className="text-xs leading-5 text-slate-500 dark:text-slate-500">PDF, DOCX up to 10MB</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                      <button type="button" onClick={() => setView('grid')} className="px-6 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition" disabled={isSubmitting}>Cancel</button>
                      <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                        {isSubmitting ? 'Saving...' : 'Save Resume'}
                      </button>
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
