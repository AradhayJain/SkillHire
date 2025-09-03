import React, { useState, useEffect } from 'react';
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
  Moon,
  Bookmark,
  Filter,
  X,
  Loader2,
  Paperclip,
  Target,
  MoreVertical, // <-- Add this
  Trash2, 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
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
// CommunityPage.js

// --- Reusable Components ---
const PostCard = ({ post, onVote, onSave, isSaved, onDelete, currentUser }) => {
  const [showOptions, setShowOptions] = useState(false);
  const thumbnailUrl = post.resumeId
    ? getThumbnailUrl(post.resumeId.cloudinaryPath)
    : null;

  const handleSaveClick = (e) => {
    e.stopPropagation(); // Prevent navigating if wrapped in a link
    onSave(post._id);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(post._id);
    setShowOptions(false); // Close menu after clicking
  };

  useEffect(()=>{
    console.log(isSaved);
    console.log(post);
  },[])

  const netScore = (post.upvotes.length || 0) - (post.downvotes.length || 0);
  const isOwner = currentUser && post.userId && currentUser._id === post.userId._id;

  return (
    <Card className="flex gap-4 p-4 mb-4 dark:bg-slate-800">
      {/* Vote buttons */}
      <div className="flex flex-col items-center bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg flex-shrink-0">
        <button
          onClick={() => onVote(post._id, "up")}
          className={`p-1 rounded ${
            post.userVote === "up"
              ? "text-blue-600 bg-blue-100 dark:bg-blue-900/50"
              : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          <ArrowUp size={18} />
        </button>
        <span className="text-sm font-bold my-1 text-slate-800 dark:text-slate-200">
          {netScore}
        </span>
        <button
          onClick={() => onVote(post._id, "down")}
          className={`p-1 rounded ${
            post.userVote === "down"
              ? "text-blue-600 bg-blue-100 dark:bg-blue-900/50"
              : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          <ArrowDown size={18} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3">
            <img
              src={post.userId?.pic}
              alt={post.userId?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Posted by{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {post.userId?.name}
              </span>{" "}
              • {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleSaveClick}
              className={`p-2 rounded-full transition-colors ${
                isSaved
                  ? "text-blue-600 bg-blue-100 dark:bg-blue-900/50"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
            </button>

            {/* NEW: More Options Button & Dropdown */}
            {isOwner && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(!showOptions);
                  }}
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <MoreVertical size={16} />
                </button>
                <AnimatePresence>
                  {showOptions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-md shadow-lg z-10"
                    >
                      <button
                        onClick={handleDeleteClick}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 size={14} />
                        Delete Post
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Post description */}
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
          {post.description}
        </p>

        {/* Post image */}
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg border dark:border-slate-700 max-h-72 w-auto my-2"
          />
        )}

        {/* Resume attachment */}
        {post.resumeId && (
          <a
            href={post.resumeId.cloudinaryPath}
            target="_blank"
            rel="noopener noreferrer"
            className="my-2 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex items-center gap-4 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="w-16 h-20 bg-slate-200 dark:bg-slate-600 rounded-md flex-shrink-0 overflow-hidden">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="Resume preview"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <FileText className="w-full h-full text-slate-400 p-4" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {post.resumeId.ResumeTitle}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                <Target size={14} />
                <span>{post.resumeId.atsScore}% ATS Score</span>
              </div>
            </div>
          </a>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};


const UserProfileCard = ({ user, onConnect }) => (
    <Card className="p-5 text-center transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-slate-800">
        <img src={user.pic} alt={user.name} className="w-24 h-24 rounded-full object-cover mb-4 mx-auto border-4 border-white dark:border-slate-700 shadow-lg"/>
        <h3 className="font-bold text-lg text-slate-800 dark:text-white">{user.name}</h3>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{user.Role}</p>
        <Button variant="outline" className="w-full mt-4" onClick={() => onConnect(user._id)}>
            <MessageSquare size={16} className="mr-2"/>
            Connect
        </Button>
    </Card>
);

// --- Main Community Page Component ---
const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('resumes');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [postSearch, setPostSearch] = useState('');
  const [peopleSearch, setPeopleSearch] = useState('');
  const [filters, setFilters] = useState({ tags: 'all', sort: 'newest', author: null,savedPosts:null });
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();
  const { user, token } = useAuth();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [userResumes, setUserResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);




  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (filters.tags && filters.tags !== 'all') params.append('tags', filters.tags);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.author) params.append('author', filters.author); // Add author to query
        if(filters.savedPosts) params.append('savedPosts',savedPosts);
        
        const { data } = await api.get(`/post/?${params.toString()}`,{
            headers: { Authorization: `Bearer ${token}` }
        });
        const enhancedPosts = data.posts.map(post => {
          let userVote = null;
          if (post.upvotes.some(id => id === user._id)) userVote = "up";
          if (post.downvotes.some(id => id === user._id)) userVote = "down";
          return { ...post, userVote };
        });
    
        setPosts(enhancedPosts);
        setAllPosts(enhancedPosts);
      } catch (err) {
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    const fetchUsers = async () => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get('/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data);
        } catch (err) {
            setError("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    if (activeTab === 'resumes') {
      fetchPosts();
    } else {
      fetchUsers();
    }
  }, [activeTab, filters, token]);

  useEffect(() => {
    const fetchUserResumes = async () => {
        if (!token) return;
        try {
            const { data } = await api.get('/resumes', { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                setUserResumes(data.resumes);
            }
        } catch (err) {
            console.error("Failed to fetch user resumes");
        }
    };
    fetchUserResumes();
  }, [token]);

  const handleCreatePost = async (postData) => {
    try {
      const formData = new FormData();
      formData.append('description', postData.description);
      if (postData.image) formData.append('image', postData.image);
      if (postData.tags) formData.append('tags', JSON.stringify(postData.tags));
      if (postData.resumeId) formData.append('resumeId', postData.resumeId);

      const { data } = await api.post('/post/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(prevPosts => [data, ...prevPosts]);
      setIsPostModalOpen(false);
      return true;
    } catch (err) {
      console.error("Failed to create post", err);
      return false;
    }
  };

  // CommunityPage.js

  // ... after handleCreatePost function
  const handleDeletePost = async (postId) => {
    // 1. Confirm with the user
    if (!window.confirm("Are you sure you want to permanently delete this post?")) {
      return;
    }

    try {
      // 2. Send delete request to the backend
      await api.delete(`/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3. Update state to remove the post from the UI
      setPosts((currentPosts) => currentPosts.filter((p) => p._id !== postId));
      
    } catch (err) {
      console.error("Failed to delete post:", err);filteredPosts.map(post => {
        return (
        <PostCard
          key={post._id}
          post={post}
          onVote={handleVote}
          onSave={handleSavePost}
          onDelete={handleDeletePost}      // <-- Add this line
          currentUser={user}              // <-- Add this line
          isSaved={savedPosts.includes(post._id)}
        />)
      })
      alert("Error: Could not delete the post. Please try again.");
    }
  };

  const handleVote = (postId, type) => {
    setPosts(prev =>
      prev.map(p => {
        if (p._id !== postId) return p;
  
        let newUpvotes = [...p.upvotes];
        let newDownvotes = [...p.downvotes];
  
        // remove current user from both first (reset)
        newUpvotes = newUpvotes.filter(id => id !== user._id);
        newDownvotes = newDownvotes.filter(id => id !== user._id);
  
        const diff = newUpvotes.length - newDownvotes.length;
  
        if (type === "up") {
          if (p.userVote !== "up") {
            newUpvotes.push(user._id);
          }
        } else if (type === "down") {
          if (diff > 0 && p.userVote !== "down") {
            newDownvotes.push(user._id);
          }
        }
  
        return {
          ...p,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: type,
        };
      })
    );
  
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/${postId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type }),
    }).catch(err => console.error(err));
  };
  
  
const [filterCategories, setFilterCategories] = useState([
  { key: 'all', label: 'All Posts' },
]);

const handleTopCategories = async () => {
  try {
    const { data } = await api.get('/post/top-tags');
    if (data) {
      // console.log(data);

      const topCategories = data.map(tag => ({
        key: tag._id,
        label: tag._id,   // you can also include count if needed
      }));

      setFilterCategories(prev => [...prev, ...topCategories]);
    }
  } catch (err) {
    console.error("Error fetching top categories:", err);
  }
};

useEffect(() => {
  handleTopCategories();
}, []);

  
  
useEffect(() => {
  const fetchSavedPosts = async () => {
    try {
      const { data } = await api.get('/post/saved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // backend should return { savedPosts: [{_id: "123"}, {_id:"456"}] }
      if(data.length===0){
        // console.log(data)
        setSavedPosts([]);
      }
      else{
        console.log("saved psots" + data)
        setSavedPosts(
          data
            .filter(p => p?.postId?._id) // only keep posts with valid IDs
            .map(p => p.postId._id)
        );
      }
    } catch (err) {
      console.error("Failed to fetch saved posts:", err);
    }
  };

  if (token) fetchSavedPosts();
}, [token]);

const handleSavePost = async (postId) => {
  try {
    const { data } = await api.post(`/post/save/${postId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (data.saved) {
      // ensure no duplicate IDs
      // console.log(data)
      setSavedPosts(prev => prev.includes(postId) ? prev : [...prev, postId]);
    } else {
      setSavedPosts(prev => prev.filter(id => id !== postId));
    }
  } catch (err) {
    console.error("Error saving post:", err);
  }
};

  const filteredUsers = users.filter(user => { const search = peopleSearch.toLowerCase(); return ( user.name.toLowerCase().includes(search) || user.role?.toLowerCase().includes(search) || user.company?.toLowerCase().includes(search) ); });
  const filteredPosts = posts.filter(p =>
    p.description?.toLowerCase().includes(postSearch.toLowerCase()) ||
    p.userId?.name?.toLowerCase().includes(postSearch.toLowerCase()) ||
    p.tags?.some(tag => tag.toLowerCase().includes(postSearch.toLowerCase()))
  );
  

  const handleConnect = async (otherUserId) => {
    // Ensure the user is authenticated
    if (!token) {
      console.error("Authentication token is missing.");
      // You might want to navigate to the login page or show a message
      return;
    }

    try {
      // The backend expects an object with 'chatType' and 'members' array.
      // Your controller automatically adds the current logged-in user,
      // so we only need to send the ID of the user we want to connect with.
      const payload = {
        chatType: 'private',
        members: [otherUserId],
      };

      // Make the POST request to create or retrieve the chat
      const { data: chat } = await api.post(
        '/chat/new_chat', // Your API endpoint
        payload,          // The request body
        {
          headers: { Authorization: `Bearer ${token}` }, // Pass the auth token
        }
      );

      // The API returns the full chat object (either newly created or existing).
      // We extract its _id for navigation.
      if (chat && chat._id) {
        navigate(`/community/chat/${chat._id}`);
      } else {
        // This is a safeguard in case the API response is not as expected
        console.error("API did not return a valid chat object with an _id:", chat);
      }
    } catch (err) {
      console.error("Failed to initiate chat:", err);
      // Optionally, show an error message to the user here
    }
  };
  
  const TabButton = ({ label, tabName, icon: Icon, active }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`relative py-2.5 px-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 rounded-full
        ${active ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`
      }
    >
      <Icon size={16} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );


  const sortOptions = [
      { key: 'newest', label: 'Newest First' },
      { key: 'oldest', label: 'Oldest First' }
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <header className="flex-shrink-0 bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md" onClick={() => navigate('/dashboard')} className="!p-2 sm:!px-3">
                <ArrowLeft size={16} />
                <span className="hidden sm:inline ml-2">Dashboard</span>
            </Button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden md:block">Community Hub</h1>
          </div>
          
          <div className="hidden md:flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
              <TabButton label="Explore Posts" tabName="resumes" icon={FileText} active={activeTab === 'resumes'} />
              <TabButton label="Explore People" tabName="people" icon={User} active={activeTab === 'people'} />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
      </header>

      <div className="md:hidden p-2 bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 flex justify-center">
          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full flex">
              <TabButton label="Posts" tabName="resumes" icon={FileText} active={activeTab === 'resumes'} />
              <TabButton label="People" tabName="people" icon={User} active={activeTab === 'people'} />
          </div>
      </div>

      <div className="flex-grow p-4 md:p-6 overflow-y-auto">
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
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8 h-full">
                <aside className="hidden lg:block space-y-6">
                    <Button onClick={() => setIsPostModalOpen(true)} className="w-full text-lg py-3 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30">
                        <Plus size={20} className="mr-2" /> Create Post
                    </Button>
                    <Card className="p-4 dark:bg-slate-800">
                        <h3 className="font-semibold mb-3 text-slate-800 dark:text-white">My Activity</h3>
                        <nav className="space-y-2">
                            <button onClick={() => setFilters(f => ({...f, author: user._id}))} className="w-full flex items-center gap-3 p-2 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"><FileText size={16}/> My Posts</button>
                            <button 
  onClick={() => {
    // console.log(savedPosts);
    setFilters(f => ({ ...f, author: null, savedPosts: savedPosts })); 
  }} 
  className="w-full flex items-center gap-3 p-2 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
>
  <Bookmark size={16}/> Saved Posts
</button>


                        </nav>
                    </Card>
                </aside>

                <main className="lg:col-start-2">
                    <div className="lg:hidden flex gap-2 mb-4">
                        <div className="relative flex-grow">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search posts..." value={postSearch} onChange={(e) => setPostSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <Button variant="outline" onClick={() => setIsFilterModalOpen(true)}><Filter size={16}/></Button>
                    </div>
                    {loading ? (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="animate-spin text-blue-600" size={40} />
  </div>
) : error ? (
  <p className="text-center text-red-500">{error}</p>
) : filteredPosts.length === 0 ? (
  <p className="text-center text-slate-500">No posts found.</p>
) : (
  filteredPosts.map(post => {
    return (
    <PostCard
      key={post._id}
      post={post}
      onVote={handleVote}
      onSave={handleSavePost}
      onDelete={handleDeletePost}      // <-- Add this line
      currentUser={user}              // <-- Add this line
      isSaved={savedPosts.includes(post._id)}
    />)
  })
)}

                </main>

                <aside className="hidden lg:block space-y-6">
                    <div className="relative">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search posts..." value={postSearch} onChange={(e) => setPostSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                     <Card className="p-4 dark:bg-slate-800">
                        <h3 className="font-semibold mb-3 text-slate-800 dark:text-white">Sort By</h3>
                        <div className="flex flex-col items-start gap-2">
                            {sortOptions.map(opt => (
                                <button key={opt.key} onClick={() => setFilters(f => ({...f, sort: opt.key}))}
                                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${filters.sort === opt.key ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <h3 className="font-semibold my-3 text-slate-800 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-700">Category</h3>
                        <div className="flex flex-col items-start gap-2">
                            {filterCategories.map(filter => (
                                <button key={filter.key} onClick={() => setFilters(f => ({...f, tags: filter.key, author: null}))}
                                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${filters.tags === filter.key ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </Card>
                </aside>
                
                <div className="lg:hidden fixed bottom-6 right-6 z-30">
                    <Button onClick={() => setIsPostModalOpen(true)} className="rounded-full w-16 h-16 shadow-lg">
                        <Plus size={28} />
                    </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'people' && (
  <div>
    <div className="relative max-w-lg mx-auto mb-8">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search by name, role, or company..."
        value={peopleSearch}
        onChange={(e) => setPeopleSearch(e.target.value)}
        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {loading ? (
        <div className="col-span-full flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={40}/>
        </div>
      ) : error ? (
        <p className="col-span-full text-center text-red-500">{error}</p>
      ) : filteredUsers.length > 0 ? (
        filteredUsers.map(user => (
          <UserProfileCard key={user._id} user={user} onConnect={handleConnect} />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">No users found</p>
      )}
    </div>
  </div>
)}

          </motion.div>
        </AnimatePresence>
      </div>

      <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} onCreate={handleCreatePost} userResumes={userResumes} />

      <AnimatePresence>
        {isFilterModalOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterModalOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            >
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-800 p-4 rounded-t-2xl"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Filters</h3>
                        <button onClick={() => setIsFilterModalOpen(false)} className="p-1"><X size={20}/></button>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        {filterCategories.map(filter => (
                            <button key={filter.key} onClick={() => { setFilters(f => ({...f, tags: filter.key})); setIsFilterModalOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-lg text-md transition-colors ${filters.tags === filter.key ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Create Post Modal Component ---
const CreatePostModal = ({ isOpen, onClose, onCreate, userResumes }) => {
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState('');
    const [resumeId, setResumeId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const success = await onCreate({ description, image, tags: tags.split(',').map(t => t.trim()).filter(t => t), resumeId });
        if (!success) {
            setError('Failed to create post. Please try again.');
        } else {
            onClose(); // Close modal on success
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!isOpen) {
            setDescription('');
            setImage(null);
            setTags('');
            setResumeId('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create a New Post" size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                        placeholder="Share your thoughts, ask for feedback, or provide tips..." rows={5}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                        required
                    />
                </div>
                <Input label="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., Template, Frontend, Review" />
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Attach Resume (Optional)</label>
                    <select value={resumeId} onChange={(e) => setResumeId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent">
                        <option value="">None</option>
                        {userResumes.map(resume => (
                            <option key={resume._id} value={resume._id}>{resume.ResumeTitle}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image (Optional)</label>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*"
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
                <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" loading={loading}>Publish</Button>
                </div>
            </form>
        </Modal>
    );
};

export default CommunityPage;
