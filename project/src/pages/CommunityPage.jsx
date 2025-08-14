import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  Heart, 
  Share, 
  Eye, 
  Calendar,
  User,
  FileText,
  Filter,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const CommunityPage = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigate = useNavigate();

  const posts = [
    {
      id: 1,
      title: 'Senior Frontend Developer Resume Template',
      author: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'Frontend Developer',
      company: 'TechCorp',
      postedAt: '2 hours ago',
      content: 'I wanted to share my resume template that helped me land multiple FAANG interviews. This template focuses on quantified achievements and ATS optimization.',
      resumePreview: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Resume', 'Frontend', 'FAANG', 'Template'],
      stats: {
        likes: 127,
        comments: 23,
        shares: 15,
        views: 892
      },
      liked: false
    },
    {
      id: 2,
      title: 'How I Increased My ATS Score from 65% to 95%',
      author: 'Michael Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'Full Stack Engineer',
      company: 'StartupXYZ',
      postedAt: '5 hours ago',
      content: 'After struggling with low ATS scores, I discovered these 5 key strategies that completely transformed my resume performance. Here\'s my journey and the exact changes I made.',
      resumePreview: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpg?auto=compress&cs=tinysrgb&w=400',
      tags: ['ATS', 'Tips', 'Optimization', 'Success Story'],
      stats: {
        likes: 89,
        comments: 34,
        shares: 12,
        views: 654
      },
      liked: true
    },
    {
      id: 3,
      title: 'Entry-Level React Developer Resume Review',
      author: 'Emily Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'Recent Graduate',
      company: 'Job Seeker',
      postedAt: '1 day ago',
      content: 'Looking for feedback on my first developer resume. I\'m a recent bootcamp graduate trying to break into the tech industry. Any suggestions would be greatly appreciated!',
      resumePreview: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Review Request', 'Entry Level', 'React', 'Feedback'],
      stats: {
        likes: 43,
        comments: 18,
        shares: 6,
        views: 321
      },
      liked: false
    },
    {
      id: 4,
      title: 'Remote Work Resume: What Employers Look For',
      author: 'David Park',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'Senior Developer',
      company: 'Remote First Co',
      postedAt: '2 days ago',
      content: 'Having worked remotely for 5+ years and now helping with hiring, here are the key elements that make a resume stand out for remote positions.',
      resumePreview: 'https://images.pexels.com/photos/1181715/pexels-photo-1181715.jpg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Remote Work', 'Hiring Tips', 'Best Practices'],
      stats: {
        likes: 156,
        comments: 42,
        shares: 28,
        views: 1203
      },
      liked: true
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'templates') return matchesSearch && post.tags.includes('Template');
    if (selectedFilter === 'reviews') return matchesSearch && post.tags.includes('Review Request');
    if (selectedFilter === 'tips') return matchesSearch && (post.tags.includes('Tips') || post.tags.includes('Best Practices'));
    
    return matchesSearch;
  });

  const toggleLike = (postId) => {
    console.log(`Toggle like for post ${postId}`);
  };

  const handleCreatePost = () => {
    setIsPostModalOpen(false);
    // In a real app, you might navigate to a separate page or handle the upload
    console.log('Create post functionality');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-600 mt-1">Share resumes, get feedback, and help others succeed</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard/community/chat">
            <Button variant="outline">
              <MessageSquare size={16} className="mr-2" />
              Join Chat
            </Button>
          </Link>
          <Button onClick={() => setIsPostModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, templates, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Posts' },
              { key: 'templates', label: 'Templates' },
              { key: 'reviews', label: 'Reviews' },
              { key: 'tips', label: 'Tips' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-primary-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    <p className="text-sm text-gray-600">{post.role} at {post.company}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar size={12} className="mr-1" />
                      {post.postedAt}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Title */}
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h2>

              {/* Post Content */}
              <p className="text-gray-700 mb-4">{post.content}</p>

              {/* Resume Preview */}
              {post.resumePreview && (
                <div className="mb-4">
                  <img
                    src={post.resumePreview}
                    alt="Resume preview"
                    className="w-full max-w-md h-40 object-cover rounded-lg border"
                  />
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, idx) => (
                  <Badge key={idx} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Post Stats and Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Eye size={16} />
                    <span>{post.stats.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={16} />
                    <span>{post.stats.comments}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center space-x-1 text-sm ${
                      post.liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                    } transition-colors`}
                  >
                    <Heart size={16} className={post.liked ? 'fill-current' : ''} />
                    <span>{post.stats.likes}</span>
                  </button>

                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-900 transition-colors">
                    <Share size={16} />
                    <span>{post.stats.shares}</span>
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="Create New Post"
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="Post Title"
            placeholder="e.g., My Senior Developer Resume Template"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              placeholder="Share your experience, ask for feedback, or provide tips to help others..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText size={32} className="text-gray-400 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Add Resume or Image</h4>
            <p className="text-sm text-gray-600 mb-4">
              Upload a resume or screenshot to share with the community
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="btn btn-outline-primary" // or your Tailwind classes
                onClick={() => navigate("/resumes")}
              >
                Choose from Uploaded
              </Button>
              <Button
                className="btn btn-primary" // or your Tailwind classes
                onClick={() => navigate("/resume-upload-image")} // or your actual upload route
              >
                Upload New Resume
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setIsPostModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost}>
              Create Post
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommunityPage;