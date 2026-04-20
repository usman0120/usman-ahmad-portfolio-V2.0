import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../../hooks/useFirestore';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { fadeUp, staggerContainer } from '../../utils/animations';
import { validateProfileForm, hasErrors, type ProfileFormErrors } from '../../utils/validators';
import type { ProfileFormData, Education, SocialLink, Certification } from '../../firebase/models';
import { SOCIAL_ICON_OPTIONS } from '../../firebase/models';

// Button component
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

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
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
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
  const paddingClasses = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };
  const baseClasses = 'rounded-lg bg-white dark:bg-cyber-dark light:bg-white border border-gray-200 dark:border-gray-700 light:border-gray-200 shadow-sm';
  return <div className={`${baseClasses} ${paddingClasses[padding]} ${className}`}>{children}</div>;
};

// Input Field Component
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  options?: { value: string; label: string }[];
}

const InputField: React.FC<InputFieldProps> = ({
  label, name, type = 'text', value, onChange, placeholder,
  required = false, error, rows, options
}) => {
  const inputClasses = `w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-cyber-dark/50 light:bg-white text-gray-900 dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    }`;

  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {options ? (
        <select name={name} value={value} onChange={onChange} className={inputClasses}>
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : rows ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows} className={`${inputClasses} resize-none`} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} className={inputClasses} />
      )}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

const ProfileSettings: React.FC = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResumeUploading, setIsResumeUploading] = useState(false);
  const [resumeUploadProgress, setResumeUploadProgress] = useState(0);
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '', title: '', bio: '', profileImage: '', email: '',
    location: '', university: '', department: '', hometown: '', resumeUrl: '',
    socialLinks: [],
    education: [],
    goals: [],
    experience: [],
    certifications: [],
    stats: { projects: 0, clients: 0, experience: 0 } // ADD THIS LINE
  });

  const [errors, setErrors] = useState<ProfileFormErrors & { submit?: string }>({
    name: '', title: '', bio: '', email: '', location: '', university: ''
  });

  // Temporary states for adding new items
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({ platform: 'github', url: '', icon: 'github' });
  const [newEducation, setNewEducation] = useState<Education>({
    institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, description: ''
  });
  const [newGoal, setNewGoal] = useState('');
  const [newExperience, setNewExperience] = useState('');
  const [newCertification, setNewCertification] = useState<Certification>({ name: '', year: '' });

useEffect(() => {
  if (profile) {
    setTimeout(() => {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        profileImage: profile.profileImage || '',
        email: profile.email || '',
        location: profile.location || '',
        university: profile.university || '',
        department: profile.department || '',
        hometown: profile.hometown || '',
        resumeUrl: profile.resumeUrl || '',
        socialLinks: Array.isArray(profile.socialLinks) ? profile.socialLinks : [],
        education: Array.isArray(profile.education) ? profile.education : [],
        goals: Array.isArray(profile.goals) ? profile.goals : [],
        experience: Array.isArray(profile.experience) ? profile.experience : [],
        certifications: Array.isArray(profile.certifications) ? profile.certifications : [],
        stats: profile.stats || { projects: 0, clients: 0, experience: 0 }
      });
      if (profile.profileImage?.startsWith('data:image')) setImagePreview(profile.profileImage);
    }, 0);
  }
}, [profile]);

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadstart = () => { setIsUploading(true); setUploadProgress(10); };
      reader.onprogress = (event) => { if (event.lengthComputable) setUploadProgress((event.loaded / event.total) * 100); };
      reader.onload = () => { setUploadProgress(100); setTimeout(() => { setIsUploading(false); setUploadProgress(0); }, 500); resolve(reader.result as string); };
      reader.onerror = () => { setIsUploading(false); setUploadProgress(0); reject(new Error('Failed to read file')); };
      reader.readAsDataURL(file);
    });
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadstart = () => { setIsResumeUploading(true); setResumeUploadProgress(10); };
      reader.onprogress = (event) => { if (event.lengthComputable) setResumeUploadProgress((event.loaded / event.total) * 100); };
      reader.onload = () => { setResumeUploadProgress(100); setTimeout(() => { setIsResumeUploading(false); setResumeUploadProgress(0); }, 500); resolve(reader.result as string); };
      reader.onerror = () => { setIsResumeUploading(false); setResumeUploadProgress(0); reject(new Error('Failed to read file')); };
      reader.readAsDataURL(file);
    });
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      const base64Resume = await convertFileToBase64(file);
      setFormData(prev => ({ ...prev, resumeUrl: base64Resume }));
      setResumeFileName(file.name);
    } catch {
      alert('Failed to upload resume');
      setIsResumeUploading(false);
    }
  };

  const handleRemoveResume = () => {
    setFormData(prev => ({ ...prev, resumeUrl: '' }));
    setResumeFileName('');
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      alert('Please upload a valid image file'); return;
    }
    if (file.size > 2 * 1024 * 1024) { alert('Image size should be less than 2MB'); return; }
    try {
      const base64Image = await convertImageToBase64(file);
      setFormData(prev => ({ ...prev, profileImage: base64Image }));
      setImagePreview(base64Image);
    } catch {
      alert('Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, profileImage: '' }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Social Links handlers
  const addSocialLink = () => {
    if (newSocialLink.url.trim()) {
      setFormData(prev => ({
        ...prev,
        socialLinks: [...(prev.socialLinks || []), { ...newSocialLink }]
      }));
      setNewSocialLink({ platform: 'github', url: '', icon: 'github' });
    }
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter((_, i) => i !== index)
    }));
  };

  // Education handlers
  const addEducation = () => {
    if (newEducation.institution.trim() && newEducation.degree.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...(prev.education || []), { ...newEducation, id: Date.now().toString() }]
      }));
      setNewEducation({ institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, description: '' });
    }
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  // Goals handlers
  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData(prev => ({ ...prev, goals: [...(prev.goals || []), newGoal] }));
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({ ...prev, goals: (prev.goals || []).filter((_, i) => i !== index) }));
  };

  // Experience handlers
  const addExperience = () => {
    if (newExperience.trim()) {
      setFormData(prev => ({ ...prev, experience: [...(prev.experience || []), newExperience] }));
      setNewExperience('');
    }
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({ ...prev, experience: (prev.experience || []).filter((_, i) => i !== index) }));
  };

  // Certification handlers
  const addCertification = () => {
    if (newCertification.name.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), newCertification]
      }));
      setNewCertification({ name: '', year: '' });
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProfileForm(formData);
    setErrors(validationErrors);
    const errorRecord: Record<string, string> = {
      name: validationErrors.name, title: validationErrors.title, bio: validationErrors.bio,
      email: validationErrors.email, location: validationErrors.location, university: validationErrors.university
    };
    if (!hasErrors(errorRecord)) {
      setIsSubmitting(true);
      try {
        if (profile?.id) {
          await updateProfile(profile.id, formData);
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 3000);
        }
      } catch {
        setErrors(prev => ({ ...prev, submit: 'Failed to update profile.' }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Safe array getters
  const safeSocialLinks = formData.socialLinks || [];
  const safeEducation = formData.education || [];
  const safeGoals = formData.goals || [];
  const safeExperience = formData.experience || [];
  const safeCertifications = formData.certifications || [];

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background">
        <div className="max-w-5xl mx-auto p-4">
          <LoadingSkeleton type="card" count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background light:bg-gray-50 transition-colors duration-300">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-cyber-dark/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm" icon="←">Back</Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal information</p>
              </div>
            </div>
            {isSaved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                ✓ Profile updated
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <motion.form variants={staggerContainer} initial="initial" animate="animate" onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section */}
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Image</h2>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-2 border-primary/20 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {imagePreview || formData.profileImage ? (
                      <img src={imagePreview || formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {(imagePreview || formData.profileImage) && (
                    <button type="button" onClick={handleRemoveImage} className="absolute -top-1 -right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="profile-image-upload" />
                  <label htmlFor="profile-image-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm cursor-pointer hover:bg-primary/90">
                    <span>📷</span>{isUploading ? 'Uploading...' : 'Upload New Image'}
                  </label>
                  {isUploading && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">JPEG, PNG, GIF or WebP • Max 2MB</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Personal Information */}
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Usman Ahmad" required error={errors.name} />
                <InputField label="Professional Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Cybersecurity Specialist" required error={errors.title} />
                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required error={errors.email} />
                <InputField label="Location" name="location" value={formData.location} onChange={handleInputChange} required error={errors.location} />
                <InputField label="Hometown" name="hometown" value={formData.hometown} onChange={handleInputChange} />
                <InputField label="University" name="university" value={formData.university} onChange={handleInputChange} required error={errors.university} />
                <InputField label="Department" name="department" value={formData.department} onChange={handleInputChange} />
                {/* Resume Upload Section */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Resume (PDF)
                  </label>
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />

                  {formData.resumeUrl ? (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {resumeFileName || 'Resume uploaded'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF document ready for download
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={formData.resumeUrl}
                          download="Usman_Ahmad_Resume.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20"
                        >
                          Preview
                        </a>
                        <button
                          type="button"
                          onClick={handleRemoveResume}
                          className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-sm hover:bg-red-500/20"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="resume-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary cursor-pointer transition-colors"
                      >
                        <span>📄</span>
                        {isResumeUploading ? 'Uploading...' : 'Upload Resume (PDF)'}
                      </label>
                      {isResumeUploading && (
                        <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${resumeUploadProgress}%` }}
                          />
                        </div>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Max file size: 5MB • PDF format only
                      </p>
                    </div>
                  )}

                  {/* Fallback URL input */}
                  <div className="mt-3">
                    <InputField
                      label="Or enter Resume URL"
                      name="resumeUrl"
                      type="url"
                      value={formData.resumeUrl?.startsWith('data:') ? '' : formData.resumeUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/resume.pdf"
                    />
                  </div>
                </div>              </div>
            </Card>
          </motion.div>

{/* Stats Section */}
<motion.div variants={fadeUp}>
  <Card padding="lg">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Homepage Stats</h2>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
      These numbers will appear on your homepage to showcase your experience.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Total Projects
        </label>
        <input
          type="number"
          min="0"
          value={formData.stats?.projects ?? 0}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            setFormData(prev => ({
              ...prev,
              stats: {
                projects: value,
                clients: prev.stats?.clients ?? 0,
                experience: prev.stats?.experience ?? 0
              }
            }));
          }}
          className="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-cyber-dark/50 text-gray-900 dark:text-white"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Total Clients
        </label>
        <input
          type="number"
          min="0"
          value={formData.stats?.clients ?? 0}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            setFormData(prev => ({
              ...prev,
              stats: {
                projects: prev.stats?.projects ?? 0,
                clients: value,
                experience: prev.stats?.experience ?? 0
              }
            }));
          }}
          className="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-cyber-dark/50 text-gray-900 dark:text-white"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Years Experience
        </label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={formData.stats?.experience ?? 0}
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;
            setFormData(prev => ({
              ...prev,
              stats: {
                projects: prev.stats?.projects ?? 0,
                clients: prev.stats?.clients ?? 0,
                experience: value
              }
            }));
          }}
          className="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-cyber-dark/50 text-gray-900 dark:text-white"
        />
      </div>
    </div>
  </Card>
</motion.div>

          {/* Biography */}
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Biography</h2>
              <InputField label="About Me" name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Write a detailed bio..." required error={errors.bio} rows={6} />
            </Card>
          </motion.div>

          {/* Education Section */}
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Education</h2>
              <div className="space-y-4 mb-4">
                {safeEducation.map((edu, index) => (
                  <div key={edu.id || index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{edu.degree} in {edu.field}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                        <p className="text-xs text-gray-500">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                      </div>
                      <button type="button" onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-700">✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Institution" name="edu_institution" value={newEducation.institution} onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })} placeholder="University name" />
                  <InputField label="Degree" name="edu_degree" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} placeholder="Bachelor of Science" />
                  <InputField label="Field of Study" name="edu_field" value={newEducation.field} onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })} placeholder="Computer Science" />
                  <InputField label="Start Date" name="edu_startDate" value={newEducation.startDate} onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })} placeholder="2020" />
                  <InputField label="End Date" name="edu_endDate" value={newEducation.endDate} onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })} placeholder="2024" />
                </div>
                <InputField label="Description" name="edu_description" value={newEducation.description} onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })} placeholder="Describe your studies..." rows={2} />
                <label className="flex items-center gap-2 dark:text-white">
                  <input type="checkbox" checked={newEducation.current} onChange={(e) => setNewEducation({ ...newEducation, current: e.target.checked })} className="rounded " /> Currently pursuing
                </label>
                <Button type="button" variant="outline" onClick={addEducation} icon="➕">Add Education</Button>
              </div>
            </Card>
          </motion.div>

          {/* Social Links Section */}
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Links</h2>
              <div className="flex flex-wrap gap-3 mb-4">
                {safeSocialLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 dark:text-white rounded-lg">
                    <span>{link.platform}: {link.url}</span>
                    <button type="button" onClick={() => removeSocialLink(index)} className="text-red-500 hover:text-red-700">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={newSocialLink.platform}
                  onChange={(e) => {
                    const platform = e.target.value;
                    const icon = SOCIAL_ICON_OPTIONS.find(o => o.value === platform)?.value || platform;
                    setNewSocialLink({ ...newSocialLink, platform, icon });
                  }}
                  className="px-3 py-2 border rounded-lg dark:text-white dark:bg-cyber-dark/50"
                >
                  {SOCIAL_ICON_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <InputField label="" name="social_url" value={newSocialLink.url} onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })} placeholder="https://..." />
                <Button type="button" variant="outline" onClick={addSocialLink} icon="➕">Add</Button>
              </div>
            </Card>
          </motion.div>

          {/* Goals & Experience */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Goals</h2>
              <div className="space-y-2 mb-4">
                {safeGoals.map((goal, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800/50 dark:text-white rounded">
                    <span>{goal}</span>
                    <button type="button" onClick={() => removeGoal(i)} className="text-red-500">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="Add a goal..." className="flex-1 px-3 py-2 border rounded-lg dark:text-white dark:bg-cyber-dark/50" />
                <Button type="button" variant="outline" onClick={addGoal}>Add</Button>
              </div>
            </Card>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Experience</h2>
              <div className="space-y-2 mb-4">
                {safeExperience.map((exp, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800/50 dark:text-white rounded">
                    <span>{exp}</span>
                    <button type="button" onClick={() => removeExperience(i)} className="text-red-500">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newExperience} onChange={(e) => setNewExperience(e.target.value)} placeholder="Add experience..." className="flex-1 px-3 py-2 border rounded-lg dark:text-white dark:bg-cyber-dark/50" />
                <Button type="button" variant="outline" onClick={addExperience}>Add</Button>
              </div>
            </Card>
          </motion.div>

          {/* Certifications */}
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Certifications</h2>
              <div className="flex flex-wrap gap-3 mb-4">
                {safeCertifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 dark:text-white rounded-lg">
                    <span>{cert.name} ({cert.year})</span>
                    <button type="button" onClick={() => removeCertification(i)} className="text-red-500">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <input type="text" value={newCertification.name} onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })} placeholder="Certification name" className="flex-1 px-3 py-2 border rounded-lg dark:bg-cyber-dark/50 dark:text-white" />
                <input type="text" value={newCertification.year} onChange={(e) => setNewCertification({ ...newCertification, year: e.target.value })} placeholder="Year" className="w-24 px-3 py-2 border rounded-lg dark:bg-cyber-dark/50 dark:text-white" />
                <Button type="button" variant="outline" onClick={addCertification}>Add</Button>
              </div>
            </Card>
          </motion.div>

          {errors.submit && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.submit}
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => window.location.reload()}>Reset</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting || isUploading}>
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
              ) : 'Save Changes'}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default ProfileSettings;