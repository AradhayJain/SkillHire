import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  Clock, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SearchBar from '../components/ui/SearchBar';
import Badge from '../components/ui/Badge';

const JobsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    location: '',
    jobType: 'all',
    experience: 'all'
  });

  const jobsPerPage = 10;
  
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: 'Senior',
      salary: '$120k - $160k',
      posted: '2 days ago',
      description: 'We are looking for a senior frontend developer with expertise in React, TypeScript, and modern web technologies.',
      skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
      saved: false
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      type: 'Full-time',
      experience: 'Mid-level',
      salary: '$90k - $130k',
      posted: '1 day ago',
      description: 'Join our growing team as a full stack engineer. Experience with React and Node.js required.',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'AWS'],
      saved: true
    },
    {
      id: 3,
      title: 'React Developer',
      company: 'Digital Agency',
      location: 'Los Angeles, CA',
      type: 'Contract',
      experience: 'Mid-level',
      salary: '$80 - $100/hr',
      posted: '3 days ago',
      description: 'Contract position for an experienced React developer to work on exciting client projects.',
      skills: ['React', 'Redux', 'JavaScript', 'HTML', 'CSS'],
      saved: false
    },
    {
      id: 4,
      title: 'Frontend Engineer',
      company: 'E-commerce Giant',
      location: 'Seattle, WA',
      type: 'Full-time',
      experience: 'Junior',
      salary: '$70k - $95k',
      posted: '4 days ago',
      description: 'Entry-level position for a frontend engineer passionate about creating amazing user experiences.',
      skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Webpack'],
      saved: false
    },
    {
      id: 5,
      title: 'Lead Frontend Architect',
      company: 'Enterprise Solutions',
      location: 'Austin, TX',
      type: 'Full-time',
      experience: 'Senior',
      salary: '$140k - $180k',
      posted: '5 days ago',
      description: 'Lead our frontend architecture initiatives and mentor a team of talented developers.',
      skills: ['React', 'Architecture', 'TypeScript', 'GraphQL', 'Leadership'],
      saved: true
    }
  ];

  // Extend the mock jobs array to have more items for pagination demo
  const allJobs = Array.from({ length: 50 }, (_, index) => ({
    ...mockJobs[index % mockJobs.length],
    id: index + 1,
    title: `${mockJobs[index % mockJobs.length].title} ${Math.floor(index / mockJobs.length) + 1}`
  }));

  const filteredJobs = allJobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const toggleSaveJob = (jobId) => {
    console.log(`Toggle save for job ${jobId}`);
  };

  const getExperienceBadgeVariant = (experience) => {
    const variants = {
      'Junior': 'info',
      'Mid-level': 'warning',
      'Senior': 'success'
    };
    return variants[experience] || 'default';
  };

  const getTypeBadgeVariant = (type) => {
    const variants = {
      'Full-time': 'success',
      'Part-time': 'warning',
      'Contract': 'info',
      'Remote': 'primary'
    };
    return variants[type] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Search</h1>
          <p className="text-gray-600 mt-1">Find your next opportunity with AI-powered job matching</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredJobs.length} jobs found
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search jobs, companies, or keywords..."
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
            />
          </div>
          
          <div className="flex gap-4">
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            >
              <option value="">All Locations</option>
              <option value="san-francisco">San Francisco</option>
              <option value="new-york">New York</option>
              <option value="los-angeles">Los Angeles</option>
              <option value="seattle">Seattle</option>
              <option value="remote">Remote</option>
            </select>

            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filters.jobType}
              onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>

            <Button variant="outline">
              <Filter size={16} className="mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Job Listings */}
      <div className="space-y-4">
        {currentJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow" hover>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-900 cursor-pointer">
                      {job.title}
                    </h3>
                    <button 
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        job.saved 
                          ? 'text-primary-900 bg-primary-50' 
                          : 'text-gray-400 hover:text-primary-900 hover:bg-primary-50'
                      }`}
                    >
                      <Bookmark size={20} className={job.saved ? 'fill-current' : ''} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Building size={16} className="mr-1" />
                      {job.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {job.posted}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={getTypeBadgeVariant(job.type)} size="sm">
                      {job.type}
                    </Badge>
                    <Badge variant={getExperienceBadgeVariant(job.experience)} size="sm">
                      {job.experience}
                    </Badge>
                    <span className="text-sm font-medium text-gray-900">{job.salary}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <Badge key={idx} variant="default" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:ml-4">
                  <Button className="whitespace-nowrap">
                    Apply Now
                    <ExternalLink size={16} className="ml-2" />
                  </Button>
                  <Button variant="outline" className="whitespace-nowrap">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + jobsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 text-sm rounded ${
                        pageNum === currentPage
                          ? 'bg-primary-900 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default JobsPage;