/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Services.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useServices } from '../hooks/useFirestore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { staggerContainer} from '../utils/animations';
import { 
  FaCode, FaBrain, FaCloud, FaArrowRight, FaRobot, 
  FaChartLine, FaCogs, FaMobileAlt, FaPaintBrush, 
  FaShoppingCart, FaDatabase, FaLock, FaServer,
  FaRocket, FaCheckCircle, FaStar, FaShieldAlt,
  FaUsers, FaLightbulb, FaTrophy, FaClock
} from 'react-icons/fa';
import type { Service } from '../firebase/models';

// Icon mapping with proper typing
const iconMap: Record<string, React.ReactNode> = {
  FaCode: <FaCode className="text-2xl" />,
  FaBrain: <FaBrain className="text-2xl" />,
  FaRobot: <FaRobot className="text-2xl" />,
  FaCloud: <FaCloud className="text-2xl" />,
  FaChartLine: <FaChartLine className="text-2xl" />,
  FaCogs: <FaCogs className="text-2xl" />,
  FaMobileAlt: <FaMobileAlt className="text-2xl" />,
  FaPaintBrush: <FaPaintBrush className="text-2xl" />,
  FaShoppingCart: <FaShoppingCart className="text-2xl" />,
  FaDatabase: <FaDatabase className="text-2xl" />,
  FaLock: <FaLock className="text-2xl" />,
  FaServer: <FaServer className="text-2xl" />
};

// Service Card Component - Clean, Professional & Modern
interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-white/[0.08] shadow-sm hover:shadow-xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 overflow-hidden"
    >
      {/* Top accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-7 sm:p-8 flex flex-col flex-grow">
        {/* Header: Icon & Badge */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-purple-300 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
            {iconMap[service.icon] || <FaCode className="text-2xl" />}
          </div>

          {service.featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full border border-amber-400/20">
              <FaStar className="text-[10px]" />
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-200">
          {service.title}
        </h3>

        {/* Tagline / Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
          {service.tagline || service.description}
        </p>

        {/* Key Features Preview (if present) */}
        {service.features && service.features.length > 0 && (
          <div className="mb-6 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">
              Highlights
            </p>
            <ul className="space-y-2">
              {service.features.slice(0, 2).map((feature: any, i: number) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <FaCheckCircle className="text-primary text-xs mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{feature.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies Pills */}
        {service.technologies && service.technologies.length > 0 && (
          <div className="mt-auto pt-4 mb-6">
            <div className="flex flex-wrap gap-1.5">
              {service.technologies.slice(0, 3).map((tech: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg"
                >
                  {tech}
                </span>
              ))}
              {service.technologies.length > 3 && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">
                  +{service.technologies.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Link Button */}
        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center justify-between w-full pt-4 border-t border-gray-100 dark:border-white/[0.06] group/link text-sm font-semibold text-primary dark:text-purple-400 hover:text-purple-600 transition-colors"
        >
          <span>Explore Details</span>
          <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover/link:bg-primary group-hover/link:text-white transition-all duration-200">
            <FaArrowRight className="text-xs transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

// Process Step Component
interface ProcessStepProps {
  step: number;
  title: string;
  description: string;
  index: number;
  icon: React.ReactNode;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ 
  step, title, description, index, icon 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative"
    >
      {/* Connector line */}
      {index < 4 && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary to-transparent opacity-20 group-hover:opacity-100 transition-opacity duration-500" 
             style={{ height: 'calc(100% + 2rem)' }} />
      )}
      
      <div className="relative flex gap-6">
        {/* Step Number with Icon */}
        <div className="flex-shrink-0 relative">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative z-10 w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
          >
            <div className="text-white text-xl">
              {icon}
            </div>
          </motion.div>
          <div className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border-2 border-primary">
            <span className="text-xs font-bold text-primary">{step}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 pt-2">
          <motion.div
            whileHover={{ x: 5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              {title}
              {index === 0 && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                  Start Here
                </span>
              )}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Stat Card Component
const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl flex items-center justify-center text-primary text-2xl">
        {icon}
      </div>
      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </motion.div>
  );
};

// Process steps data with icons
const processSteps = [
  {
    step: 1,
    icon: <FaLightbulb />,
    title: 'Discovery & Strategy',
    description: 'We begin with a deep dive into your business goals, target audience, and technical requirements to create a comprehensive project roadmap tailored to your success.'
  },
  {
    step: 2,
    icon: <FaPaintBrush />,
    title: 'Architecture & Design',
    description: 'I design scalable system architecture and create intuitive user interfaces that align with your brand identity and exceed user expectations.'
  },
  {
    step: 3,
    icon: <FaCode />,
    title: 'Development & Integration',
    description: 'Using modern tech stacks and industry best practices, I build robust, secure solutions with clean, maintainable code and seamless third-party integrations.'
  },
  {
    step: 4,
    icon: <FaShieldAlt />,
    title: 'Testing & Optimization',
    description: 'Rigorous testing ensures reliability and peak performance. I optimize for speed, security, and user experience across all devices and platforms.'
  },
  {
    step: 5,
    icon: <FaRocket />,
    title: 'Deployment & Growth',
    description: 'Smooth deployment with continuous monitoring and dedicated support to ensure your solution scales seamlessly with your business growth.'
  }
];

const Services: React.FC = () => {
  const { services, loading } = useServices();

  const featuredServices = useMemo(() => {
    if (!services) return [];
    return [...services].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [services]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          <LoadingSkeleton type="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-14 md:pb-16 overflow-hidden">
        {/* Soft Background Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-28 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }} />
        </div>
        
        <div className="container mx-auto px-6 max-w-5xl relative">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary dark:text-purple-300 rounded-full text-xs sm:text-sm font-semibold mb-6 border border-primary/20">
              <FaStar className="text-[10px]" />
              MY SERVICES
            </span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              Transforming Ideas into{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Powerful Solutions
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Comprehensive software engineering and AI solutions tailored to elevate your business with clean architecture and reliable execution.
            </p>
            
            {/* Hero Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-gray-200/80 dark:border-white/10 shadow-sm text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <FaCheckCircle className="text-emerald-500 text-xs" />
                <span className="font-medium">100% Client Satisfaction</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-gray-200/80 dark:border-white/10 shadow-sm text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <FaTrophy className="text-amber-500 text-xs" />
                <span className="font-medium">2+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-gray-200/80 dark:border-white/10 shadow-sm text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <FaUsers className="text-primary text-xs" />
                <span className="font-medium">05+ Happy Clients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              WHAT I OFFER
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Tailored Services for Your Success
            </h2>
          </motion.div>

          {featuredServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Services Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                I'm currently updating my service offerings. Check back soon!
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-16 bg-white dark:bg-gray-800/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            <StatCard value="100%" label="Client Satisfaction" icon={<FaStar />} />
            <StatCard value="10+" label="Projects Completed" icon={<FaRocket />} />
            <StatCard value="24/7" label="Support Available" icon={<FaClock />} />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary rounded-full text-sm font-semibold mb-4 border border-primary/20"
            >
              MY APPROACH
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How I Bring Your Vision to Life
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              A structured, collaborative process that ensures exceptional quality at every stage
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <ProcessStep
                  key={step.step}
                  step={step.step}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-blue-600 rounded-3xl"
          >
            {/* Animated Background Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            />
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} />
            </div>
            
            <div className="relative z-10 p-12 md:p-16 text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              >
                <FaRocket className="text-4xl text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                Ready to Build Something Amazing?
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-white/80 text-lg mb-8 max-w-2xl mx-auto"
              >
                Let's discuss your project and create a tailored solution that drives real results for your business.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>Start a Conversation</span>
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/projects"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  <span>View My Work</span>
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/60 text-sm"
              >
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-green-400" />
                  Free Consultation
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-green-400" />
                  No Obligation Quote
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-green-400" />
                  NDA Available
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;