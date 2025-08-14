import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  Upload, 
  BarChart3, 
  Users, 
  MessageSquare,
  Crown,
  Zap,
  Shield
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const SubscriptionPage = () => {
  const currentPlan = 'pro'; // This would come from user context in a real app

  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      icon: Upload,
      iconColor: 'text-gray-600',
      features: [
        '3 resume uploads per month',
        'Basic ATS scoring',
        'Job search access',
        'Community access',
        'Basic analytics',
        'Email support'
      ],
      limitations: [
        'Limited resume templates',
        'Basic optimization tips',
        'Standard processing speed'
      ],
      uploads: 3,
      popular: false,
      current: currentPlan === 'free'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'Best for active job seekers',
      icon: BarChart3,
      iconColor: 'text-blue-600',
      features: [
        '30 resume uploads per month',
        'Advanced ATS scoring',
        'AI-powered optimization tips',
        'Priority job matching',
        'Detailed analytics dashboard',
        'Resume template library',
        'Interview preparation guide',
        'Priority email support'
      ],
      limitations: [
        'No 1-on-1 consultations',
        'Standard customer support'
      ],
      uploads: 30,
      popular: true,
      current: currentPlan === 'pro'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$49',
      period: '/month',
      description: 'For serious professionals',
      icon: Crown,
      iconColor: 'text-purple-600',
      features: [
        'Unlimited resume uploads',
        'AI-powered insights & recommendations',
        'Personal job coach access',
        'Advanced interview preparation',
        '1-on-1 resume consultations',
        'Custom resume templates',
        'LinkedIn profile optimization',
        'Salary negotiation guidance',
        'Priority phone & chat support',
        'Industry-specific advice'
      ],
      limitations: [],
      uploads: 'Unlimited',
      popular: false,
      current: currentPlan === 'premium'
    }
  ];

  const features = [
    {
      category: 'Resume Management',
      items: [
        { name: 'Resume Uploads', free: '3/month', pro: '30/month', premium: 'Unlimited' },
        { name: 'ATS Scoring', free: 'Basic', pro: 'Advanced', premium: 'AI-Powered' },
        { name: 'Optimization Tips', free: 'Basic', pro: 'Advanced', premium: 'Personalized' },
        { name: 'Template Library', free: '3 templates', pro: '15 templates', premium: 'All + Custom' }
      ]
    },
    {
      category: 'Job Search',
      items: [
        { name: 'Job Matching', free: 'Standard', pro: 'Priority', premium: 'AI-Enhanced' },
        { name: 'Job Alerts', free: 'Daily', pro: 'Real-time', premium: 'Real-time + Curated' },
        { name: 'Application Tracking', free: 'Basic', pro: 'Advanced', premium: 'Full Analytics' }
      ]
    },
    {
      category: 'Support & Coaching',
      items: [
        { name: 'Email Support', free: '✓', pro: 'Priority', premium: 'Priority' },
        { name: 'Chat Support', free: '×', pro: '×', premium: '✓' },
        { name: '1-on-1 Consultations', free: '×', pro: '×', premium: '✓' },
        { name: 'Personal Job Coach', free: '×', pro: '×', premium: '✓' }
      ]
    }
  ];

  const usageStats = {
    resumesUploaded: 12,
    resumeLimit: 30,
    atsScoresGenerated: 45,
    jobsApplied: 28,
    daysRemaining: 18
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upgrade your job search with AI-powered tools and personalized guidance
        </p>
      </div>

      {/* Current Usage (if user has a plan) */}
      {currentPlan !== 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Star className="h-6 w-6 text-primary-900" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Current Plan: Pro</h3>
                  <p className="text-gray-600">Renews on January 25, 2025</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">{usageStats.resumesUploaded}/{usageStats.resumeLimit}</div>
                <div className="text-sm text-gray-600">Resumes Uploaded</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{usageStats.atsScoresGenerated}</div>
                <div className="text-sm text-gray-600">ATS Scores Generated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{usageStats.jobsApplied}</div>
                <div className="text-sm text-gray-600">Jobs Applied</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{usageStats.daysRemaining}</div>
                <div className="text-sm text-gray-600">Days Remaining</div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className={`p-8 relative h-full flex flex-col ${
              plan.popular ? 'ring-2 ring-primary-900 shadow-lg scale-105' : ''
            } ${plan.current ? 'ring-2 ring-green-500' : ''}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge variant="primary" className="px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {plan.current && (
                <div className="absolute top-4 right-4">
                  <Badge variant="success">Current Plan</Badge>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-lg bg-gray-100 mb-4`}>
                  <plan.icon size={32} className={plan.iconColor} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-xl text-gray-600 ml-1">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="flex-1">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check size={16} className="text-green-500 mr-3 mt-0.5 shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="text-xs text-gray-400">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                {plan.current ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    variant={plan.popular ? 'primary' : 'outline'} 
                    className="w-full"
                  >
                    {plan.price === '$0' ? 'Get Started' : 'Upgrade Now'}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Feature Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Detailed Feature Comparison
          </h2>

          <div className="space-y-8">
            {features.map((category, categoryIndex) => (
              <div key={category.category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  {category.category === 'Resume Management' && <Upload size={20} className="mr-2 text-blue-600" />}
                  {category.category === 'Job Search' && <BarChart3 size={20} className="mr-2 text-green-600" />}
                  {category.category === 'Support & Coaching' && <MessageSquare size={20} className="mr-2 text-purple-600" />}
                  {category.category}
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 w-1/4">Feature</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Free</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Pro</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-700">{item.name}</td>
                          <td className="py-3 px-4 text-center text-sm text-gray-600">{item.free}</td>
                          <td className="py-3 px-4 text-center text-sm text-gray-600">{item.pro}</td>
                          <td className="py-3 px-4 text-center text-sm text-gray-600">{item.premium}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* FAQ or Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <Card className="p-8 bg-gray-50">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Zap className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600 text-sm">Get ATS scores and optimization tips in seconds</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Your resume data is encrypted and never shared</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600 text-sm">Join thousands of successful job seekers</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SubscriptionPage;