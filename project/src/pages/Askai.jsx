import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Sun, Moon, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import ReactMarkdown from 'react-markdown'; // <-- 1. IMPORT THE LIBRARY

// --- API Configuration ---
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  return [theme, toggleTheme];
};

// --- Main Ask AI Page Component ---
const AskAiPage = () => {
  const [resume, setResume] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const { resumeId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // --- Effect to Fetch Resume Data ---
  useEffect(() => {
    const fetchResume = async () => {
      if (!token || !resumeId) return;
      try {
        setLoading(true);
        const { data } = await api.get(`/resumes/${resumeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setResume(data.resume);
          setMessages([

            {
            
            sender: 'ai',
            
            text: `Hello ${user.name.split(' ')[0]}! I'm your AI career coach. I've loaded your resume, "${data.resume.ResumeTitle}". How can I help you improve it today?`
            
            }
            
            ]);
        } else {
          throw new Error(data.message || 'Failed to fetch resume data.');
        }
      } catch (err) {
        setError('Could not load the resume. Please go back and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [resumeId, token]);

  // --- Effect for WebSocket Connection ---
  useEffect(() => {
    if (!token) return; // Don't connect if there's no token

    socketRef.current = io('http://localhost:3000', {
        auth: { token } // Send token on connection
    });

    socketRef.current.on('aiResponse', (aiMessage) => {
        setMessages(prev => [...prev, aiMessage]);
        setIsAiTyping(false);
    });

    socketRef.current.on('aiError', (errorMessage) => {
        setMessages(prev => [...prev, errorMessage]);
        setIsAiTyping(false);
    });

    return () => {
        socketRef.current.disconnect();
    };
  }, [token]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || isAiTyping || !socketRef.current) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    const resumeText = resume?.analyticsData?.extracted_text;
    if (!resumeText) {
        const errMessage = { sender: 'ai', text: "Sorry, the resume content is not available for analysis." };
        setMessages(prev => [...prev, errMessage]);
        return;
    }

    socketRef.current.emit('sendMessage', {
        resumeText: resumeText,
        userQuestion: input,
    });

    setInput('');
    setIsAiTyping(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-center p-4">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Back to Dashboard</button>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <header className="flex-shrink-0 bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">Ask AI</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{resume?.ResumeTitle}</p>
            </div>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
            {messages.map((msg, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                >
                    {msg.sender === 'ai' && <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0"><Sparkles size={16} className="text-white"/></div>}
                    <div className={`p-3 rounded-2xl max-w-lg prose prose-sm dark:prose-invert ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                        {/* --- 2. USE THE COMPONENT HERE --- */}
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    {msg.sender === 'user' && <img src={user?.pic || 'https://placehold.co/32x32/E2E8F0/475569?text=U'} alt="User" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />}
                </motion.div>
            ))}
        </AnimatePresence>
        {isAiTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0"><Sparkles size={16} className="text-white"/></div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-0"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                </div>
            </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your resume..."
              className="flex-1 bg-transparent focus:outline-none text-sm px-2"
              disabled={isAiTyping}
            />
            <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50" disabled={!input.trim() || isAiTyping}>
              <Send size={16} />
            </button>
          </form>
        </footer>
    </div>
  );
};

export default AskAiPage;
