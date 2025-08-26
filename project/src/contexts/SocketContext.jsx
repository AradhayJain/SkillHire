// src/contexts/SocketContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext'; // Import useAuth to get the token

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { token } = useAuth(); // Get the token from your AuthProvider

  useEffect(() => {
    if (token) {
      // If a user is logged in (token exists), create a new socket connection
      const newSocket = io(import.meta.env.VITE_BACKEND_URL, { // Your server URL
        auth: {
          token: token, // The server middleware will use this to get the userId
        },
      });

      setSocket(newSocket);

      // Listen for the list of online users from the server
      newSocket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      // Cleanup function to close the socket when the component unmounts or user logs out
      return () => newSocket.close();
    } else {
      // If there is no token (user logged out), close any existing socket
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [token]); // This effect re-runs whenever the token changes (on login/logout)

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};