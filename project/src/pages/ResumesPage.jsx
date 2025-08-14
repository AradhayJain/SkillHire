import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  Download, 
  Trash2, 
  Calendar,
  Target,
  Upload,
  X
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';

const ResumesPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const resumes = [
    {
      id: 1,
      name: 'Senior Frontend Developer Resume',
      role: 'Frontend Developer',
      uploadDate: '2025-01-15',
      atsScore: 92,
      status: 'optimized'
    },
    {
      id: 2,
      name: 'Full Stack Developer Resume',
      role: 'Full Stack Developer',
      uploadDate: '2025-01-12',
      atsScore: 87,
      status: 'good'
    },
    {
      id: 3,
      name: 'React Developer Resume',
      role: 'React Developer',
      uploadDate: '2025-01-10',
      atsScore: 78,
      status: 'needs-improvement'
    }
  ];

  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setTimeout(() => {
              setIsUploadModalOpen(false);
              setUploadProgress(0);
            }, 1000);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusBadge = (status) => {
    const variants = {
      optimized: 'success',
      good: 'warning',
      'needs-improvement': 'error'
    };
    const labels = {
      optimized: 'Optimized',
      good: 'Good',
      'needs-improvement': 'Needs Work'
    };
    return { variant: variants[status], label: labels[status] };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumes</h1>
          <p className="text-gray-600 mt-1">Manage and optimize your resumes for better ATS scores</p>
        </div>
        <Button 
          onClick={() => setIsUploadModalOpen(true)}
          className="shrink-0"
        >
          <Plus size={20} className="mr-2" />
          Upload Resume
        </Button>
      </div>

      {/* Resume Grid */}
      {resumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume, index) => {
            const statusBadge = getStatusBadge(resume.status);
            
            return (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow" hover>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{resume.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{resume.role}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        {new Date(resume.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant={statusBadge.variant} size="sm">
                      {statusBadge.label}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">ATS Score</span>
                      <span className={`text-sm font-bold px-2 py-1 rounded ${getScoreColor(resume.atsScore)}`}>
                        {resume.atsScore}%
                      </span>
                    </div>
                    <ProgressBar progress={resume.atsScore} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download size={16} className="mr-1" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <Card className="max-w-md mx-auto p-8">
            <FileText size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes uploaded yet</h3>
            <p className="text-gray-600 mb-6">
              Upload your first resume to get started with AI-powered optimization and ATS scoring.
            </p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Upload Resume
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Resume"
        size="lg"
      >
        <div className="space-y-6">
          {!isUploading ? (
            <>
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-colors
                  ${dragActive 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-300'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload size={48} className="text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your resume here
                </h4>
                <p className="text-gray-600 mb-4">
                  or click to browse files
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button as="span" variant="outline">
                    Choose File
                  </Button>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, DOC, DOCX (max 10MB)
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-1">💡 Pro Tips:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use standard section headings (Experience, Education, Skills)</li>
                  <li>• Include relevant keywords for your target role</li>
                  <li>• Keep formatting simple and ATS-friendly</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="py-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={32} className="text-primary-900" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Uploading Resume...
                </h4>
                <p className="text-gray-600">
                  Our AI is analyzing your resume for optimization opportunities
                </p>
              </div>
              
              <ProgressBar progress={uploadProgress} showPercentage className="mb-4" />
              
              <div className="text-center">
                {uploadProgress === 100 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600 font-medium"
                  >
                    ✅ Upload complete! Processing...
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ResumesPage;