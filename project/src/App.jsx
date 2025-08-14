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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-inter">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/login" element={<AuthPage mode="login" />} />
            <Route path="/auth/signup" element={<AuthPage mode="signup" />} />
            <Route path="/community/chat" element={<CommunityChat />} />
            <Route path="/resumes" element={<ResumesPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/resume-upload-image" element={<ResumeUpload />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;