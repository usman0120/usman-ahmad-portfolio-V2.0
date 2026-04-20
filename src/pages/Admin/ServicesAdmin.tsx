// pages/Admin/ServicesAdmin.tsx
import React, { useState, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useServices } from '../../hooks/useFirestore';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { staggerContainer, scale } from '../../utils/animations';
import { SERVICE_ICON_OPTIONS, FEATURE_ICON_OPTIONS } from '../../firebase/models';
import type { ServiceFormData, Service, ServiceFeature, ServiceProcess } from '../../firebase/models';
import { FaPlus, FaTrash, FaEdit, FaArrowUp, FaArrowDown } from 'react-icons/fa';

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
  const baseClasses = 'rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg active:scale-95',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-primary border border-primary/30 hover:border-primary',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
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
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};

// Input Component
const InputField = memo(({ 
  label, 
  type = 'text', 
  name,
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error 
}: {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
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
        className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        }`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
});

InputField.displayName = 'InputField';

// Textarea Component
const TextareaField = memo(({ 
  label, 
  name,
  value, 
  onChange, 
  placeholder, 
  required = false, 
  rows = 4, 
  error 
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  error?: string;
}) => {
  return (
    <div className="flex flex-col space-y-1.5">
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
        className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-none ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        }`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
});

TextareaField.displayName = 'TextareaField';

// Feature Editor Component
const FeatureEditor: React.FC<{
  features: ServiceFeature[];
  onChange: (features: ServiceFeature[]) => void;
}> = ({ features, onChange }) => {
  const [newFeature, setNewFeature] = useState<ServiceFeature>({ title: '', description: '', icon: 'star' });

  const addFeature = () => {
    if (newFeature.title && newFeature.description) {
      onChange([...features, { ...newFeature }]);
      setNewFeature({ title: '', description: '', icon: 'star' });
    }
  };

  const removeFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: keyof ServiceFeature, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Features</label>
      
      {/* Existing Features */}
      {features.map((feature, index) => (
        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-3">
          <div className="flex gap-2">
            <InputField
              label=""
              name={`feature-title-${index}`}
              value={feature.title}
              onChange={(e) => updateFeature(index, 'title', e.target.value)}
              placeholder="Feature title"
            />
            <select
              value={feature.icon}
              onChange={(e) => updateFeature(index, 'icon', e.target.value)}
              className="w-32 px-3 py-2.5 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            >
              {FEATURE_ICON_OPTIONS.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
            <Button variant="danger" size="sm" onClick={() => removeFeature(index)}>
              <FaTrash />
            </Button>
          </div>
          <TextareaField
            label=""
            name={`feature-desc-${index}`}
            value={feature.description}
            onChange={(e) => updateFeature(index, 'description', e.target.value)}
            placeholder="Feature description"
            rows={2}
          />
        </div>
      ))}

      {/* Add New Feature */}
      <div className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl space-y-3">
        <div className="flex gap-2">
          <InputField
            label=""
            name="new-feature-title"
            value={newFeature.title}
            onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
            placeholder="New feature title"
          />
          <select
            value={newFeature.icon}
            onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
            className="w-32 px-3 py-2.5 border rounded-xl bg-white dark:bg-gray-800"
          >
            {FEATURE_ICON_OPTIONS.map(icon => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </select>
          <Button variant="primary" size="sm" onClick={addFeature}>
            <FaPlus /> Add
          </Button>
        </div>
        <TextareaField
          label=""
          name="new-feature-desc"
          value={newFeature.description}
          onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
          placeholder="Feature description"
          rows={2}
        />
      </div>
    </div>
  );
};

// Process Editor Component
const ProcessEditor: React.FC<{
  process: ServiceProcess[];
  onChange: (process: ServiceProcess[]) => void;
}> = ({ process, onChange }) => {
  const [newStep, setNewStep] = useState<ServiceProcess>({ step: process.length + 1, title: '', description: '' });

  const addStep = () => {
    if (newStep.title && newStep.description) {
      onChange([...process, { ...newStep, step: process.length + 1 }]);
      setNewStep({ step: process.length + 2, title: '', description: '' });
    }
  };

  const removeStep = (index: number) => {
    const updated = process.filter((_, i) => i !== index);
    // Re-number steps
    onChange(updated.map((step, i) => ({ ...step, step: i + 1 })));
  };

  const updateStep = (index: number, field: keyof ServiceProcess, value: string | number) => {
    const updated = [...process];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === process.length - 1)) {
      return;
    }
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...process];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    // Re-number steps
    onChange(updated.map((step, i) => ({ ...step, step: i + 1 })));
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Process Steps</label>
      
      {process.map((step, index) => (
        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm">
              {step.step}
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => moveStep(index, 'up')}>
                <FaArrowUp />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => moveStep(index, 'down')}>
                <FaArrowDown />
              </Button>
              <Button variant="danger" size="sm" onClick={() => removeStep(index)}>
                <FaTrash />
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <InputField
              label=""
              name={`step-title-${index}`}
              value={step.title}
              onChange={(e) => updateStep(index, 'title', e.target.value)}
              placeholder="Step title"
            />
            <TextareaField
              label=""
              name={`step-desc-${index}`}
              value={step.description}
              onChange={(e) => updateStep(index, 'description', e.target.value)}
              placeholder="Step description"
              rows={2}
            />
          </div>
        </div>
      ))}

      <div className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl space-y-3">
        <InputField
          label=""
          name="new-step-title"
          value={newStep.title}
          onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
          placeholder="New step title"
        />
        <TextareaField
          label=""
          name="new-step-desc"
          value={newStep.description}
          onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
          placeholder="Step description"
          rows={2}
        />
        <Button variant="primary" size="sm" onClick={addStep}>
          <FaPlus /> Add Step
        </Button>
      </div>
    </div>
  );
};

// Array Input Component
const ArrayInput: React.FC<{
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}> = ({ label, values, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const addValue = () => {
    if (inputValue.trim() && !values.includes(inputValue.trim())) {
      onChange([...values, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
        />
        <Button variant="secondary" onClick={addValue}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-1"
          >
            {value}
            <button onClick={() => removeValue(index)} className="hover:text-red-500">×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

// Main Component
const ServicesAdmin: React.FC = () => {
  const { services, loading, addService, updateService, deleteService } = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    overview: [''],
    features: [],
    process: [],
    technologies: [],
    imageUrl: '',
    icon: 'FaCode',
    featured: false,
    order: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: generateSlug(value)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, imageUrl: 'Please upload an image file' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, imageUrl: 'Image size should be less than 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, imageUrl: base64String }));
      setImagePreview(base64String);
      if (errors.imageUrl) {
        setErrors(prev => ({ ...prev, imageUrl: '' }));
      }
    };
    reader.readAsDataURL(file);
  };

// pages/Admin/ServicesAdmin.tsx

// Add this function after your state declarations (around line 345, after the openEditModal function)

const closeModal = () => {
  setIsModalOpen(false);
  setEditingService(null);
  setImagePreview('');
  setErrors({});
};

// Also update the openAddModal and openEditModal to not duplicate this logic:

const openAddModal = () => {
  setEditingService(null);
  setFormData({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    overview: [''],
    features: [],
    process: [],
    technologies: [],
    imageUrl: '',
    icon: 'FaCode',
    featured: false,
    order: services?.length || 0
  });
  setImagePreview('');
  setErrors({});
  setIsModalOpen(true);
};

const openEditModal = (service: Service) => {
  setEditingService(service);
  setFormData({
    title: service.title,
    slug: service.slug,
    tagline: service.tagline,
    description: service.description,
    overview: service.overview || [''],
    features: service.features || [],
    process: service.process || [],
    technologies: service.technologies || [],
    imageUrl: service.imageUrl || '',
    icon: service.icon || 'FaCode',
    featured: service.featured || false,
    order: service.order || 0
  });
  if (service.imageUrl?.startsWith('data:image')) {
    setImagePreview(service.imageUrl);
  } else {
    setImagePreview('');
  }
  setErrors({});
  setIsModalOpen(true);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (formData.features.length === 0) newErrors.features = 'At least one feature is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingService?.id) {
        await updateService(editingService.id, formData);
      } else {
        await addService(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving service:', error);
      setErrors({ submit: 'Failed to save service. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(serviceId);
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background">
        <div className="max-w-7xl mx-auto p-6">
          <LoadingSkeleton type="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm" icon="←">
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Services
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage your service offerings
                </p>
              </div>
            </div>
            <Button variant="primary" onClick={openAddModal} icon={<FaPlus />}>
              Add New Service
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {services?.map((service: Service, index: number) => (
              <motion.div
                key={service.id}
                variants={scale}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-40">
                    <img
                      src={service.imageUrl || 'https://via.placeholder.com/400x160?text=Service+Image'}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    {service.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-primary text-white px-2 py-1 rounded-lg text-xs font-medium">
                          ⭐ Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {service.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Slug: {service.slug}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1 line-clamp-2">
                      {service.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {service.technologies?.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {service.technologies?.length > 3 && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                          +{service.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditModal(service)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDelete(service.id!)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {services?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🛠️</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Services Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start by adding your first service offering.
            </p>
            <Button variant="primary" onClick={openAddModal}>
              Add Your First Service
            </Button>
          </motion.div>
        )}
      </div>

{/* Add/Edit Modal */}
<Modal
  isOpen={isModalOpen}
  onClose={closeModal}
  title={editingService ? 'Edit Service' : 'Add New Service'}
  size="xl"
  showCloseButton={true}
  closeOnBackdropClick={!isSubmitting} // Prevent closing while submitting
>
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* ... all your form fields ... */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Service Title"
              name="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Web Development"
              required
              error={errors.title}
            />
            <InputField
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="web-development"
              required
            />
          </div>

          <InputField
            label="Tagline"
            name="tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="Brief description of the service"
            required
          />

          <TextareaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed service description"
            required
            rows={3}
            error={errors.description}
          />

          {/* Overview Points */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Overview Points</label>
            {formData.overview.map((point, index) => (
              <div key={index} className="flex gap-2">
                <InputField
                  label=""
                  name={`overview-${index}`}
                  value={point}
                  onChange={(e) => {
                    const updated = [...formData.overview];
                    updated[index] = e.target.value;
                    setFormData({ ...formData, overview: updated });
                  }}
                  placeholder="Overview point"
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    const updated = formData.overview.filter((_, i) => i !== index);
                    setFormData({ ...formData, overview: updated.length ? updated : [''] });
                  }}
                >
                  <FaTrash />
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFormData({ ...formData, overview: [...formData.overview, ''] })}
            >
              <FaPlus /> Add Point
            </Button>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Service Icon
            </label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            >
              {SERVICE_ICON_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Service Image
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, imageUrl: '' });
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                Choose Image
              </Button>
            )}
            
            <InputField
              label="Or enter image URL"
              name="imageUrl"
              type="url"
              value={formData.imageUrl?.startsWith('data:') ? '' : formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Technologies */}
          <ArrayInput
            label="Technologies"
            values={formData.technologies}
            onChange={(technologies) => setFormData({ ...formData, technologies })}
            placeholder="e.g., React, Node.js, Python"
          />

          {/* Features Editor */}
          <FeatureEditor
            features={formData.features}
            onChange={(features) => setFormData({ ...formData, features })}
          />

          {/* Process Editor */}
          <ProcessEditor
            process={formData.process}
            onChange={(process) => setFormData({ ...formData, process })}
          />

          {/* Featured & Order */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Featured Service
              </span>
            </label>
            
            <InputField
              label="Display Order"
              name="order"
              type="number"
              value={String(formData.order)}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            />
          </div>
    {errors.submit && (
      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
        {errors.submit}
      </div>
    )}

    {/* Form Buttons - These are inside the form, not in the modal footer */}
    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
      <Button 
        type="button" 
        variant="outline" 
        onClick={closeModal} 
        className="flex-1"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        variant="primary" 
        disabled={isSubmitting} 
        className="flex-1"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {editingService ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          editingService ? 'Update Service' : 'Create Service'
        )}
      </Button>
    </div>
  </form>
</Modal>
    </div>
  );
};

export default ServicesAdmin;