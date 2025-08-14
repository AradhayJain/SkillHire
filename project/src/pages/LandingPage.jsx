import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Search, 
  Target, 
  Users, 
  Star, 
  Check, 
  ArrowRight,
  Upload,
  BarChart3,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Linkedin,
  Plus
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import arjunImg from '../images/arjun.jpg';
import aradhayImg from '../images/1748174337933.jpeg';
import adityaImg from '../images/1742494027892.jpeg';
import resumeImg from "../images/add.jpeg";

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Resume Parsing',
      description: 'Advanced AI technology analyzes your resume and provides intelligent insights to improve your job prospects.',
      link: '/resumes' // Add the route for the Resume page
    },
    {
      icon: Search,
      title: 'Smart Job Finder',
      description: 'Find relevant job opportunities that match your skills and experience with our intelligent matching system.',
      link: '/jobs' // Add the route for the Jobs page
    },
    {
      icon: Target,
      title: 'ATS Score Optimization',
      description: 'Get detailed ATS compatibility scores and recommendations to increase your resume visibility.',
      link: '/analytics' // Add the route for the Analytics page
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with other job seekers, share experiences, and get advice from our supportive community.',
      link: '/community' // Add the route for the Community page
    },
    {
      icon: Plus,
      title: '',
      description: '',
      link: '/resume-upload-image', // This will be a new route for the image
      isPlus: true
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '3 resume uploads',
        'Basic ATS scoring',
        'Job search access',
        'Community access'
      ],
      uploads: 3,
      popular: false
    },
    {
      name: 'Pro',
      price: '₹299',
      period: '/month',
      description: 'Best for active job seekers',
      features: [
        '30 resume uploads',
        'Advanced ATS scoring',
        'Priority job matching',
        'Resume optimization tips',
        'Email support'
      ],
      uploads: 30,
      popular: true
    },
    {
      name: 'Premium',
      price: '₹699',
      period: '/month',
      description: 'For serious professionals',
      features: [
        'Unlimited uploads',
        'AI-powered insights',
        'Personal job coach',
        'Interview preparation',
        '1-on-1 consultations',
        'Priority support'
      ],
      uploads: 'Unlimited',
      popular: false
    }
  ];

  const teamMembers = [
    {
      name: 'Arjun Yadav',
      role: 'CEO & Co-Founder',
      image: arjunImg,
    },
    {
      name: 'Aradhay Jain',
      role: 'Lead Developer & Co-Founder',
      image: aradhayImg,
    },
    {
      name: 'Aditya Sahu',
      role: 'ML Engineer & Co-Founder',
      image: adityaImg,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Land Your Dream Job with
              <span className="text-primary-900 block">AI-Powered Precision</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Transform your resume with AI analysis, discover perfect job matches, and join a community of successful professionals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/auth">
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16"
            >
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Professional workspace"
                className="rounded-lg shadow-2xl mx-auto max-w-4xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features to Accelerate Your Career
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides everything you need to stand out in today's competitive job market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <Link to={feature.link} key={feature.title || index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" hover>
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      {feature.isPlus ? (
                        <Plus size={32} className="text-primary-900" />
                      ) : (
                        <feature.icon size={32} className="text-primary-900" />
                      )}
                    </div>
                    {feature.title && (
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    )}
                    {feature.description && (
                      <p className="text-gray-600">{feature.description}</p>
                    )}
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include our core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`p-8 relative ${plan.popular ? 'ring-2 ring-primary-900' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-primary-900 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-xl text-gray-600 ml-1">{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check size={20} className="text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/auth">
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Revolutionizing Job Search with AI
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded by career professionals who experienced the pain points of traditional job searching, 
                SkillHire was created to bridge the gap between talented individuals and their dream opportunities.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our AI-powered platform has helped over 50,000+ professionals land their ideal jobs by 
                optimizing their resumes and connecting them with the right opportunities.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary-900 mb-2">50K+</div>
                  <div className="text-gray-600">Jobs Matched</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-900 mb-2">95%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Team collaboration"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to transforming how people find and land their dream jobs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow" hover>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <Mail size={32} className="text-primary-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">adityabibhas.sahu@gmail.com</p>
            </Card>

            <Card className="p-6 text-center">
              <Phone size={32} className="text-primary-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+91 9899566125</p>
            </Card>

            <Card className="p-6 text-center">
              <MapPin size={32} className="text-primary-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">Behrampur, Uttar PraDESH</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Upload className="h-8 w-8 text-primary-400" />
                <span className="text-xl font-bold">SkillHire</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                AI-powered resume optimization and job matching platform helping professionals land their dream careers.
              </p>
              <div className="flex space-x-4">
                <Twitter size={20} className="text-gray-400 hover:text-white cursor-pointer" />
                <Facebook size={20} className="text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin size={20} className="text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SkillHire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

export const ResumeUploadImage = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <img src={resumeImg} alt="Upload Resume and other details" className="max-w-full h-auto rounded-lg shadow" />
  </div>
);