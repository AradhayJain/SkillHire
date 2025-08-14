import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Briefcase } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = ({ type }) => {
  const [isLogin, setIsLogin] = useState(type === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    PhoneNumber: '',
    pic: null
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      let res;
      if (isLogin) {
        // LOGIN: Send JSON
        res = await fetch('http://localhost:3000/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        
      } else {
        // REGISTER: Send FormData
        const data = new FormData();
        data.append('username', formData.username);
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('PhoneNumber', formData.PhoneNumber);
        if (formData.pic) data.append('pic', formData.pic);

        res = await fetch('http://localhost:3000/api/user/register', {
          method: 'POST',
          body: data
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Something went wrong');
      }

      const data = await res.json();

      // Save token/user info in context
      login(data);

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    if (field === 'pic') {
      setFormData(prev => ({ ...prev, pic: e.target.files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      PhoneNumber: '',
      pic: null
    });
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center space-x-2">
              <Briefcase className="h-10 w-10 text-primary-900" />
              <span className="text-2xl font-bold text-primary-900">SkillHire</span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Start your journey to finding the perfect job'
              }
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <Input
                  label="Username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  required
                />
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange('PhoneNumber')}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange('pic')}
                    required
                    className="block w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-primary-50 file:text-primary-700
                               hover:file:bg-primary-100"
                  />
                </div>
              </>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-5 h-5 mr-2"
              />
              Continue with Google
            </Button>

            {/* Toggle Auth Mode */}
            <div className="text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-primary-900 hover:text-primary-800 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Forgot Password */}
            {isLogin && (
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary-900 hover:text-primary-800"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="hidden lg:block flex-1 bg-gradient-to-br from-primary-50 to-primary-100"
      >
        <div className="h-full flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Professional success"
              className="rounded-lg shadow-2xl mb-8"
            />
            <h3 className="text-2xl font-bold text-primary-900 mb-4">
              Join thousands of successful professionals
            </h3>
            <p className="text-primary-700">
              Our AI-powered platform has helped over 50,000+ job seekers land their dream careers with optimized resumes and perfect job matches.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
