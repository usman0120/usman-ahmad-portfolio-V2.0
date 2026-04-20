// pages/Projects.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProjects, useProjectDetails } from '../hooks/useFirestore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { staggerContainer, scale } from '../utils/animations';
import { FaGithub, FaExternalLinkAlt, FaArrowRight, FaSearch, FaTimes } from 'react-icons/fa';
import { HiOutlineCode, HiOutlineLightBulb } from 'react-icons/hi';

// Project interface
interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  githubUrl: string;
  demoUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Custom Button Component
const CustomButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: React.ReactNode;
}> = ({ children, variant = 'primary', size = 'md', onClick, href, className = '', icon }) => {
  const baseClasses = 'rounded-xl font-medium transition-all duration-300 focus:outline-none inline-flex items-center gap-2 justify-center';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105',
    secondary: 'bg-white dark:bg-gray-800 text-primary border border-primary/30 hover:border-primary hover:shadow-lg',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const buttonContent = (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
};

// Project Card Component
const ProjectCard: React.FC<{ 
  project: Project; 
  index: number;
  onFilterChange: (filter: string) => void;
  hasDetail: boolean;
}> = ({ project, index, onFilterChange, hasDetail }) => {
  return (
    <motion.div
      variants={scale}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <div className="group h-full flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        {/* Project Image */}
        <div className="relative overflow-hidden h-52">
          <motion.img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {project.featured && (
            <div className="absolute top-4 right-4">
              <span className="bg-gradient-to-r from-primary to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                ⭐ Featured
              </span>
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <HiOutlineCode className="text-primary/50 group-hover:text-primary transition-colors text-xl" />
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1 leading-relaxed text-sm">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 4).map((tech: string, techIndex: number) => (
                <motion.span
                  key={techIndex}
                  className="px-3 py-1 bg-primary/5 border border-primary/20 rounded-full text-xs text-primary cursor-pointer hover:bg-primary hover:text-white transition-all duration-300"
                  onClick={() => onFilterChange(tech)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tech}
                </motion.span>
              ))}
              {project.techStack.length > 4 && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded-full">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Project Links */}
          <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <CustomButton
              variant="outline"
              size="sm"
              className="flex-1"
              href={project.githubUrl}
              icon={<FaGithub />}
            >
              Code
            </CustomButton>
            {project.demoUrl && (
              <CustomButton
                variant="primary"
                size="sm"
                className="flex-1"
                href={project.demoUrl}
                icon={<FaExternalLinkAlt />}
              >
                Demo
              </CustomButton>
            )}
            {hasDetail && (
              <Link to={`/projects/${project.id}`} className="flex-1">
                <CustomButton
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  icon={<FaArrowRight />}
                >
                  Details
                </CustomButton>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const { projects, loading } = useProjects();
  const { projectDetails } = useProjectDetails();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Default projects with software engineering focus
  const defaultProjects = [
    {
      id: '1',
      title: 'AI-Powered Analytics Dashboard',
      description: 'Real-time analytics dashboard with AI-driven insights, predictive modeling, and interactive data visualization for business intelligence.',
      techStack: ['React', 'TypeScript', 'TensorFlow.js', 'D3.js', 'Node.js', 'PostgreSQL'],
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      githubUrl: 'https://github.com/usman/ai-analytics',
      demoUrl: 'https://analytics.demo.com',
      featured: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Cloud-Native Microservices Platform',
      description: 'Scalable microservices architecture with Kubernetes orchestration, service mesh, and automated CI/CD pipelines for enterprise applications.',
      techStack: ['Go', 'Kubernetes', 'Docker', 'Istio', 'gRPC', 'MongoDB'],
      imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      githubUrl: 'https://github.com/usman/cloud-platform',
      demoUrl: 'https://microservices.demo.com',
      featured: true,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: '3',
      title: 'LLM-Powered Code Assistant',
      description: 'Intelligent code completion and review assistant using fine-tuned LLMs, supporting multiple languages and integrating with popular IDEs.',
      techStack: ['Python', 'FastAPI', 'PyTorch', 'Transformers', 'Redis', 'Docker'],
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      githubUrl: 'https://github.com/usman/code-assistant',
      demoUrl: 'https://codeai.demo.com',
      featured: true,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '4',
      title: 'E-Commerce Platform with AI Recommendations',
      description: 'Full-featured e-commerce platform with personalized product recommendations, real-time inventory, and secure payment processing.',
      techStack: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Redis', 'TensorFlow'],
      imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      githubUrl: 'https://github.com/usman/ecommerce-ai',
      demoUrl: 'https://shopai.demo.com',
      featured: false,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    },
    {
      id: '5',
      title: 'Real-Time Collaboration Suite',
      description: 'Web-based collaboration platform with real-time document editing, video conferencing, and project management features.',
      techStack: ['React', 'WebRTC', 'Socket.io', 'Express', 'PostgreSQL', 'Redis'],
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      githubUrl: 'https://github.com/usman/collab-suite',
      demoUrl: 'https://collab.demo.com',
      featured: false,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25')
    },
    {
      id: '6',
      title: 'DevOps Automation Platform',
      description: 'Comprehensive DevOps platform for automated deployments, infrastructure as code, monitoring, and incident management.',
      techStack: ['Terraform', 'Ansible', 'Jenkins', 'Prometheus', 'Grafana', 'Python'],
      imageUrl: 'https://images.unsplash.com/photo-1618401471353-b40afd2def21?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      githubUrl: 'https://github.com/usman/devops-platform',
      demoUrl: 'https://devops.demo.com',
      featured: false,
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-05')
    }
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  // Check which projects have detail pages
  const projectDetailIds = new Set(projectDetails.map(d => d.projectId));

  // Get all unique technologies for filtering
  const allTechnologies = Array.from(
    new Set(displayProjects.flatMap(project => project.techStack))
  ).sort();

  // Filter projects
  const filteredProjects = displayProjects.filter(project => {
    const matchesFilter = filter === 'all' || 
      project.techStack.some(tech => tech.toLowerCase().includes(filter.toLowerCase()));
    
    const matchesSearch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <LoadingSkeleton type="card" count={6} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary rounded-full text-sm font-semibold mb-4 border border-primary/20"
          >
            MY WORK
          </motion.span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">Featured </span>
            <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            A showcase of software engineering projects, AI solutions, and innovative applications 
            built with modern technologies and best practices.
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto mb-6"
          >
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mb-4"
          >
            <motion.button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All ({displayProjects.length})
            </motion.button>
            {allTechnologies.slice(0, 8).map((tech) => (
              <motion.button
                key={tech}
                onClick={() => setFilter(tech)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  filter === tech
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tech}
              </motion.button>
            ))}
          </motion.div>

          {/* Active Filter */}
          <AnimatePresence>
            {filter !== 'all' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-block bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-xl mb-4"
              >
                <span className="text-sm">
                  Filtering by: <strong>{filter}</strong>
                </span>
                <button
                  onClick={() => setFilter('all')}
                  className="ml-3 text-primary hover:text-purple-600"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onFilterChange={handleFilterChange}
              hasDetail={projectDetailIds.has(project.id)}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No projects match your search criteria. Try adjusting your filters.
            </p>
            <CustomButton
              variant="primary"
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </CustomButton>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="p-8 bg-gradient-to-br from-primary/5 to-purple-600/5 rounded-2xl border border-primary/20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HiOutlineLightBulb className="text-3xl text-primary" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Have a Project in Mind?
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
              Let's collaborate to build something innovative and impactful together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <CustomButton variant="primary" size="lg" icon={<FaArrowRight />}>
                  Start a Project
                </CustomButton>
              </Link>
              <CustomButton
                variant="outline"
                size="lg"
                href={displayProjects.length > 0 ? displayProjects[0].githubUrl : 'https://github.com/usman'}
                icon={<FaGithub />}
              >
                View GitHub
              </CustomButton>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-primary/20">
              <div>
                <div className="text-2xl font-bold text-primary">{displayProjects.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{allTechnologies.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Technologies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {displayProjects.filter(p => p.featured).length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Featured</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;