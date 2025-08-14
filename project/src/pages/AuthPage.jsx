import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Briefcase, UploadCloud, UserPlus, LogIn, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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

// --- Main Auth Page ---
const AuthPage = ({ type }) => {
  const [isLogin, setIsLogin] = useState(type === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '', name: '', email: '', password: '', confirmPassword: '', PhoneNumber: '', pic: null
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

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ username: '', name: '', email: '', password: '', confirmPassword: '', PhoneNumber: '', pic: null });
  };

  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -50 : 50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 15, stiffness: 100 } },
    exit: { opacity: 0, x: isLogin ? 50 : -50, transition: { duration: 0.2 } }
  };
  
  const promoSlides = [
    {
      type: 'welcome',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Join thousands of successful professionals',
      text: 'Our platform has helped over 50,000+ job seekers land their dream careers with optimized resumes and perfect job matches.'
    },
    {
      type: 'testimonial',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      name: 'Sarah L.',
      role: 'UX Designer',
      quote: 'SkillHire\'s AI feedback was a game-changer. My resume went from getting no replies to landing interviews at top tech companies!'
    },
    {
      type: 'testimonial',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      name: 'Mike R.',
      role: 'Software Engineer',
      quote: 'The community support is incredible. I got real-time advice from hiring managers that you just can\'t find anywhere else.'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentSlide(prev => (prev === promoSlides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [promoSlides.length]);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Left Side - Form */}
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
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {isLogin ? 'Welcome Back!' : 'Create Your Account'}
                </h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  {isLogin ? 'Sign in to continue your journey.' : 'Unlock your career potential.'}
                </p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6 text-sm text-center">
                  {error}
                </motion.div>
              )}

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
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </Input>

                {!isLogin && (
                  <Input label="Confirm Password" type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" required />
                )}
                
                {isLogin && (
                    <div className="text-right">
                        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                    </div>
                )}

                <Button type="submit" loading={loading} className="w-full" size="lg">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300 dark:border-slate-700" /></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-50 dark:bg-slate-900 text-slate-500">Or</span></div>
                </div>

                <Button type="button" variant="outline" className="w-full" size="lg">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-3" />
                  Continue with Google
                </Button>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button type="button" onClick={toggleAuthMode} className="font-semibold text-blue-600 hover:text-blue-500">
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side - Carousel Promo */}
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
  );
};

export default AuthPage;
