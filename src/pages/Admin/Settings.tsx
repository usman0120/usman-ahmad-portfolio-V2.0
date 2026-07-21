import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { staggerContainer } from '../../utils/animations';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseClient';
import { COLLECTIONS } from '../../firebase/models';
import { exportToJSON, exportToPDF } from '../../utils/dataExport';
import { parseJSONFile, restoreToFirestore } from '../../utils/dataImport';

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
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
    secondary: 'bg-cyber-dark dark:bg-cyber-dark light:bg-gray-100 text-primary border border-primary/30',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-sm',
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

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6'
  };

  const baseClasses = 'rounded-lg bg-white dark:bg-cyber-dark light:bg-white border border-gray-200 dark:border-gray-700 light:border-gray-200 shadow-sm';

  return (
    <div className={`${baseClasses} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

// Input Field Component
interface InputFieldProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'url';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  type, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  disabled = false, 
  error 
}) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-cyber-dark/50 light:bg-white text-gray-900 dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        }`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

// Checkbox Component
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, description }) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
      />
      <div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
};

// Types
interface AccountData {
  displayName: string;
  email: string;
}

interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PreferencesData {
  emailNotifications: boolean;
  projectNotifications: boolean;
  messageNotifications: boolean;
}

const Settings: React.FC = () => {
  const { user, logout, resetPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'preferences' | 'data'>('account');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Account Settings
  const [accountData, setAccountData] = useState<AccountData>({
    displayName: user?.displayName || '',
    email: user?.email || ''
  });

  // Security Settings
  const [securityData, setSecurityData] = useState<SecurityData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Preferences
  const [preferences, setPreferences] = useState<PreferencesData>({
    emailNotifications: true,
    projectNotifications: true,
    messageNotifications: true
  });

  // Data Management State
  const [selectedCollection, setSelectedCollection] = useState<string>(COLLECTIONS.PROJECTS);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [overwriteExisting, setOverwriteExisting] = useState<boolean>(true);
  const [isDataActionRunning, setIsDataActionRunning] = useState<boolean>(false);

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Account information updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setErrorMessage('Failed to update account information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    if (securityData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await resetPassword(user?.email || '');
      setSuccessMessage('Password reset email sent! Check your inbox.');
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch {
      setErrorMessage('Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      localStorage.setItem('admin_preferences', JSON.stringify(preferences));
      setSuccessMessage('Preferences updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setErrorMessage('Failed to update preferences.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async (format: 'json' | 'pdf') => {
    setIsDataActionRunning(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const colRef = collection(db, selectedCollection);
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (format === 'json') {
        exportToJSON(data, `${selectedCollection}_backup`);
      } else if (format === 'pdf') {
        exportToPDF(data, selectedCollection.toUpperCase());
      }
      setSuccessMessage(`Successfully exported ${selectedCollection} as ${format.toUpperCase()}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage(`Failed to export data: ${(err as Error).message}`);
    } finally {
      setIsDataActionRunning(false);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) {
      setErrorMessage('Please select a JSON file to import.');
      return;
    }
    
    setIsDataActionRunning(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const data = await parseJSONFile(importFile);
      await restoreToFirestore(selectedCollection, data, { overwriteExisting });
      setSuccessMessage(`Successfully imported data to ${selectedCollection}!`);
      setImportFile(null);
      // reset file input
      const fileInput = document.getElementById('importFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage(`Failed to import data: ${(err as Error).message}`);
    } finally {
      setIsDataActionRunning(false);
    }
  };

  const handleAccountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSecurityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('admin_preferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences) as PreferencesData);
      } catch {
        console.error('Error loading preferences');
      }
    }
  }, []);

  const tabs = [
    { id: 'account' as const, label: 'Account', icon: '👤' },
    { id: 'security' as const, label: 'Security', icon: '🔐' },
    { id: 'preferences' as const, label: 'Preferences', icon: '⚙️' },
    { id: 'data' as const, label: 'Data Management', icon: '💾' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background light:bg-gray-50 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-cyber-dark/90 light:bg-white/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm" icon="←">
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Settings
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm"
            >
              ✓ {successMessage}
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
            >
              ⚠ {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Account Settings */}
        {activeTab === 'account' && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                Account Information
              </h2>
              
              <form onSubmit={handleAccountUpdate} className="space-y-5">
                <InputField
                  label="Display Name"
                  type="text"
                  name="displayName"
                  value={accountData.displayName}
                  onChange={handleAccountChange}
                  placeholder="Enter your display name"
                />

                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={accountData.email}
                  onChange={handleAccountChange}
                  placeholder="Enter your email"
                  disabled
                />

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                Change Password
              </h2>
              
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <InputField
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={securityData.currentPassword}
                  onChange={handleSecurityChange}
                  placeholder="Enter current password"
                />

                <InputField
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={securityData.newPassword}
                  onChange={handleSecurityChange}
                  placeholder="Enter new password"
                  required
                />

                <InputField
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={securityData.confirmPassword}
                  onChange={handleSecurityChange}
                  placeholder="Confirm new password"
                  required
                />

                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Password must be at least 6 characters
                  </p>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </div>
              </form>
            </Card>

            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Reset Password via Email
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                We'll send a password reset link to your email address.
              </p>
              <Button
                variant="outline"
                onClick={() => resetPassword(user?.email || '')}
              >
                Send Reset Email
              </Button>
            </Card>

            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Session
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Log out from your current session.
              </p>
              <Button variant="danger" onClick={logout}>
                Log Out
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Preferences */}
        {activeTab === 'preferences' && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                Notification Preferences
              </h2>
              
              <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                <div className="space-y-4">
                  <Checkbox
                    label="Email Notifications"
                    checked={preferences.emailNotifications}
                    onChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                    description="Receive email notifications for important updates"
                  />

                  <Checkbox
                    label="Project Updates"
                    checked={preferences.projectNotifications}
                    onChange={(checked) => setPreferences({...preferences, projectNotifications: checked})}
                    description="Get notified when projects are added or updated"
                  />

                  <Checkbox
                    label="New Messages"
                    checked={preferences.messageNotifications}
                    onChange={(checked) => setPreferences({...preferences, messageNotifications: checked})}
                    description="Receive notifications for new contact form messages"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Appearance
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTheme}
                      icon={theme === 'dark' ? '☀️' : '🌙'}
                    >
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Preferences'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Data Management */}
        {activeTab === 'data' && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Backup & Restore
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Export your Firestore collections for backup or reporting, and import JSON data to restore.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Select Collection
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-cyber-dark/50 light:bg-white text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value={COLLECTIONS.PROJECTS}>Projects</option>
                  <option value={COLLECTIONS.SKILLS}>Skills</option>
                  <option value={COLLECTIONS.SERVICES}>Services</option>
                  <option value={COLLECTIONS.PROFILE}>Profile</option>
                  <option value={COLLECTIONS.MESSAGES}>Messages</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mb-8">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Export Data</h3>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('json')}
                    disabled={isDataActionRunning}
                    icon="📄"
                  >
                    Export as JSON (Backup)
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('pdf')}
                    disabled={isDataActionRunning}
                    icon="📊"
                  >
                    Export as PDF (Report)
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Import Data (Restore)</h3>
                <p className="text-xs text-yellow-600 dark:text-yellow-500 mb-4 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border border-yellow-200 dark:border-yellow-800">
                  <strong>Warning:</strong> Ensure you are uploading a valid JSON backup for the selected collection.
                </p>
                
                <form onSubmit={handleImport} className="space-y-5">
                  <div>
                    <input
                      id="importFileInput"
                      type="file"
                      accept=".json"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                      required
                    />
                  </div>

                  <Checkbox
                    label="Overwrite Existing Documents"
                    checked={overwriteExisting}
                    onChange={(checked) => setOverwriteExisting(checked)}
                    description="If checked, existing items with the same ID will be entirely replaced by the backup. If unchecked, new fields are merged."
                  />

                  <div className="flex justify-start pt-2">
                    <Button type="submit" variant="primary" disabled={isDataActionRunning || !importFile}>
                      {isDataActionRunning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Restoring...
                        </>
                      ) : (
                        'Restore from JSON'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Settings;