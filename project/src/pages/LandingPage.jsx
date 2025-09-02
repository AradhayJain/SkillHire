import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Brain, Search, Target, Users, Star, Check, ArrowRight,
  ChevronDown, MessageSquare, Mail, Phone, MapPin, Twitter, Facebook, 
  Linkedin, Plus, Sun, Moon, Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import aradhay from "../../public/aradhay.png";
import aditya from "../../public/aditya1.jpeg"
import arjun from "../../public/arjun.jpeg"
import logo from "../../public/logo.png"

// --- Reusable Components (can be moved to their own files) ---
const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-blue-500",
  };
  const sizes = { md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  return <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};

const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

// --- Custom Hook for Theme Management ---
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  return [theme, toggleTheme];
};

// --- Reimagined Navbar ---
const Navbar = ({ toggleTheme, currentTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="S" className='rounded-lg w-14 h-14' />
            <span className="text-2xl font-bold text-slate-800 dark:text-white">SkillSnap</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500">Features</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500">Pricing</a>
            <a href="#team" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500">Team</a>
            <a href="#faq" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500">FAQ</a>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800">
              {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <Link to="/auth/login" className="hidden sm:block"><Button variant="outline" size="md">Sign In</Button></Link>
            <Link to="/auth/signup"><Button size="md">Get Started</Button></Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- FAQ Accordion Item Component ---
const AccordionItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div className="border-b border-slate-200 dark:border-slate-800" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-6">
                <span className="text-lg font-medium text-slate-800 dark:text-slate-200">{question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={24} className="text-slate-500" />
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
                        <p className="pb-6 text-slate-600 dark:text-slate-400">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Reimagined Landing Page ---
const LandingPage = () => {
  const [theme, toggleTheme] = useTheme();
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
    // useEffect(() => {
    //   if (!authLoading && isAuthenticated) {
    //     navigate('/dashboard');
    //   }
    // }, [isAuthenticated, authLoading, navigate]);

  const features = [
    { icon: Brain, title: 'AI Resume Parsing', description: 'Advanced AI analyzes your resume and provides intelligent insights.'},
    { icon: Search, title: 'Smart Job Finder', description: 'Find relevant job opportunities that match your skills and experience.'},
    { icon: Target, title: 'ATS Score Optimization', description: 'Get detailed scores and recommendations to increase your visibility.'},
    { icon: Users, title: 'Community Support', description: 'Connect with peers, share experiences, and get advice from our community.'},
  ];
  
  const pricingPlans = [
    { name: 'Free', price: '$0', period: '/month', description: 'Perfect for getting started', features: ['3 resume uploads', 'Basic ATS scoring', 'Job search access', 'Community access'], popular: false },
    { name: 'Pro', price: '₹299', period: '/month', description: 'Best for active job seekers', features: ['30 resume uploads', 'Advanced ATS scoring', 'Priority job matching', 'Resume optimization tips', 'Email support'], popular: true },
    { name: 'Premium', price: '₹699', period: '/month', description: 'For serious professionals', features: ['Unlimited uploads', 'AI-powered insights', 'Personal job coach', 'Interview preparation', '1-on-1 consultations', 'Priority support'], popular: false },
  ];

  const teamMembers = [
    { name: 'Aradhay Jain', role: 'CEO & Co-Founder', image:aradhay, social: 'https://www.linkedin.com/in/aradhayjain2006/' },
    { name: 'Aditya Sahu', role: 'CTO & Co-Founder', image:aditya, social: 'https://www.linkedin.com/in/aditya-bibhas-sahu-632995280/' },
    { name: 'Arjun Yadav', role: 'COO & Co-Founder', image:arjun, social: 'https://www.linkedin.com/in/arjun-yadav-5526362b3/' },
  ];
  
  const testimonials = [
      { name: 'Sarah L.', role: 'UX Designer', quote: 'SkillSnap\'s AI feedback was a game-changer. My resume went from getting no replies to landing interviews at top tech companies!', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' },
      { name: 'Mike R.', role: 'Software Engineer', quote: 'The community support is incredible. I got real-time advice from hiring managers that you just can\'t find anywhere else.', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' },
      { name: 'Jessica P.', role: 'Marketing Manager', quote: 'I landed my dream job in three weeks. The platform not only improved my resume but also my confidence. Highly recommended!', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
  ];

  const faqs = [
      { question: 'How does the AI resume scoring work?', answer: 'Our AI analyzes your resume against thousands of data points from successful resumes in your industry. It checks for keywords, formatting, clarity, and impact, providing you with a score and actionable feedback to improve.' },
      { question: 'Is my personal data secure?', answer: 'Absolutely. We use industry-standard encryption for all data in transit and at rest. Your privacy and security are our top priorities. We will never share your personal information without your explicit consent.' },
      { question: 'What makes SkillSnap different from other job platforms?', answer: 'SkillSnap is more than just a job board. We are a comprehensive career platform that combines AI technology with a supportive community. Our focus is on empowering you with the tools and knowledge to not just find a job, but to build a successful career.' },
      { question: 'Can I cancel my subscription at any time?', answer: 'Yes, you can cancel your Pro or Premium subscription at any time from your account dashboard. You will retain access to the features until the end of your current billing period.' },
  ];
  
  // Animation Variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  const listVariants = {
    visible: { transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  const titleVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
  };
  const wordVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors duration-300">
      <Navbar toggleTheme={toggleTheme} currentTheme={theme} />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-black opacity-50"></div>
          <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div>
              <motion.h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight" variants={titleVariants} initial="hidden" animate="visible">
                {"Land Your Dream Job with".split(" ").map((word, i) => <motion.span key={i} variants={wordVariants} className="inline-block mr-3">{word}</motion.span>)}
                <span className="text-blue-600 dark:text-blue-500 block">
                    {"AI-Powered Precision".split(" ").map((word, i) => <motion.span key={i} variants={wordVariants} className="inline-block mr-3">{word}</motion.span>)}
                </span>
              </motion.h1>
              <motion.p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
                Transform your resume, discover perfect job matches, and get ahead with our intelligent career platform.
              </motion.p>
              <motion.div className="flex gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.0 }}>
                <Link to="/auth/signup"><Button size="lg">Get Started Free <ArrowRight size={20} className="ml-2" /></Button></Link>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
               <Card className="p-4 transform-gpu rotate-3 hover:rotate-0 transition-transform">
                  <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Professional workspace" className="rounded-lg shadow-2xl w-full" />
               </Card>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <motion.section id="why-us" className="py-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Why Choose Us?</h2>
                    <p className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Proven Results, Unmatched Support</p>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">We combine cutting-edge technology with a community-first approach to ensure your success.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="text-center p-8 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                        <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">50,000+</div>
                        <div className="text-lg text-slate-600 dark:text-slate-400">Professionals Matched with Jobs</div>
                    </div>
                    <div className="text-center p-8 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                        <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">95%</div>
                        <div className="text-lg text-slate-600 dark:text-slate-400">Interview Success Rate</div>
                    </div>
                </div>
            </div>
        </motion.section>

        {/* Features Section */}
        <motion.section id="features" className="py-24 bg-slate-100 dark:bg-black" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">A Smarter Way to Build Your Career</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Our AI platform provides everything you need to stand out in today's competitive job market.
              </p>
            </div>
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12" variants={listVariants}>
              {features.map((feature) => (
                <motion.div key={feature.title} variants={itemVariants}>
                  <Link>
                    <Card className={`p-8 text-center h-full hover:-translate-y-2 hover:shadow-xl transition-all flex flex-col items-center justify-center ${feature.isPlus ? 'bg-blue-600 text-white dark:bg-blue-500' : ''}`}>
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6 ${feature.isPlus ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/50'}`}>
                        <feature.icon size={32} className={feature.isPlus ? 'text-white' : 'text-blue-600 dark:text-blue-400'} />
                      </div>
                      <h3 className={`text-xl font-semibold mb-3 ${feature.isPlus ? 'text-white' : ''}`}>{feature.title}</h3>
                      <p className={`text-sm ${feature.isPlus ? 'text-blue-200' : 'text-slate-600 dark:text-slate-400'}`}>{feature.description}</p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section id="testimonials" className="py-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Our Users Love Us</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Don't just take our word for it. Here's what our users have to say.</p>
                </div>
                <motion.div className="grid lg:grid-cols-3 gap-8" variants={listVariants}>
                    {testimonials.map((testimonial, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="p-8 h-full">
                                <div className="flex items-center mb-4">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 italic">"{testimonial.quote}"</p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section id="pricing" className="py-24 bg-slate-100 dark:bg-black" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Start free and upgrade as you grow. Cancel anytime.</p>
                </div>
                <motion.div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto" variants={listVariants}>
                    {pricingPlans.map((plan) => (
                        <motion.div key={plan.name} variants={itemVariants}>
                            <Card className={`p-8 flex flex-col h-full ${plan.popular ? 'border-2 border-blue-600' : ''}`}>
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-5xl font-bold mb-2">{plan.price}<span className="text-lg font-medium text-slate-500">{plan.period}</span></p>
                                    <p className="text-slate-500">{plan.description}</p>
                                </div>
                                <ul className="space-y-4 mb-8 flex-grow">
                                    {plan.features.map((feature) => <li key={feature} className="flex items-start"><Check size={16} className="text-green-500 mr-3 mt-1 flex-shrink-0" /><span>{feature}</span></li>)}
                                </ul>
                                <Link to="/auth/signup"><Button variant={plan.popular ? 'primary' : 'outline'} className="w-full">Get Started</Button></Link>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
        
        {/* Team Section */}
        <motion.section id="team" className="py-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Passionate professionals dedicated to your career success.</p>
                </div>
                <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" variants={listVariants}>
                    {teamMembers.map((member) => (
                        <motion.div key={member.name} variants={itemVariants}>
                            <Card className="p-6 text-center group">
                                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                                <p className="text-blue-600 dark:text-blue-500 text-sm font-medium mb-3">{member.role}</p>
                                <a href={member.social} target="_blank" rel="noopener noreferrer"><Linkedin size={20} className="mx-auto text-slate-400 group-hover:text-blue-600 transition-colors" /></a>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
        
        {/* FAQ Section */}
        <motion.section id="faq" className="py-24 bg-slate-100 dark:bg-black" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400">Have questions? We've got answers.</p>
                </div>
                <motion.div variants={listVariants}>
                    {faqs.map((faq, i) => <AccordionItem key={i} question={faq.question} answer={faq.answer} />)}
                </motion.div>
            </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section id="contact" className="py-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Have questions? We'd love to hear from you.</p>
                </div>
                <motion.div className="grid md:grid-cols-3 gap-8" variants={listVariants}>
                    <motion.div variants={itemVariants}><Card className="p-8 text-center"><Mail size={32} className="text-blue-600 mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">Email Us</h3><a href="mailto:aradhayjain2006@gmail.com" className="text-slate-500 hover:text-blue-600">aradhayjain2006@gmail.com</a></Card></motion.div>
                    <motion.div variants={itemVariants}><Card className="p-8 text-center"><Phone size={32} className="text-blue-600 mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">Call Us</h3><p className="text-slate-500">+91 9899566125</p></Card></motion.div>
                    <motion.div variants={itemVariants}><Card className="p-8 text-center"><MapPin size={32} className="text-blue-600 mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">Visit Us</h3><p className="text-slate-500">Behrampur, Delhi, India</p></Card></motion.div>
                </motion.div>
            </div>
        </motion.section>
        
        {/* Footer */}
        <footer className="bg-slate-100 dark:bg-black border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <img src={logo} alt="S" className='rounded-lg w-14 h-14' />
                  <span className="text-xl font-bold">SkillSnap</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">AI-powered resume optimization and job matching platform helping professionals land their dream careers.</p>
                <div className="flex space-x-4">
                    <a href="#" className="text-slate-400 hover:text-blue-600"><Twitter size={20} /></a>
                    <a href="#" className="text-slate-400 hover:text-blue-600"><Facebook size={20} /></a>
                    <a href="#" className="text-slate-400 hover:text-blue-600"><Linkedin size={20} /></a>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-slate-500 dark:text-slate-400 hover:text-blue-600">Features</a></li>
                  <li><a href="#pricing" className="text-slate-500 dark:text-slate-400 hover:text-blue-600">Pricing</a></li>
                  <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600">API</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#why-us" className="text-slate-500 dark:text-slate-400 hover:text-blue-600">About</a></li>
                  <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600">Blog</a></li>
                  <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600">Careers</a></li>
                  <li><a href="#contact" className="text-slate-500 dark:text-slate-400 hover:text-blue-600">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
              <p>&copy; 2025 SkillSnap. All rights reserved. Made with ❤️ in Delhi, India.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;

export const ResumeUploadImage = () => {
  const [theme] = useTheme();
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <img src={resumeImg} alt="Upload Resume and other details" className="max-w-full h-auto rounded-lg shadow-2xl border-4 border-white dark:border-slate-700" />
        </motion.div>
    </div>
  );
};
