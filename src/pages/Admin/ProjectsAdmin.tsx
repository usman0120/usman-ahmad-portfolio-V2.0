// pages/Admin/ProjectsAdmin.tsx
import React, { useState, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProjects, useProjectDetails } from '../../hooks/useFirestore';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { staggerContainer, scale } from '../../utils/animations';
import { validateProjectForm, hasErrors, type ProjectFormErrors } from '../../utils/validators';
import type { ProjectFormData, Project, ProjectDetailFormData, ProjectDetail } from '../../firebase/models';
import { FaPlus, FaTrash, FaEdit, FaFileAlt, FaTimes, FaUpload} from 'react-icons/fa';

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
  children, variant = 'primary', size = 'md', onClick, type = 'button', disabled = false, className = '', icon
}) => {
  const baseClasses = 'rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg active:scale-95',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-primary border border-primary/30',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
  };

  const sizeClasses = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} className={classes} whileHover={!disabled ? { scale: 1.02 } : {}} whileTap={!disabled ? { scale: 0.98 } : {}}>
      {icon}{children}
    </motion.button>
  );
};

// Card Component
const Card: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean; padding?: 'none' | 'sm' | 'md' | 'lg' }> = ({ children, className = '', hover = false, padding = 'md' }) => {
  const paddingClasses = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };
  const classes = `rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm ${hover ? 'transition-all duration-200 hover:shadow-md hover:border-primary/30' : ''} ${paddingClasses[padding]} ${className}`;
  return <motion.div className={classes} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>{children}</motion.div>;
};

// Input Component
const InputField = memo(({ label, type = 'text', name, value, onChange, placeholder, required = false, error }: {
  label: string; type?: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string; required?: boolean; error?: string;
}) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label} {required && <span className="text-primary">*</span>}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
));
InputField.displayName = 'InputField';

// Textarea Component
const TextareaField = memo(({ label, name, value, onChange, placeholder, required = false, rows = 4, error }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string; required?: boolean; rows?: number; error?: string;
}) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label} {required && <span className="text-primary">*</span>}</label>
    <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows}
      className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
));
TextareaField.displayName = 'TextareaField';

// Array Input Component
const ArrayInput: React.FC<{ label: string; values: string[]; onChange: (values: string[]) => void; placeholder?: string }> = ({ label, values, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const addValue = () => { if (inputValue.trim() && !values.includes(inputValue.trim())) { onChange([...values, inputValue.trim()]); setInputValue(''); } };
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex gap-2">
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={placeholder} className="flex-1 px-4 py-2 border rounded-xl dark:bg-gray-800" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())} />
        <Button variant="secondary" onClick={addValue}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((value, i) => (
          <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-1">
            {value} <button onClick={() => onChange(values.filter((_, j) => j !== i))} className="hover:text-red-500">×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

// Project Detail Modal Component
const ProjectDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  existingDetail?: ProjectDetail;
  onSave: (data: ProjectDetailFormData) => Promise<void>;
}> = ({ isOpen, onClose, project, existingDetail, onSave }) => {
  const [formData, setFormData] = useState<ProjectDetailFormData>(() => ({
    projectId: project.id,
    client: existingDetail?.client || '',
    date: existingDetail?.date || new Date().toISOString().split('T')[0],
    overview: existingDetail?.overview || '',
    challenges: existingDetail?.challenges || [],
    solutions: existingDetail?.solutions || '',
    results: existingDetail?.results || [],
    services: existingDetail?.services || [],
    gallery: existingDetail?.gallery || []
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [galleryPreview, setGalleryPreview] = useState<string[]>(existingDetail?.gallery || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (!file.type.match('image.*')) return;
      if (file.size > 2 * 1024 * 1024) return;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, base64] }));
        setGalleryPreview(prev => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
    setGalleryPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving project detail:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Project Details: ${project.title}`} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Client" name="client" value={formData.client || ''} onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))} placeholder="Client name (optional)" />
          <InputField label="Project Date" type="date" name="date" value={formData.date || ''} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} />
        </div>

        <TextareaField label="Project Overview" name="overview" value={formData.overview} onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))} placeholder="Detailed project overview..." required rows={4} />

        <ArrayInput label="Challenges" values={formData.challenges} onChange={(challenges) => setFormData(prev => ({ ...prev, challenges }))} placeholder="e.g., Scaling to 1M users" />

        <TextareaField label="Solution" name="solutions" value={formData.solutions} onChange={(e) => setFormData(prev => ({ ...prev, solutions: e.target.value }))} placeholder="How you solved the challenges..." required rows={4} />

        <ArrayInput label="Results / Key Outcomes" values={formData.results} onChange={(results) => setFormData(prev => ({ ...prev, results }))} placeholder="e.g., 40% performance improvement" />

        <ArrayInput label="Services Provided" values={formData.services} onChange={(services) => setFormData(prev => ({ ...prev, services }))} placeholder="e.g., Full-Stack Development" />

        {/* Gallery Upload */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Project Gallery</label>
          <input type="file" ref={fileInputRef} onChange={handleGalleryUpload} accept="image/*" multiple className="hidden" />
          
          <div className="grid grid-cols-3 gap-3 mb-3">
            {galleryPreview.map((img, index) => (
              <div key={index} className="relative group">
                <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => fileInputRef.current?.click()} className="h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors">
              <FaPlus className="w-6 h-6" />
            </button>
          </div>
          <p className="text-xs text-gray-500">Upload screenshots or delivery images (max 2MB each)</p>
        </div>

        <div className="flex gap-3 pt-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Saving...' : (existingDetail ? 'Update Details' : 'Save Details')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Main Component
const ProjectsAdmin: React.FC = () => {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
  const { projectDetails, addProjectDetail, updateProjectDetail } = useProjectDetails();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [detailModalProject, setDetailModalProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '', description: '', techStack: [], imageUrl: '', githubUrl: '', demoUrl: '', featured: false
  });

  const [errors, setErrors] = useState<ProjectFormErrors & { submit?: string }>({
    title: '', description: '', imageUrl: '', githubUrl: '', demoUrl: '', techStack: ''
  });

  const [techInput, setTechInput] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match('image.*')) { setErrors(prev => ({ ...prev, imageUrl: 'Please upload an image file' })); return; }
    if (file.size > 2 * 1024 * 1024) { setErrors(prev => ({ ...prev, imageUrl: 'Image size should be less than 2MB' })); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, imageUrl: base64String }));
      setImagePreview(base64String);
      if (errors.imageUrl) setErrors(prev => ({ ...prev, imageUrl: '' }));
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({ title: '', description: '', techStack: [], imageUrl: '', githubUrl: '', demoUrl: '', featured: false });
    setImagePreview(''); setTechInput(''); setErrors({ title: '', description: '', imageUrl: '', githubUrl: '', demoUrl: '', techStack: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({ title: project.title, description: project.description, techStack: project.techStack, imageUrl: project.imageUrl, githubUrl: project.githubUrl, demoUrl: project.demoUrl, featured: project.featured });
    setImagePreview(project.imageUrl?.startsWith('data:image') ? project.imageUrl : '');
    setTechInput(''); setErrors({ title: '', description: '', imageUrl: '', githubUrl: '', demoUrl: '', techStack: '' });
    setIsModalOpen(true);
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);

  const handleAddTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData(prev => ({ ...prev, techStack: [...prev.techStack, techInput.trim()] }));
      setTechInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProjectForm(formData);
    setErrors(validationErrors);
    const errorRecord: Record<string, string> = { title: validationErrors.title, description: validationErrors.description, imageUrl: validationErrors.imageUrl, githubUrl: validationErrors.githubUrl, demoUrl: validationErrors.demoUrl, techStack: validationErrors.techStack };
    if (!hasErrors(errorRecord)) {
      setIsSubmitting(true);
      try {
        if (editingProject) {
          await updateProject(editingProject.id, formData);
        } else {
          await addProject(formData);
        }
        setIsModalOpen(false);
      } catch { setErrors(prev => ({ ...prev, submit: 'Failed to save project.' })); }
      finally { setIsSubmitting(false); }
    }
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Delete this project?')) {
      try { await deleteProject(projectId); } catch { alert('Failed to delete.'); }
    }
  };

  const handleSaveDetail = async (data: ProjectDetailFormData) => {
    if (!detailModalProject) return;
    const existing = projectDetails.find(d => d.projectId === detailModalProject.id);
    if (existing?.id) {
      await updateProjectDetail(existing.id, data);
    } else {
      await addProjectDetail(data);
    }
  };

  const getProjectDetail = (projectId: string) => projectDetails.find(d => d.projectId === projectId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6"><LoadingSkeleton type="card" count={6} /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard"><Button variant="ghost" size="sm" icon="←">Back</Button></Link>
              <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1><p className="text-sm text-gray-500">Manage your portfolio</p></div>
            </div>
            <Button variant="primary" onClick={openAddModal} icon={<FaPlus />}>Add Project</Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project, index) => {
              const hasDetail = !!getProjectDetail(project.id);
              return (
                <motion.div key={project.id} variants={scale} transition={{ delay: index * 0.1 }} layout>
                  <Card className="h-full flex flex-col overflow-hidden" hover>
                    <div className="relative h-48">
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                      {project.featured && <div className="absolute top-3 right-3"><span className="bg-primary text-white px-2 py-1 rounded text-xs">⭐ Featured</span></div>}
                      {hasDetail && <div className="absolute top-3 left-3"><span className="bg-green-500 text-white px-2 py-1 rounded text-xs"><FaFileAlt className="inline mr-1" />Detail</span></div>}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.techStack.slice(0, 3).map((tech, i) => <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{tech}</span>)}
                        {project.techStack.length > 3 && <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">+{project.techStack.length - 3}</span>}
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(project)}><FaEdit /> Edit</Button>
                          <Button variant="danger" size="sm" className="flex-1" onClick={() => handleDelete(project.id)}><FaTrash /> Delete</Button>
                        </div>
                        <Button variant="secondary" size="sm" className="w-full" onClick={() => setDetailModalProject(project)} icon={<FaFileAlt />}>
                          {hasDetail ? 'Edit Project Details' : 'Add Project Details'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {projects.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="text-5xl mb-4 opacity-30">📁</div>
            <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
            <p className="text-gray-500 mb-6">Add your first project.</p>
            <Button variant="primary" onClick={openAddModal}>Add Project</Button>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Edit Project' : 'Add Project'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="Title" name="title" value={formData.title} onChange={handleInputChange} required error={errors.title} />
          <TextareaField label="Description" name="description" value={formData.description} onChange={handleInputChange} required rows={4} error={errors.description} />
          
          <div>
            <label className="text-sm font-medium mb-2 block">Image</label>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            {imagePreview ? (
              <div className="relative"><img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                <button type="button" onClick={() => { setFormData(prev => ({ ...prev, imageUrl: '' })); setImagePreview(''); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full"><FaTimes className="w-3 h-3" /></button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}><FaUpload /> Choose Image</Button>
              </div>
            )}
            <InputField label="Or image URL" name="imageUrl" value={formData.imageUrl?.startsWith('data:') ? '' : formData.imageUrl} onChange={handleInputChange} error={errors.imageUrl} />
          </div>

          <InputField label="GitHub URL" name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} required error={errors.githubUrl} />
          <InputField label="Demo URL" name="demoUrl" value={formData.demoUrl} onChange={handleInputChange} error={errors.demoUrl} />

          <div>
            <label className="text-sm font-medium mb-2 block">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Add technology..." className="flex-1 px-4 py-2 border rounded-xl dark:bg-gray-800" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())} />
              <Button type="button" variant="secondary" onClick={handleAddTech}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-1">{tech} <button onClick={() => setFormData(prev => ({ ...prev, techStack: prev.techStack.filter(t => t !== tech) }))} className="hover:text-red-500">×</button></span>
              ))}
            </div>
            {errors.techStack && <p className="text-red-500 text-xs mt-1">{errors.techStack}</p>}
          </div>

          <label className="flex items-center gap-2"><input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-4 h-4 text-primary rounded" /> Featured project</label>

          {errors.submit && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">{errors.submit}</div>}

          <div className="flex gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">{isSubmitting ? 'Saving...' : (editingProject ? 'Update' : 'Add')}</Button>
          </div>
        </form>
      </Modal>

      {/* Project Detail Modal */}
      {detailModalProject && (
        <ProjectDetailModal
          isOpen={true}
          onClose={() => setDetailModalProject(null)}
          project={detailModalProject}
          existingDetail={getProjectDetail(detailModalProject.id)}
          onSave={handleSaveDetail}
        />
      )}
    </div>
  );
};

export default ProjectsAdmin;