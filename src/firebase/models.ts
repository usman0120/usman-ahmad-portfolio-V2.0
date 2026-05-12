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

export type SkillCategory = 
  | 'full_stack'
  | 'software_dev'
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
  | 'data_science'
  | 'programming' 
  | 'tools'
  | 'testing'
  | 'architecture'
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

export const SKILL_CATEGORIES: { value: SkillCategory; label: string; icon: string; color: string; description: string }[] = [
  { value: 'full_stack', label: 'Full Stack Development', icon: 'FaStackOverflow', color: 'from-indigo-500 to-purple-600', description: 'End-to-end web application development' },
  { value: 'software_dev', label: 'Software Development', icon: 'FaCode', color: 'from-blue-500 to-cyan-500', description: 'Software engineering principles and practices' },
  { value: 'security', label: 'Cybersecurity', icon: 'FaShieldAlt', color: 'from-red-500 to-orange-500', description: 'Security assessment, penetration testing, and defensive security' },
  { value: 'network', label: 'Networking', icon: 'FaNetworkWired', color: 'from-green-500 to-emerald-500', description: 'Network protocols, architecture, and security' },
  { value: 'web', label: 'Web Development', icon: 'FaGlobe', color: 'from-blue-500 to-cyan-500', description: 'Web applications, frameworks, and technologies' },
  { value: 'mobile', label: 'Mobile Development', icon: 'FaMobileAlt', color: 'from-purple-500 to-pink-500', description: 'iOS, Android, and cross-platform mobile development' },
  { value: 'backend', label: 'Backend Development', icon: 'FaServer', color: 'from-indigo-500 to-blue-500', description: 'Server-side technologies, APIs, and microservices' },
  { value: 'frontend', label: 'Frontend Development', icon: 'FaPaintBrush', color: 'from-sky-500 to-blue-500', description: 'UI/UX, frameworks, and client-side technologies' },
  { value: 'database', label: 'Databases', icon: 'FaDatabase', color: 'from-orange-500 to-amber-500', description: 'SQL, NoSQL, and database management systems' },
  { value: 'devops', label: 'DevOps & CI/CD', icon: 'FaSyncAlt', color: 'from-cyan-500 to-teal-500', description: 'Automation, deployment, and infrastructure management' },
  { value: 'cloud', label: 'Cloud Computing', icon: 'FaCloud', color: 'from-sky-500 to-indigo-500', description: 'Cloud platforms, services, and architecture' },
  { value: 'ai_ml', label: 'AI & Machine Learning', icon: 'FaRobot', color: 'from-violet-500 to-purple-500', description: 'Artificial intelligence, ML models, and data science' },
  { value: 'data_science', label: 'Data Science', icon: 'FaChartBar', color: 'from-emerald-500 to-teal-500', description: 'Data analysis, visualization, and statistical modeling' },
  { value: 'programming', label: 'Programming Languages', icon: 'FaTerminal', color: 'from-yellow-500 to-amber-500', description: 'Programming languages and paradigms' },
  { value: 'tools', label: 'Tools & Technologies', icon: 'FaTools', color: 'from-gray-500 to-slate-500', description: 'Development tools, IDEs, and utilities' },
  { value: 'testing', label: 'Testing & QA', icon: 'FaCheckCircle', color: 'from-green-500 to-emerald-500', description: 'Testing frameworks, automation, and quality assurance' },
  { value: 'architecture', label: 'System Architecture', icon: 'FaProjectDiagram', color: 'from-purple-500 to-indigo-500', description: 'System design, patterns, and architectural concepts' },
  { value: 'concepts', label: 'Core Concepts', icon: 'FaLightbulb', color: 'from-amber-500 to-yellow-500', description: 'Foundational knowledge and theoretical concepts' },
  { value: 'soft', label: 'Soft Skills', icon: 'FaUserFriends', color: 'from-pink-500 to-rose-500', description: 'Professional and interpersonal abilities' },
  { value: 'other', label: 'Other Skills', icon: 'FaEllipsisH', color: 'from-slate-500 to-gray-500', description: 'Additional skills and competencies' }
];
// Icon options for skills
export const SKILL_ICON_OPTIONS = [
  // FA Icons - these will be mapped to React Icons in the admin panel
  'FaCode', 'FaReact', 'FaNodeJs', 'FaPython', 'FaJava',
  'SiTypescript', 'FaHtml5', 'FaCss3Alt', 'FaAngular', 'FaVuejs',
  'SiNextdotjs', 'FaPhp', 'SiFlask', 'SiDjango', 'SiFastapi',
  'SiSpring', 'SiDotnet', 'FaMobile', 'FaSwift', 'FaAndroid',
  'FaApple', 'FaBrain', 'FaRobot', 'SiTensorflow', 'SiPytorch',
  'SiScikitlearn', 'SiPandas', 'SiNumpy', 'SiOpencv',
  'FaCloud', 'FaAws', 'SiGooglecloud', 'FaDocker', 'SiKubernetes',
  'SiTerraform', 'SiJenkins', 'SiGrafana', 'SiPrometheus',
  'FaDatabase', 'SiMongodb', 'SiPostgresql', 'SiMysql', 'SiRedis',
  'SiElasticsearch', 'SiGraphql', 'SiPrisma', 'SiFirebase', 'SiSupabase',
  'FaTools', 'FaGitAlt', 'FaGithub', 'FaGitlab', 'VscVscode',
  'SiTailwindcss', 'SiBootstrap', 'SiSass', 'SiWebpack', 'SiEslint',
  'SiPrettier', 'SiJest', 'SiCypress', 'SiMocha', 'SiStorybook',
  'FaFigma', 'SiSketch', 'SiPostman', 'SiSwagger', 'SiNpm',
  'SiYarn', 'SiVite', 'SiBabel',
  'FaShieldAlt', 'FaLock', 'FaKey', 'FaUserSecret', 'FaUserLock',
  'FaBug', 'FaNetworkWired', 'FaFire', 'FaShieldVirus',
  'FaLinux', 'SiUbuntu', 'FaWindows', 'FaApple',
  'SiNginx', 'SiApache', 'SiCaddy', 'SiTraefikproxy',
  'SiRabbitmq', 'SiApachekafka', 'SiRedis',
  'SiAnsible', 'SiPuppet', 'SiChef', 'SiCircleci', 'SiTravisci',
  'SiGithubactions', 'SiBitbucket',
  'SiDatadog', 'SiNewrelic', 'SiSplunk', 'SiKibana', 'SiLogstash',
  'SiAuth0', 'SiOkta', 'SiKeycloak', 'SiVault',
  'SiSlack', 'SiDiscord', 'SiZoom', 'SiNotion', 'SiTrello',
  'SiAsana', 'SiJira', 'SiConfluence',
  'SiStripe', 'SiPaypal', 'SiShopify', 'SiWoocommerce',
  'SiWordpress', 'SiContentful', 'SiSanity', 'SiStrapi', 'SiGhost',
  'SiWebflow', 'SiArduino', 'SiRaspberrypi', 'SiEspressif',
  'SiOpenai', 'SiHuggingface', 'SiLangchain',
  'SiJavascript', 'SiCplusplus', 'SiGo', 'SiRust', 'SiRuby',
  'SiKotlin', 'SiScala', 'SiHaskell', 'SiLua', 'SiPerl', 'SiR',
  'SiSqlite', 'SiMariadb', 'SiInfluxdb', 'SiNeo4j',
  'SiExpo', 'SiElectron', 'SiTauri', 'SiRedux', 'SiMobx',
  'SiRecoil', 'SiAxios', 'SiReactquery', 'SiReactrouter', 'SiReacthookform',
  'SiRollupdotjs', 'SiEsbuild', 'SiPnpm', 'SiBun',
  'SiTestinglibrary', 'SiJasmine', 'SiChai', 'SiInvision',
  'FaSass', 'FaMicrochip', 'FaShoppingCart', 'FaCreditCard',
  'FaHeart', 'FaSmile', 'FaBalanceScale', 'FaClock', 'FaTrophy',
  'FaGraduationCap', 'FaGlobe', 'FaChartLine', 'FaRocket',
  'FaUsers', 'FaComments', 'FaHandshake', 'FaLightbulb',
  'FaSearch', 'FaMicrosoft', 'FaApple', 'FaAndroid', 'FaLinux',
  'FaWindows', 'FaDocker', 'FaGithub', 'FaGitlab', 'FaAws',
  'FaPython', 'FaJava', 'FaNodeJs', 'FaReact', 'FaHtml5',
  'FaCss3Alt', 'FaAngular', 'FaVuejs', 'FaPhp', 'FaSwift'
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

export const SERVICE_ICON_OPTIONS = [
  { value: 'FaCode', label: 'Development', category: 'development' },
  { value: 'FaLaptopCode', label: 'Software Development', category: 'development' },
  { value: 'FaServer', label: 'Backend', category: 'development' },
  { value: 'FaPaintBrush', label: 'UI/UX Design', category: 'design' },
  { value: 'FaMobileAlt', label: 'Mobile App', category: 'development' },
  { value: 'FaShoppingCart', label: 'E-Commerce', category: 'business' },
  { value: 'FaBrain', label: 'AI/ML', category: 'ai' },
  { value: 'FaRobot', label: 'AI Solutions', category: 'ai' },
  { value: 'FaCloud', label: 'Cloud Services', category: 'infrastructure' },
  { value: 'FaDatabase', label: 'Database Solutions', category: 'infrastructure' },
  { value: 'FaLock', label: 'Security', category: 'security' },
  { value: 'FaShieldAlt', label: 'Cybersecurity', category: 'security' },
  { value: 'FaChartLine', label: 'Analytics', category: 'business' },
  { value: 'FaCogs', label: 'Automation', category: 'ai' },
  { value: 'FaMicrochip', label: 'IoT', category: 'hardware' },
  { value: 'FaGlobe', label: 'Web Development', category: 'development' },
  { value: 'FaPalette', label: 'Design', category: 'design' },
  { value: 'FaStackOverflow', label: 'Full Stack', category: 'development' },
  { value: 'FaRocket', label: 'MVP Development', category: 'development' },
  { value: 'FaUsers', label: 'Consulting', category: 'business' },
  { value: 'FaHeadset', label: 'Support', category: 'business' },
  { value: 'FaSync', label: 'DevOps', category: 'infrastructure' },
  { value: 'FaProjectDiagram', label: 'Architecture', category: 'development' },
  { value: 'FaCheckCircle', label: 'QA & Testing', category: 'development' },
  { value: 'FaGraduationCap', label: 'Training', category: 'business' }
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