// pages/Home.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useProfile, useServices, useSkills, useProjects } from '../hooks/useFirestore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { fadeUp, staggerContainer } from '../utils/animations';
import { FaCode, FaBrain, FaCloud, FaArrowRight, FaRobot, FaChartLine, FaCogs, FaGithub, FaExternalLinkAlt, FaStar } from 'react-icons/fa';
import { renderIcon, getCategoryStyle, getProficiencyBarColor } from './Skills';
import type { Service, Skill, Project } from '../firebase/models';

// Animated Background Component
const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-40 -right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  to?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon,
  to
}) => {
  const baseClasses = 'relative font-medium transition-all duration-300 focus:outline-none overflow-hidden group rounded-xl inline-flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105',
    secondary: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-primary border border-primary/30 hover:border-primary hover:bg-primary hover:text-white',
    outline: 'bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-primary hover:text-primary',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  const buttonContent = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {buttonContent}
    </motion.button>
  );
};

// Typewriter Effect Component
const TypewriterText: React.FC<{ texts: string[] }> = ({ texts }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentFullText.length) {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        } else {
          // Use a separate timeout for the pause before deleting
          const pauseTimeout = setTimeout(() => setIsDeleting(true), 2000);
          return () => clearTimeout(pauseTimeout);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex, texts]);

  return (
    <span className="inline-block">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-8 bg-primary ml-1"
      />
    </span>
  );
};

// Service Card Component for Home Page
interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const getIcon = (iconName: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      FaCode: <FaCode className="text-2xl" />,
      FaBrain: <FaBrain className="text-2xl" />,
      FaRobot: <FaRobot className="text-2xl" />,
      FaCloud: <FaCloud className="text-2xl" />,
      FaChartLine: <FaChartLine className="text-2xl" />,
      FaCogs: <FaCogs className="text-2xl" />
    };
    return icons[iconName] || <FaCode className="text-2xl" />;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* Gradient border on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      <div className="absolute inset-[2px] bg-white dark:bg-gray-800 rounded-2xl" />
      
      <div className="relative p-6 z-10">
        {/* Icon */}
        <motion.div
          className="w-14 h-14 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:from-primary group-hover:to-purple-500 transition-all duration-300"
          whileHover={{ rotate: 5, scale: 1.1 }}
        >
          <div className="text-primary group-hover:text-white transition-colors duration-300">
            {getIcon(service.icon)}
          </div>
        </motion.div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {service.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 line-clamp-3">
          {service.description}
        </p>

        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 text-primary font-medium group/link"
        >
          <span>Learn More</span>
          <FaArrowRight className="text-sm transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
};

// Stats Card Component
interface StatCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="text-primary mb-3 flex justify-center">{icon}</div>
      <motion.div 
        className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1"
      >
        {value}
      </motion.div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </motion.div>
  );
};

// Featured Skill Card Component
const FeaturedSkillCard: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => {
  const categoryStyle = getCategoryStyle(skill.category);
  const barColor = getProficiencyBarColor(skill.proficiency);
  const proficiencyPercent = (skill.proficiency / 5) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ scale: 1.02, x: 5 }}
      className="group flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${categoryStyle.iconBg} group-hover:shadow-md transition-all`}>
        {renderIcon(skill.icon, `text-xl ${categoryStyle.accentColor}`)}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-end mb-1.5">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate flex items-center gap-2">
            {skill.name}
            {skill.featured && <FaStar className="text-yellow-500 text-[10px]" title="Featured" />}
          </h4>
          <span className={`text-xs font-bold ${categoryStyle.accentColor}`}>
            {Math.round(proficiencyPercent)}%
          </span>
        </div>
        
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${barColor}`}
            initial={{ width: 0 }}
            whileInView={{ width: `${proficiencyPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, type: "spring" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Featured Project Card Component
const FeaturedProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4">
          <span className="bg-gradient-to-r from-primary to-purple-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">⭐ Featured</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-5">
          {project.techStack.slice(0, 3).map((tech, i) => (
            <span key={i} className="px-2.5 py-1 text-[10px] font-semibold bg-primary/10 text-primary rounded-full">
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2.5 py-1 text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex gap-3 mt-auto">
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors">
            <FaGithub /> Code
          </a>
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-md transition-colors">
              <FaExternalLinkAlt /> Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main Home Component
const Home: React.FC = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { services, loading: servicesLoading } = useServices();
  const { skills, loading: skillsLoading } = useSkills();
  const { projects, loading: projectsLoading } = useProjects();

  const profileName = 'Usman Ahmad';
  const profileImage = profile?.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80";

  const displayedServices = useMemo(() => {
    if (!services || services.length === 0) {
      return [];
    }
    const featured = services.filter((s: Service) => s.featured).slice(0, 4);
    return featured.length > 0 ? featured : services.slice(0, 4);
  }, [services]);

  const featuredSkills = useMemo(() => {
    if (!skills) return [];
    return skills.filter(s => s.featured).slice(0, 12);
  }, [skills]);

  const featuredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(p => p.featured).slice(0, 6);
  }, [projects]);

  const stats = useMemo(() => [
    {
      value: profile?.stats?.projects ? `${profile.stats.projects}+` : '25+',
      label: 'Projects Delivered',
      icon: <FaCode className="w-6 h-6" />
    },
    {
      value: profile?.stats?.clients ? `${profile.stats.clients}+` : '15+',
      label: 'Happy Clients',
      icon: <FaChartLine className="w-6 h-6" />
    },
    {
      value: profile?.stats?.experience ? `${profile.stats.experience}+` : '5+',
      label: 'Years Experience',
      icon: <FaBrain className="w-6 h-6" />
    }
  ], [profile]);

  const rotatingTitles = useMemo(() => [
    'Software Engineer',
    'AI Solution Architect',
    'Full Stack Developer',
    'Problem Solver'
  ], []);

  const handleDownloadResume = () => {
    if (!profile?.resumeUrl) return;
    const link = document.createElement('a');
    link.href = profile.resumeUrl;
    link.download = 'Usman_Ahmad_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background">
        <LoadingSkeleton type="card" count={1} className="w-full max-w-4xl h-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-background transition-colors duration-300">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative py-20">
        <div className="container-custom text-center px-4 max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-5xl mx-auto"
          >
            {/* Profile Image */}
            <motion.div variants={fadeUp} className="mb-8 relative inline-block">
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-full opacity-75 blur-sm"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative bg-white dark:bg-gray-800 p-1.5 rounded-full">
                <motion.img
                  src={profileImage}
                  alt={profileName}
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </div>
            </motion.div>

            {/* Name and Title */}
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">Usman </span>
              <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
                Ahmad
              </span>
            </motion.h1>

            <motion.div variants={fadeUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 h-12">
              <TypewriterText texts={rotatingTitles} />
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Building innovative solutions at the intersection of software engineering and artificial intelligence. 
              I craft scalable applications and intelligent systems that solve real-world problems.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center items-center">
              <Button variant="primary" size="lg" to="/projects">
                View My Work
              </Button>
              
              {profile?.resumeUrl ? (
                <Button variant="secondary" size="lg" onClick={handleDownloadResume}>
                  Download Resume
                </Button>
              ) : (
                <Button variant="secondary" size="lg" disabled>
                  Resume Coming Soon
                </Button>
              )}
              
              <Button variant="outline" size="lg" to="/contact">
                Let's Connect
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto mt-16"
            >
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  delay={0.5 + index * 0.2}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="py-20 relative bg-white/40 dark:bg-gray-800/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4"
            >
              MY EXPERTISE
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Featured <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Skills</span>
            </h2>
          </motion.div>

          {skillsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : featuredSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {featuredSkills.map((skill, index) => (
                <FeaturedSkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No featured skills found.</div>
          )}

          {featuredSkills.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" to="/skills" icon={<FaArrowRight />}>
                View All Skills
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4"
            >
              PORTFOLIO
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Featured <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Projects</span>
            </h2>
          </motion.div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <FeaturedProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No featured projects found.</div>
          )}

          {featuredProjects.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" to="/projects" icon={<FaArrowRight />}>
                View All Projects
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 relative bg-white/40 dark:bg-gray-800/20">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4"
            >
              WHAT I OFFER
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white"
            >
              Engineering Digital <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Excellence</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto"
            >
              Comprehensive solutions tailored to your unique business challenges
            </motion.p>
          </motion.div>

          {/* Services Grid */}
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : displayedServices.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {displayedServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <p className="text-gray-500 dark:text-gray-400">No services available yet.</p>
            </motion.div>
          )}

          {/* View All Services Link */}
          {displayedServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-center mt-12"
            >
              <Button variant="outline" size="lg" to="/services" icon={<FaArrowRight />}>
                View All Services
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;