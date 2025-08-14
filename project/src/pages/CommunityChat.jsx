import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  ArrowLeft, 
  Users, 
  Smile,
  Paperclip,
  MoreVertical,
  Circle
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const CommunityChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      message: 'Hey everyone! Just wanted to share that I got the job! Thanks for all the resume feedback 🎉',
      timestamp: '2:30 PM',
      isOwn: false
    },
    {
      id: 2,
      user: 'Michael Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      message: 'Congratulations Sarah! That\'s amazing news 👏',
      timestamp: '2:32 PM',
      isOwn: false
    },
    {
      id: 3,
      user: 'You',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      message: 'That\'s fantastic! What company did you end up joining?',
      timestamp: '2:35 PM',
      isOwn: true
    },
    {
      id: 4,
      user: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      message: 'I joined TechCorp as a Senior Frontend Developer! The ATS optimization tips from this community really made the difference.',
      timestamp: '2:38 PM',
      isOwn: false
    },
    {
      id: 5,
      user: 'Emily Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      message: 'Can you share which specific changes helped the most? I\'m still working on my resume.',
      timestamp: '2:40 PM',
      isOwn: false
    },
    {
      id: 6,
      user: 'David Park',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      message: 'This community is so supportive! Love seeing success stories like this 💪',
      timestamp: '2:42 PM',
      isOwn: false
    }
  ]);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const onlineMembers = [
    {
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'Frontend Developer',
      status: 'online'
    },
    {
      name: 'Michael Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'Full Stack Engineer',
      status: 'online'
    },
    {
      name: 'Emily Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'Recent Graduate',
      status: 'online'
    },
    {
      name: 'David Park',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'Senior Developer',
      status: 'away'
    },
    {
      name: 'Lisa Wang',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'Product Manager',
      status: 'online'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
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
    }
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-green-500' : 'bg-yellow-500';
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/dashboard/community">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft size={16} />
                </Button>
              </Link>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Community Chat</h2>
                <p className="text-sm text-gray-600">
                  {onlineMembers.filter(m => m.status === 'online').length} members online
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="p-2">
              <MoreVertical size={16} />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-xs lg:max-w-md ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
                {!msg.isOwn && (
                  <img
                    src={msg.avatar}
                    alt={msg.user}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div className={`${msg.isOwn ? 'mr-2' : 'ml-2'}`}>
                  {!msg.isOwn && (
                    <p className="text-xs text-gray-600 mb-1">{msg.user}</p>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      msg.isOwn
                        ? 'bg-primary-900 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.isOwn ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Paperclip size={16} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Smile size={16} />
            </button>
            <Button type="submit" size="sm" className="px-4">
              <Send size={16} />
            </Button>
          </form>
        </div>
      </div>

      {/* Online Members Sidebar */}
      <div className="w-80 border-l border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Online Members</h3>
            <Badge variant="success" size="sm">
              {onlineMembers.filter(m => m.status === 'online').length}
            </Badge>
          </div>
        </div>

        <div className="overflow-y-auto h-full p-4 space-y-3">
          {onlineMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-600">{member.role}</p>
              </div>
            </motion.div>
          ))}

          {/* Offline Members */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Offline - 12 members</h4>
            <div className="space-y-2">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-center space-x-3 p-2 rounded-lg opacity-60">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    <Circle size={8} className="absolute bottom-0 right-0 text-gray-400 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-300 rounded mb-1" />
                    <div className="h-2 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;