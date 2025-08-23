import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, Paperclip, Search, ArrowLeft, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';
// --- Mock Auth Context ---
// This is a placeholder to make the component runnable.
// In your actual app, you would remove this and use your real useAuth hook.
// ADD THIS IMPORT AT THE TOP OF THE FILE
import { useAuth } from '../contexts/AuthContext';


// --- API Configuration ---
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// --- Helper function to format date ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString();
};


// --- Main Chat Component ---
const CommunityChat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);




   // --- Effect for Socket.io Connection ---
  useEffect(() => {
    if (token) {
      // 1. Establish connection with auth token
      const socket = io('http://localhost:3000', {
        auth: {
          token: token
        }
      });
      socketRef.current = socket;

      // 2. Listen for incoming messages
      socket.on('receiveMessage', (newMessage) => {
        // Update messages only if it belongs to the active chat
        if (newMessage.chatId === activeChat?._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
        
        // Also update the last message in the sidebar
        setChats(prevChats => prevChats.map(chat => 
          chat._id === newMessage.chatId ? { ...chat, lastMessage: newMessage } : chat
        ));
      });

      // 3. Clean up on component unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [token, activeChat]); // Re-run if activeChat changes to update the closure

  // --- Effect to Join Chat Room ---
  useEffect(() => {
    if (socketRef.current && activeChat) {
      socketRef.current.emit('joinChat', activeChat._id);
    }
  }, [activeChat]);


  // --- Effect to fetch all user chats for the sidebar ---
  useEffect(() => {
    const fetchChats = async () => {
      if (!token) {
          setLoadingChats(false);
          return;
      };
      setLoadingChats(true);
      try {
        // CORRECTED ENDPOINT for fetching sidebar chats
        const { data } = await api.get('/chat/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(data);
      } catch (err) {
        console.error("Failed to fetch chats", err);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchChats();
  }, [token]);

  // --- Effect to set the active chat based on URL parameter ---
  useEffect(() => {
    if (chatId && chats.length > 0) {
      const currentChat = chats.find(c => c._id === chatId);
      setActiveChat(currentChat || null);
    } else if (!chatId) {
      setActiveChat(null); 
    }
  }, [chatId, chats]);

  // --- Effect to fetch messages when the active chat changes ---
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat || !token) {
        setMessages([]);
        return;
      }
      setLoadingMessages(true);
      try {
        // CORRECTED ENDPOINT for fetching messages for a specific chat
        const { data } = await api.get(`/chat/${activeChat._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [activeChat, token]);

  // --- Effect to scroll to the latest message ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Handler for sending a new message ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    setSendingMessage(true);
    const payload = {
      messageType: 'text',
      messageText: newMessage,
    };

    try {
      const { data: savedMessage } = await api.post(`/chat/send/${activeChat._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 4. Emit the message through the socket
      socketRef.current.emit('sendMessage', savedMessage);

      // Optimistically update your own UI
      setMessages(prev => [...prev, savedMessage]);
      setNewMessage("");
      
      setChats(prevChats => prevChats.map(chat => 
        chat._id === activeChat._id ? { ...chat, lastMessage: savedMessage } : chat
      ));

    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSendingMessage(false);
    }
  };
  // --- Helper to get display info for a chat ---
  const getChatDisplayInfo = (chat) => {
    if (!chat || !user) return { name: '', pic: '' };
    if (chat.chatType === 'group') {
      return {
        name: chat.chatName,
        pic: 'https://placehold.co/100x100/6366f1/ffffff?text=G'
      };
    }
    const otherMember = chat.members.find(member => member._id !== user._id);
    return {
      name: otherMember?.name || 'Unknown User',
      pic: otherMember?.pic || 'https://placehold.co/100x100/a0a0a0/ffffff?text=?'
    };
  };

  const activeChatInfo = activeChat ? getChatDisplayInfo(activeChat) : null;

  // --- JSX remains the same ---
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-1/3 lg:w-1/4 h-screen flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h1>
          <button onClick={() => navigate('/community')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
             <ArrowLeft size={20} />
          </button>
        </div>
        <div className="p-3 flex-shrink-0">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {loadingChats ? (
            <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
          ) : (
            <ul>
              {chats.map(chat => {
                const info = getChatDisplayInfo(chat);
                return (
                  <li key={chat._id} onClick={() => navigate(`/community/chat/${chat._id}`)}
                    className={`flex items-center gap-4 p-3 mx-2 my-1 cursor-pointer rounded-lg transition-colors ${activeChat?._id === chat._id ? 'bg-blue-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    <img src={info.pic} alt={info.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-grow overflow-hidden">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold truncate">{info.name}</p>
                        <p className={`text-xs flex-shrink-0 ml-2 ${activeChat?._id === chat._id ? 'text-blue-200' : 'text-slate-400'}`}>
                          {chat.lastMessage ? formatDate(chat.lastMessage.createdAt) : ''}
                        </p>
                      </div>
                      <p className={`text-sm truncate ${activeChat?._id === chat._id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {chat.lastMessage?.messageText || 'No messages yet...'}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* Main Chat Window */}
      <main className="hidden md:flex flex-1 flex-col h-screen">
        {activeChat ? (
          <>
            <header className="flex items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
              <img src={activeChatInfo.pic} alt={activeChatInfo.name} className="w-10 h-10 rounded-full object-cover mr-4" />
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">{activeChatInfo.name}</h2>
            </header>

            <div className="flex-grow overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/80">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
              ) : (
                messages.map(msg => {
                  const isCurrentUser = msg.senderId._id === user._id;
                  return (
                    <div key={msg._id} className={`flex items-end gap-3 my-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                      <img 
                        src={msg.senderId.pic || 'https://placehold.co/100x100/a0a0a0/ffffff?text=?'} 
                        alt={msg.senderId.name} 
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-white ${
                        isCurrentUser 
                          ? 'bg-green-500 rounded-br-none' // Current user's message: green, right
                          : 'bg-blue-500 rounded-bl-none'   // Other user's message: blue, left
                      }`}>
                        <p className="text-sm">{msg.messageText}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button type="button" className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-transparent rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  autoComplete="off"
                />
                <button type="submit" disabled={!newMessage.trim() || sendingMessage} className="p-3 rounded-full bg-blue-500 text-white disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors">
                  {sendingMessage ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-50 dark:bg-slate-900/80">
            <div className="text-center">
              <svg className="w-32 h-32 mx-auto mb-4 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">Select a Chat</h2>
              <p className="mt-2">Choose a conversation from the sidebar to start messaging.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CommunityChat;