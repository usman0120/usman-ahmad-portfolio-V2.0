import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { validateLoginForm, hasErrors, type LoginFormErrors } from '../../utils/validators';
import { fadeUp, scale } from '../../utils/animations';

// Custom Input Component
const InputField: React.FC<{
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required: boolean;
  error?: string;
  icon?: React.ReactNode;
}> = memo(({ name, label, type, value, onChange, placeholder, required, error, icon }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-text-dark light:text-gray-700">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-primary/50">
            {icon}
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-3 
            ${icon ? 'pl-10' : ''}
            border rounded-lg
            bg-white dark:bg-cyber-dark/50 light:bg-white
            text-gray-900 dark:text-white light:text-gray-900
            placeholder-gray-400 dark:placeholder-text-light/50
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            transition-all duration-300
            ${error 
              ? 'border-red-500 focus:ring-red-500/50' 
              : 'border-gray-300 dark:border-primary/30 light:border-gray-300'
            }
          `}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

// Custom Button Component
const Button: React.FC<{
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}> = memo(({ 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  children, 
  className = '' 
}) => {
  const baseClasses = 'rounded-lg font-medium transition-all duration-300 focus:outline-none inline-flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-cyber-blue text-white shadow-neon hover:shadow-neon-strong hover:scale-105',
    secondary: 'bg-cyber-dark dark:bg-cyber-dark light:bg-gray-100 text-primary border border-primary/30 hover:border-primary hover:shadow-neon',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
    cyber: 'bg-transparent border border-primary/50 text-primary hover:text-white relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary before:to-cyber-blue before:scale-x-0 hover:before:scale-x-100 before:origin-left before:transition-transform before:duration-300 before:-z-10 before:rounded-lg'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
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
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

// Custom Card Component
const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = memo(({ 
  children, 
  className = '', 
  hover = false 
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300 bg-white dark:bg-cyber-dark light:bg-white border border-gray-200 dark:border-primary/20 light:border-gray-200 shadow-lg dark:shadow-neon light:shadow-lg';
  const hoverClasses = hover ? 'hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-neon-strong light:hover:shadow-xl' : '';

  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginFormErrors & { submit?: string }>({
    email: '',
    password: '',
    submit: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateLoginForm(formData);
    setErrors(prev => ({
      ...validationErrors,
      submit: prev.submit
    }));
    
    const errorRecord: Record<string, string> = {
      email: validationErrors.email,
      password: validationErrors.password
    };
    
    if (!hasErrors(errorRecord)) {
      setIsSubmitting(true);
      setErrors(prev => ({ ...prev, submit: '' }));
      
      try {
        await login(formData.email, formData.password);
        navigate(from, { replace: true });
      } catch (error: unknown) {
        console.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed. Please check your credentials.';
        setErrors(prev => ({
          ...prev,
          submit: errorMessage
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background light:bg-gray-50 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 right-10 w-80 h-80 bg-cyber-blue/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8" hover>
          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="text-center mb-8"
          >
            <motion.div 
              className="relative w-20 h-20 mx-auto mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-primary via-cyber-blue to-neon-purple rounded-full opacity-75 blur-sm"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative w-full h-full bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-gray-900 dark:text-white light:text-gray-900">Admin </span>
              <span className="bg-gradient-to-r from-primary to-cyber-blue bg-clip-text text-transparent">Access</span>
            </h1>
            <p className="text-gray-600 dark:text-text-light light:text-gray-600 text-sm">
              Secure authentication required
            </p>
            
            {/* Security Badge */}
            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-primary/5 border border-primary/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-mono text-primary">ENCRYPTED CONNECTION</span>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.form
            variants={scale}
            initial="initial"
            animate="animate"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <InputField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@example.com"
              required={true}
              error={errors.email}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            <InputField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required={true}
              error={errors.password}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm flex items-start gap-3"
              >
                <span>🔐</span>
                <span>{errors.submit}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <span>🔓</span>
                  Access Dashboard
                </>
              )}
            </Button>
          </motion.form>

          {/* Back to Site Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-cyber-blue transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Main Site
            </a>
          </motion.div>

          {/* Footer Security Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 pt-4 border-t border-gray-200 dark:border-primary/20 light:border-gray-200"
          >
            <div className="font-mono text-xs text-gray-500 dark:text-primary/30 light:text-gray-500 text-center">
              <span className="text-primary/50">$</span> session_timeout: 24h
              <span className="mx-2">•</span>
              <span className="text-primary/50">$</span> encryption: AES-256
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;