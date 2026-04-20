// pages/About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../hooks/useFirestore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { staggerContainer, slideInLeft, slideInRight, fadeUp } from '../utils/animations';
import { 
  FaRocket, FaStore, FaUserGraduate, FaCode, FaBrain, 
  FaCloud, FaCheckCircle, FaArrowRight, FaMapPin, 
  FaEnvelope, FaGraduationCap, FaHome, FaBuilding,
  FaChartLine, FaLightbulb, FaUsers, FaLaptopCode,
  FaQuoteRight, FaStar, FaAward, FaBriefcase, FaHeart
} from 'react-icons/fa';

// Define proper types
interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Certification {
  name: string;
  year?: string;
}

// Card component with modern design
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  gradient = false,
  glass = false
}) => {
  const baseClasses = 'rounded-3xl transition-all duration-500';
  
  const styleClasses = glass
    ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50'
    : gradient 
      ? 'bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 border border-gray-200 dark:border-gray-700'
      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg';
  
  const hoverClasses = hover ? 'hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30 dark:hover:shadow-primary/20' : '';

  const classes = `${baseClasses} ${styleClasses} ${hoverClasses} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Section Title Component
interface SectionTitleProps {
  subtitle: string;
  title: string;
  highlightedTitle?: string;
  align?: 'left' | 'center';
  description?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  subtitle, 
  title, 
  highlightedTitle, 
  align = 'center',
  description 
}) => {
  const alignmentClasses = align === 'center' ? 'text-center' : 'text-left';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${alignmentClasses} mb-12`}
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="relative inline-block"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 blur-xl rounded-full" />
        <span className="relative inline-block px-5 py-2 bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
          {subtitle}
        </span>
      </motion.span>
      
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4">
        <span className="text-gray-900 dark:text-white">{title} </span>
        {highlightedTitle && (
          <span className="relative">
            <span className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-600/20 blur-xl rounded-lg" />
            <span className="relative bg-gradient-to-r from-primary via-purple-600 to-blue-500 bg-clip-text text-transparent">
              {highlightedTitle}
            </span>
          </span>
        )}
      </h2>
      
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          {description}
        </p>
      )}
      
      {align === 'center' && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-24 h-1 bg-gradient-to-r from-primary via-purple-600 to-transparent mx-auto mt-6 rounded-full"
        />
      )}
    </motion.div>
  );
};

// Info Item Component
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay?: number;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-600/5 transition-all duration-300"
    >
      <div className="w-11 h-11 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </motion.div>
  );
};

// Help Card Component
interface HelpCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  badge?: string;
}

const HelpCard: React.FC<HelpCardProps> = ({ icon, title, description, delay, badge }) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
      className="group relative p-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 hover:border-primary/40 hover:shadow-2xl transition-all duration-500 overflow-hidden"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-purple-600/0 to-blue-500/0 group-hover:from-primary/5 group-hover:via-purple-600/5 group-hover:to-blue-500/5 transition-all duration-500 rounded-3xl" />
      
      {badge && (
        <span className="absolute top-4 right-4 px-2.5 py-1 bg-gradient-to-r from-primary/20 to-purple-600/20 text-primary text-xs font-medium rounded-full border border-primary/20">
          {badge}
        </span>
      )}
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:from-primary group-hover:to-purple-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
          <div className="text-primary group-hover:text-white transition-colors duration-500 text-2xl">
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
        
        <div className="mt-5 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span>Learn more</span>
          <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

// Timeline Item Component
interface TimelineItemProps {
  education: Education;
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ education, index }) => {
  const isLeft = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className={`flex flex-col md:flex-row items-start gap-6 md:gap-0 relative ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Date */}
      <div className={`md:w-1/2 ${isLeft ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 blur-lg rounded-xl" />
            <div className="relative px-5 py-2.5 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-xl border border-primary/20">
              <span className="text-primary font-semibold">
                {education.startDate} — {education.current ? 'Present' : education.endDate}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Timeline Dot */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 blur-md rounded-full" />
          <div className="relative w-5 h-5 bg-gradient-to-br from-primary to-purple-600 rounded-full border-4 border-white dark:border-gray-900 shadow-xl" />
        </div>
      </div>
      
      {/* Content */}
      <div className={`md:w-1/2 ${isLeft ? 'md:pl-16' : 'md:pr-16'}`}>
        <Card hover className="p-7">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl flex items-center justify-center text-primary">
              <FaGraduationCap className="text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{education.institution}</h3>
              <p className="text-primary font-medium text-sm">
                {education.degree} in {education.field}
              </p>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {education.description}
          </p>
          
          {education.current && (
            <div className="mt-5 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
                Currently Pursuing
              </span>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
};

// Stat Badge Component
interface StatBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const StatBadge: React.FC<StatBadgeProps> = ({ icon, label, value }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </motion.div>
  );
};

const About: React.FC = () => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton type="card" count={3} className="mb-8" />
        </div>
      </div>
    );
  }

  const profileName = profile?.name || 'Usman Ahmad';
  const firstName = profileName.split(' ')[0];
  const lastName = profileName.split(' ').slice(1).join(' ');
  const profileTitle = profile?.title || 'Software Engineer & AI Solution Architect';
  const profileImage = profile?.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80";
  const profileLocation = profile?.location || 'Lahore, Pakistan';
  const profileUniversity = profile?.university || 'University of Engineering & Technology, Lahore';
  const profileDepartment = profile?.department || 'Software Engineering';
  const profileHometown = profile?.hometown || 'Lahore, Pakistan';
  const profileEmail = profile?.email || 'usman@example.com';
  const profileBio = profile?.bio || "I'm a passionate Software Engineer and AI Solution Architect with expertise in building scalable applications and intelligent systems. With a strong foundation in computer science and a keen interest in artificial intelligence, I bridge the gap between innovative technology and practical business solutions.";

  const education: Education[] = profile?.education && profile.education.length > 0 
    ? profile.education 
    : [
        {
          institution: "University of Engineering & Technology (UET), Lahore",
          degree: "Bachelor of Science",
          field: "Software Engineering",
          startDate: "2023",
          endDate: "2027",
          current: true,
          description: "Currently pursuing my degree with a focus on software architecture, artificial intelligence, and cloud computing. Maintaining a strong academic record while actively participating in hackathons and building real-world projects."
        }
      ];

  const goals: string[] = profile?.goals && profile.goals.length > 0 
    ? profile.goals 
    : [
        "Build enterprise-grade AI solutions",
        "Master cloud-native architecture",
        "Contribute to open-source AI projects",
        "Lead innovative tech teams",
        "Create impactful developer tools"
      ];

  const experience: string[] = profile?.experience && profile.experience.length > 0 
    ? profile.experience 
    : [
        "Full-stack web application development",
        "AI/ML model integration and deployment",
        "Cloud architecture and DevOps",
        "System design and scalability",
        "Technical leadership and mentoring"
      ];

  const certifications: Certification[] = profile?.certifications && profile.certifications.length > 0 
    ? profile.certifications 
    : [];

  // Stats from profile
  const stats = {
    projects: profile?.stats?.projects || '25+',
    clients: profile?.stats?.clients || '15+',
    experience: profile?.stats?.experience || '5+'
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative inline-block"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-600/30 blur-2xl rounded-full" />
            <span className="relative inline-block px-6 py-2 bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
              GET TO KNOW ME
            </span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 mt-6">
            <span className="text-gray-900 dark:text-white">About </span>
            <span className="relative">
              <span className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-600/20 blur-xl rounded-lg" />
              <span className="relative bg-gradient-to-r from-primary via-purple-600 to-blue-500 bg-clip-text text-transparent">
                Me
              </span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Software Engineer & AI Solution Architect passionate about building innovative solutions 
            that make a difference.
          </p>
          
          {/* Stats Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            <StatBadge icon={<FaCode />} label="Projects" value={stats.projects} />
            <StatBadge icon={<FaUsers />} label="Clients" value={stats.clients} />
            <StatBadge icon={<FaBriefcase />} label="Years Exp" value={stats.experience} />
          </motion.div>
        </motion.div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Profile Card */}
          <motion.div
            variants={slideInLeft}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Card className="p-7 text-center overflow-hidden" hover glass>
              {/* Profile Image */}
              <div className="relative inline-block mb-6">
                <motion.div 
                  className="absolute -inset-1.5 bg-gradient-to-r from-primary via-purple-600 to-blue-500 rounded-full opacity-75 blur-xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full opacity-50 blur-md"
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative bg-white dark:bg-gray-800 p-1 rounded-full">
                  <img
                    src={profileImage}
                    alt={profileName}
                    className="w-44 h-44 md:w-48 md:h-48 rounded-full object-cover border-2 border-white dark:border-gray-700"
                  />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">
                <span className="text-gray-900 dark:text-white">{firstName}</span>
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> {lastName}</span>
              </h3>
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-full mb-6 border border-primary/20">
                <FaLaptopCode className="text-primary text-xs" />
                <p className="text-primary text-sm font-medium">{profileTitle}</p>
              </div>
              
              <div className="space-y-3">
                <InfoItem icon={<FaMapPin />} label="Location" value={profileLocation} delay={0.1} />
                <InfoItem icon={<FaBuilding />} label="University" value={profileUniversity} delay={0.2} />
                <InfoItem icon={<FaCode />} label="Department" value={profileDepartment} delay={0.3} />
                <InfoItem icon={<FaHome />} label="Hometown" value={profileHometown} delay={0.4} />
                <InfoItem icon={<FaEnvelope />} label="Email" value={profileEmail} delay={0.5} />
              </div>

              {/* Quick Contact Button */}
              <Link
                to="/contact"
                className="mt-7 relative inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-medium rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 group overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2">
                  <span>Get in Touch</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Card>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            variants={slideInRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="p-8" hover>
              <div className="flex items-center gap-4 mb-7">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl" />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl flex items-center justify-center text-primary text-xl">
                    <FaLightbulb />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  <span className="text-gray-900 dark:text-white">My </span>
                  <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Story</span>
                </h2>
              </div>
              
              <div className="relative mb-8">
                <FaQuoteRight className="absolute -top-2 -left-2 text-4xl text-primary/10" />
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg pl-6">
                  {profileBio}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Expertise */}
                <div>
                  <h4 className="text-lg font-bold mb-5 flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FaCode className="text-primary text-sm" />
                    </div>
                    <span className="text-gray-900 dark:text-white">Core Expertise</span>
                  </h4>
                  <ul className="space-y-3">
                    {experience.map((exp: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 group"
                      >
                        <div className="mt-1 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FaCheckCircle className="text-primary text-xs" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {exp}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                {/* Goals */}
                <div>
                  <h4 className="text-lg font-bold mb-5 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600/10 rounded-lg flex items-center justify-center">
                      <FaChartLine className="text-purple-500 text-sm" />
                    </div>
                    <span className="text-gray-900 dark:text-white">Professional Goals</span>
                  </h4>
                  <ul className="space-y-3">
                    {goals.map((goal: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 group"
                      >
                        <div className="mt-1 w-5 h-5 bg-purple-600/10 rounded-full flex items-center justify-center group-hover:bg-purple-600/20 transition-colors">
                          <FaStar className="text-purple-500 text-xs" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {goal}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Certifications */}
              {certifications.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <FaAward className="text-blue-500 text-sm" />
                    </div>
                    <span className="text-gray-900 dark:text-white">Certifications</span>
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {certifications.map((cert: Certification, index: number) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 rounded-full text-sm text-primary font-medium cursor-default"
                      >
                        {cert.name} {cert.year && <span className="text-gray-500">({cert.year})</span>}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Education Timeline */}
        <SectionTitle 
          subtitle="MY JOURNEY" 
          title="Education &" 
          highlightedTitle="Background"
          description="A timeline of my academic journey and continuous learning"
        />
        
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative">
            {/* Timeline line with gradient */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full">
              <div className="w-0.5 h-full bg-gradient-to-b from-primary via-purple-600 to-transparent" />
            </div>
            
            <div className="space-y-16">
              {education.map((edu: Education, index: number) => (
                <TimelineItem key={edu.id || index} education={edu} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto pl-8"
        >
          <Card className="p-8" hover glass>
            <div className="flex items-center gap-4 mb-7">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl flex items-center justify-center text-primary">
                  <FaHeart className="text-lg" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">
                <span className="text-gray-900 dark:text-white">Personal </span>
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Details</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: profileName },
                { label: 'Email', value: profileEmail },
                { label: 'Location', value: profileLocation },
                { label: 'University', value: profileUniversity },
                { label: 'Department', value: profileDepartment },
                { label: 'Hometown', value: profileHometown },
                { label: 'Status', value: 'Available for Opportunities', highlight: true },
                { label: 'Focus', value: 'AI & Full-Stack Development', highlight: true }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition-all duration-300"
                >
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.label}
                  </span>
                  <span className={`text-sm font-semibold ${
                    item.highlight 
                      ? 'bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* How I Can Help You Section */}
        <SectionTitle 
          subtitle="MY SERVICES" 
          title="How I Can" 
          highlightedTitle="Help You"
          description="Tailored solutions designed to meet your unique needs and drive real results"
        />
        
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          <HelpCard
            icon={<FaRocket />}
            title="Startups"
            description="Fast, modern web presence to establish your brand and attract customers. I build scalable MVPs and full-stack applications that grow with your business."
            delay={0.1}
            badge="Popular"
          />
          <HelpCard
            icon={<FaStore />}
            title="Small Businesses"
            description="Upgrade your online visibility with professional, conversion-focused designs. Custom websites and applications that drive real business results."
            delay={0.2}
          />
          <HelpCard
            icon={<FaUserGraduate />}
            title="Students & Educators"
            description="Beautiful portfolio and project websites to showcase your work. I help students and academics present their research and achievements effectively."
            delay={0.3}
          />
          <HelpCard
            icon={<FaUsers />}
            title="Enterprise Teams"
            description="Custom internal tools, dashboards, and AI-powered solutions that streamline operations and enhance team productivity."
            delay={0.4}
            badge="Enterprise"
          />
        </motion.div>

        {/* Additional Help Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <Card gradient className="p-8 md:p-10 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
                Additional <span className="text-primary">Expertise</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="text-center group"
                >
                  <div className="relative inline-block mb-5">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl group-hover:bg-blue-500/30 transition-colors" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-blue-500 text-3xl group-hover:scale-110 transition-transform">
                      <FaCloud />
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Cloud Solutions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Scalable cloud architecture and deployment strategies for growing applications.
                  </p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="text-center group"
                >
                  <div className="relative inline-block mb-5">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-2xl group-hover:bg-purple-500/30 transition-colors" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center text-purple-500 text-3xl group-hover:scale-110 transition-transform">
                      <FaBrain />
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">AI Integration</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Intelligent features powered by machine learning to enhance user experiences.
                  </p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="text-center group"
                >
                  <div className="relative inline-block mb-5">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl group-hover:bg-primary/30 transition-colors" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl flex items-center justify-center text-primary text-3xl group-hover:scale-110 transition-transform">
                      <FaCode />
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Technical Consulting</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Expert guidance on technology stack selection and system architecture.
                  </p>
                </motion.div>
              </div>
              
              {/* CTA */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                  Have a project in mind? Let's discuss how I can help bring your vision to life.
                </p>
                <Link
                  to="/services"
                  className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Explore All Services</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};

export default About;