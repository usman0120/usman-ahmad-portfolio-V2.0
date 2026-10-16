// components/Footer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../hooks/useFirestore';
import { 
  FaLinkedinIn, FaGithub, FaFacebookF, FaBehance, FaWhatsapp,
  FaCode, FaEnvelope,
  FaMapPin, FaArrowRight
} from "react-icons/fa";
import { SiFiverr, SiUpwork, SiFreelancer, SiX } from "react-icons/si";
import { MdEmail, MdLanguage } from "react-icons/md";

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { profile } = useProfile();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks: SocialLink[] = React.useMemo(() => {
    if (!profile?.socialLinks) return [];
    if (!Array.isArray(profile.socialLinks)) return [];
    return profile.socialLinks;
  }, [profile?.socialLinks]);

  const getIconForPlatform = (platform: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'linkedin': <FaLinkedinIn className="w-4 h-4" />,
      'github': <FaGithub className="w-4 h-4" />,
      'fiverr': <SiFiverr className="w-4 h-4" />,
      'upwork': <SiUpwork className="w-4 h-4" />,
      'freelancer': <SiFreelancer className="w-4 h-4" />,
      'facebook': <FaFacebookF className="w-4 h-4" />,
      'behance': <FaBehance className="w-4 h-4" />,
      'whatsapp': <FaWhatsapp className="w-4 h-4" />,
      'x': <SiX className="w-4 h-4" />,
      'envelope': <MdEmail className="w-4 h-4" />,
      'globe': <MdLanguage className="w-4 h-4" />,
    };
    return iconMap[platform.toLowerCase()] || <MdLanguage className="w-4 h-4" />;
  };

  const formatUrl = (url: string): string => {
    if (!url) return '#';
    if (url.startsWith('mailto:')) return url;
    if (url.includes('whatsapp') || url.startsWith('wa.me')) {
      const phoneNumber = url.replace(/\D/g, '');
      return `https://wa.me/${phoneNumber}`;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <footer className="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="lg:col-span-5 space-y-6"
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur-md opacity-50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">U</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Usman Ahmad
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 tracking-wider">
                  SOFTWARE ENGINEER
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md">
              Building innovative software solutions at the intersection of engineering and artificial intelligence. 
              Let's create something extraordinary together.
            </p>

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-br from-primary/5 to-purple-600/5 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="relative">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  </div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Available</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Open to opportunities</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl border border-blue-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <FaMapPin className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {profile?.location?.split(',')[0] || 'Remote'}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Worldwide</p>
              </div>
            </div>

            {/* Tech Stack Preview */}
            <div className="flex items-center gap-3">
              <FaCode className="text-primary/50 w-4 h-4" />
              <div className="flex gap-1.5">
                {['React', 'Node.js', 'Python', 'AI/ML'].map((tech) => (
                  <span key={tech} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-medium rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.1 }} 
            className="lg:col-span-3 space-y-4"
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-primary to-purple-600 rounded-full" />
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="group flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-200"
                  >
                    <span className="text-[10px] text-primary/50 group-hover:text-primary transition-colors">
                      →
                    </span>
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.2 }} 
            className="lg:col-span-4 space-y-4"
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-primary to-purple-600 rounded-full" />
              Let's Connect
            </h4>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Have a project in mind? Let's discuss how I can help bring your vision to life.
            </p>

            {/* Contact CTA */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
            >
              <span>Start a Conversation</span>
              <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2 pt-2">
              {socialLinks.length > 0 ? (
                socialLinks.slice(0, 6).map((link: SocialLink, index: number) => (
                  <motion.a 
                    key={`${link.platform}-${index}`} 
                    href={formatUrl(link.url)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ scale: 1.1, y: -2 }} 
                    whileTap={{ scale: 0.9 }} 
                    className="p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-all duration-300"
                  >
                    {getIconForPlatform(link.platform)}
                  </motion.a>
                ))
              ) : (
                <>
                  <motion.a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ scale: 1.1, y: -2 }} 
                    whileTap={{ scale: 0.9 }} 
                    className="p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-all duration-300"
                  >
                    <FaGithub className="w-4 h-4" />
                  </motion.a>
                  <motion.a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ scale: 1.1, y: -2 }} 
                    whileTap={{ scale: 0.9 }} 
                    className="p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-all duration-300"
                  >
                    <FaLinkedinIn className="w-4 h-4" />
                  </motion.a>
                  <motion.a 
                    href="mailto:contact@example.com" 
                    whileHover={{ scale: 1.1, y: -2 }} 
                    whileTap={{ scale: 0.9 }} 
                    className="p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-all duration-300"
                  >
                    <FaEnvelope className="w-4 h-4" />
                  </motion.a>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>© {currentYear} Usman Ahmad</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;