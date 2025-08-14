import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  FileText, 
  Briefcase, 
  Users, 
  Target,
  Calendar,
  Activity,
  Award
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Router, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = [
    {
      icon: Target,
      title: 'ATS Score',
      value: '92%',
      change: '+5%',
      trend: 'up',
      color: 'text-green-600'
    },
    {
      icon: FileText,
      title: 'Resumes Uploaded',
      value: '12',
      change: '+3',
      trend: 'up',
      color: 'text-blue-600'
    },
    {
      icon: Briefcase,
      title: 'Applications Sent',
      value: '28',
      change: '+7',
      trend: 'up',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Jobs Saved',
      value: '45',
      change: '+12',
      trend: 'up',
      color: 'text-orange-600'
    }
  ];

  const recentActivity = [
    {
      type: 'resume',
      title: 'Resume uploaded: Senior Developer Resume',
      time: '2 hours ago',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      type: 'job',
      title: 'Applied to Frontend Developer at TechCorp',
      time: '5 hours ago',
      icon: Briefcase,
      color: 'bg-green-100 text-green-600'
    },
    {
      type: 'ats',
      title: 'ATS Score improved to 92%',
      time: '1 day ago',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      type: 'community',
      title: 'New comment on your resume post',
      time: '2 days ago',
      icon: Users,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const recommendations = [
    {
      title: 'Optimize Resume Keywords',
      description: 'Add more relevant keywords to improve ATS compatibility',
      priority: 'high'
    },
    {
      title: 'Update Profile Photo',
      description: 'Professional photos increase profile views by 40%',
      priority: 'medium'
    },
    {
      title: 'Complete Skills Assessment',
      description: 'Validate your skills to show expertise to employers',
      priority: 'low'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-lg p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, John! 👋</h1>
        <p className="opacity-90">
          You're doing great! Your ATS score improved by 5% this week. Keep optimizing to land more interviews.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow" hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Activity size={20} className="text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${activity.color}`}>
                    <activity.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-4 text-sm text-primary-900 hover:text-primary-800 font-medium">
              View all activity →
            </button>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recommendations</h2>
              <Award size={20} className="text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="border-l-4 border-primary-200 pl-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{rec.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                    </div>
                    <Badge 
                      variant={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-4 text-sm text-primary-900 hover:text-primary-800 font-medium">
              View all recommendations →
            </button>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={()=>navigate("/resume-upload-image")} className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <FileText size={24} className="text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Upload Resume</span>
            </button>
            <button onClick={()=>navigate("/jobs")} className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <Briefcase size={24} className="text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Find Jobs</span>
            </button>
            <button onClick={()=>navigate("/analytics")} className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <Target size={24} className="text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Check ATS Score</span>
            </button>
            <button onClick={()=>navigate("/community")} className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <Users size={24} className="text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Join Community</span>
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;