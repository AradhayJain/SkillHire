import React, { useState } from 'react';
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
  Send,
  UploadCloud
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Enhanced Resume Card Component (No changes needed here)
const ResumeCard = ({ resume, onSelect, onDelete }) => {
  return (
    <motion.div
      layoutId={`resume-card-${resume.id}`}
      onClick={() => onSelect(resume)}
      className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow overflow-hidden group"
    >
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800 truncate">{resume.title}</h3>
        <p className="text-xs text-slate-500">Last updated: {resume.lastUpdated}</p>
      </div>
      <div className="p-4 flex-grow flex flex-col items-center justify-center text-slate-300">
        <FileText size={48} />
      </div>
      <div className="p-3 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Target size={14} className="text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">{resume.atsScore}% ATS Score</span>
        </div>
        <button 
          onClick={(e) => {
              e.stopPropagation();
              onDelete(resume.id);
          }}
          className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// Sidebar Component (No changes needed here)
const Sidebar = ({ items, brandName="ResumeAI" }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="w-60 bg-slate-800 text-slate-300 p-6 flex flex-col flex-shrink-0">
            <div className="flex items-center gap-3 mb-10">
                <BrainCircuit size={32} className="text-indigo-400"/>
                <span className="text-xl font-bold text-white">{brandName}</span>
            </div>
            <nav className="flex flex-col space-y-2">
                {items.map(item => (
                  <button 
                    key={item.label} 
                    onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors text-sm font-medium
                        ${location.pathname === item.path 
                            ? 'bg-slate-900 text-white' 
                            : 'hover:bg-slate-700 hover:text-white'
                        }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
            </nav>
        </aside>
    );
}

// Main Dashboard Component
const Dashboard = () => {
  const [resumes, setResumes] = useState([
    { id: 1, title: 'Senior Software Engineer', lastUpdated: '2 days ago', atsScore: 92 },
    { id: 2, title: 'Lead Product Manager', lastUpdated: '1 week ago', atsScore: 85 },
    { id: 3, title: 'UX/UI Designer v2', lastUpdated: '3 hours ago', atsScore: 88 },
  ]);
  
  const [view, setView] = useState('grid'); // 'grid', 'detail', 'add'
  const [selectedResume, setSelectedResume] = useState(null);
  const [newResumeTitle, setNewResumeTitle] = useState('');

  // --- Handlers ---
  const handleDeleteResume = (id) => {
    setResumes(prev => prev.filter(resume => resume.id !== id));
  };
  
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
  
  // --- Sidebar Configurations ---
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
    { icon: BarChart2, label: 'Analytics', path: '/resume/analytics' },
    { icon: Send, label: 'Applied Jobs', path: '/resume/applied-jobs' },
  ];
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* --- CONDITIONAL SIDEBAR LOGIC --- */}
      {view === 'grid' && <Sidebar items={mainSidebarItems} />}
      {view === 'detail' && selectedResume && <Sidebar items={detailSidebarItems} brandName={selectedResume.title} />}
      {/* No sidebar is rendered for the 'add' view */}
      
      <main className="flex-1 p-8 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          {view === 'grid' && (
            <motion.div
              key="grid"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
            >
              <h1 className="text-3xl font-bold text-slate-800 mb-6">Your Resumes</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {resumes.map(resume => (
                  <ResumeCard 
                    key={resume.id} 
                    resume={resume}
                    onSelect={handleSelectResume}
                    onDelete={handleDeleteResume}
                  />
                ))}
              </div>
              <button 
                onClick={() => setView('add')}
                className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-indigo-700 hover:scale-110 transition-all"
                aria-label="Add New Resume"
              >
                <Plus size={28} />
              </button>
            </motion.div>
          )}

          {view === 'detail' && selectedResume && (
            <motion.div
              key="detail"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
            >
                <button 
                    onClick={handleBackToGrid} 
                    className="absolute top-8 right-8 flex items-center px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Dashboard
                </button>
                <motion.div layoutId={`resume-card-${selectedResume.id}`} className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto mt-4">
                     <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">{selectedResume.title}</h1>
                            <p className="text-slate-500 mb-6">ATS Score: {selectedResume.atsScore}%</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-lg font-semibold text-slate-700 mb-4">Update Resume</h2>
                            <button className="w-full px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors">
                                UPDATE
                            </button>
                        </div>
                     </div>
                    <div className="w-full h-[60vh] bg-slate-50 rounded-md border-2 border-dashed flex items-center justify-center mt-4">
                        <p className="text-slate-400">Full resume preview would appear here.</p>
                    </div>
                </motion.div>
            </motion.div>
          )}

          {view === 'add' && (
            <motion.div
              key="add"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
              className="max-w-3xl mx-auto"
            >
              <h1 className="text-3xl font-bold text-slate-800 mb-6">Add New Resume</h1>
              <form onSubmit={handleAddResume} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                <div>
                  <label htmlFor="resumeTitle" className="block text-sm font-medium text-slate-700 mb-1">Resume Title</label>
                  <input 
                    type="text"
                    id="resumeTitle"
                    value={newResumeTitle}
                    onChange={(e) => setNewResumeTitle(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Upload File</label>
                  <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-10">
                    <div className="text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="mt-4 flex text-sm leading-6 text-slate-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-slate-500">PDF, DOCX up to 10MB</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setView('grid')} className="px-6 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
                    Save Resume
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;