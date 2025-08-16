import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Briefcase, UploadCloud, UserPlus, LogIn, Star, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// --- Reusable Components ---
const Button = ({ children, variant = 'primary', size = 'md', className = '', loading = false, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-blue-500",
  };
  const sizes = { md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-base" };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading} {...props}>
      {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : children}
    </button>
  );
};

const Input = ({ label, type, name, value, onChange, placeholder, required, children }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
      {children}
    </div>
  </div>
);

const FileInput = ({ label, name, onChange }) => {
    const [fileName, setFileName] = useState('');
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
            onChange(e);
        }
    };
    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
            <label htmlFor={name} className="relative flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:border-blue-500 dark:hover:border-blue-400">
                <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-10 w-10 text-slate-400" />
                    <div className="flex text-sm text-slate-600 dark:text-slate-400">
                        <span className="relative font-medium text-blue-600 dark:text-blue-400">
                            <span>Upload a file</span>
                            <input id={name} name={name} type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </span>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{fileName || 'PNG, JPG, GIF up to 10MB'}</p>
                </div>
            </label>
        </div>
    );
};

// --- Forgot Password Modal ---
const ForgotPasswordModal = ({ onClose, onLinkSent }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // API call to your backend to handle the password reset email
            const res = await fetch('http://localhost:3000/api/user/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Could not send reset link.');
            }
            onLinkSent();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold">Forgot Password?</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">No worries, we'll send you reset instructions.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <Input label="Email Address" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" loading={loading}>Send Reset Link</Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};


// --- Main Auth Page ---
const AuthPage = ({ type }) => {
  const [isLogin, setIsLogin] = useState(type === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [formData, setFormData] = useState({
    username: '', name: '', email: '', password: '', confirmPassword: '', PhoneNumber: '', pic: null
  });

  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"; // <-- IMPORTANT: REPLACE THIS

  useEffect(() => {
    setIsLogin(type === 'login');
    setError('');
    setFormData({ username: '', name: '', email: '', password: '', confirmPassword: '', PhoneNumber: '', pic: null });
  }, [type]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const res = await fetch('http://localhost:3000/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
        const data = await res.json();
        login(data);
        navigate('/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match');
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        const res = await fetch('http://localhost:3000/api/user/register', { method: 'POST', body: data });
        if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
        navigate('/auth/login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
        const token = credentialResponse.credential;
        
        const res = await fetch('http://localhost:3000/api/user/google-auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || 'Google Sign-In failed.');
        }

        const data = await res.json();
        login(data);
        navigate('/dashboard');

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const toggleAuthMode = () => {
    if (isLogin) navigate("/auth/signup");
    else navigate("/auth/login");
  };

  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -50 : 50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 15, stiffness: 100 } },
    exit: { opacity: 0, x: isLogin ? 50 : -50, transition: { duration: 0.2 } }
  };
  
  const promoSlides = [
    { type: 'welcome', image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Join thousands of successful professionals', text: 'Our platform has helped over 50,000+ job seekers land their dream careers.' },
    { type: 'testimonial', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100', name: 'Sarah L.', role: 'UX Designer', quote: 'SkillHire\'s AI feedback was a game-changer for my resume!' },
    { type: 'testimonial', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', name: 'Mike R.', role: 'Software Engineer', quote: 'The community support is incredible. I got real-time advice from hiring managers.' }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentSlide(prev => (prev === promoSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [promoSlides.length]);

  if (authLoading || isAuthenticated) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900"></div>;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <Link to="/" className="flex items-center justify-center space-x-2">
                <Briefcase className="h-10 w-10 text-blue-600" />
                <span className="text-3xl font-bold text-blue-600">SkillHire</span>
              </Link>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? 'login' : 'signup'} variants={formVariants} initial="hidden" animate="visible" exit="exit">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">{isLogin ? 'Sign in to continue your journey.' : 'Unlock your career potential.'}</p>
                </div>

                {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6 text-sm text-center">{error}</motion.div>}
                {resetLinkSent && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg mb-6 text-sm text-center">Password reset link sent to your email!</motion.div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                          <Input label="Username" type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Your username" required />
                          <Input label="Full Name" type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your name" required />
                      </div>
                      <Input label="Phone Number" type="tel" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleInputChange} placeholder="Your phone number" required />
                      <FileInput label="Profile Picture" name="pic" onChange={handleInputChange} />
                    </>
                  )}
                  <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" required />
                  <Input label="Password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" required>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                  </Input>
                  {!isLogin && <Input label="Confirm Password" type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" required />}
                  {isLogin && <div className="text-right"><button type="button" onClick={() => { setIsForgotModalOpen(true); setResetLinkSent(false); }} className="text-sm text-blue-600 hover:underline">Forgot password?</button></div>}
                  <Button type="submit" loading={loading} className="w-full" size="lg">{isLogin ? 'Sign In' : 'Create Account'}</Button>
                  <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300 dark:border-slate-700" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-50 dark:bg-slate-900 text-slate-500">Or</span></div></div>
                  
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google login failed. Please try again.')} useOneTap />

                  <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button type="button" onClick={toggleAuthMode} className="font-semibold text-blue-600 hover:text-blue-500">{isLogin ? 'Sign up' : 'Sign in'}</button>
                  </p>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="hidden lg:block flex-1 bg-gradient-to-br from-blue-50 to-sky-100 dark:from-slate-800 dark:to-blue-900/50 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-72 h-72 bg-blue-200 dark:bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-24 -right-12 w-72 h-72 bg-sky-200 dark:bg-sky-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="h-full flex flex-col items-center justify-center p-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        className="relative max-w-lg w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                        <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/30 text-center">
                           {promoSlides[currentSlide].type === 'welcome' && (
                               <>
                                    <img src={promoSlides[currentSlide].image} alt="Professional success" className="rounded-lg shadow-lg mb-6"/>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{promoSlides[currentSlide].title}</h3>
                                    <p className="text-slate-600 dark:text-slate-300">{promoSlides[currentSlide].text}</p>
                               </>
                           )}
                           {promoSlides[currentSlide].type === 'testimonial' && (
                               <>
                                    <img src={promoSlides[currentSlide].avatar} alt={promoSlides[currentSlide].name} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white/50" />
                                    <div className="flex justify-center text-yellow-400 mb-4">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 italic text-lg mb-4">"{promoSlides[currentSlide].quote}"</p>
                                    <h4 className="font-bold text-slate-800 dark:text-white">{promoSlides[currentSlide].name}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{promoSlides[currentSlide].role}</p>
                               </>
                           )}
                        </div>
                    </motion.div>
                </AnimatePresence>
                <div className="flex justify-center space-x-2 mt-8">
                    {promoSlides.map((_, index) => (
                        <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full transition-colors ${currentSlide === index ? 'bg-blue-600' : 'bg-slate-400/50 hover:bg-slate-400'}`}></button>
                    ))}
                </div>
            </div>
        </div>
      </div>
      <AnimatePresence>
        {isForgotModalOpen && <ForgotPasswordModal onClose={() => setIsForgotModalOpen(false)} onLinkSent={() => { setIsForgotModalOpen(false); setResetLinkSent(true); }} />}
      </AnimatePresence>
    </GoogleOAuthProvider>
  );
};

export default AuthPage;
