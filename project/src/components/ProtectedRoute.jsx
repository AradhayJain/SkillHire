// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While the auth state is loading from localStorage,
  // you can show a loader or a blank screen.
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If the user is not authenticated, redirect them to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/auth/signup" />;
  }

  // If the user is authenticated, render the page they were trying to access.
  return children;
};

export default ProtectedRoute;