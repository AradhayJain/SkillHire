// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HandleLogin = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While the auth state is loading from localStorage,
  // you can show a loader or a blank screen.
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If the user is not authenticated, redirect them to the login page.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  // If the user is not authenticated, render the login page.
  return children;
};

export default HandleLogin;