import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ResumesPage from './pages/ResumesPage';
import JobsPage from './pages/JobsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CommunityPage from './pages/CommunityPage';
import ResumeUpload from './pages/ResumeUpload';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import CommunityChat from './pages/CommunityChat';
import ProtectedRoute from './components/ProtectedRoute';
import HandleLogin from './components/HandleLogin';
import ResetPasswordPage from './pages/Reset';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-inter">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/reset-password/:resettoken" element={<ResetPasswordPage />} />
            <Route path="/" element={
              <HandleLogin>
                <LandingPage />
              </HandleLogin>}/>
            <Route path="/auth/login" element={<HandleLogin><AuthPage type="login" /></HandleLogin>} />
            <Route path="/auth/signup" element={<HandleLogin><AuthPage type="signup" /></HandleLogin>} />

            {/* --- Protected Routes --- */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community" 
              element={
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community/chat" 
              element={
                <ProtectedRoute>
                  <CommunityChat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community/chat/:userId" 
              element={
                <ProtectedRoute>
                  <CommunityChat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resume/jobs" 
              element={
                <ProtectedRoute>
                  <JobsPage />
                </ProtectedRoute>
              } 
            />
            {/* Add other protected routes here in the same way */}

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
