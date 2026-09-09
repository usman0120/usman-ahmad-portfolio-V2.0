// pages/Skills.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '../hooks/useFirestore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { fadeUp, staggerContainer } from '../utils/animations';
import { SKILL_CATEGORIES, type Skill } from '../firebase/models';
import { FaArrowRight, FaRocket, FaStar, FaCode, FaSass, FaKey, FaUserSecret, FaUserLock, FaFire, FaShieldVirus, FaClock, FaHeart, FaSmile, FaBalanceScale, FaMicrochip, FaShoppingCart, FaCreditCard, FaMicrosoft, FaWhatsapp, FaDiscord, FaDraftingCompass, FaTasks, FaChalkboardTeacher, FaPencilRuler, FaMouse, FaFileAlt, FaStream, FaSlidersH, FaBoxes, FaUserCog, FaUnlink } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Import all possible icons that could be used in skills
import { FaBrain,
  FaCloud, FaDatabase, FaMobile, FaShieldAlt, FaTools, FaGlobe,
  FaPaintBrush, FaChartLine, FaRobot, FaLock, FaSearch,
  FaBug, FaNetworkWired, FaGitAlt, FaDocker,
  FaAws, FaReact, FaNodeJs, FaPython, FaJava, FaHtml5, FaCss3Alt,
  FaAngular, FaVuejs, FaPhp, FaSwift, FaAndroid, FaApple,
  FaLinux, FaWindows, FaGithub, FaGitlab,
  FaFigma, FaTrophy, FaGraduationCap,
  FaLightbulb, FaUsers, FaComments, FaHandshake,
  FaStackOverflow, FaTerminal, FaSyncAlt, FaMobileAlt,
  FaServer, FaUserFriends, FaEllipsisH, FaProjectDiagram,
  FaCheckCircle, FaChartBar, FaHeadset, FaDribbble, FaMedium, FaDev,
  FaTelegram, FaSkype, FaSlack, FaBehance, FaEnvelope, FaLinkedin,
  FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaTwitch
} from 'react-icons/fa';
import { 
  SiTypescript, SiKubernetes, SiTerraform, SiJenkins, SiGrafana,
  SiPrometheus, SiMongodb, SiPostgresql, SiMysql, SiRedis, SiElasticsearch,
  SiGraphql, SiPrisma, SiNextdotjs, SiTailwindcss,
  SiBootstrap, SiSass, SiWebpack, SiEslint, SiPrettier,
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
  SiLangchain, SiGithubactions,
  SiFiverr,
  SiUpwork,
  SiFreelancer,
  SiToptal
} from 'react-icons/si';
import { VscVscode, VscTerminal, VscFolder, VscFile, VscSearch, VscSettings } from 'react-icons/vsc';
// ===== NEW IMPORTS (Fa Icons) =====
import {
  FaSitemap,
  FaClipboardList,
  FaDiagramProject,
  FaBook,
  FaBookOpen,
  FaUserGraduate,
  FaObjectGroup,
  FaObjectUngroup,
  FaBezierCurve,
  FaLayerGroup,
  FaRoute,
  FaCube,
  FaCubes,
  FaDesktop,
  FaLaptop,
  FaKeyboard,
  FaMemory,
  FaCodeBranch,
  FaCodeCompare,
  FaFileCode,
  FaRegFileCode,
  FaRegLightbulb,
  FaMagnifyingGlassChart,
  FaBugSlash,
  FaClipboardCheck,
  FaPeopleArrows,
  FaTimeline,
  FaUserTie,
  FaUsersGear,
  FaGears,
  FaGear,
  FaWandMagicSparkles,
  FaPalette,
  FaPenNib,
  FaHighlighter,
  FaChartPie,
  FaChartArea,
  FaChartSimple,
  FaFileContract,
  FaFileCircleCheck,
  FaFileShield,
  FaFileLines,
  FaFolderTree,
  FaFolderOpen,
  FaCodePullRequest,
  FaDiagramSuccessor,
  FaDiagramPredecessor,
  FaShareNodes,
  FaEthernet,
  FaWifi,
  FaSatelliteDish,
  FaCalculator,
  FaInfinity,
  FaAtom,
  FaVrCardboard,
  FaGamepad,
  FaCloudArrowUp,
  FaCloudArrowDown,
  FaHardDrive,
  FaSdCard,
  FaUsb,
  FaLink,
  FaSearchengin,
  FaFingerprint,
  FaEye,
  FaEyeSlash,
  FaShieldHalved,
  FaCodeCommit,
  FaCodeMerge,
  FaDiagramNext,
  FaClipboardQuestion,
  FaListCheck,
  FaSquarePollVertical,
  FaFilter,
  FaTableColumns,
  FaTableList,
  FaBarsProgress,
  FaArrowsToCircle,
  FaRankingStar,
  FaCertificate
} from 'react-icons/fa6';
// ===== NEW IMPORTS (Simple Icons) =====
import {
  SiFlutter,
  SiDart,
  SiC,
  SiSharp,
  SiMariadbfoundation,
  SiSocketdotio,
  SiReduxsaga,
  SiThreedotjs,
  SiShadcnui,
  SiMui,
  SiChakraui,
  SiAntdesign,
  SiStyledcomponents,
  SiRadixui,
  SiBlender,
  SiWireguard,
  SiWireshark,
  SiCisco,
  SiKalilinux,
  SiVirtualbox,
  SiVmware,
  SiLinuxmint,
  SiArchlinux,
  SiManjaro,
  SiCoursera,
  SiUdemy,
  SiEdx,
  SiFuturelearn,
  SiSololearn,
  SiCodeforces,
  SiLeetcode,
  SiHackerrank,
  SiGeeksforgeeks,
  SiCodechef,
  SiJsonwebtokens,
  SiOpenjdk,
  SiIntellijidea,
  SiPycharm,
  SiWebstorm,
  SiAndroidstudio,
  SiXcode,
  SiCanva,
  SiMarkdown,
  SiYaml,
  SiLatex,
  SiJupyter,
  SiGooglecolab,
  SiScilab,
  SiOverleaf,
  SiObsidian,
  SiMiro,
  SiClickup,
  SiClockify,
  SiTodoist,
  SiUml,
} from 'react-icons/si';
// ===== NEW IMPORTS (VS Code Icons) =====
import {
  VscSymbolClass,
  VscSymbolMethod,
  VscSymbolVariable,
  VscSymbolInterface,
  VscRepo,
  VscTools,
  VscDebug,
  VscGraph,
  VscServerProcess,
  VscVm,
  VscTerminalCmd,
  VscWorkspaceTrusted,
  VscSettingsGear,
  VscOrganization,
  VscLibrary,
  VscNotebook,
  VscHubot
} from 'react-icons/vsc';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'FaStackOverflow': FaStackOverflow,
  'FaTerminal': FaTerminal,
  'FaSyncAlt': FaSyncAlt,
  'FaMobileAlt': FaMobileAlt,
  'FaServer': FaServer,
  'FaUserFriends': FaUserFriends,
  'FaEllipsisH': FaEllipsisH,
  'FaProjectDiagram': FaProjectDiagram,
  'FaCheckCircle': FaCheckCircle,
  'FaChartBar': FaChartBar,
  'FaLaptopCode': FaCode, 
  'FaCode': FaCode, 'FaPython': FaPython, 'FaJava': FaJava, 'FaPhp': FaPhp,
  'FaSwift': FaSwift, 'FaReact': FaReact, 'FaVuejs': FaVuejs, 'FaAngular': FaAngular,
  'FaNodeJs': FaNodeJs, 'FaHtml5': FaHtml5, 'FaCss3Alt': FaCss3Alt, 'FaSass': FaSass,
  'FaMobile': FaMobile, 'FaAndroid': FaAndroid, 'FaApple': FaApple, 'FaBrain': FaBrain,
  'FaRobot': FaRobot, 'FaCloud': FaCloud, 'FaAws': FaAws, 'FaDocker': FaDocker,
  'FaDatabase': FaDatabase, 'FaTools': FaTools, 'FaGitAlt': FaGitAlt, 'FaGithub': FaGithub,
  'FaGitlab': FaGitlab, 'FaFigma': FaFigma, 'FaShieldAlt': FaShieldAlt, 'FaLock': FaLock,
  'FaKey': FaKey, 'FaUserSecret': FaUserSecret, 'FaUserLock': FaUserLock, 'FaSearch': FaSearch,
  'FaBug': FaBug, 'FaNetworkWired': FaNetworkWired, 'FaFire': FaFire, 'FaShieldVirus': FaShieldVirus,
  'FaLinux': FaLinux, 'FaWindows': FaWindows, 'FaUsers': FaUsers, 'FaComments': FaComments,
  'FaHandshake': FaHandshake, 'FaLightbulb': FaLightbulb, 'FaChartLine': FaChartLine,
  'FaRocket': FaRocket, 'FaTrophy': FaTrophy, 'FaGraduationCap': FaGraduationCap,
  'FaGlobe': FaGlobe, 'FaPaintBrush': FaPaintBrush, 'FaClock': FaClock, 'FaHeart': FaHeart,
  'FaSmile': FaSmile, 'FaBalanceScale': FaBalanceScale, 'FaMicrochip': FaMicrochip,
  'FaShoppingCart': FaShoppingCart, 'FaCreditCard': FaCreditCard, 'FaMicrosoft': FaMicrosoft,
  'SiJavascript': SiJavascript, 'SiTypescript': SiTypescript, 'SiCplusplus': SiCplusplus,
  'SiGo': SiGo, 'SiRust': SiRust, 'SiRuby': SiRuby, 'SiKotlin': SiKotlin, 'SiScala': SiScala,
  'SiHaskell': SiHaskell, 'SiLua': SiLua, 'SiPerl': SiPerl, 'SiR': SiR, 'SiNextdotjs': SiNextdotjs,
  'SiTailwindcss': SiTailwindcss, 'SiBootstrap': SiBootstrap, 'SiSass': SiSass, 'SiRedux': SiRedux,
  'SiMobx': SiMobx, 'SiRecoil': SiRecoil, 'SiAxios': SiAxios, 'SiReactquery': SiReactquery,
  'SiReactrouter': SiReactrouter, 'SiReacthookform': SiReacthookform, 'SiFlask': SiFlask,
  'SiDjango': SiDjango, 'SiFastapi': SiFastapi, 'SiSpring': SiSpring, 'SiDotnet': SiDotnet,
  'SiExpo': SiExpo, 'SiElectron': SiElectron, 'SiTauri': SiTauri, 'SiPostgresql': SiPostgresql,
  'SiMysql': SiMysql, 'SiMongodb': SiMongodb, 'SiRedis': SiRedis, 'SiSqlite': SiSqlite,
  'SiMariadb': SiMariadb, 'SiElasticsearch': SiElasticsearch, 'SiInfluxdb': SiInfluxdb,
  'SiFirebase': SiFirebase, 'SiSupabase': SiSupabase, 'SiGraphql': SiGraphql, 'SiPrisma': SiPrisma,
  'SiGooglecloud': SiGooglecloud, 'SiDigitalocean': SiDigitalocean, 'SiCloudflare': SiCloudflare,
  'SiVercel': SiVercel, 'SiNetlify': SiNetlify, 'SiHeroku': SiHeroku, 'SiKubernetes': SiKubernetes,
  'SiTerraform': SiTerraform, 'SiJenkins': SiJenkins, 'SiGithubactions': SiGithubactions,
  'SiCircleci': SiCircleci, 'SiTravisci': SiTravisci, 'SiAnsible': SiAnsible, 'SiPuppet': SiPuppet,
  'SiChef': SiChef, 'SiGrafana': SiGrafana, 'SiPrometheus': SiPrometheus, 'SiDatadog': SiDatadog,
  'SiNewrelic': SiNewrelic, 'SiSplunk': SiSplunk, 'SiKibana': SiKibana, 'SiLogstash': SiLogstash,
  'SiRabbitmq': SiRabbitmq, 'SiApachekafka': SiApachekafka, 'SiNginx': SiNginx, 'SiApache': SiApache,
  'SiCaddy': SiCaddy, 'SiTraefikproxy': SiTraefikproxy, 'SiTensorflow': SiTensorflow,
  'SiPytorch': SiPytorch, 'SiScikitlearn': SiScikitlearn, 'SiPandas': SiPandas, 'SiNumpy': SiNumpy,
  'SiOpencv': SiOpencv, 'SiOpenai': SiOpenai, 'SiHuggingface': SiHuggingface, 'SiLangchain': SiLangchain,
  'SiBitbucket': SiBitbucket, 'SiPostman': SiPostman, 'SiInsomnia': SiInsomnia, 'SiSwagger': SiSwagger,
  'SiNpm': SiNpm, 'SiYarn': SiYarn, 'SiPnpm': SiPnpm, 'SiBun': SiBun, 'SiVite': SiVite,
  'SiWebpack': SiWebpack, 'SiRollupdotjs': SiRollupdotjs, 'SiEsbuild': SiEsbuild, 'SiBabel': SiBabel,
  'SiEslint': SiEslint, 'SiPrettier': SiPrettier, 'SiJest': SiJest, 'SiCypress': SiCypress,
  'SiMocha': SiMocha, 'SiChai': SiChai, 'SiJasmine': SiJasmine, 'SiTestinglibrary': SiTestinglibrary,
  'SiStorybook': SiStorybook, 'SiSketch': SiSketch, 'SiInvision': SiInvision, 'SiWordpress': SiWordpress,
  'SiContentful': SiContentful, 'SiSanity': SiSanity, 'SiStrapi': SiStrapi, 'SiGhost': SiGhost,
  'SiWebflow': SiWebflow, 'SiShopify': SiShopify, 'SiWoocommerce': SiWoocommerce, 'SiStripe': SiStripe,
  'SiPaypal': SiPaypal, 'SiSlack': SiSlack, 'SiDiscord': SiDiscord, 'SiZoom': SiZoom,
  'SiNotion': SiNotion, 'SiTrello': SiTrello, 'SiAsana': SiAsana, 'SiJira': SiJira,
  'SiConfluence': SiConfluence, 'SiAuth0': SiAuth0, 'SiOkta': SiOkta, 'SiKeycloak': SiKeycloak,
  'SiVault': SiVault, 'SiUbuntu': SiUbuntu, 'SiArduino': SiArduino, 'SiRaspberrypi': SiRaspberrypi,
  'SiEspressif': SiEspressif, 'VscVscode': VscVscode, 'VscTerminal': VscTerminal,
  'VscFolder': VscFolder, 'VscFile': VscFile, 'VscSearch': VscSearch, 'VscSettings': VscSettings,
  // Social Icons (add these)
  'FaLinkedin': FaLinkedin,
  'FaTwitter': FaTwitter,
  'FaFacebook': FaFacebook,
  'FaInstagram': FaInstagram,
  'FaYoutube': FaYoutube,
  'FaTwitch': FaTwitch,
  'FaDiscord': FaDiscord,
  'FaWhatsapp': FaWhatsapp,
  'FaTelegram': FaTelegram,
  'FaEnvelope': FaEnvelope,
  'FaBehance': FaBehance,
  'FaDribbble': FaDribbble,
  'FaMedium': FaMedium,
  'FaDev': FaDev,
  'FaSkype': FaSkype,
  'FaFiverr': SiFiverr,
  'FaUpwork': SiUpwork,
  'FaFreelancer': SiFreelancer,
  'FaToptal': SiToptal,
  'FaSlack': FaSlack,
  'FaHeadset': FaHeadset,
  // ===== NEW ICON MAP ENTRIES =====

'FaDraftingCompass': FaDraftingCompass,
'FaSitemap': FaSitemap,
'FaClipboardList': FaClipboardList,
'FaTasks': FaTasks,
'FaDiagramProject': FaDiagramProject,
'FaBook': FaBook,
'FaBookOpen': FaBookOpen,
'FaChalkboardTeacher': FaChalkboardTeacher,
'FaUserGraduate': FaUserGraduate,
'FaPencilRuler': FaPencilRuler,
'FaObjectGroup': FaObjectGroup,
'FaObjectUngroup': FaObjectUngroup,
'FaBezierCurve': FaBezierCurve,
'FaLayerGroup': FaLayerGroup,
'FaRoute': FaRoute,
'FaCube': FaCube,
'FaCubes': FaCubes,
'FaDesktop': FaDesktop,
'FaLaptop': FaLaptop,
'FaKeyboard': FaKeyboard,
'FaMouse': FaMouse,
'FaMemory': FaMemory,
'FaCodeBranch': FaCodeBranch,
'FaCodeCompare': FaCodeCompare,
'FaFileCode': FaFileCode,
'FaFileAlt': FaFileAlt,
'FaRegFileCode': FaRegFileCode,
'FaRegLightbulb': FaRegLightbulb,
'FaStream': FaStream,
'FaSlidersH': FaSlidersH,
'FaBoxes': FaBoxes,
'FaMagnifyingGlassChart': FaMagnifyingGlassChart,
'FaBugSlash': FaBugSlash,
'FaClipboardCheck': FaClipboardCheck,
'FaPeopleArrows': FaPeopleArrows,
'FaTimeline': FaTimeline,
'FaUserCog': FaUserCog,
'FaUserTie': FaUserTie,
'FaUsersGear': FaUsersGear,
'FaGears': FaGears,
'FaGear': FaGear,
'FaWandMagicSparkles': FaWandMagicSparkles,
'FaPalette': FaPalette,
'FaPenNib': FaPenNib,
'FaHighlighter': FaHighlighter,
'FaChartPie': FaChartPie,
'FaChartArea': FaChartArea,
'FaChartSimple': FaChartSimple,
'FaFileContract': FaFileContract,
'FaFileCircleCheck': FaFileCircleCheck,
'FaFileShield': FaFileShield,
'FaFileLines': FaFileLines,
'FaFolderTree': FaFolderTree,
'FaFolderOpen': FaFolderOpen,
'FaCodePullRequest': FaCodePullRequest,
'FaDiagramSuccessor': FaDiagramSuccessor,
'FaDiagramPredecessor': FaDiagramPredecessor,
'FaShareNodes': FaShareNodes,
'FaEthernet': FaEthernet,
'FaWifi': FaWifi,
'FaSatelliteDish': FaSatelliteDish,
'FaCalculator': FaCalculator,
'FaInfinity': FaInfinity,
'FaAtom': FaAtom,
'FaVrCardboard': FaVrCardboard,
'FaGamepad': FaGamepad,
'FaCloudArrowUp': FaCloudArrowUp,
'FaCloudArrowDown': FaCloudArrowDown,
'FaHardDrive': FaHardDrive,
'FaSdCard': FaSdCard,
'FaUsb': FaUsb,
'FaLink': FaLink,
'FaUnlink': FaUnlink,
'FaSearchengin': FaSearchengin,
'FaFingerprint': FaFingerprint,
'FaEye': FaEye,
'FaEyeSlash': FaEyeSlash,
'FaShieldHalved': FaShieldHalved,
'FaCodeCommit': FaCodeCommit,
'FaCodeMerge': FaCodeMerge,
'FaDiagramNext': FaDiagramNext,
'FaClipboardQuestion': FaClipboardQuestion,
'FaListCheck': FaListCheck,
'FaSquarePollVertical': FaSquarePollVertical,
'FaFilter': FaFilter,
'FaTableColumns': FaTableColumns,
'FaTableList': FaTableList,
'FaBarsProgress': FaBarsProgress,
'FaArrowsToCircle': FaArrowsToCircle,
'FaRankingStar': FaRankingStar,
'FaCertificate': FaCertificate,

'SiFlutter': SiFlutter,
'SiDart': SiDart,
'SiC': SiC,
'SiSharp': SiSharp,
'SiMariadbfoundation': SiMariadbfoundation,
'SiSocketdotio': SiSocketdotio,
'SiReduxsaga': SiReduxsaga,
'SiThreedotjs': SiThreedotjs,
'SiShadcnui': SiShadcnui,
'SiMui': SiMui,
'SiChakraui': SiChakraui,
'SiAntdesign': SiAntdesign,
'SiStyledcomponents': SiStyledcomponents,
'SiRadixui': SiRadixui,
'SiCanva': SiCanva,
'SiBlender': SiBlender,
'SiWireguard': SiWireguard,
'SiWireshark': SiWireshark,
'SiCisco': SiCisco,
'SiKalilinux': SiKalilinux,
'SiVirtualbox': SiVirtualbox,
'SiVmware': SiVmware,
'SiLinuxmint': SiLinuxmint,
'SiArchlinux': SiArchlinux,
'SiManjaro': SiManjaro,
'SiCoursera': SiCoursera,
'SiUdemy': SiUdemy,
'SiEdx': SiEdx,
'SiFuturelearn': SiFuturelearn,
'SiSololearn': SiSololearn,
'SiCodeforces': SiCodeforces,
'SiLeetcode': SiLeetcode,
'SiHackerrank': SiHackerrank,
'SiGeeksforgeeks': SiGeeksforgeeks,
'SiCodechef': SiCodechef,
'SiJsonwebtokens': SiJsonwebtokens,
'SiOauth': SiAuth0,
'SiOpenjdk': SiOpenjdk,
'SiIntellijidea': SiIntellijidea,
'SiPycharm': SiPycharm,
'SiWebstorm': SiWebstorm,
'SiAndroidstudio': SiAndroidstudio,
'SiXcode': SiXcode,
'SiMarkdown': SiMarkdown,
'SiYaml': SiYaml,
'SiLatex': SiLatex,
'SiJupyter': SiJupyter,
'SiGooglecolab': SiGooglecolab,
'SiArduinoide': SiArduino,
'SiScilab': SiScilab,
'SiOverleaf': SiOverleaf,
'SiObsidian': SiObsidian,
'SiMiro': SiMiro,
'SiClickup': SiClickup,
'SiClockify': SiClockify,
'SiTodoist': SiTodoist,
'SiUml': SiUml,
'VscSymbolClass': VscSymbolClass,
'VscSymbolMethod': VscSymbolMethod,
'VscSymbolVariable': VscSymbolVariable,
'VscSymbolInterface': VscSymbolInterface,
'VscRepo': VscRepo,
'VscTools': VscTools,
'VscDebug': VscDebug,
'VscGraph': VscGraph,
'VscServerProcess': VscServerProcess,
'VscVm': VscVm,
'VscTerminalCmd': VscTerminalCmd,
'VscWorkspaceTrusted': VscWorkspaceTrusted,
'VscSettingsGear': VscSettingsGear,
'VscOrganization': VscOrganization,
'VscLibrary': VscLibrary,
'VscNotebook': VscNotebook,
'VscHubot': VscHubot,
};

export const renderIcon = (iconName: string, className: string = '') => {
  const IconComponent = iconMap[iconName];
  if (IconComponent) return <IconComponent className={className} />;
  // If icon name is a short emoji/string (2-3 chars), render it as text
  if (iconName && iconName.length <= 3) return <span className={className}>{iconName}</span>;
  // Fallback: try to render as text if it doesn't start with Fa/Si/Vsc
  if (iconName && !iconName.startsWith('Fa') && !iconName.startsWith('Si') && !iconName.startsWith('Vsc')) {
    return <span className={className}>{iconName}</span>;
  }
  return <FaCode className={className} />;
};

export const getCategoryStyle = (category: string) => {
  const styles: Record<string, { bgGradient: string; borderColor: string; iconBg: string; accentColor: string }> = {
    full_stack: { bgGradient: 'from-indigo-500/10 to-purple-600/10', borderColor: 'border-indigo-500/30', iconBg: 'bg-indigo-100 dark:bg-indigo-900/20', accentColor: 'text-indigo-600 dark:text-indigo-400' },
    software_dev: { bgGradient: 'from-blue-500/10 to-cyan-500/10', borderColor: 'border-blue-500/30', iconBg: 'bg-blue-100 dark:bg-blue-900/20', accentColor: 'text-blue-600 dark:text-blue-400' },
    security: { bgGradient: 'from-red-500/10 to-orange-500/10', borderColor: 'border-red-500/30', iconBg: 'bg-red-100 dark:bg-red-900/20', accentColor: 'text-red-600 dark:text-red-400' },
    network: { bgGradient: 'from-green-500/10 to-emerald-500/10', borderColor: 'border-green-500/30', iconBg: 'bg-green-100 dark:bg-green-900/20', accentColor: 'text-green-600 dark:text-green-400' },
    web: { bgGradient: 'from-blue-500/10 to-cyan-500/10', borderColor: 'border-blue-500/30', iconBg: 'bg-blue-100 dark:bg-blue-900/20', accentColor: 'text-blue-600 dark:text-blue-400' },
    mobile: { bgGradient: 'from-purple-500/10 to-pink-500/10', borderColor: 'border-purple-500/30', iconBg: 'bg-purple-100 dark:bg-purple-900/20', accentColor: 'text-purple-600 dark:text-purple-400' },
    backend: { bgGradient: 'from-indigo-500/10 to-blue-500/10', borderColor: 'border-indigo-500/30', iconBg: 'bg-indigo-100 dark:bg-indigo-900/20', accentColor: 'text-indigo-600 dark:text-indigo-400' },
    frontend: { bgGradient: 'from-sky-500/10 to-blue-500/10', borderColor: 'border-sky-500/30', iconBg: 'bg-sky-100 dark:bg-sky-900/20', accentColor: 'text-sky-600 dark:text-sky-400' },
    database: { bgGradient: 'from-orange-500/10 to-amber-500/10', borderColor: 'border-orange-500/30', iconBg: 'bg-orange-100 dark:bg-orange-900/20', accentColor: 'text-orange-600 dark:text-orange-400' },
    devops: { bgGradient: 'from-cyan-500/10 to-teal-500/10', borderColor: 'border-cyan-500/30', iconBg: 'bg-cyan-100 dark:bg-cyan-900/20', accentColor: 'text-cyan-600 dark:text-cyan-400' },
    cloud: { bgGradient: 'from-sky-500/10 to-indigo-500/10', borderColor: 'border-sky-500/30', iconBg: 'bg-sky-100 dark:bg-sky-900/20', accentColor: 'text-sky-600 dark:text-sky-400' },
    ai_ml: { bgGradient: 'from-violet-500/10 to-purple-500/10', borderColor: 'border-violet-500/30', iconBg: 'bg-violet-100 dark:bg-violet-900/20', accentColor: 'text-violet-600 dark:text-violet-400' },
    data_science: { bgGradient: 'from-emerald-500/10 to-teal-500/10', borderColor: 'border-emerald-500/30', iconBg: 'bg-emerald-100 dark:bg-emerald-900/20', accentColor: 'text-emerald-600 dark:text-emerald-400' },
    programming: { bgGradient: 'from-yellow-500/10 to-amber-500/10', borderColor: 'border-yellow-500/30', iconBg: 'bg-yellow-100 dark:bg-yellow-900/20', accentColor: 'text-yellow-600 dark:text-yellow-400' },
    tools: { bgGradient: 'from-gray-500/10 to-slate-500/10', borderColor: 'border-gray-500/30', iconBg: 'bg-gray-100 dark:bg-gray-900/20', accentColor: 'text-gray-600 dark:text-gray-400' },
    testing: { bgGradient: 'from-green-500/10 to-emerald-500/10', borderColor: 'border-green-500/30', iconBg: 'bg-green-100 dark:bg-green-900/20', accentColor: 'text-green-600 dark:text-green-400' },
    architecture: { bgGradient: 'from-purple-500/10 to-indigo-500/10', borderColor: 'border-purple-500/30', iconBg: 'bg-purple-100 dark:bg-purple-900/20', accentColor: 'text-purple-600 dark:text-purple-400' },
    concepts: { bgGradient: 'from-amber-500/10 to-yellow-500/10', borderColor: 'border-amber-500/30', iconBg: 'bg-amber-100 dark:bg-amber-900/20', accentColor: 'text-amber-600 dark:text-amber-400' },
    soft: { bgGradient: 'from-pink-500/10 to-rose-500/10', borderColor: 'border-pink-500/30', iconBg: 'bg-pink-100 dark:bg-pink-900/20', accentColor: 'text-pink-600 dark:text-pink-400' },
    other: { bgGradient: 'from-slate-500/10 to-gray-500/10', borderColor: 'border-slate-500/30', iconBg: 'bg-slate-100 dark:bg-slate-900/20', accentColor: 'text-slate-600 dark:text-slate-400' }
  };
  return styles[category] || styles.other;
};

export const getProficiencyBarColor = (level: number) => {
  if (level >= 5) return 'from-green-500 to-emerald-500';
  if (level >= 4) return 'from-blue-500 to-cyan-500';
  if (level >= 3) return 'from-yellow-500 to-amber-500';
  if (level >= 2) return 'from-orange-500 to-red-500';
  return 'from-gray-400 to-gray-500';
};

// ==================== CARD 1: Soft Skills Card ====================
const SoftSkillsCard: React.FC<{ skills: Skill[] }> = ({ skills }) => {
  if (skills.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-12 px-2 sm:px-0"
    >
      <h3 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-white flex items-center">
        <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm mr-2 sm:mr-3">
          🤝
        </span>
        Soft Skills
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm flex flex-col items-center text-center space-y-2 transition-all duration-300 hover:shadow-md border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-2.5 rounded-lg">
              {renderIcon(skill.icon, 'text-xl text-purple-600 dark:text-purple-400')}
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
              {skill.name}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-1.5 h-1.5 rounded-full ${
                    level <= skill.proficiency ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ==================== CARD 2: Tools & Technologies Card ====================
const ToolsCard: React.FC<{ skills: Skill[] }> = ({ skills }) => {
  if (skills.length === 0) return null;

  const getProficiencyColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getProficiencyText = (percentage: number) => {
    if (percentage >= 80) return "Expert";
    if (percentage >= 70) return "Advanced";
    if (percentage >= 40) return "Intermediate";
    return "Basic";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-12 md:mt-16 px-2 sm:px-0"
    >
      <h3 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-white flex items-center justify-center">
        <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm mr-2 sm:mr-3">
          ⚙️
        </span>
        Tools & Technologies
      </h3>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
          {skills.map((tool, index) => {
            const proficiencyPercent = (tool.proficiency / 5) * 100;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                whileHover={{ y: -3 }}
                className="group relative bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-400 transition-all duration-200"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 relative">
                    {renderIcon(tool.icon, 'text-current')}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 ${getProficiencyColor(proficiencyPercent)} rounded-full border-2 border-white dark:border-gray-800 shadow-sm`} />
                  </div>
                  
                  <span className="font-medium text-gray-800 dark:text-white text-xs text-center leading-tight">
                    {tool.name}
                  </span>
                  
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        {getProficiencyText(proficiencyPercent)}
                      </span>
                      <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                        {Math.round(proficiencyPercent)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${getProficiencyColor(proficiencyPercent)} transition-all duration-500`}
                        style={{ width: `${proficiencyPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            Proficient with modern development tools & platforms
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ==================== CARD 3: Main Categories Card (Unified Modern Creative Design) ====================
const MainCategoryCard: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => {
  const proficiencyPercent = (skill.proficiency / 5) * 100;

  const getProficiencyLabel = (percent: number) => {
    if (percent >= 90) return 'Expert';
    if (percent >= 75) return 'Advanced';
    if (percent >= 55) return 'Intermediate';
    return 'Basic';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-xl bg-gray-50/80 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/90 border border-gray-200/70 dark:border-white/[0.06] hover:border-primary/40 dark:hover:border-primary/40 shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all duration-300 p-3.5 flex flex-col justify-between"
    >
      {/* Ambient hover glow */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-500 pointer-events-none" />

      {/* Top row: Icon + Title/Level + Percentage */}
      <div className="flex items-center gap-3 relative z-10">
        {/* Unified Icon container */}
        <div className="relative flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-purple-500/10 dark:from-primary/20 dark:to-purple-900/30 border border-primary/20 text-primary dark:text-purple-300 flex items-center justify-center text-base shadow-sm group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          {renderIcon(skill.icon, "text-base text-current transition-colors")}
        </div>

        {/* Name & Proficiency Level */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate tracking-tight group-hover:text-primary transition-colors">
              {skill.name}
            </h4>
            {skill.featured && (
              <FaStar className="text-amber-400 text-[9px] flex-shrink-0" title="Featured Skill" />
            )}
          </div>
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-400 tracking-wider uppercase mt-0.5">
            {getProficiencyLabel(proficiencyPercent)}
          </p>
        </div>

        {/* Percentage pill */}
        <div className="flex-shrink-0 font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-primary/10 dark:bg-primary/15 text-primary dark:text-purple-300 border border-primary/15 shadow-sm">
          {Math.round(proficiencyPercent)}%
        </div>
      </div>

      {/* Modern Slim Progress Bar */}
      <div className="mt-3 relative z-10">
        <div className="w-full h-1.5 bg-gray-200/80 dark:bg-slate-700/60 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-purple-500 to-indigo-400 shadow-[0_0_8px_rgba(139,92,246,0.35)]"
            initial={{ width: 0 }}
            whileInView={{ width: `${proficiencyPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.05, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Category Panel Component (Grouped Bento Design)
const CategoryPanel: React.FC<{ 
  category: typeof SKILL_CATEGORIES[0]; 
  skills: Skill[];
  isSingleView?: boolean;
}> = ({ category, skills, isSingleView }) => {
  const CatIconComponent = iconMap[category.icon];
  const avgProficiency = Math.round(
    skills.reduce((acc, s) => acc + (s.proficiency / 5) * 100, 0) / (skills.length || 1)
  );

  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-2xl p-5 sm:p-6 bg-white/75 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/80 dark:border-white/[0.08] shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 flex flex-col justify-between ${
        isSingleView ? 'col-span-full' : ''
      }`}
    >
      {/* Category Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-purple-500/10 dark:from-primary/20 dark:to-purple-900/30 text-primary dark:text-purple-300 border border-primary/20 flex items-center justify-center text-lg shadow-sm">
            {CatIconComponent ? (
              <CatIconComponent className="text-lg text-primary dark:text-purple-300" />
            ) : (
              <span>{category.icon}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg tracking-tight">
              {category.label}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {skills.length} {skills.length === 1 ? 'Skill' : 'Skills'}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-primary/10 text-primary dark:text-purple-300 border border-primary/20">
          {avgProficiency}% avg
        </span>
      </div>

      {/* Skills Grid inside this Category */}
      <div className={`grid gap-3 ${
        isSingleView 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : (skills.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1')
      }`}>
        {skills.map((skill, index) => (
          <MainCategoryCard key={skill.id} skill={skill} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  const { skills, loading } = useSkills();
  
  const [learningTopics] = useState<string[]>(() => {
    const savedTopics = localStorage.getItem('learning_topics');
    if (savedTopics) {
      try {
        const topics = JSON.parse(savedTopics);
        return topics.filter((t: { active: boolean }) => t.active).map((t: { name: string }) => t.name);
      } catch { /* ignore */ }
    }
    return [
      'Advanced AI/ML Architectures',
      'Cloud-Native Development',
      'System Design & Scalability',
      'Edge Computing',
      'LLM Fine-tuning',
      'Quantum Computing Basics',
      'Blockchain Development',
      'DevOps & Platform Engineering'
    ];
  });

  const [learningSettings] = useState(() => {
    const savedSettings = localStorage.getItem('learning_settings');
    if (savedSettings) {
      try { return JSON.parse(savedSettings); } catch { /* ignore */ }
    }
    return {
      title: 'Continuous Learning',
      description: 'Technology evolves at lightning speed. I\'m committed to staying at the forefront through continuous education and hands-on experimentation.',
      quote: 'The best way to predict the future is to invent it.'
    };
  });

  const displaySkills = skills;

  const skillsByCategory = SKILL_CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = displaySkills.filter(skill => skill.category === cat.value);
    return acc;
  }, {} as Record<string, Skill[]>);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Main categories (excluding soft and tools)
  const mainCategories = SKILL_CATEGORIES.filter(cat => 
    !['soft', 'tools'].includes(cat.value) && skillsByCategory[cat.value]?.length > 0
  );

  const filteredCategories = selectedCategory === 'all'
    ? mainCategories
    : mainCategories.filter(cat => cat.value === selectedCategory);

  const totalMainSkills = mainCategories.reduce((sum, cat) => sum + (skillsByCategory[cat.value]?.length || 0), 0);

  // Get skills for special sections
  const softSkills = displaySkills.filter(s => s.category === 'soft');
  const toolSkills = displaySkills.filter(s => s.category === 'tools');

  if (loading && skills.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton type="card" count={4} className="mb-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary rounded-full text-sm font-semibold mb-4 border border-primary/20"
          >
            MY EXPERTISE
          </motion.span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Technical </span>
            <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-500 bg-clip-text text-transparent">
              Expertise
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A comprehensive toolkit of software engineering, AI development, and technical expertise 
            built through years of hands-on experience and continuous learning.
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        {mainCategories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/25 scale-105'
                  : 'bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary/50 hover:text-primary'
              }`}
            >
              <span>✨ All Categories</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                {totalMainSkills}
              </span>
            </button>

            {mainCategories.map((cat) => {
              const count = skillsByCategory[cat.value]?.length || 0;
              const isSelected = selectedCategory === cat.value;
              const CatIcon = iconMap[cat.icon];

              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/25 scale-105'
                      : 'bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {CatIcon ? <CatIcon className="text-xs" /> : <span>{cat.icon}</span>}
                  <span>{cat.label}</span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Skills Grid by Category - Grouped Bento Design */}
        {filteredCategories.length > 0 ? (
          <motion.div
            key={selectedCategory}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredCategories.map((category) => {
              const categorySkills = skillsByCategory[category.value] || [];
              if (categorySkills.length === 0) return null;

              return (
                <CategoryPanel
                  key={category.value}
                  category={category}
                  skills={categorySkills}
                  isSingleView={selectedCategory !== 'all'}
                />
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Skills Added Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Skills will appear here once added through the admin panel.
            </p>
          </div>
        )}

        {/* Soft Skills Section - Card 1 */}
        <SoftSkillsCard skills={softSkills} />

        {/* Tools & Technologies Section - Card 2 */}
        <ToolsCard skills={toolSkills} />

        {/* Skills Statistics */}
        {mainCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="rounded-2xl p-6 bg-gradient-to-br from-primary/5 via-purple-600/5 to-blue-500/5 border border-primary/20">
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                {mainCategories.map((category) => {
                  const categorySkills = skillsByCategory[category.value] || [];
                  return (
                    <motion.div
                      key={category.value}
                      whileHover={{ scale: 1.05 }}
                      className="text-center"
                    >
                      <div className="text-2xl">
  {(() => {
    const StatIconComponent = iconMap[category.icon];
    if (StatIconComponent) {
      return <StatIconComponent className="mx-auto text-gray-600 dark:text-gray-400" />;
    }
    return <span>{category.icon}</span>;
  })()}
</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {categorySkills.length}
                      </div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {category.label}
                      </div>
                    </motion.div>
                  );
                })}
                <div className="text-center">
                  <div className="text-2xl">📊</div>
                  <div className="text-2xl font-bold text-primary">
                    {displaySkills.length}
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Total Skills
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Learning Journey */}
        {learningTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="rounded-2xl p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-3xl">📚</span>
                <h3 className="text-2xl font-bold">
                  <span className="text-gray-900 dark:text-white">
                    {learningSettings.title.split(' ')[0]}
                  </span>
                  <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {' '}{learningSettings.title.split(' ').slice(1).join(' ')}
                  </span>
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-3xl mx-auto">
                {learningSettings.description}
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {learningTopics.map((topic, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-4 py-2 bg-primary/5 border border-primary/20 rounded-full text-sm text-primary hover:bg-primary/10 transition-all duration-300"
                  >
                    {topic}
                  </motion.span>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-primary/80 font-mono text-sm italic">
                  "{learningSettings.quote}"
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
            >
              <span>See My Work</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-300 dark:border-gray-700 hover:border-primary hover:text-primary transition-all duration-300"
            >
              <FaRocket />
              <span>Let's Build Together</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;