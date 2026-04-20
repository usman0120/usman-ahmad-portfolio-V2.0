// pages/ProjectDetail.tsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects, useProjectDetails } from '../hooks/useFirestore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { FaGithub, FaExternalLinkAlt, FaCalendarAlt, FaCheckCircle, FaArrowLeft, FaUser, FaTools, FaLightbulb, FaRocket, FaFileAlt } from 'react-icons/fa';
import { HiOutlineLightBulb } from 'react-icons/hi';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, loading: projectsLoading } = useProjects();
  const { projectDetails, loading: detailsLoading } = useProjectDetails();

  const project = projects.find(p => p.id === projectId);
  const detail = projectDetails.find(d => d.projectId === projectId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  const loading = projectsLoading || detailsLoading;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <LoadingSkeleton type="card" count={1} className="h-96" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h2>
          <Link to="/projects" className="text-primary hover:underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <Link to="/projects" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-8 transition-colors">
          <FaArrowLeft /> Back to Projects
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-purple-600/5 to-blue-500/5 border border-primary/20 p-8 md:p-12 mb-12"
        >
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {detail?.services?.[0] || 'Software Development'}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center gap-2">
                    <FaGithub /> View Code
                  </a>
                )}
              </div>
            </div>
            <div className="lg:w-1/3">
              <img src={project.imageUrl} alt={project.title} className="rounded-xl shadow-2xl w-full h-64 object-cover" />
            </div>
          </div>
        </motion.div>

        {detail ? (
          <>
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2 space-y-8">
                {/* Overview */}
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <HiOutlineLightBulb className="text-primary" /> Project Overview
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{detail.overview}</p>
                </motion.section>

                {/* Challenges */}
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaTools className="text-primary" /> Key Challenges
                  </h2>
                  <ul className="space-y-3">
                    {detail.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                        <span className="text-primary mt-1">▹</span> {challenge}
                      </li>
                    ))}
                  </ul>
                </motion.section>

                {/* Solution */}
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaLightbulb className="text-primary" /> My Solution
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{detail.solutions}</p>
                </motion.section>
              </div>

              {/* Sidebar */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Project Details</h3>
                  
                  <div className="space-y-4">
                    {detail.client && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Client</h4>
                        <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2"><FaUser className="text-primary/50" /> {detail.client}</p>
                      </div>
                    )}
                    
                    {detail.date && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Timeline</h4>
                        <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2"><FaCalendarAlt className="text-primary/50" /> {new Date(detail.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                      </div>
                    )}

                    {detail.services.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {detail.services.map((s, i) => <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">{s}</span>)}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((t, i) => <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">{t}</span>)}
                      </div>
                    </div>

                    {detail.results.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Results</h4>
                        <ul className="space-y-2">
                          {detail.results.map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Gallery */}
            {detail.gallery.length > 0 && (
              <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FaRocket className="text-primary" /> Project Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {detail.gallery.map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                      <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-48 object-cover" />
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
            <FaFileAlt className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Detailed information coming soon</h3>
            <p className="text-gray-600 dark:text-gray-400">This project's detailed case study is being prepared.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;