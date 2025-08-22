import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Mail, Phone, MessageSquare, ArrowLeft, Sun, Moon, ChevronDown, CheckCircle } from 'lucide-react';

// --- Custom Hook for Theme Management ---
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  return [theme, toggleTheme];
};

// --- Reusable Components ---
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 px-5 py-2.5 text-base";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-blue-500",
  };
  return <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Input = ({ label, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <input {...props} className={`w-full px-4 py-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:border-blue-500 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'}`} />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Textarea = ({ label, error, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
      <textarea {...props} rows="5" className={`w-full px-4 py-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:border-blue-500 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'}`}></textarea>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

// --- FAQ Accordion Item ---
const FaqItem = ({ q, a, isOpen, onClick }) => (
    <div className="border-b border-slate-200 dark:border-slate-700">
        <button onClick={onClick} className="w-full flex justify-between items-center text-left py-5">
            <span className="font-medium text-slate-800 dark:text-slate-200">{q}</span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={20} className="text-slate-500" />
            </motion.div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                >
                    <p className="pb-5 text-slate-600 dark:text-slate-400">{a}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);


// --- Main Support Page Component ---
export default function Support() {
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const navigate = useNavigate();

  const faqs = [
    { q: "How do I reset my password?", a: "You can reset your password from the login page by clicking the 'Forgot Password?' link. We'll send a secure reset link to your registered email address." },
    { q: "How do I contact support?", a: "You can use the contact options on this page: email us directly, or fill out the support form for a detailed inquiry. We typically respond within 24 hours." },
    { q: "Where can I find my billing details?", a: "Billing details and subscription management are located in your main dashboard under the 'Billing & Subscription' section in your profile settings." }
  ];

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message) newErrors.message = "Message cannot be empty";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Support form submitted:", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <header className="flex-shrink-0 bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 p-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="md" onClick={() => navigate('/dashboard')} className="!p-2 sm:!px-3">
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline ml-2">Dashboard</span>
                </Button>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden md:block">Support Center</h1>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
        </header>

        <div className="p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto text-center mb-12"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                How can we help you?
                </h1>
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                Find answers to common questions or reach out to our support team.
                </p>
                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search our knowledge base..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-blue-500" />
                </div>
            </motion.div>

            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
                {/* Left Side: FAQ */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-1">
                        {faqs.map((item, i) => (
                            <FaqItem key={i} q={item.q} a={item.a} isOpen={openIndex === i} onClick={() => setOpenIndex(openIndex === i ? null : i)} />
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Contact Form */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
                    <AnimatePresence>
                        {submitted && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="p-4 mb-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-3">
                                <CheckCircle size={20} /> Your message has been sent successfully!
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 space-y-4">
                        <Input label="Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={errors.name} />
                        <Input label="Email" name="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={errors.email} />
                        <Input label="Subject" name="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} error={errors.subject} />
                        <Textarea label="Message" name="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} error={errors.message} />
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </motion.div>
            </div>
        </div>
    </div>
  );
}
