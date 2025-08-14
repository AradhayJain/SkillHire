import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Briefcase, 
  Calendar,
  PieChart,
  BarChart3,
  Award,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const AnalyticsPage = () => {
  const keyMetrics = [
    {
      title: 'Applications Sent',
      value: '47',
      change: '+12%',
      trend: 'up',
      icon: Briefcase,
      color: 'text-blue-600'
    },
    {
      title: 'Interview Rate',
      value: '23%',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Average ATS Score',
      value: '89%',
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      title: 'Jobs Saved',
      value: '73',
      change: '-2%',
      trend: 'down',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  const atsScoreData = [
    { month: 'Jan', score: 75 },
    { month: 'Feb', score: 78 },
    { month: 'Mar', score: 82 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 89 },
  ];

  const applicationData = [
    { month: 'Jan', applications: 8, interviews: 2 },
    { month: 'Feb', applications: 12, interviews: 3 },
    { month: 'Mar', applications: 15, interviews: 4 },
    { month: 'Apr', applications: 18, interviews: 5 },
    { month: 'May', applications: 22, interviews: 8 },
  ];

  const industryData = [
    { industry: 'Technology', percentage: 45, color: 'bg-blue-500' },
    { industry: 'Finance', percentage: 25, color: 'bg-green-500' },
    { industry: 'Healthcare', percentage: 15, color: 'bg-purple-500' },
    { industry: 'Education', percentage: 10, color: 'bg-orange-500' },
    { industry: 'Other', percentage: 5, color: 'bg-gray-500' },
  ];

  const insights = [
    {
      title: 'Strong ATS Performance',
      description: 'Your average ATS score of 89% is excellent! You\'re in the top 10% of candidates.',
      type: 'success',
      icon: Award
    },
    {
      title: 'Interview Rate Improving',
      description: 'Your interview rate increased by 5% this month. Keep optimizing your applications!',
      type: 'success',
      icon: TrendingUp
    },
    {
      title: 'Focus on Tech Industry',
      description: 'You\'re getting the best response from technology companies. Consider expanding here.',
      type: 'info',
      icon: Target
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your job search progress and optimize your strategy</p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100 ${metric.color}`}>
                    <metric.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ATS Score Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">ATS Score Trend</h3>
              <BarChart3 size={20} className="text-gray-400" />
            </div>

            <div className="space-y-4">
              {atsScoreData.map((data, index) => (
                <div key={data.month} className="flex items-center space-x-4">
                  <div className="w-8 text-sm text-gray-600">{data.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.score}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="bg-gradient-to-r from-primary-600 to-primary-800 h-3 rounded-full"
                    />
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-900">{data.score}%</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Applications vs Interviews */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Applications vs Interviews</h3>
              <TrendingUp size={20} className="text-gray-400" />
            </div>

            <div className="space-y-4">
              {applicationData.map((data, index) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">{data.month}</span>
                    <span className="text-xs text-gray-500">
                      {Math.round((data.interviews / data.applications) * 100)}% interview rate
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(data.applications / 25) * 100}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                          className="bg-blue-500 h-2 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-gray-600">{data.applications}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(data.interviews / 25) * 100}%` }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                          className="bg-green-500 h-2 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-gray-600">{data.interviews}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Applications</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Interviews</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Industry Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Industry Distribution</h3>
              <PieChart size={20} className="text-gray-400" />
            </div>

            <div className="space-y-4">
              {industryData.map((item, index) => (
                <motion.div
                  key={item.industry}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{item.industry}</span>
                    <span className="text-sm text-gray-600">{item.percentage}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Insights & Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Insights & Recommendations</h3>
              <Award size={20} className="text-gray-400" />
            </div>

            <div className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
                >
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'success' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    <insight.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-xs text-gray-600">{insight.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;