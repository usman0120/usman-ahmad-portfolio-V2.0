import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProjects, useSkills, useMessages, useProfile } from '../../hooks/useFirestore';
import { useTheme } from '../../hooks/useTheme';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { fadeUp, staggerContainer } from '../../utils/animations';

// Button component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon
}) => {
  const baseClasses = 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 active:scale-95 shadow-sm',
    secondary: 'bg-cyber-dark dark:bg-cyber-dark light:bg-gray-100 text-primary border border-primary/30 hover:border-primary',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};

// Card component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6'
  };

  const baseClasses = 'rounded-lg bg-white dark:bg-cyber-dark light:bg-white border border-gray-200 dark:border-gray-700 light:border-gray-200 shadow-sm';
  const hoverClasses = hover ? 'transition-all duration-200 hover:shadow-md hover:border-primary/30' : '';

  const classes = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Sidebar Navigation Component
const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '📁', label: 'Projects', path: '/admin/projects' },
    { icon: '⚡', label: 'Skills', path: '/admin/skills' },
    { icon: '🛠️', label: 'Services', path: '/admin/services' },
    { icon: '✉️', label: 'Messages', path: '/admin/messages' },
    { icon: '👤', label: 'Profile', path: '/admin/profile' },
    { icon: '⚙️', label: 'Settings', path: '/admin/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-cyber-dark light:bg-white border-r border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-cyber-blue bg-clip-text text-transparent">
                  Admin Panel
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Portfolio Management
                </p>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors text-left"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-xl">{theme === 'dark' ? '☀️' : '🌙'}</span>
                  <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <Link
                  to="/"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-xl">🌐</span>
                  <span className="font-medium">View Site</span>
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: string;
  color: string;
  link: string;
  badge?: number;
}> = ({ title, value, icon, color, link, badge }) => {
  return (
    <Link to={link}>
      <Card hover padding="md" className="h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          </div>
          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${color}`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
        {badge !== undefined && badge > 0 && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {badge} unread
            </span>
          </div>
        )}
      </Card>
    </Link>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const { skills, loading: skillsLoading } = useSkills();
  const { messages, loading: messagesLoading } = useMessages();
  const { profile, loading: profileLoading } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isLoading = projectsLoading || skillsLoading || messagesLoading || profileLoading;

  const unreadMessages = messages.filter(msg => !msg.read).length;
  const featuredProjects = projects.filter(project => project.featured).length;

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: '📁',
      color: 'from-primary/20 to-primary/10',
      link: '/admin/projects'
    },
    {
      title: 'Skills',
      value: skills.length,
      icon: '⚡',
      color: 'from-cyber-blue/20 to-cyber-blue/10',
      link: '/admin/skills'
    },
    {
      title: 'Messages',
      value: messages.length,
      icon: '✉️',
      color: 'from-neon-purple/20 to-neon-purple/10',
      link: '/admin/messages',
      badge: unreadMessages
    },
    {
      title: 'Featured',
      value: featuredProjects,
      icon: '⭐',
      color: 'from-yellow-500/20 to-yellow-500/10',
      link: '/admin/projects'
    }
  ];

  const quickActions = [
    { icon: '➕', label: 'New Project', path: '/admin/projects?action=add', color: 'bg-primary/10 text-primary' },
    { icon: '⚡', label: 'Add Skill', path: '/admin/skills?action=add', color: 'bg-cyber-blue/10 text-cyber-blue' },
    { icon: '✉️', label: 'Messages', path: '/admin/messages', color: 'bg-neon-purple/10 text-neon-purple' },
    { icon: '👤', label: 'Edit Profile', path: '/admin/profile', color: 'bg-primary/10 text-primary' },
    { icon: '⚙️', label: 'Settings', path: '/admin/Settings', color: 'bg-primary/10 text-primary' },
    { icon: '🛠️', label: 'Services', path: '/admin/services', color: 'bg-primary/10 text-primary' }

  ];

  const recentMessages = messages
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background light:bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <LoadingSkeleton type="card" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background light:bg-gray-50 transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-cyber-dark/90 light:bg-white/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Welcome, {profile?.name?.split(' ')[0] || user?.email?.split('@')[0]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/" className="hidden md:block">
                <Button variant="outline" size="sm" icon="🌐">
                  View Site
                </Button>
              </Link>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleLogout}
                icon="🚪"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={stat.title} variants={fadeUp} transition={{ delay: index * 0.1 }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card padding="lg" className="bg-gradient-to-r from-primary/5 to-cyber-blue/5 border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Welcome back, {profile?.name || 'Admin'}!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You have {unreadMessages} unread messages and {featuredProjects} featured projects.
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/admin/projects?action=add">
                  <Button variant="primary" icon="➕">
                    New Project
                  </Button>
                </Link>
                <Link to="/admin/messages">
                  <Button variant="outline" icon="📨">
                    View Messages
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <Link key={action.label} to={action.path}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-sm transition-all text-center"
                    >
                      <div className={`w-12 h-12 mx-auto rounded-lg ${action.color} flex items-center justify-center text-xl mb-2`}>
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {action.label}
                      </span>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Recent Activity Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Recent Activity
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Latest Project</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {projects[0]?.title || 'No projects yet'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {projects[0]?.updatedAt.toLocaleDateString() || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card padding="lg" className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Messages
                </h3>
                <Link to="/admin/messages">
                  <span className="text-sm text-primary hover:underline">
                    View all
                  </span>
                </Link>
              </div>

              {recentMessages.length > 0 ? (
                <div className="space-y-3">
                  {recentMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className={`p-3 rounded-lg border transition-colors ${
                        !message.read 
                          ? 'bg-primary/5 border-primary/30' 
                          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          !message.read 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {message.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {message.name}
                            </p>
                            {!message.read && (
                              <span className="w-2 h-2 bg-primary rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {message.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {message.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3 opacity-30">📭</div>
                  <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            Total: {projects.length} projects • {skills.length} skills • {messages.length} messages
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;