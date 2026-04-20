// pages/Contact.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile, useMessages, useHireRequests } from '../hooks/useFirestore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { slideInLeft, slideInRight } from '../utils/animations';
import { validateContactForm, hasErrors, type ContactFormErrors } from '../utils/validators';
import { 
  FaLinkedinIn, FaGithub, FaFacebookF, FaBehance, FaWhatsapp, FaTimes,
  FaStore, FaPaperclip, FaCheck, FaFile, FaImage, FaFilePdf, FaFileAlt,
  FaMapPin, FaClock, FaGlobe, FaArrowRight, FaChevronRight, FaShareAlt,
  FaRocket, FaCheckCircle
} from "react-icons/fa";
import { SiFiverr, SiUpwork, SiFreelancer } from "react-icons/si";
import { MdEmail, MdLanguage, MdClose } from "react-icons/md";
import { 
  PROJECT_TYPES, 
  BUDGET_OPTIONS, 
  TIMELINE_OPTIONS,
  type HireFormData,
  type HireAttachment 
} from '../firebase/models';

// Types
interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

// Button Component
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'rounded-xl font-medium transition-all duration-300 focus:outline-none inline-flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105',
    secondary: 'bg-white dark:bg-gray-800 text-primary border border-primary/30 hover:border-primary hover:shadow-lg',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
    cyber: 'bg-transparent border border-primary/50 text-primary hover:text-white relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary before:to-purple-600 before:scale-x-0 hover:before:scale-x-100 before:origin-left before:transition-transform before:duration-300 before:-z-10 before:rounded-xl'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  );
};

// Input Component
interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = ''
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
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
        className={`
          w-full px-4 py-3 
          border rounded-xl
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          transition-all duration-300
          ${error 
            ? 'border-red-500 focus:ring-red-500/50' 
            : 'border-gray-300 dark:border-gray-600'
          }
        `}
      />
      {error && <p className="text-red-500 text-sm flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
};

// Select Component
interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
  className = ''
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full px-4 py-3 
          border rounded-xl
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          transition-all duration-300
          ${error 
            ? 'border-red-500 focus:ring-red-500/50' 
            : 'border-gray-300 dark:border-gray-600'
          }
        `}
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
};

// Textarea Component
interface TextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  error?: string;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  error,
  className = ''
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`
          w-full px-4 py-3 
          border rounded-xl resize-none
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          transition-all duration-300
          ${error 
            ? 'border-red-500 focus:ring-red-500/50' 
            : 'border-gray-300 dark:border-gray-600'
          }
        `}
      />
      {error && <p className="text-red-500 text-sm flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';
  const styleClasses = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg';
  const hoverClasses = hover ? 'hover:-translate-y-2 hover:shadow-xl' : '';

  return (
    <motion.div
      className={`${baseClasses} ${styleClasses} ${hoverClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Terms Modal Component
interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, type }) => {
  const termsContent = {
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'January 2024',
      sections: [
        {
          heading: '1. Acceptance of Terms',
          content: 'By accessing or using my services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the services.'
        },
        {
          heading: '2. Services Description',
          content: 'I provide software development, AI solutions, and technical consulting services. All services are provided on an "as is" basis. I reserve the right to refuse service to anyone for any reason at any time.'
        },
        {
          heading: '3. Project Engagement',
          content: 'All projects require a written agreement outlining scope, timeline, deliverables, and payment terms. Any changes to project scope must be agreed upon in writing by both parties.'
        },
        {
          heading: '4. Payment Terms',
          content: 'Payment terms will be specified in each project agreement. Typically, I require a 50% deposit before work begins, with the balance due upon project completion. Late payments may incur a 1.5% monthly interest charge.'
        },
        {
          heading: '5. Intellectual Property',
          content: 'Upon full payment, clients receive full ownership of final deliverables. I retain the right to display work in my portfolio unless a Non-Disclosure Agreement (NDA) is signed. I retain ownership of all pre-existing code, tools, and methodologies used during development.'
        },
        {
          heading: '6. Confidentiality',
          content: 'I agree to keep confidential any proprietary information shared by clients. If an NDA is required, it must be signed before any confidential information is disclosed. This obligation survives the termination of our agreement.'
        },
        {
          heading: '7. Limitation of Liability',
          content: 'In no event shall I be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from the use or inability to use my services.'
        },
        {
          heading: '8. Warranty Disclaimer',
          content: 'I provide a 30-day warranty on delivered work for bug fixes. After this period, maintenance and support are available at my standard hourly rates or through a separate maintenance agreement.'
        },
        {
          heading: '9. Termination',
          content: 'Either party may terminate a project agreement with written notice. Upon termination, client shall pay for all work completed up to the termination date. Any deposits are non-refundable unless I am in material breach of the agreement.'
        },
        {
          heading: '10. Governing Law',
          content: 'These terms shall be governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions. Any disputes shall be resolved through binding arbitration in Lahore, Pakistan.'
        },
        {
          heading: '11. Changes to Terms',
          content: 'I reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of my services constitutes acceptance of the modified terms.'
        }
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'January 2024',
      sections: [
        {
          heading: '1. Information I Collect',
          content: 'I collect information you provide directly, including name, email address, phone number, company information, and project details. I also collect any files or documents you upload as part of project discussions.'
        },
        {
          heading: '2. How I Use Information',
          content: 'I use the information collected to communicate with you about projects, provide services, send invoices and receipts, improve my services, and comply with legal obligations. I do not use your information for marketing purposes without explicit consent.'
        },
        {
          heading: '3. Information Sharing',
          content: 'I do not sell, trade, or rent your personal information to third parties. I may share information with trusted service providers who assist in operating my business, subject to confidentiality obligations. I may disclose information when required by law.'
        },
        {
          heading: '4. Data Security',
          content: 'I implement appropriate technical and organizational measures to protect your personal information. All data is encrypted in transit and at rest. Access to your information is restricted to authorized personnel only.'
        },
        {
          heading: '5. Data Retention',
          content: 'I retain your information for as long as necessary to provide services and comply with legal obligations. Project data is typically retained for 5 years after project completion. You may request deletion of your data at any time.'
        },
        {
          heading: '6. Your Rights',
          content: 'You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact me directly.'
        },
        {
          heading: '7. Cookies and Tracking',
          content: 'My website uses essential cookies for functionality and analytics cookies to understand usage patterns. You can control cookie settings through your browser. I do not use tracking cookies for advertising purposes.'
        },
        {
          heading: '8. Third-Party Services',
          content: 'My website may contain links to third-party services. I am not responsible for the privacy practices of these services. I encourage you to review their privacy policies before providing any information.'
        },
        {
          heading: '9. International Data Transfers',
          content: 'Your information may be transferred to and processed in countries outside your residence. I ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.'
        },
        {
          heading: '10. Children\'s Privacy',
          content: 'My services are not directed to individuals under 18. I do not knowingly collect information from children. If you believe I have collected information from a child, please contact me immediately.'
        },
        {
          heading: '11. Changes to Privacy Policy',
          content: 'I may update this privacy policy periodically. Significant changes will be communicated via email. Your continued use of my services after changes constitutes acceptance of the updated policy.'
        },
        {
          heading: '12. Contact Information',
          content: 'For questions about this privacy policy or data practices, please contact me at usman@example.com or through the contact form on this website.'
        }
      ]
    }
  };

  const content = type === 'terms' ? termsContent.terms : termsContent.privacy;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{content.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last Updated: {content.lastUpdated}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MdClose className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              {content.sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{section.heading}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="primary" onClick={onClose} className="w-full">
                I Understand
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// File Attachment Component
const FileAttachment: React.FC<{
  attachments: HireAttachment[];
  onAdd: (files: FileList) => void;
  onRemove: (index: number) => void;
  error?: string;
}> = ({ attachments, onAdd, onRemove, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      onAdd(e.dataTransfer.files);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FaImage className="text-blue-500" />;
    if (type === 'application/pdf') return <FaFilePdf className="text-red-500" />;
    if (type.includes('document')) return <FaFileAlt className="text-blue-600" />;
    return <FaFile className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Attachments (Optional)
      </label>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
          }
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => e.target.files && onAdd(e.target.files)}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
        />
        <FaPaperclip className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag & drop files here or click to browse
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Max 5MB per file • PDF, DOC, Images
        </p>
      </div>

      {/* File List */}
      {attachments.length > 0 && (
        <div className="space-y-2 mt-3">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {error && <p className="text-red-500 text-sm">⚠ {error}</p>}
    </div>
  );
};

// Main Contact Component
const Contact: React.FC = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { addMessage } = useMessages();
  const { addHireRequest } = useHireRequests();
  
  const [activeTab, setActiveTab] = useState<'contact' | 'hire'>('contact');
  const [termsModalType, setTermsModalType] = useState<'terms' | 'privacy' | null>(null);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactErrors, setContactErrors] = useState<ContactFormErrors & { submit?: string }>({
    name: '', email: '', message: '', submit: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Hire Form State
  const [hireForm, setHireForm] = useState<HireFormData>({
    name: '', email: '', company: '', phone: '',
    projectType: '', budget: '', timeline: '', description: '',
    ndaRequired: false, termsAccepted: false, attachments: []
  });
  const [hireErrors, setHireErrors] = useState<Record<string, string>>({});
  const [hireSubmitted, setHireSubmitted] = useState(false);
  const [hireSubmitting, setHireSubmitting] = useState(false);
  const [attachmentError, setAttachmentError] = useState('');

  const profileEmail = profile?.email || 'usman@example.com';
  const profileLocation = profile?.location || 'Lahore, Pakistan';

  // File handling
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const compressImage = async (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 1200;
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleFileAdd = async (files: FileList) => {
    const newAttachments: HireAttachment[] = [];
    setAttachmentError('');

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setAttachmentError('Each file must be less than 5MB');
        return;
      }

      try {
        let base64 = await convertFileToBase64(file);
        if (file.type.startsWith('image/')) {
          base64 = await compressImage(base64);
        }

        newAttachments.push({
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64
        });
      } catch {
        setAttachmentError('Failed to process file');
        return;
      }
    }

    setHireForm(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newAttachments]
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
    if (contactErrors[name as keyof typeof contactErrors]) {
      setContactErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleHireChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setHireForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (hireErrors[name]) {
      setHireErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContactForm(contactForm);
    setContactErrors(validationErrors);
    
    if (!hasErrors({ name: validationErrors.name, email: validationErrors.email, message: validationErrors.message })) {
      setContactSubmitting(true);
      try {
        await addMessage(contactForm);
        setContactSubmitted(true);
        setContactForm({ name: '', email: '', message: '' });
      } catch {
        setContactErrors(prev => ({ ...prev, submit: 'Failed to send message. Please try again.' }));
      } finally {
        setContactSubmitting(false);
      }
    }
  };

  const handleHireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    
    if (!hireForm.name) errors.name = 'Name is required';
    if (!hireForm.email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hireForm.email)) errors.email = 'Invalid email';
    if (!hireForm.projectType) errors.projectType = 'Project type is required';
    if (!hireForm.description) errors.description = 'Project description is required';
    if (!hireForm.termsAccepted) errors.termsAccepted = 'You must accept the Terms of Service';

    setHireErrors(errors);

    if (Object.keys(errors).length === 0) {
      setHireSubmitting(true);
      try {
        await addHireRequest(hireForm);
        setHireSubmitted(true);
        setHireForm({
          name: '', email: '', company: '', phone: '',
          projectType: '', budget: '', timeline: '', description: '',
          ndaRequired: false, termsAccepted: false, attachments: []
        });
      } catch {
        setHireErrors(prev => ({ ...prev, submit: 'Failed to submit request. Please try again.' }));
      } finally {
        setHireSubmitting(false);
      }
    }
  };

  const socialLinks: SocialLink[] = React.useMemo(() => {
  const links = profile?.socialLinks;
  if (!links) return [];
  return Array.isArray(links) ? links : [];
}, [profile]);

  const getIconForPlatform = (platform: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'linkedin': <FaLinkedinIn className="w-5 h-5" />,
      'github': <FaGithub className="w-5 h-5" />,
      'fiverr': <SiFiverr className="w-5 h-5" />,
      'upwork': <SiUpwork className="w-5 h-5" />,
      'freelancer': <SiFreelancer className="w-5 h-5" />,
      'guru': <FaStore className="w-5 h-5" />,
      'facebook': <FaFacebookF className="w-5 h-5" />,
      'behance': <FaBehance className="w-5 h-5" />,
      'whatsapp': <FaWhatsapp className="w-5 h-5" />,
      'envelope': <MdEmail className="w-5 h-5" />,
      'globe': <MdLanguage className="w-5 h-5" />,
    };
    return iconMap[platform.toLowerCase()] || <MdLanguage className="w-5 h-5" />;
  };

  const formatUrl = (url: string): string => {
    if (!url) return '#';
    if (url.startsWith('mailto:')) return url;
    if (url.includes('whatsapp') || url.startsWith('wa.me')) {
      return `https://wa.me/${url.replace(/\D/g, '')}`;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <LoadingSkeleton type="card" count={2} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary rounded-full text-sm font-semibold mb-4 border border-primary/20"
          >
            LET'S CONNECT
          </motion.span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">Get In </span>
            <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Choose the option that works best for you.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex p-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'contact'
                  ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary'
              }`}
            >
              Quick Message
            </button>
            <button
              onClick={() => setActiveTab('hire')}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'hire'
                  ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary'
              }`}
            >
              Hire Me
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            variants={slideInLeft}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Card className="p-6 md:p-8">
              {activeTab === 'contact' ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl flex items-center justify-center text-primary">
                      <MdEmail className="text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Send a Message
                    </h2>
                  </div>

                  {contactSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheck className="text-2xl text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        I'll get back to you within 24-48 hours.
                      </p>
                      <Button variant="primary" onClick={() => setContactSubmitted(false)}>
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      <Input
                        label="Your Name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        placeholder="John Doe"
                        required
                        error={contactErrors.name}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        placeholder="john@example.com"
                        required
                        error={contactErrors.email}
                      />
                      <Textarea
                        label="Your Message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        placeholder="Tell me about your project..."
                        required
                        rows={5}
                        error={contactErrors.message}
                      />
                      {contactErrors.submit && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">
                          {contactErrors.submit}
                        </div>
                      )}
                      <Button type="submit" variant="primary" disabled={contactSubmitting} className="w-full">
                        {contactSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl flex items-center justify-center text-primary">
                      <FaPaperclip className="text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Hire Me
                    </h2>
                  </div>

                  {hireSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheck className="text-2xl text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Request Submitted!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        I'll review your project and get back to you within 24 hours.
                      </p>
                      <Button variant="primary" onClick={() => setHireSubmitted(false)}>
                        Submit Another Request
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleHireSubmit} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          name="name"
                          value={hireForm.name}
                          onChange={handleHireChange}
                          placeholder="John Doe"
                          required
                          error={hireErrors.name}
                        />
                        <Input
                          label="Email"
                          type="email"
                          name="email"
                          value={hireForm.email}
                          onChange={handleHireChange}
                          placeholder="john@example.com"
                          required
                          error={hireErrors.email}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Company (Optional)"
                          name="company"
                          value={hireForm.company || ''}
                          onChange={handleHireChange}
                          placeholder="Company name"
                        />
                        <Input
                          label="Phone (Optional)"
                          type="tel"
                          name="phone"
                          value={hireForm.phone || ''}
                          onChange={handleHireChange}
                          placeholder="+1 234 567 890"
                        />
                      </div>
                      <Select
                        label="Project Type"
                        name="projectType"
                        value={hireForm.projectType}
                        onChange={handleHireChange}
                        options={PROJECT_TYPES}
                        required
                        error={hireErrors.projectType}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Select
                          label="Budget Range"
                          name="budget"
                          value={hireForm.budget}
                          onChange={handleHireChange}
                          options={BUDGET_OPTIONS}
                        />
                        <Select
                          label="Timeline"
                          name="timeline"
                          value={hireForm.timeline}
                          onChange={handleHireChange}
                          options={TIMELINE_OPTIONS}
                        />
                      </div>
                      <Textarea
                        label="Project Description"
                        name="description"
                        value={hireForm.description}
                        onChange={handleHireChange}
                        placeholder="Describe your project, goals, and requirements..."
                        required
                        rows={4}
                        error={hireErrors.description}
                      />
                      
                      {/* File Attachments */}
                      <FileAttachment
                        attachments={hireForm.attachments || []}
                        onAdd={handleFileAdd}
                        onRemove={(index) => {
                          setHireForm(prev => ({
                            ...prev,
                            attachments: prev.attachments?.filter((_, i) => i !== index)
                          }));
                        }}
                        error={attachmentError}
                      />

                      {/* Checkboxes */}
                      <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="ndaRequired"
                            checked={hireForm.ndaRequired}
                            onChange={handleHireChange}
                            className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            I require a Non-Disclosure Agreement (NDA) before discussing project details
                          </span>
                        </label>
                        
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={hireForm.termsAccepted}
                            onChange={handleHireChange}
                            className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            I agree to the{' '}
                            <button
                              type="button"
                              onClick={() => setTermsModalType('terms')}
                              className="text-primary hover:underline"
                            >
                              Terms of Service
                            </button>
                            {' '}and{' '}
                            <button
                              type="button"
                              onClick={() => setTermsModalType('privacy')}
                              className="text-primary hover:underline"
                            >
                              Privacy Policy
                            </button>
                            {' '}*
                          </span>
                        </label>
                        {hireErrors.termsAccepted && (
                          <p className="text-red-500 text-sm">⚠ {hireErrors.termsAccepted}</p>
                        )}
                      </div>

                      {hireErrors.submit && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">
                          {hireErrors.submit}
                        </div>
                      )}

                      <Button type="submit" variant="primary" disabled={hireSubmitting} className="w-full">
                        {hireSubmitting ? 'Submitting...' : 'Submit Hire Request'}
                      </Button>
                    </form>
                  )}
                </>
              )}
            </Card>
          </motion.div>

{/* Contact Info Section */}
<motion.div
  variants={slideInRight}
  initial="initial"
  whileInView="animate"
  viewport={{ once: true }}
  className="space-y-6"
>
{/* Contact Information Card */}
<Card className="p-6 md:p-8 overflow-hidden relative">
  {/* Background Gradient */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full blur-2xl -mr-16 -mt-16" />
  
  <div className="relative">
    <div className="flex items-center gap-3 mb-8">
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/25"
      >
        <MdLanguage className="text-xl" />
      </motion.div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Contact Information
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Let's connect and create something great
        </p>
      </div>
    </div>
    
    <div className="space-y-3">
      {[
        { 
          icon: FaMapPin, 
          label: 'Location', 
          value: profileLocation,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-500/10'
        },
        { 
          icon: MdEmail, 
          label: 'Email', 
          value: profileEmail, 
          link: `mailto:${profileEmail}`,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-500/10'
        },
        { 
          icon: FaClock, 
          label: 'Response Time', 
          value: 'Within 24-48 hours',
          iconColor: 'text-green-500',
          bgColor: 'bg-green-500/10'
        },
        { 
          icon: FaGlobe, 
          label: 'Availability', 
          value: 'Remote / Worldwide',
          iconColor: 'text-purple-500',
          bgColor: 'bg-purple-500/10'
        }
      ].map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            className="group relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
          >
            <div className="relative flex items-center gap-4 p-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-11 h-11 ${item.bgColor} rounded-xl flex items-center justify-center text-lg group-hover:shadow-md transition-all duration-300`}
              >
                <IconComponent className={item.iconColor} />
              </motion.div>
              <div className="flex-1">
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {item.label}
                </p>
                {item.link ? (
                  <a 
                    href={item.link} 
                    className="text-sm font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors inline-flex items-center gap-1 group/link"
                  >
                    {item.value}
                    <FaArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 text-primary" />
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </p>
                )}
              </div>
              {item.link && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <FaChevronRight className="w-3 h-3 text-primary" />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
</Card>

  {/* Social Links Card */}
  <Card className="p-6 md:p-8 overflow-hidden relative">
    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-primary/10 to-purple-600/10 rounded-full blur-2xl -ml-20 -mb-20" />
    
    <div className="relative">
      <div className="flex items-center gap-3 mb-8">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/25"
        >
          <FaShareAlt className="text-xl" />
        </motion.div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Connect With Me
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Find me on these platforms
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {socialLinks.length > 0 ? (
          socialLinks.map((link, index) => (
            <motion.a
              key={`${link.platform}-${index}`}
              href={formatUrl(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative overflow-hidden bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex flex-col items-center p-4">
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-2xl mb-3 shadow-sm group-hover:shadow-md transition-all duration-300"
                >
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                    {getIconForPlatform(link.platform)}
                  </span>
                </motion.div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize group-hover:text-primary transition-colors">
                  {link.platform}
                </span>
              </div>
            </motion.a>
          ))
        ) : (
          <>
            {[
              { icon: FaGithub, label: 'GitHub', url: 'https://github.com', color: 'hover:text-gray-900' },
              { icon: FaLinkedinIn, label: 'LinkedIn', url: 'https://linkedin.com', color: 'hover:text-blue-600' },
              { icon: MdEmail, label: 'Email', url: `mailto:${profileEmail}`, color: 'hover:text-red-500' }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.a 
                  key={index}
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative overflow-hidden bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex flex-col items-center p-4">
                    <motion.div 
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-2xl mb-3 shadow-sm group-hover:shadow-md transition-all duration-300"
                    >
                      <IconComponent className={`text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors ${item.color}`} />
                    </motion.div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </>
        )}
      </div>
    </div>
  </Card>

  {/* CTA Card */}
  <Card className="p-6 md:p-8 overflow-hidden relative bg-gradient-to-br from-primary via-purple-600 to-blue-600 border-0">
    {/* Animated Background Elements */}
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
    />
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"
    />
    
    <div className="relative text-center">
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-16 h-16 mx-auto mb-5 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
      >
        <FaRocket className="text-3xl text-white" />
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold mb-3 text-white"
      >
        Ready to Build Something Amazing?
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-white/80 text-sm mb-6"
      >
        I'm available for freelance projects, consulting, and collaborations.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          variant="primary"
          onClick={() => setActiveTab('hire')}
          className="w-full !bg-white !text-primary hover:!bg-white/90 hover:!scale-105 !shadow-xl group"
        >
          <span className="text-white">Start a Project</span>
          <FaArrowRight className="group-hover:translate-x-1 transition-transform text-white" />
        </Button>
      </motion.div>
      
      {/* Trust Indicators */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-4 mt-5 text-white/60 text-xs"
      >
        <span className="flex items-center gap-1">
          <FaCheckCircle className="text-green-400" />
          Free Consultation
        </span>
        <span className="w-1 h-1 bg-white/30 rounded-full" />
        <span className="flex items-center gap-1">
          <FaCheckCircle className="text-green-400" />
          NDA Available
        </span>
        <span className="w-1 h-1 bg-white/30 rounded-full" />
        <span className="flex items-center gap-1">
          <FaCheckCircle className="text-green-400" />
          Quick Response
        </span>
      </motion.div>
    </div>
  </Card>
</motion.div>
        </div>
      </div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={termsModalType !== null}
        onClose={() => setTermsModalType(null)}
        type={termsModalType || 'terms'}
      />
    </div>
  );
};

export default Contact;