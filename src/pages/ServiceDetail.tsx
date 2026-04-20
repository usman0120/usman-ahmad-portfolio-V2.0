// pages/ServiceDetail.tsx
import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useServices } from '../hooks/useFirestore';
import { fadeUp, staggerContainer, slideInLeft, slideInRight } from '../utils/animations';
import { 
  FaArrowLeft, FaArrowRight, FaCode, FaBrain, FaCloud, 
  FaRobot, FaChartLine, FaCogs, FaMobileAlt, FaPaintBrush,
  FaShoppingCart, FaDatabase, FaLock, FaServer, FaRocket,
  FaCheckCircle, FaStar, FaQuoteLeft
} from 'react-icons/fa';
import type { Service, ServiceFeature, ServiceProcess } from '../firebase/models';

// Icon mapping for service icons
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

// Feature icon mapping with React Icons
const featureIconMap: Record<string, React.ReactNode> = {
  bolt: <span className="text-2xl">⚡</span>,
  'mobile-alt': <FaMobileAlt className="text-xl" />,
  'shield-alt': <span className="text-2xl">🛡️</span>,
  search: <span className="text-2xl">🔍</span>,
  'sync-alt': <span className="text-2xl">🔄</span>,
  headset: <span className="text-2xl">🎧</span>,
  'user-friends': <span className="text-2xl">👥</span>,
  'project-diagram': <span className="text-2xl">📊</span>,
  cube: <span className="text-2xl">🧊</span>,
  palette: <FaPaintBrush className="text-xl" />,
  tasks: <span className="text-2xl">✅</span>,
  'layer-group': <span className="text-2xl">📚</span>,
  mobile: <FaMobileAlt className="text-xl" />,
  th: <span className="text-2xl">🔲</span>,
  image: <span className="text-2xl">🖼️</span>,
  'hand-pointer': <span className="text-2xl">👆</span>,
  'tachometer-alt': <span className="text-2xl">⚡</span>,
  globe: <span className="text-2xl">🌐</span>,
  'box-open': <span className="text-2xl">📦</span>,
  'credit-card': <span className="text-2xl">💳</span>,
  warehouse: <span className="text-2xl">🏭</span>,
  'shopping-cart': <FaShoppingCart className="text-xl" />,
  bullhorn: <span className="text-2xl">📢</span>,
  'chart-line': <FaChartLine className="text-xl" />,
  brain: <FaBrain className="text-xl" />,
  robot: <FaRobot className="text-xl" />,
  microchip: <span className="text-2xl">💻</span>,
  'cloud-upload-alt': <FaCloud className="text-xl" />,
  database: <FaDatabase className="text-xl" />,
  'code-branch': <span className="text-2xl">🌿</span>,
  cogs: <FaCogs className="text-xl" />,
  'chart-bar': <FaChartLine className="text-xl" />,
  lightbulb: <span className="text-2xl">💡</span>,
  rocket: <FaRocket className="text-xl" />,
  star: <FaStar className="text-xl" />,
  crown: <span className="text-2xl">👑</span>,
  gem: <span className="text-2xl">💎</span>
};

const ServiceDetail: React.FC = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const navigate = useNavigate();
  const { services, loading } = useServices();
  
  const service = useMemo(() => {
    if (!services || !serviceSlug) return null;
    return services.find((s: Service) => s.slug === serviceSlug) || null;
  }, [services, serviceSlug]);

  useEffect(() => {
    if (!loading && services && serviceSlug && !service) {
      navigate('/services', { replace: true });
    }
  }, [loading, services, serviceSlug, service, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Service Not Found</h2>
          <Link to="/services" className="text-primary hover:underline">
            Return to Services
          </Link>
        </div>
      </div>
    );
  }

  const displayName = service.slug?.toUpperCase().replace(/-/g, ' ') || service.title;

  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      {/* Back Navigation */}
      <div className="container mx-auto px-6 max-w-7xl pt-20">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors group"
        >
          <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
          <span>Back to Services</span>
        </Link>
      </div>

      {/* Service Header - Enhanced Hero Section */}
      <section className="service-header relative py-6 md:py-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20" />
        <div className="absolute top-20 -right-20 w-80 h-80 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Service Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full text-sm font-semibold mb-6 border border-purple-200 dark:border-purple-700">
                {iconMap[service.icon] || <FaCode className="text-base" />}
                {displayName}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              {service.title}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              {service.tagline}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
              >
                Get Started
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary transition-all duration-300"
              >
                View My Work
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm"
            >
              {[
                '100% Client Satisfaction',
                'On-Time Delivery',
                'Post-Launch Support'
              ].map((text, i) => (
                <span key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaCheckCircle className="text-green-500" />
                  {text}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Service Overview - Enhanced */}
      <section className="py-8 md:py-10 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              variants={slideInLeft}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">Overview</span>
                <div className="h-px w-12 bg-gradient-to-r from-primary to-transparent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Tailored Digital{' '}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Experiences
                </span>
              </h2>
              
              {/* Quote */}
              <div className="flex gap-3 mb-6 p-5 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
                <FaQuoteLeft className="text-primary/30 text-xl flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300 italic">
                  Every project begins with understanding your unique business requirements and target audience.
                </p>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
                {service.description}
              </p>
              
              {service.overview?.map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-600 dark:text-gray-400 mb-4 flex items-start gap-3">
                  <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
                  <span>{paragraph}</span>
                </p>
              ))}
              
              {/* Technologies */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaCode className="text-primary" />
                  Technologies I Work With
                </h4>
                <div className="flex flex-wrap gap-2">
                  {service.technologies?.map((tech: string, index: number) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={slideInRight}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl opacity-20 blur-xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700">
                <img
                  src={service.imageUrl || 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                  alt={service.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-purple-500/10 rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features - Enhanced */}
      <section className="py-6 md:py-10 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              KEY FEATURES
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose My{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {displayName}
              </span>{' '}
              Service
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Quality, performance, and attention to detail are at the core of every project I deliver.
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {service.features?.map((feature: ServiceFeature, index: number) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="feature-card group bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition-all duration-300"
              >
                {/* Icon with Gradient Background */}
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-purple-600 dark:text-purple-400">
                    {featureIconMap[feature.icon] || <FaStar className="text-xl" />}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Indicator */}
                <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-primary to-purple-600 group-hover:w-12 transition-all duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Development Process - Enhanced */}
      <section className="py-8 md:py-10 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              MY PROCESS
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How I Approach{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {displayName}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A structured, transparent process that ensures quality results at every stage.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 lg:left-1/2 transform lg:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-600 to-blue-500" />
            
            <div className="space-y-12">
              {service.process?.map((step: ServiceProcess, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`process-step relative flex flex-col lg:flex-row items-start gap-6 lg:gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Step Number Circle */}
                  <div className={`absolute left-0 lg:left-1/2 transform lg:-translate-x-1/2 z-10 ${
                    index % 2 === 0 ? 'lg:translate-x-0' : ''
                  }`}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 border-4 border-white dark:border-gray-800"
                    >
                      {step.step}
                    </motion.div>
                  </div>
                  
                  {/* Content */}
                  <div className={`flex-1 pl-24 lg:pl-0 ${
                    index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'
                  }`}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Spacer for alternating layout */}
                  <div className="hidden lg:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section id="contact" className="py-8 md:py-10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-blue-600 dark:from-primary/90 dark:via-purple-600/90 dark:to-blue-600/90" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        
        {/* Animated Dots Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse" />
          <div className="absolute top-20 right-20 w-3 h-3 bg-white rounded-full animate-pulse delay-100" />
          <div className="absolute bottom-10 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse delay-200" />
          <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-white rounded-full animate-pulse delay-300" />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            >
              <FaRocket className="text-4xl text-white" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
              Let's discuss how I can help bring your vision to life with a custom solution tailored to your needs.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 hover:shadow-lg transition-all duration-300 group"
              >
                Get in Touch
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                View My Work
              </Link>
            </div>

            {/* Contact Options */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-green-300" />
                Free Initial Consultation
              </span>
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-green-300" />
                NDA Available
              </span>
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-green-300" />
                Quick Response
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;