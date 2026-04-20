// Social Link interface
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// Education interface
export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

// Firebase document interfaces
export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Skill Categories - Comprehensive for CS, SE, Cyber
export type SkillCategory = 
  | 'security' 
  | 'network' 
  | 'web' 
  | 'mobile' 
  | 'backend' 
  | 'frontend' 
  | 'database' 
  | 'devops' 
  | 'cloud' 
  | 'ai_ml' 
  | 'programming' 
  | 'tools'
  | 'concepts'
  | 'soft' 
  | 'other';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string;
  proficiency: number;
  featured: boolean;
}

// Learning Topic interface
export interface LearningTopic {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Learning Journey Settings
export interface LearningJourneySettings {
  id: string;
  title: string;
  description: string;
  quote: string;
  updatedAt: Date;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  email: string;
  location: string;
  university: string;
  department: string;
  hometown: string;
  resumeUrl: string;
  socialLinks: SocialLink[];
  education: Education[];
  goals: string[];
  experience: string[];
  certifications?: Certification[];
  stats?: {
    projects: number;
    clients: number;
    experience: number;
  };
}

export interface Certification {
  name: string;
  year: string;
}

// Form data interfaces
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
}

export interface SkillFormData {
  name: string;
  category: SkillCategory;
  icon: string;
  proficiency: number;
  featured: boolean;
}

export interface LearningTopicFormData {
  name: string;
  description?: string;
  active: boolean;
  order: number;
}

export interface LearningJourneySettingsFormData {
  title: string;
  description: string;
  quote: string;
}

export interface ProfileFormData {
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  email: string;
  location: string;
  university: string;
  department: string;
  hometown: string;
  resumeUrl: string;
  socialLinks: SocialLink[];
  education: Education[];
  goals: string[];
  experience: string[];
  certifications?: Certification[];
  stats?: {
    projects: number;
    clients: number;
    experience: number;
  };
}

// Auth interfaces
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Collection names
export const COLLECTIONS = {
  PROJECTS: 'projects',
  SKILLS: 'skills',
  MESSAGES: 'messages',
  PROFILE: 'profile',
  LEARNING_TOPICS: 'learningTopics',
  LEARNING_SETTINGS: 'learningSettings',
  SERVICES: 'services',
  HIRE_REQUESTS: 'hireRequests',
  PROJECT_DETAILS: 'projectDetails'
} as const;

// Category configuration
export const SKILL_CATEGORIES: { value: SkillCategory; label: string; icon: string; color: string; description: string }[] = [
  { value: 'security', label: 'Cybersecurity', icon: '🛡️', color: 'from-primary to-neon-purple', description: 'Security assessment, penetration testing, and defensive security' },
  { value: 'network', label: 'Networking', icon: '🌐', color: 'from-cyber-blue to-primary', description: 'Network protocols, architecture, and security' },
  { value: 'web', label: 'Web Development', icon: '🌍', color: 'from-primary to-cyber-blue', description: 'Web applications, frameworks, and technologies' },
  { value: 'mobile', label: 'Mobile Development', icon: '📱', color: 'from-neon-purple to-primary', description: 'iOS, Android, and cross-platform mobile development' },
  { value: 'backend', label: 'Backend Development', icon: '⚙️', color: 'from-cyber-blue to-neon-purple', description: 'Server-side technologies, APIs, and microservices' },
  { value: 'frontend', label: 'Frontend Development', icon: '🎨', color: 'from-primary to-neon-purple', description: 'UI/UX, frameworks, and client-side technologies' },
  { value: 'database', label: 'Databases', icon: '🗄️', color: 'from-cyber-blue to-primary', description: 'SQL, NoSQL, and database management systems' },
  { value: 'devops', label: 'DevOps & CI/CD', icon: '🔄', color: 'from-primary to-cyber-blue', description: 'Automation, deployment, and infrastructure management' },
  { value: 'cloud', label: 'Cloud Computing', icon: '☁️', color: 'from-neon-purple to-primary', description: 'Cloud platforms, services, and architecture' },
  { value: 'ai_ml', label: 'AI & Machine Learning', icon: '🤖', color: 'from-cyber-blue to-neon-purple', description: 'Artificial intelligence, ML models, and data science' },
  { value: 'programming', label: 'Programming Languages', icon: '💻', color: 'from-primary to-cyber-blue', description: 'Programming languages and paradigms' },
  { value: 'tools', label: 'Tools & Technologies', icon: '🛠️', color: 'from-neon-purple to-primary', description: 'Development tools, IDEs, and utilities' },
  { value: 'concepts', label: 'Foundations & Core Concepts', icon: '📚', color: 'from-cyber-blue to-neon-purple', description: 'Foundations & Core Concepts, Learning Concepts' },
  { value: 'soft', label: 'Soft Skills', icon: '🌟', color: 'from-cyber-blue to-neon-purple', description: 'Professional and interpersonal abilities' },
  { value: 'other', label: 'Other Skills', icon: '📌', color: 'from-gray-500 to-gray-700', description: 'Additional skills and competencies' }
];

// Icon options for skills
export const SKILL_ICON_OPTIONS = [
  // Security
  '🛡️', '🔍', '🔐', '🎯', '🔒', '🔎', '🦈', '🐛', '⚔️', '🏹',
  // Development
  '📱', '🎨', '🔄', '🔥', '📡', '💻', '🐍', '⚡', '🗄️', '📚',
  '🐧', '🐳', '☕', '🦀', '🐘', '🐬', '🍃', '🎭', '⚛️', '📦',
  // Cloud & DevOps
  '☁️', '🚀', '📊', '🔧', '⚙️', '🎪', '🏗️', '📈', '🔔', '🎛️',
  // AI/ML
  '🤖', '🧠', '👁️', '📊', '🎲', '🔮', '📐', '🎯',
  // Soft Skills
  '💡', '🧠', '💬', '👥', '📖', '⭐', '🎯', '🏆', '🤝', '📢',
  // Other
  '⚙️', '🔧', '📊', '📁', '📎', '🔗', '📌', '📍'
];

// Updated Font Awesome icon options for social links
export const SOCIAL_ICON_OPTIONS = [
  { value: 'linkedin', label: 'LinkedIn', prefix: 'fab' },
  { value: 'github', label: 'GitHub', prefix: 'fab' },
  { value: 'fiverr', label: 'Fiverr', prefix: 'fab' },
  { value: 'upwork', label: 'Upwork', prefix: 'fab' },
  { value: 'freelancer', label: 'Freelancer', prefix: 'fab' },
  { value: 'guru', label: 'Guru', prefix: 'fab' },
  { value: 'facebook', label: 'Facebook', prefix: 'fab' },
  { value: 'behance', label: 'Behance', prefix: 'fab' },
  { value: 'whatsapp', label: 'WhatsApp', prefix: 'fab' },
  { value: 'envelope', label: 'Email', prefix: 'fas' },
  { value: 'globe', label: 'Website', prefix: 'fas' },
];


// Service interface
export interface ServiceFeature {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceProcess {
  step: number;
  title: string;
  description: string;
}

export interface Service {
  id?: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  overview: string[];
  features: ServiceFeature[];
  process: ServiceProcess[];
  technologies: string[];
  imageUrl: string;
  icon: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceFormData {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  overview: string[];
  features: ServiceFeature[];
  process: ServiceProcess[];
  technologies: string[];
  imageUrl: string;
  icon: string;
  featured: boolean;
  order: number;
}

// Service icon options
export const SERVICE_ICON_OPTIONS = [
  { value: 'FaCode', label: 'Code', category: 'development' },
  { value: 'FaPaintBrush', label: 'Design', category: 'design' },
  { value: 'FaMobileAlt', label: 'Mobile', category: 'development' },
  { value: 'FaShoppingCart', label: 'E-Commerce', category: 'business' },
  { value: 'FaBrain', label: 'AI/ML', category: 'ai' },
  { value: 'FaRobot', label: 'AI Solutions', category: 'ai' },
  { value: 'FaCloud', label: 'Cloud', category: 'infrastructure' },
  { value: 'FaDatabase', label: 'Database', category: 'infrastructure' },
  { value: 'FaLock', label: 'Security', category: 'security' },
  { value: 'FaChartLine', label: 'Analytics', category: 'business' },
  { value: 'FaCogs', label: 'Automation', category: 'ai' },
  { value: 'FaMicrochip', label: 'IoT', category: 'hardware' },
  { value: 'FaServer', label: 'Backend', category: 'development' },
  { value: 'FaGlobe', label: 'Web', category: 'development' },
  { value: 'FaPalette', label: 'UI/UX', category: 'design' }
];

// Feature icon options
export const FEATURE_ICON_OPTIONS = [
  'bolt', 'mobile-alt', 'shield-alt', 'search', 'sync-alt', 'headset',
  'user-friends', 'project-diagram', 'cube', 'palette', 'tasks', 'layer-group',
  'mobile', 'th', 'image', 'hand-pointer', 'tachometer-alt', 'globe',
  'box-open', 'credit-card', 'warehouse', 'shopping-cart', 'bullhorn', 'chart-line',
  'brain', 'robot', 'microchip', 'cloud-upload-alt', 'database', 'code-branch',
  'cogs', 'chart-bar', 'lightbulb', 'rocket', 'star', 'crown', 'gem'
];













// Hire Request interface
export interface HireRequest {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  ndaRequired: boolean;
  termsAccepted: boolean;
  attachments?: HireAttachment[];
  status: 'new' | 'reviewed' | 'contacted' | 'archived';
  createdAt: Date;
  read: boolean;
}

export interface HireAttachment {
  name: string;
  type: string;
  size: number;
  data: string; // base64
}

export interface HireFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  ndaRequired: boolean;
  termsAccepted: boolean;
  attachments?: HireAttachment[];
}

// Project type options
export const PROJECT_TYPES = [
  { value: 'web-app', label: 'Web Application' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'ai-ml', label: 'AI/ML Solution' },
  { value: 'cloud-infra', label: 'Cloud Infrastructure' },
  { value: 'consulting', label: 'Technical Consulting' },
  { value: 'other', label: 'Other' }
];

// Budget options
export const BUDGET_OPTIONS = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k-plus', label: '$50,000+' },
  { value: 'not-sure', label: 'Not Sure Yet' }
];

// Timeline options
export const TIMELINE_OPTIONS = [
  { value: 'immediate', label: 'Immediate (Within 1 week)' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '3-months', label: 'Within 3 months' },
  { value: '6-months', label: 'Within 6 months' },
  { value: 'flexible', label: 'Flexible' }
];





// Project Detail interface
export interface ProjectDetail {
  id?: string;
  projectId: string;
  client?: string;
  date?: string;
  overview: string;
  challenges: string[];
  solutions: string;
  results: string[];
  services: string[];
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectDetailFormData {
  projectId: string;
  client?: string;
  date?: string;
  overview: string;
  challenges: string[];
  solutions: string;
  results: string[];
  services: string[];
  gallery: string[];
}