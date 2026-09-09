// components/Navbar.tsx
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const prevLocationRef = useRef(location);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    if (prevLocationRef.current !== location) {
      setIsMobileMenuOpen(false);
      prevLocationRef.current = location;
    }
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="relative group flex items-center gap-2">
              {/* Logo Icon */}
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative w-9 h-9 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
              </div>
              
              {/* Logo Text */}
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Usman Ahmad
                </span>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 -mt-0.5 tracking-wider">
                  SOFTWARE ENGINEER
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                  isActive(item.path) 
                    ? 'text-primary' 
                    : 'text-gray-700 dark:text-text-light light:text-gray-700 hover:text-primary'
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-primary/10 dark:bg-primary/10 light:bg-primary/5 border border-primary/30 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <span className="text-primary/50 text-xs font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="relative">
                    {item.name}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                  </span>
                </span>
              </Link>
            ))}
            
            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />
            
            {/* Theme Toggle */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary dark:hover:border-primary hover:bg-primary/10 transition-all duration-300 group overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              <motion.div
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </motion.div>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary hover:bg-primary/10 transition-all duration-300"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaTimes className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaBars className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden pb-6"
            >
              <div className="space-y-1.5 pt-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive(item.path)
                          ? 'bg-primary/10 border border-primary/30 text-primary'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className={`text-xs font-mono w-7 ${
                        isActive(item.path) ? 'text-primary' : 'text-gray-400'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{item.name}</span>
                      {isActive(item.path) && (
                        <motion.div
                          layoutId="mobile-active"
                          className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-3" />
                
                {/* Mobile Theme Toggle */}
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  <span className="text-xs font-mono w-7 text-gray-400">00</span>
                  <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                  <span className="ml-auto">
                    {theme === 'dark' ? '☀️' : '🌙'}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;