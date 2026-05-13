// pages/Admin/SkillsAdmin.tsx
import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSkills } from '../../hooks/useFirestore';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { staggerContainer, scale } from '../../utils/animations';
import { validateSkillForm, hasErrors, type SkillFormErrors } from '../../utils/validators';
import { SKILL_CATEGORIES, type SkillFormData, type Skill } from '../../firebase/models';

// Import only React Icons (remove FontAwesome completely)
import { 
  FaPlus, FaEdit, FaTrash, FaCheck, FaStar, FaCode, FaBrain,
  FaCloud, FaDatabase, FaMobile, FaShieldAlt, FaGlobe,
  FaPaintBrush, FaChartLine, FaRobot, FaLock, FaSearch,
  FaBug, FaNetworkWired, FaGitAlt, FaDocker,
  FaAws, FaReact, FaNodeJs, FaPython, FaJava, FaHtml5, FaCss3Alt,
  FaAngular, FaVuejs, FaPhp, FaSwift, FaGithub, FaGitlab,
  FaFigma, FaTrophy, FaGraduationCap,
  FaLightbulb, FaUsers, FaComments, FaHandshake,
  FaSass, FaMicrochip, FaKey, FaUserSecret, FaUserLock,
  FaFire, FaShieldVirus, FaCreditCard, FaShoppingCart,
  FaWindows, FaApple, FaLinux, FaAndroid, FaClock,
  FaHeart, FaSmile, FaBalanceScale, FaRocket,
  FaStackOverflow, FaTerminal, FaSyncAlt, FaMobileAlt,
  FaServer, FaUserFriends, FaEllipsisH, FaProjectDiagram,
  FaCheckCircle, FaChartBar,
  FaTools,
  FaDraftingCompass,
  FaTasks
} from 'react-icons/fa';

import { 
  SiTypescript, SiKubernetes, SiTerraform, SiJenkins, SiGrafana,
  SiPrometheus, SiMongodb, SiPostgresql, SiMysql, SiRedis, SiElasticsearch,
  SiNextdotjs, SiTailwindcss, SiBootstrap, SiSass, SiWebpack, SiEslint, SiPrettier,
  SiJest, SiCypress, SiTensorflow, SiPytorch, SiScikitlearn,
  SiPandas, SiNumpy, SiOpencv, SiFlask, SiDjango, SiFastapi, SiSpring,
  SiDotnet, SiVercel, SiNetlify, SiHeroku, SiDigitalocean, SiCloudflare, SiUbuntu,
  SiJavascript, SiCplusplus, SiGo, SiRust, SiRuby, SiKotlin, SiScala, SiHaskell,
  SiLua, SiPerl, SiR, SiSqlite, SiMariadb, SiInfluxdb, SiRabbitmq, SiApachekafka,
  SiNginx, SiApache, SiCaddy, SiTraefikproxy, SiAnsible, SiPuppet, SiChef,
  SiCircleci, SiTravisci, SiBitbucket, SiDatadog, SiNewrelic, SiSplunk, SiLogstash,
  SiKibana, SiAuth0, SiOkta, SiKeycloak, SiVault, SiFirebase, SiSupabase,
  SiStripe, SiPaypal, SiShopify, SiWoocommerce, SiSlack, SiDiscord, SiZoom,
  SiNotion, SiTrello, SiAsana, SiJira, SiConfluence, SiSketch, SiInvision,
  SiPostman, SiInsomnia, SiSwagger, SiNpm, SiYarn, SiPnpm, SiBun, SiVite,
  SiRollupdotjs, SiEsbuild, SiBabel, SiMocha, SiChai, SiJasmine, SiStorybook,
  SiTestinglibrary, SiRedux, SiMobx, SiRecoil, SiAxios, SiReactquery,
  SiReactrouter, SiReacthookform, SiExpo, SiElectron, SiTauri, SiArduino,
  SiRaspberrypi, SiEspressif, SiGooglecloud, SiWebflow, SiWordpress,
  SiContentful, SiSanity, SiStrapi, SiGhost, SiOpenai, SiHuggingface,
  SiLangchain, SiGithubactions, SiExpress
} from 'react-icons/si';

import { VscVscode } from 'react-icons/vsc';
import { DiDebian, DiRedhat, DiLess, DiDart, DiIllustrator, DiMaterializecss, DiPhotoshop, DiSymfony, DiLaravel } from 'react-icons/di';
// ===== NEW IMPORTS (Fa Icons) =====
import {
  FaLaptopCode,
  FaSitemap,
  FaClipboardList,
  FaBookOpen,
  FaUserGraduate,
  FaObjectGroup,
  FaBezierCurve,
  FaCube,
  FaCodeBranch,
  FaMagnifyingGlassChart,
  FaClipboardCheck,
  FaTimeline,
  FaUsersGear,
  FaPalette,
  FaPenNib,
  FaChartPie,
  FaFileContract,
  FaDiagramSuccessor,
  FaDiagramPredecessor,
  FaShareNodes,
  FaCalculator,
  FaAtom,
  FaFingerprint,
  FaClipboardQuestion,
  FaListCheck,
  FaPencil,
} from 'react-icons/fa6';
// ===== NEW IMPORTS (Simple Icons) =====
import {
  SiFlutter,
  SiC,
  SiSharp,
  SiWireshark,
  SiCisco,
  SiKalilinux,
  SiCoursera,
  SiUdemy,
  SiEdx,
  SiSololearn,
  SiCodeforces,
  SiLeetcode,
  SiHackerrank,
  SiGeeksforgeeks,
  SiCodechef,
  SiIntellijidea,
  SiPycharm,
  SiWebstorm,
  SiAndroidstudio,
  SiXcode,
  SiMarkdown,
  SiLatex,
  SiScilab,
  SiOverleaf,
  SiMiro,
  SiClickup,
  SiClockify,
  SiTodoist,
  SiUml,
} from 'react-icons/si';
// Category Icon Mapping - maps icon name strings to React components
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'FaStackOverflow': FaStackOverflow,
  'FaCode': FaCode,
  'FaShieldAlt': FaShieldAlt,
  'FaNetworkWired': FaNetworkWired,
  'FaGlobe': FaGlobe,
  'FaMobileAlt': FaMobileAlt,
  'FaServer': FaServer,
  'FaPaintBrush': FaPaintBrush,
  'FaDatabase': FaDatabase,
  'FaSyncAlt': FaSyncAlt,
  'FaCloud': FaCloud,
  'FaRobot': FaRobot,
  'FaChartBar': FaChartBar,
  'FaTerminal': FaTerminal,
  'FaTools': FaTools,
  'FaCheckCircle': FaCheckCircle,
  'FaProjectDiagram': FaProjectDiagram,
  'FaLightbulb': FaLightbulb,
  'FaUserFriends': FaUserFriends,
  'FaEllipsisH': FaEllipsisH,
};

// Helper to render category icon from string name
const renderCategoryIcon = (iconName: string, className: string = '') => {
  const IconComponent = CATEGORY_ICON_MAP[iconName];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  // Fallback
  return <FaCode className={className} />;
};
// Extended Icon Options - All using React Icons only
const EXTENDED_ICON_OPTIONS: Array<{ value: string; icon: React.ComponentType<{ className?: string }>; label: string }> = [
  // === PROGRAMMING LANGUAGES ===
  { value: 'FaCode', icon: FaCode, label: 'Code (General)' },
  { value: 'FaPython', icon: FaPython, label: 'Python' },
  { value: 'FaJava', icon: FaJava, label: 'Java' },
  { value: 'SiJavascript', icon: SiJavascript, label: 'JavaScript' },
  { value: 'SiTypescript', icon: SiTypescript, label: 'TypeScript' },
  { value: 'SiCplusplus', icon: SiCplusplus, label: 'C++' },
  { value: 'SiGo', icon: SiGo, label: 'Go' },
  { value: 'SiRust', icon: SiRust, label: 'Rust' },
  { value: 'SiRuby', icon: SiRuby, label: 'Ruby' },
  { value: 'FaPhp', icon: FaPhp, label: 'PHP' },
  { value: 'FaSwift', icon: FaSwift, label: 'Swift' },
  { value: 'SiKotlin', icon: SiKotlin, label: 'Kotlin' },
  { value: 'SiScala', icon: SiScala, label: 'Scala' },
  { value: 'SiHaskell', icon: SiHaskell, label: 'Haskell' },
  { value: 'SiLua', icon: SiLua, label: 'Lua' },
  { value: 'SiPerl', icon: SiPerl, label: 'Perl' },
  { value: 'SiR', icon: SiR, label: 'R' },
  { value: 'DiDart', icon: DiDart, label: 'Dart' },
  
  // === WEB DEVELOPMENT ===
  { value: 'FaHtml5', icon: FaHtml5, label: 'HTML5' },
  { value: 'FaCss3Alt', icon: FaCss3Alt, label: 'CSS3' },
  { value: 'FaSass', icon: FaSass, label: 'Sass' },
  { value: 'SiSass', icon: SiSass, label: 'SCSS' },
  { value: 'DiLess', icon: DiLess, label: 'Less' },
  { value: 'SiTailwindcss', icon: SiTailwindcss, label: 'Tailwind CSS' },
  { value: 'SiBootstrap', icon: SiBootstrap, label: 'Bootstrap' },
  { value: 'DiMaterializecss', icon: DiMaterializecss, label: 'Materialize' },
  
  // === FRONTEND FRAMEWORKS ===
  { value: 'FaReact', icon: FaReact, label: 'React' },
  { value: 'SiNextdotjs', icon: SiNextdotjs, label: 'Next.js' },
  { value: 'FaVuejs', icon: FaVuejs, label: 'Vue.js' },
  { value: 'FaAngular', icon: FaAngular, label: 'Angular' },
  { value: 'SiRedux', icon: SiRedux, label: 'Redux' },
  { value: 'SiMobx', icon: SiMobx, label: 'MobX' },
  { value: 'SiRecoil', icon: SiRecoil, label: 'Recoil' },
  { value: 'SiAxios', icon: SiAxios, label: 'Axios' },
  { value: 'SiReactquery', icon: SiReactquery, label: 'React Query' },
  { value: 'SiReactrouter', icon: SiReactrouter, label: 'React Router' },
  { value: 'SiReacthookform', icon: SiReacthookform, label: 'React Hook Form' },
  
  // === BACKEND FRAMEWORKS ===
  { value: 'FaNodeJs', icon: FaNodeJs, label: 'Node.js' },
  { value: 'SiExpress', icon: SiExpress, label: 'Express.js' },
  { value: 'SiFlask', icon: SiFlask, label: 'Flask' },
  { value: 'SiDjango', icon: SiDjango, label: 'Django' },
  { value: 'SiFastapi', icon: SiFastapi, label: 'FastAPI' },
  { value: 'SiSpring', icon: SiSpring, label: 'Spring Boot' },
  { value: 'SiDotnet', icon: SiDotnet, label: '.NET' },
  { value: 'DiLaravel', icon: DiLaravel, label: 'Laravel' },
  { value: 'DiSymfony', icon: DiSymfony, label: 'Symfony' },
  
  // === MOBILE DEVELOPMENT ===
  { value: 'FaMobile', icon: FaMobile, label: 'Mobile Dev' },
  { value: 'FaSwift', icon: FaSwift, label: 'Swift' },
  { value: 'FaAndroid', icon: FaAndroid, label: 'Android' },
  { value: 'FaApple', icon: FaApple, label: 'iOS' },
  { value: 'SiKotlin', icon: SiKotlin, label: 'Kotlin' },
  { value: 'FaReact', icon: FaReact, label: 'React Native' },
  { value: 'SiExpo', icon: SiExpo, label: 'Expo' },
  { value: 'SiElectron', icon: SiElectron, label: 'Electron' },
  { value: 'SiTauri', icon: SiTauri, label: 'Tauri' },
  
  // === DATABASES ===
  { value: 'FaDatabase', icon: FaDatabase, label: 'Database' },
  { value: 'SiPostgresql', icon: SiPostgresql, label: 'PostgreSQL' },
  { value: 'SiMysql', icon: SiMysql, label: 'MySQL' },
  { value: 'SiMongodb', icon: SiMongodb, label: 'MongoDB' },
  { value: 'SiRedis', icon: SiRedis, label: 'Redis' },
  { value: 'SiSqlite', icon: SiSqlite, label: 'SQLite' },
  { value: 'SiMariadb', icon: SiMariadb, label: 'MariaDB' },
  { value: 'SiElasticsearch', icon: SiElasticsearch, label: 'Elasticsearch' },
  { value: 'SiInfluxdb', icon: SiInfluxdb, label: 'InfluxDB' },
  { value: 'SiFirebase', icon: SiFirebase, label: 'Firebase' },
  { value: 'SiSupabase', icon: SiSupabase, label: 'Supabase' },
  
  // === CLOUD & DEVOPS ===
  { value: 'FaCloud', icon: FaCloud, label: 'Cloud' },
  { value: 'FaAws', icon: FaAws, label: 'AWS' },
  { value: 'SiGooglecloud', icon: SiGooglecloud, label: 'Google Cloud' },
  { value: 'SiDigitalocean', icon: SiDigitalocean, label: 'DigitalOcean' },
  { value: 'SiCloudflare', icon: SiCloudflare, label: 'Cloudflare' },
  { value: 'SiVercel', icon: SiVercel, label: 'Vercel' },
  { value: 'SiNetlify', icon: SiNetlify, label: 'Netlify' },
  { value: 'SiHeroku', icon: SiHeroku, label: 'Heroku' },
  { value: 'FaDocker', icon: FaDocker, label: 'Docker' },
  { value: 'SiKubernetes', icon: SiKubernetes, label: 'Kubernetes' },
  { value: 'SiTerraform', icon: SiTerraform, label: 'Terraform' },
  { value: 'SiJenkins', icon: SiJenkins, label: 'Jenkins' },
  { value: 'SiGithubactions', icon: SiGithubactions, label: 'GitHub Actions' },
  { value: 'SiCircleci', icon: SiCircleci, label: 'CircleCI' },
  { value: 'SiTravisci', icon: SiTravisci, label: 'Travis CI' },
  { value: 'SiAnsible', icon: SiAnsible, label: 'Ansible' },
  { value: 'SiPuppet', icon: SiPuppet, label: 'Puppet' },
  { value: 'SiChef', icon: SiChef, label: 'Chef' },
  
  // === MONITORING ===
  { value: 'SiGrafana', icon: SiGrafana, label: 'Grafana' },
  { value: 'SiPrometheus', icon: SiPrometheus, label: 'Prometheus' },
  { value: 'SiDatadog', icon: SiDatadog, label: 'Datadog' },
  { value: 'SiNewrelic', icon: SiNewrelic, label: 'New Relic' },
  { value: 'SiSplunk', icon: SiSplunk, label: 'Splunk' },
  { value: 'SiKibana', icon: SiKibana, label: 'Kibana' },
  { value: 'SiLogstash', icon: SiLogstash, label: 'Logstash' },
  
  // === MESSAGE QUEUES ===
  { value: 'SiRabbitmq', icon: SiRabbitmq, label: 'RabbitMQ' },
  { value: 'SiApachekafka', icon: SiApachekafka, label: 'Kafka' },
  
  // === WEB SERVERS ===
  { value: 'SiNginx', icon: SiNginx, label: 'Nginx' },
  { value: 'SiApache', icon: SiApache, label: 'Apache' },
  { value: 'SiCaddy', icon: SiCaddy, label: 'Caddy' },
  { value: 'SiTraefikproxy', icon: SiTraefikproxy, label: 'Traefik' },
  
  // === AI & MACHINE LEARNING ===
  { value: 'FaBrain', icon: FaBrain, label: 'AI/ML' },
  { value: 'FaRobot', icon: FaRobot, label: 'AI' },
  { value: 'SiTensorflow', icon: SiTensorflow, label: 'TensorFlow' },
  { value: 'SiPytorch', icon: SiPytorch, label: 'PyTorch' },
  { value: 'SiScikitlearn', icon: SiScikitlearn, label: 'Scikit-learn' },
  { value: 'SiPandas', icon: SiPandas, label: 'Pandas' },
  { value: 'SiNumpy', icon: SiNumpy, label: 'NumPy' },
  { value: 'SiOpencv', icon: SiOpencv, label: 'OpenCV' },
  { value: 'SiOpenai', icon: SiOpenai, label: 'OpenAI' },
  { value: 'SiHuggingface', icon: SiHuggingface, label: 'Hugging Face' },
  { value: 'SiLangchain', icon: SiLangchain, label: 'LangChain' },
  
  // === DEVELOPMENT TOOLS ===
  { value: 'FaGitAlt', icon: FaGitAlt, label: 'Git' },
  { value: 'FaGithub', icon: FaGithub, label: 'GitHub' },
  { value: 'FaGitlab', icon: FaGitlab, label: 'GitLab' },
  { value: 'SiBitbucket', icon: SiBitbucket, label: 'Bitbucket' },
  { value: 'VscVscode', icon: VscVscode, label: 'VS Code' },
  { value: 'SiPostman', icon: SiPostman, label: 'Postman' },
  { value: 'SiInsomnia', icon: SiInsomnia, label: 'Insomnia' },
  { value: 'SiSwagger', icon: SiSwagger, label: 'Swagger' },
  { value: 'SiNpm', icon: SiNpm, label: 'npm' },
  { value: 'SiYarn', icon: SiYarn, label: 'Yarn' },
  { value: 'SiPnpm', icon: SiPnpm, label: 'pnpm' },
  { value: 'SiBun', icon: SiBun, label: 'Bun' },
  { value: 'SiVite', icon: SiVite, label: 'Vite' },
  { value: 'SiWebpack', icon: SiWebpack, label: 'Webpack' },
  { value: 'SiRollupdotjs', icon: SiRollupdotjs, label: 'Rollup' },
  { value: 'SiEsbuild', icon: SiEsbuild, label: 'esbuild' },
  { value: 'SiBabel', icon: SiBabel, label: 'Babel' },
  { value: 'SiEslint', icon: SiEslint, label: 'ESLint' },
  { value: 'SiPrettier', icon: SiPrettier, label: 'Prettier' },
  
  // === TESTING ===
  { value: 'SiJest', icon: SiJest, label: 'Jest' },
  { value: 'SiCypress', icon: SiCypress, label: 'Cypress' },
  { value: 'SiMocha', icon: SiMocha, label: 'Mocha' },
  { value: 'SiChai', icon: SiChai, label: 'Chai' },
  { value: 'SiJasmine', icon: SiJasmine, label: 'Jasmine' },
  { value: 'SiTestinglibrary', icon: SiTestinglibrary, label: 'Testing Library' },
  { value: 'SiStorybook', icon: SiStorybook, label: 'Storybook' },
  
  // === DESIGN TOOLS ===
  { value: 'FaFigma', icon: FaFigma, label: 'Figma' },
  { value: 'SiSketch', icon: SiSketch, label: 'Sketch' },
  { value: 'DiPhotoshop', icon: DiPhotoshop, label: 'Photoshop' },
  { value: 'DiIllustrator', icon: DiIllustrator, label: 'Illustrator' },
  { value: 'SiInvision', icon: SiInvision, label: 'InVision' },
  { value: 'FaPaintBrush', icon: FaPaintBrush, label: 'UI/UX Design' },
  
  // === CMS ===
  { value: 'SiWordpress', icon: SiWordpress, label: 'WordPress' },
  { value: 'SiContentful', icon: SiContentful, label: 'Contentful' },
  { value: 'SiSanity', icon: SiSanity, label: 'Sanity' },
  { value: 'SiStrapi', icon: SiStrapi, label: 'Strapi' },
  { value: 'SiGhost', icon: SiGhost, label: 'Ghost' },
  { value: 'SiWebflow', icon: SiWebflow, label: 'Webflow' },
  
  // === E-COMMERCE ===
  { value: 'SiShopify', icon: SiShopify, label: 'Shopify' },
  { value: 'SiWoocommerce', icon: SiWoocommerce, label: 'WooCommerce' },
  { value: 'FaShoppingCart', icon: FaShoppingCart, label: 'E-Commerce' },
  { value: 'SiStripe', icon: SiStripe, label: 'Stripe' },
  { value: 'SiPaypal', icon: SiPaypal, label: 'PayPal' },
  { value: 'FaCreditCard', icon: FaCreditCard, label: 'Payments' },
  
  // === COMMUNICATION ===
  { value: 'SiSlack', icon: SiSlack, label: 'Slack' },
  { value: 'SiDiscord', icon: SiDiscord, label: 'Discord' },
  { value: 'SiZoom', icon: SiZoom, label: 'Zoom' },
  { value: 'SiNotion', icon: SiNotion, label: 'Notion' },
  { value: 'SiTrello', icon: SiTrello, label: 'Trello' },
  { value: 'SiAsana', icon: SiAsana, label: 'Asana' },
  { value: 'SiJira', icon: SiJira, label: 'Jira' },
  { value: 'SiConfluence', icon: SiConfluence, label: 'Confluence' },
  
  // === SECURITY ===
  { value: 'FaShieldAlt', icon: FaShieldAlt, label: 'Security' },
  { value: 'FaLock', icon: FaLock, label: 'Encryption' },
  { value: 'FaKey', icon: FaKey, label: 'Authentication' },
  { value: 'FaUserSecret', icon: FaUserSecret, label: 'Privacy' },
  { value: 'FaUserLock', icon: FaUserLock, label: 'Access Control' },
  { value: 'SiAuth0', icon: SiAuth0, label: 'Auth0' },
  { value: 'SiOkta', icon: SiOkta, label: 'Okta' },
  { value: 'SiKeycloak', icon: SiKeycloak, label: 'Keycloak' },
  { value: 'SiVault', icon: SiVault, label: 'Vault' },
  { value: 'FaBug', icon: FaBug, label: 'Bug Bounty' },
  { value: 'FaNetworkWired', icon: FaNetworkWired, label: 'Network Security' },
  { value: 'FaFire', icon: FaFire, label: 'Firewall' },
  { value: 'FaShieldVirus', icon: FaShieldVirus, label: 'Antivirus' },
  
  // === OPERATING SYSTEMS ===
  { value: 'FaLinux', icon: FaLinux, label: 'Linux' },
  { value: 'SiUbuntu', icon: SiUbuntu, label: 'Ubuntu' },
  { value: 'FaWindows', icon: FaWindows, label: 'Windows' },
  { value: 'FaApple', icon: FaApple, label: 'macOS' },
  { value: 'DiDebian', icon: DiDebian, label: 'Debian' },
  { value: 'DiRedhat', icon: DiRedhat, label: 'Red Hat' },
  
  // === IOT ===
  { value: 'SiArduino', icon: SiArduino, label: 'Arduino' },
  { value: 'SiRaspberrypi', icon: SiRaspberrypi, label: 'Raspberry Pi' },
  { value: 'SiEspressif', icon: SiEspressif, label: 'ESP32' },
  { value: 'FaMicrochip', icon: FaMicrochip, label: 'Embedded' },
  
  // === SOFT SKILLS ===
  { value: 'FaUsers', icon: FaUsers, label: 'Teamwork' },
  { value: 'FaComments', icon: FaComments, label: 'Communication' },
  { value: 'FaHandshake', icon: FaHandshake, label: 'Collaboration' },
  { value: 'FaLightbulb', icon: FaLightbulb, label: 'Problem Solving' },
  { value: 'FaChartLine', icon: FaChartLine, label: 'Analytics' },
  { value: 'FaRocket', icon: FaRocket, label: 'Innovation' },
  { value: 'FaTrophy', icon: FaTrophy, label: 'Leadership' },
  { value: 'FaGraduationCap', icon: FaGraduationCap, label: 'Learning' },
  { value: 'FaGlobe', icon: FaGlobe, label: 'Global Perspective' },
  { value: 'FaClock', icon: FaClock, label: 'Time Management' },
  { value: 'FaBrain', icon: FaBrain, label: 'Critical Thinking' },
  { value: 'FaHeart', icon: FaHeart, label: 'Empathy' },
  { value: 'FaSmile', icon: FaSmile, label: 'Positive Attitude' },
  { value: 'FaBalanceScale', icon: FaBalanceScale, label: 'Decision Making' },

{ value: 'FaStackOverflow', icon: FaStackOverflow, label: 'Full Stack' },
{ value: 'FaTerminal', icon: FaTerminal, label: 'Terminal/CLI' },
{ value: 'FaSyncAlt', icon: FaSyncAlt, label: 'CI/CD' },
{ value: 'FaMobileAlt', icon: FaMobileAlt, label: 'Mobile Dev' },
{ value: 'FaServer', icon: FaServer, label: 'Server/Backend' },
{ value: 'FaUserFriends', icon: FaUserFriends, label: 'User Centered' },
{ value: 'FaEllipsisH', icon: FaEllipsisH, label: 'Other' },
{ value: 'FaProjectDiagram', icon: FaProjectDiagram, label: 'Architecture' },
{ value: 'FaCheckCircle', icon: FaCheckCircle, label: 'Testing/QA' },
{ value: 'FaChartBar', icon: FaChartBar, label: 'Data/Analytics' },




// ===== NEW ICON OPTIONS TO APPEND IN EXTENDED_ICON_OPTIONS =====

// === SOFTWARE ENGINEERING COURSES ===
{ value: 'FaClipboardList', icon: FaClipboardList, label: 'Software Requirements Engineering' },
{ value: 'FaProjectDiagram', icon: FaProjectDiagram, label: 'System Design' },
{ value: 'FaDraftingCompass', icon: FaDraftingCompass, label: 'Software Architecture' },
{ value: 'FaSitemap', icon: FaSitemap, label: 'Data Structures & Algorithms' },
{ value: 'FaMicrochip', icon: FaMicrochip, label: 'Digital Logic Design' },
{ value: 'FaNetworkWired', icon: FaNetworkWired, label: 'Computer Networks' },
{ value: 'FaShieldAlt', icon: FaShieldAlt, label: 'Cyber Security' },
{ value: 'FaDatabase', icon: FaDatabase, label: 'Database Systems' },
{ value: 'FaBrain', icon: FaBrain, label: 'Artificial Intelligence' },
{ value: 'FaRobot', icon: FaRobot, label: 'Machine Learning' },
{ value: 'FaLaptopCode', icon: FaLaptopCode, label: 'Object Oriented Programming' },
{ value: 'FaTerminal', icon: FaTerminal, label: 'Operating Systems' },
{ value: 'FaCodeBranch', icon: FaCodeBranch, label: 'Compiler Construction' },
{ value: 'FaGlobe', icon: FaGlobe, label: 'Web Engineering' },
{ value: 'FaMobileAlt', icon: FaMobileAlt, label: 'Mobile App Development' },

// === REQUIREMENT ENGINEERING / DOCUMENTATION ===
{ value: 'FaFileContract', icon: FaFileContract, label: 'SRS Documentation' },
{ value: 'FaClipboardCheck', icon: FaClipboardCheck, label: 'Requirement Validation' },
{ value: 'FaClipboardQuestion', icon: FaClipboardQuestion, label: 'Requirement Elicitation' },
{ value: 'FaListCheck', icon: FaListCheck, label: 'Requirement Analysis' },
{ value: 'FaDiagramSuccessor', icon: FaDiagramSuccessor, label: 'Use Case Diagram' },
{ value: 'FaDiagramPredecessor', icon: FaDiagramPredecessor, label: 'Sequence Diagram' },
{ value: 'FaTimeline', icon: FaTimeline, label: 'Activity Diagram' },
{ value: 'FaShareNodes', icon: FaShareNodes, label: 'DFD / Flowcharts' },
{ value: 'SiPlantuml', icon: SiUml, label: 'PlantUML' },
{ value: 'SiUml', icon: SiUml, label: 'UML Modeling' },

// === UI/UX / WIREFRAMING ===
{ value: 'FaPencilRuler', icon: FaPencil, label: 'Wireframing' },
{ value: 'FaObjectGroup', icon: FaObjectGroup, label: 'Prototyping' },
{ value: 'FaBezierCurve', icon: FaBezierCurve, label: 'User Flow Design' },
{ value: 'FaPalette', icon: FaPalette, label: 'Visual Design' },
{ value: 'FaPenNib', icon: FaPenNib, label: 'UI Design' },
{ value: 'FaUserFriends', icon: FaUserFriends, label: 'UX Research' },
{ value: 'SiMiro', icon: SiMiro, label: 'Miro' },

// === PROGRAMMING LANGUAGES EXTRA ===
{ value: 'SiC', icon: SiC, label: 'C Language' },
{ value: 'SiSharp', icon: SiSharp, label: 'C#' },
{ value: 'SiFlutter', icon: SiFlutter, label: 'Flutter' },

// === DEVELOPMENT TOOLS EXTRA ===
{ value: 'SiAndroidstudio', icon: SiAndroidstudio, label: 'Android Studio' },
{ value: 'SiIntellijidea', icon: SiIntellijidea, label: 'IntelliJ IDEA' },
{ value: 'SiPycharm', icon: SiPycharm, label: 'PyCharm' },
{ value: 'SiWebstorm', icon: SiWebstorm, label: 'WebStorm' },
{ value: 'SiXcode', icon: SiXcode, label: 'Xcode' },
{ value: 'SiOverleaf', icon: SiOverleaf, label: 'Overleaf' },
{ value: 'SiMarkdown', icon: SiMarkdown, label: 'Markdown' },
{ value: 'SiLatex', icon: SiLatex, label: 'LaTeX' },

// === LEARNING / COURSES ===
{ value: 'FaBookOpen', icon: FaBookOpen, label: 'Online Learning' },
{ value: 'FaUserGraduate', icon: FaUserGraduate, label: 'Student' },
{ value: 'SiCoursera', icon: SiCoursera, label: 'Coursera' },
{ value: 'SiUdemy', icon: SiUdemy, label: 'Udemy' },
{ value: 'SiEdx', icon: SiEdx, label: 'edX' },
{ value: 'SiSololearn', icon: SiSololearn, label: 'SoloLearn' },

// === CODING PRACTICE ===
{ value: 'SiLeetcode', icon: SiLeetcode, label: 'LeetCode' },
{ value: 'SiHackerrank', icon: SiHackerrank, label: 'HackerRank' },
{ value: 'SiCodeforces', icon: SiCodeforces, label: 'Codeforces' },
{ value: 'SiCodechef', icon: SiCodechef, label: 'CodeChef' },
{ value: 'SiGeeksforgeeks', icon: SiGeeksforgeeks, label: 'GeeksforGeeks' },

// === ANALYTICS / DATA ===
{ value: 'FaChartPie', icon: FaChartPie, label: 'Data Visualization' },
{ value: 'FaMagnifyingGlassChart', icon: FaMagnifyingGlassChart, label: 'Business Analysis' },

// === NETWORKING / SECURITY ===
{ value: 'SiCisco', icon: SiCisco, label: 'Cisco' },
{ value: 'SiWireshark', icon: SiWireshark, label: 'Wireshark' },
{ value: 'SiKalilinux', icon: SiKalilinux, label: 'Kali Linux' },
{ value: 'FaFingerprint', icon: FaFingerprint, label: 'Biometric Security' },

// === PROJECT MANAGEMENT ===
{ value: 'FaTasks', icon: FaTasks, label: 'Task Management' },
{ value: 'FaUsersGear', icon: FaUsersGear, label: 'Project Management' },
{ value: 'SiClickup', icon: SiClickup, label: 'ClickUp' },
{ value: 'SiClockify', icon: SiClockify, label: 'Clockify' },
{ value: 'SiTodoist', icon: SiTodoist, label: 'Todoist' },

// === COMPUTER SCIENCE ===
{ value: 'FaCalculator', icon: FaCalculator, label: 'Discrete Mathematics' },
{ value: 'FaAtom', icon: FaAtom, label: 'Theory of Computation' },
{ value: 'FaCube', icon: FaCube, label: '3D Modeling' },
{ value: 'SiScilab', icon: SiScilab, label: 'Scilab' },
];

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
    primary: 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg hover:shadow-primary/25 active:scale-95',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-sm',
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
const Card: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean; padding?: 'none' | 'sm' | 'md' | 'lg' }> = ({ 
  children, className = '', hover = false, padding = 'md'
}) => {
  const paddingClasses = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };
  const classes = `rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm ${hover ? 'transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1' : ''} ${paddingClasses[padding]} ${className}`;
  return <motion.div className={classes} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>{children}</motion.div>;
};

// Input Component
const InputField = memo(({ label, type = 'text', name, value, onChange, placeholder, required = false, error }: {
  label: string; type?: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

// Icon Picker Component
const IconPicker: React.FC<{ selectedIcon: string; onSelect: (icon: string) => void; error?: string }> = ({ selectedIcon, onSelect, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredIcons = EXTENDED_ICON_OPTIONS.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedIconData = EXTENDED_ICON_OPTIONS.find(opt => opt.value === selectedIcon);
  const SelectedIconComponent = selectedIconData?.icon || FaCode;

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Select Icon</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 flex items-center gap-3 hover:border-primary/50 transition-colors ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
      >
        <SelectedIconComponent className="text-2xl text-primary" />
        <span className="text-gray-700 dark:text-gray-300">{selectedIconData?.label || 'Select an icon'}</span>
        <FaPlus className="ml-auto text-gray-400 text-sm" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-80 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search icons..."
                  className="w-full pl-9 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto max-h-60">
              <div className="grid grid-cols-6 gap-2">
                {filteredIcons.map((opt) => {
                  const IconComponent = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSelect(opt.value);
                        setIsOpen(false);
                      }}
                      className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
                        selectedIcon === opt.value
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-primary/10 text-gray-600 dark:text-gray-300'
                      }`}
                      title={opt.label}
                    >
                      <IconComponent className={`text-xl ${selectedIcon === opt.value ? 'text-white' : ''}`} />
                      <span className="text-[10px] truncate w-full text-center">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// Learning Topics Manager Component
const LearningTopicsManager: React.FC = () => {
  const [topics, setTopics] = useState<Array<{ id: string; name: string; active: boolean }>>(() => {
    const saved = localStorage.getItem('learning_topics');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      { id: '1', name: 'Advanced AI/ML Architectures', active: true },
      { id: '2', name: 'Cloud-Native Development', active: true },
      { id: '3', name: 'System Design & Scalability', active: true },
      { id: '4', name: 'Edge Computing', active: true },
      { id: '5', name: 'LLM Fine-tuning', active: true },
      { id: '6', name: 'Quantum Computing Basics', active: true },
      { id: '7', name: 'Blockchain Development', active: true },
      { id: '8', name: 'DevOps & Platform Engineering', active: true }
    ];
  });

  const [newTopic, setNewTopic] = useState('');
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('learning_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      title: 'Continuous Learning',
      description: 'Technology evolves at lightning speed. I\'m committed to staying at the forefront through continuous education and hands-on experimentation.',
      quote: 'The best way to predict the future is to invent it.'
    };
  });
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  const saveTopics = (newTopics: typeof topics) => {
    setTopics(newTopics);
    localStorage.setItem('learning_topics', JSON.stringify(newTopics));
  };

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('learning_settings', JSON.stringify(newSettings));
  };

  return (
    <Card padding="lg" className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <FaGraduationCap className="text-primary" /> Learning Journey
      </h2>

      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Section Content</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsEditingSettings(!isEditingSettings)} icon={<FaEdit />}>
            {isEditingSettings ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {isEditingSettings ? (
          <div className="space-y-4">
            <InputField label="Section Title" name="title" value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })} />
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <textarea value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} rows={3}
                className="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-800 resize-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <InputField label="Quote" name="quote" value={settings.quote} onChange={(e) => setSettings({ ...settings, quote: e.target.value })} />
            <Button variant="primary" onClick={() => { saveSettings(settings); setIsEditingSettings(false); }} icon={<FaCheck />}>Save</Button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary/5 to-purple-600/5 rounded-xl p-5 border border-primary/20">
            <p className="font-semibold text-gray-900 dark:text-white text-lg">{settings.title}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{settings.description}</p>
            <p className="text-primary/80 italic mt-3 text-sm">"{settings.quote}"</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Learning Topics</h3>
        <div className="flex gap-2 mb-4">
          <input type="text" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="Add a topic..."
            className="flex-1 px-4 py-2.5 border rounded-xl dark:bg-gray-800 focus:ring-2 focus:ring-primary/50"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), (() => { if (newTopic.trim()) { saveTopics([...topics, { id: Date.now().toString(), name: newTopic.trim(), active: true }]); setNewTopic(''); } })())} />
          <Button variant="primary" onClick={() => { if (newTopic.trim()) { saveTopics([...topics, { id: Date.now().toString(), name: newTopic.trim(), active: true }]); setNewTopic(''); } }} icon={<FaPlus />}>Add</Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {topics.map((topic) => (
            <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={topic.active} onChange={() => saveTopics(topics.map(t => t.id === topic.id ? { ...t, active: !t.active } : t))}
                  className="w-4 h-4 text-primary rounded focus:ring-primary" />
                <span className={topic.active ? 'text-gray-900 dark:text-white' : 'text-gray-400 line-through'}>{topic.name}</span>
              </div>
              <button onClick={() => saveTopics(topics.filter(t => t.id !== topic.id))} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <FaTrash className="text-sm" />
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Active: {topics.filter(t => t.active).length} • Uncheck to hide</p>
      </div>
    </Card>
  );
};

// Main Component
const SkillsAdmin: React.FC = () => {
  const { skills, loading, addSkill, updateSkill, deleteSkill } = useSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'skills' | 'learning'>('skills');

  const [formData, setFormData] = useState<SkillFormData>({ name: '', category: 'programming', icon: 'FaCode', proficiency: 3, featured: false });
  const [errors, setErrors] = useState<SkillFormErrors & { submit?: string }>({ name: '', category: '', icon: '', proficiency: '' });

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({ name: '', category: 'programming', icon: 'FaCode', proficiency: 3, featured: false });
    setErrors({ name: '', category: '', icon: '', proficiency: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({ name: skill.name, category: skill.category, icon: skill.icon, proficiency: skill.proficiency, featured: skill.featured });
    setErrors({ name: '', category: '', icon: '', proficiency: '' });
    setIsModalOpen(true);
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateSkillForm(formData);
    setErrors(validationErrors);
    if (!hasErrors({ name: validationErrors.name, category: validationErrors.category, icon: validationErrors.icon, proficiency: validationErrors.proficiency })) {
      setIsSubmitting(true);
      try {
        if (editingSkill) {
          await updateSkill(editingSkill.id, formData);
        } else {
          await addSkill(formData);
        }
        setIsModalOpen(false);
      } catch {
        setErrors(prev => ({ ...prev, submit: 'Failed to save skill.' }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async (skillId: string) => {
    if (window.confirm('Delete this skill?')) {
      try { await deleteSkill(skillId); } catch { alert('Failed to delete.'); }
    }
  };

  const skillsByCategory = SKILL_CATEGORIES.reduce((acc, cat) => { acc[cat.value] = skills.filter(s => s.category === cat.value); return acc; }, {} as Record<string, Skill[]>);
  const categoriesWithSkills = SKILL_CATEGORIES.filter(cat => skillsByCategory[cat.value]?.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6"><LoadingSkeleton type="card" count={6} /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard"><Button variant="ghost" size="sm" icon="←">Back</Button></Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skills Management</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your technical expertise</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant={activeTab === 'skills' ? 'primary' : 'outline'} size="sm" onClick={() => setActiveTab('skills')} icon={<FaCode />}>Skills</Button>
              <Button variant={activeTab === 'learning' ? 'primary' : 'outline'} size="sm" onClick={() => setActiveTab('learning')} icon={<FaGraduationCap />}>Learning</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'skills' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{skills.length} skills • {categoriesWithSkills.length} categories</span>
              </div>
              <Button variant="primary" onClick={openAddModal} icon={<FaPlus />}>Add Skill</Button>
            </div>

            {categoriesWithSkills.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                {categoriesWithSkills.map((cat) => (
                  <Card key={cat.value} padding="sm" className="text-center">
                    <div className={`text-xl font-bold bg-gradient-to-r ${cat.color} bg-clip-text text-transparent`}>{skillsByCategory[cat.value]?.length || 0}</div>
<div className="text-xs text-gray-500 flex items-center justify-center gap-1">
  <span>{renderCategoryIcon(cat.icon, 'text-sm')}</span>
  <span>{cat.label}</span>
</div>                  </Card>
                ))}
              </div>
            )}

            <div className="space-y-8">
              <AnimatePresence>
                {SKILL_CATEGORIES.map((category) => {
                  const categorySkills = skillsByCategory[category.value] || [];
                  if (categorySkills.length === 0) return null;
                  return (
                    <motion.div key={category.value} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${category.color}`} />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{category.label}</h2>
                        <span className="text-sm text-gray-500">{categorySkills.length} skills</span>
                      </div>
                      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {categorySkills.map((skill, index) => {
                          const iconData = EXTENDED_ICON_OPTIONS.find(opt => opt.value === skill.icon);
                          const IconComponent = iconData?.icon || FaCode;
                          return (
                            <motion.div key={skill.id} variants={scale} transition={{ delay: index * 0.05 }} layout>
                              <Card className="p-4" hover>
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-primary/10 rounded-lg"><IconComponent className="text-xl text-primary" /></div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium text-gray-900 dark:text-white truncate">{skill.name}</h3>
                                      {skill.featured && <FaStar className="text-yellow-500 text-xs" />}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                      {[1, 2, 3, 4, 5].map((l) => <div key={l} className={`w-2 h-2 rounded-full ${l <= skill.proficiency ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`} />)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(skill)} icon={<FaEdit />}>Edit</Button>
                                  <Button variant="danger" size="sm" className="flex-1" onClick={() => handleDelete(skill.id)} icon={<FaTrash />}>Delete</Button>
                                </div>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {skills.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <FaCode className="text-5xl mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Skills Yet</h3>
                <p className="text-gray-500 mb-6">Add your first skill to showcase your expertise.</p>
                <Button variant="primary" onClick={openAddModal} icon={<FaPlus />}>Add First Skill</Button>
              </motion.div>
            )}
          </>
        ) : (
          <LearningTopicsManager />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSkill ? 'Edit Skill' : 'Add Skill'} size="md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="Skill Name" name="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., React" required error={errors.name} />

          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange}
              className="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-800 focus:ring-2 focus:ring-primary/50">
{SKILL_CATEGORIES.map(opt => (
  <option key={opt.value} value={opt.value}>
    {opt.label}
  </option>
))}            </select>
          </div>

          <IconPicker selectedIcon={formData.icon} onSelect={(icon) => setFormData(prev => ({ ...prev, icon }))} error={errors.icon} />

          <div>
            <div className="flex justify-between mb-2"><label className="text-sm font-medium">Proficiency</label><span className="text-primary font-semibold">{formData.proficiency}/5</span></div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Beginner</span>
              <input type="range" name="proficiency" min="1" max="5" value={formData.proficiency} onChange={handleInputChange} className="flex-1 h-2 rounded-lg accent-primary" />
              <span className="text-xs text-gray-500">Expert</span>
            </div>
          </div>

          <label className="flex items-center gap-2"><input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-4 h-4 text-primary rounded" /> Featured skill</label>

          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <h4 className="text-xs font-medium text-gray-500 mb-3">Preview</h4>
            <div className="flex items-center gap-3">
              {(() => { const Icon = EXTENDED_ICON_OPTIONS.find(o => o.value === formData.icon)?.icon || FaCode; return <Icon className="text-3xl text-primary" />; })()}
              <div>
                <div className="font-medium">{formData.name || 'Skill Name'}</div>
                <div className="text-sm text-gray-500">{SKILL_CATEGORIES.find(c => c.value === formData.category)?.label}</div>
                <div className="flex gap-0.5 mt-1">{[1,2,3,4,5].map(l => <div key={l} className={`w-2 h-2 rounded-full ${l <= formData.proficiency ? 'bg-primary' : 'bg-gray-300'}`} />)}</div>
              </div>
            </div>
          </div>

          {errors.submit && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">{errors.submit}</div>}

          <div className="flex gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">{isSubmitting ? 'Saving...' : (editingSkill ? 'Update' : 'Add')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SkillsAdmin;