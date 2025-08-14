import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  ArrowLeft, 
  Users, 
  Smile,
  Paperclip,
  MoreVertical,
  Hash,
  AtSign,
  User,
  Settings
} from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import Button from '../components/ui/Button';

// --- Helper to process messages for grouping ---
const processMessages = (messages) => {
  if (!messages || messages.length === 0) return [];
  return messages.map((msg, index) => {
    const prevMsg = messages[index - 1];
    const isGroupStart = !prevMsg || prevMsg.user !== msg.user;
    return { ...msg, isGroupStart };
  });
};

// --- Reimagined Chat Component ---
const CommunityChat = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { userId } = useParams(); // Get user ID from URL if available
  
  const [messages, setMessages] = useState([
    { id: 1, user: 'Sarah Chen', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100', message: 'Hey everyone! Just wanted to share that I got the job! Thanks for all the resume feedback 🎉', timestamp: '2:30 PM' },
    { id: 2, user: 'Michael Rodriguez', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', message: 'Congratulations Sarah! That\'s amazing news 👏', timestamp: '2:32 PM' },
    { id: 3, user: 'You', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100', message: 'That\'s fantastic! What company did you end up joining?', timestamp: '2:35 PM', isOwn: true },
    { id: 4, user: 'Sarah Chen', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100', message: 'I joined TechCorp as a Senior Frontend Developer!', timestamp: '2:38 PM' },
    { id: 5, user: 'Sarah Chen', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100', message: 'The ATS optimization tips from this community really made the difference.', timestamp: '2:38 PM' },
    { id: 6, user: 'Emily Johnson', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', message: 'Can you share which specific changes helped the most? I\'m still working on my resume.', timestamp: '2:40 PM' },
  ]);
  
  const messagesEndRef = useRef(null);
  const processedMessages = processMessages(messages);

  const onlineMembers = {
    'Hiring Managers': [
      { name: 'David Kim', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100', status: 'online' }
    ],
    'Developers': [
      { name: 'Sarah Chen', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100', status: 'online' },
      { name: 'Michael Rodriguez', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', status: 'online' },
      { name: 'David Park', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100', status: 'away' }
    ],
    'Members': [
      { name: 'Emily Johnson', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', status: 'online' },
    ]
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      user: 'You',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      {/* Left Sidebar: Channels & DMs */}
      <nav className="w-64 bg-slate-200 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-slate-300">
          <h1 className="text-lg font-bold">ResumeAI Community</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <div>
              <h2 className="px-2 text-xs font-bold uppercase text-slate-500 mb-1">Channels</h2>
              <a href="#" className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-300"><Hash size={16} /> general</a>
              <a href="#" className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-300"><Hash size={16} /> resume-feedback</a>
            </div>
            <div>
              <h2 className="px-2 text-xs font-bold uppercase text-slate-500 mb-1 mt-4">Direct Messages</h2>
              <a href="#" className="flex items-center gap-2 p-2 rounded-md bg-blue-200 text-blue-800 font-semibold"><AtSign size={16}/> Sarah Chen</a>
              <a href="#" className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-300"><AtSign size={16}/> Michael Rodriguez</a>
            </div>
        </div>
        <div className="p-2 border-t border-slate-300">
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-300 cursor-pointer">
                <div className="flex items-center gap-2">
                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-semibold">You</span>
                </div>
                <Settings size={16} />
            </div>
        </div>
      </nav>

      {/* Center: Main Chat Pane */}
      <main className="flex-1 flex flex-col bg-white">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-1 text-slate-500 hover:text-slate-800 md:hidden"><ArrowLeft size={20}/></button>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100" className="w-9 h-9 rounded-full"/>
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
                    </div>
                    <div>
                        <h2 className="text-base font-semibold">Sarah Chen</h2>
                        <p className="text-xs text-slate-500">Active now</p>
                    </div>
                </div>
            </div>
            <button className="p-2 rounded-full hover:bg-slate-100"><MoreVertical size={20}/></button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-1">
          {processedMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 group ${msg.isOwn ? 'justify-end' : ''} ${msg.isGroupStart ? 'mt-4' : ''}`}
            >
              { !msg.isOwn && msg.isGroupStart && <img src={msg.avatar} className="w-8 h-8 rounded-full"/> }
              { !msg.isOwn && !msg.isGroupStart && <div className="w-8"/> }

              <div className={`flex flex-col max-w-lg ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                { !msg.isOwn && msg.isGroupStart && <p className="text-xs text-slate-500 mb-1 ml-3">{msg.user}</p> }
                <div className={`px-4 py-2 rounded-2xl ${msg.isOwn ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 text-slate-400 hover:text-slate-600"><Smile size={16}/></button>
              </div>
            </motion.div>
          ))}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <footer className="p-4 border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-2">
            <button type="button" className="p-2 text-slate-500 hover:text-blue-600"><Paperclip size={20}/></button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message Sarah Chen`}
              className="flex-1 bg-transparent focus:outline-none text-sm"
            />
            <Button type="submit" size="sm" className="rounded-lg" disabled={!message.trim()}>
              <Send size={16} />
            </Button>
          </form>
        </footer>
      </main>

      {/* Right Sidebar: Members Info */}
      <aside className="w-80 bg-slate-50 border-l border-slate-200 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-slate-200 text-center">
            <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100" className="w-20 h-20 rounded-full mx-auto mb-2" />
            <h3 className="font-semibold">Sarah Chen</h3>
            <p className="text-sm text-slate-500">Senior Frontend Developer</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
            {Object.entries(onlineMembers).map(([role, members]) => (
                <div key={role} className="mb-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">{role} - {members.length}</h4>
                    <div className="space-y-2">
                        {members.map(member => (
                            <div key={member.name} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-200 cursor-pointer">
                                <div className="relative">
                                    <img src={member.avatar} className="w-8 h-8 rounded-full" />
                                    <span className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full border border-slate-50 ${member.status === 'online' ? 'bg-green-500' : 'bg-yellow-400'}`}></span>
                                </div>
                                <span className="text-sm font-medium">{member.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </aside>
    </div>
  );
};

export default CommunityChat;