import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  BarChart3, 
  Users, 
  CreditCard, 
  LogOut,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resumes', path: '/dashboard/resumes', icon: FileText },
    { name: 'Jobs', path: '/dashboard/jobs', icon: Briefcase },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Community', path: '/dashboard/community', icon: Users },
    { name: 'Chat', path: '/dashboard/community/chat', icon: MessageSquare },
    { name: 'Subscription', path: '/dashboard/subscription', icon: CreditCard },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-full bg-white shadow-lg border-r border-gray-200 w-64">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-5 border-b border-gray-200">
          <Briefcase className="h-8 w-8 text-primary-900" />
          <span className="ml-3 text-xl font-bold text-primary-900">SkillHire</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.name} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-50 text-primary-900 border-r-2 border-primary-900' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;