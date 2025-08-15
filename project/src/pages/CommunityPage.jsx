import {React, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  Search,
  FileText,
  ArrowUp,
  ArrowDown,
  User,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

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
const PostCard = ({ post, onVote }) => (
  <Card className="flex gap-4 p-4 mb-4 dark:bg-slate-800">
    <div className="flex flex-col items-center bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg">
      <button onClick={() => onVote(post.id, 'up')} className={`p-1 rounded ${post.userVote === 'up' ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/50' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
        <ArrowUp size={18} />
      </button>
      <span className="text-sm font-bold my-1 text-slate-800 dark:text-slate-200">{post.votes}</span>
      <button onClick={() => onVote(post.id, 'down')} className={`p-1 rounded ${post.userVote === 'down' ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/50' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
        <ArrowDown size={18} />
      </button>
    </div>
    <div className="flex-1">
      <div className="flex items-center space-x-3 mb-2">
        <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full object-cover"/>
        <p className="text-xs text-slate-500 dark:text-slate-400">Posted by <span className="font-medium text-slate-700 dark:text-slate-300">{post.author}</span> • {post.postedAt}</p>
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 hover:text-blue-600 cursor-pointer">{post.title}</h2>
      <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">{post.content}</p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => <Badge key={tag} variant="outline" size="sm">{tag}</Badge>)}
      </div>
    </div>
  </Card>
);

const UserProfileCard = ({ user, onConnect }) => (
    <Card className="p-5 text-center transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-slate-800">
        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover mb-4 mx-auto border-4 border-white dark:border-slate-700 shadow-lg"/>
        <h3 className="font-bold text-lg text-slate-800 dark:text-white">{user.name}</h3>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{user.role}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{user.company}</p>
        <Button variant="outline" className="w-full" onClick={() => onConnect(user.id)}>
            <MessageSquare size={16} className="mr-2"/>
            Connect
        </Button>
    </Card>
);

// --- Main Community Page Component ---
const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('resumes');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postSearch, setPostSearch] = useState('');
  const [peopleSearch, setPeopleSearch] = useState('');
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();

  const [posts, setPosts] = useState([
      { id: 1, author: 'Sarah Chen', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100', postedAt: '2h ago', title: 'FAANG-ready Frontend Resume Template', content: 'Sharing my template that focuses on quantified achievements...', tags: ['Template', 'Frontend'], votes: 127, userVote: 'up' },
      { id: 2, author: 'Michael Rodriguez', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', postedAt: '5h ago', title: 'How I Boosted My ATS Score to 95%', content: 'Here are the 5 key strategies I used to transform my resume...', tags: ['ATS', 'Tips'], votes: 89, userVote: null },
      { id: 3, author: 'Emily Johnson', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', postedAt: '1d ago', title: 'Critique my first React developer resume?', content: 'Bootcamp grad looking for feedback. Any advice is welcome!', tags: ['Review', 'React'], votes: 45, userVote: null },
  ]);
  
  const users = [
      { id: 1, name: 'Jonathan Lee', role: 'Senior Backend Engineer', company: 'Google', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' },
      { id: 2, name: 'Isabella Rossi', role: 'Lead UX Designer', company: 'Figma', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' },
      { id: 3, name: 'David Kim', role: 'Hiring Manager', company: 'Amazon', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100' },
      { id: 4, name: 'Maria Garcia', role: 'Recent Graduate', company: 'Northeastern University', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
  ];

  const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(postSearch.toLowerCase()));
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(peopleSearch.toLowerCase()) || u.role.toLowerCase().includes(peopleSearch.toLowerCase()));

  const handleVote = (postId, voteType) => {
    setPosts(posts.map(post => {
      if (post.id !== postId) return post;
      if (post.userVote === voteType) return { ...post, userVote: null, votes: post.votes + (voteType === 'up' ? -1 : 1) };
      let voteChange = voteType === 'up' ? 1 : -1;
      if (post.userVote) voteChange *= 2;
      return { ...post, userVote: voteType, votes: post.votes + voteChange };
    }));
  };

  const handleConnect = (userId) => navigate(`/community/chat/${userId}`);
  const handleCreatePost = () => setIsPostModalOpen(false);
  
  const TabButton = ({ label, tabName, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`relative flex-1 p-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2
        ${activeTab === tabName ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`
      }
    >
      <Icon size={18} />
      {label}
      {activeTab === tabName && (
        <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" layoutId="underline" />
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* New Header */}
      <header className="flex-shrink-0 bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="md" onClick={() => navigate('/dashboard')}>
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">Community Hub</h1>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
      </header>

      {/* Top Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
        <TabButton label="Explore Resumes" tabName="resumes" icon={FileText} />
        <TabButton label="Explore People" tabName="people" icon={User} />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'resumes' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
                <div className="lg:col-span-3 h-full">
                    {filteredPosts.map(post => <PostCard key={post.id} post={post} onVote={handleVote} />)}
                </div>
                <div className="lg:col-span-1 space-y-4">
                    <div className="relative">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search posts..." value={postSearch} onChange={(e) => setPostSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <Button onClick={() => setIsPostModalOpen(true)} className="w-full">
                        <Plus size={16} className="mr-2" /> Create Post
                    </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'people' && (
                <div>
                    <div className="relative max-w-lg mx-auto mb-8">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search by name, role, or company..." value={peopleSearch} onChange={(e) => setPeopleSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredUsers.map(user => <UserProfileCard key={user.id} user={user} onConnect={handleConnect} />)}
                    </div>
                </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Create Post Modal */}
      <Modal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} title="Create a New Post" size="lg">
        <div className="space-y-6">
          <Input label="Title" placeholder="An engaging title for your post" required />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
            <textarea placeholder="Share details, ask questions, or provide tips..." rows={5}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsPostModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePost}>Publish</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommunityPage;
