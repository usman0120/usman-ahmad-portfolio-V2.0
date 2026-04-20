# 🚀 Usman Ahmad - Portfolio Website

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Firebase Setup](#-firebase-setup)
- [Admin Panel](#-admin-panel)
- [Deployment](#-deployment)
- [Customization](#-customization)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

A modern, fully-featured portfolio website built for **Usman Ahmad** - Software Engineer & AI Solution Architect. This portfolio showcases technical expertise, projects, services, and provides a complete admin dashboard for easy content management.

### Key Highlights

- 🎨 **Modern UI/UX** with smooth animations and responsive design
- 🔧 **Complete CMS** - Manage all content through an intuitive admin panel
- 🌙 **Dark/Light Mode** - Automatic theme detection with manual toggle
- 📱 **Fully Responsive** - Optimized for all devices from mobile to desktop
- 🔒 **Secure Authentication** - Firebase Auth protected admin routes
- ⚡ **Real-time Updates** - Firestore real-time data synchronization

---

## ✨ Features

### Public Pages

| Page | Description |
|------|-------------|
| **Home** | Hero section with animated text, stats, and featured services preview |
| **About** | Professional bio, education timeline, expertise areas, and "How I Can Help" section |
| **Skills** | Categorized technical skills with proficiency indicators, tools section, and soft skills |
| **Projects** | Portfolio showcase with filtering, search, and detailed project pages |
| **Services** | Service offerings with detailed pages, features, process steps, and technologies |
| **Contact** | Dual-form system: Quick message and detailed Hire Me form with file attachments |
| **Project Detail** | Comprehensive case study pages with overview, challenges, solutions, and gallery |

### Admin Panel

| Section | Capabilities |
|---------|-------------|
| **Dashboard** | Overview stats, recent activity, quick actions, and inbox preview |
| **Projects** | CRUD operations, image upload, tech stack management, detailed case study editor |
| **Skills** | Category-based skill management, icon picker with 100+ tech icons, proficiency control |
| **Services** | Service creation with features, process steps, technologies, and gallery |
| **Messages** | Unified inbox for contact forms and hire requests with attachment viewer |
| **Profile** | Personal info, social links, education, experience, goals, certifications, resume upload |
| **Learning Journey** | Customizable learning topics and philosophy section |

### Additional Features

- 🔐 **NDA Option** - Clients can request NDA before sharing project details
- 📎 **File Attachments** - Support for images, PDFs, and documents (max 5MB)
- 🔍 **Search & Filter** - Find projects and skills easily
- 📊 **Dynamic Stats** - Homepage stats update automatically from admin panel
- 🎭 **Smooth Animations** - Page transitions and scroll animations using Framer Motion
- 📱 **PWA Ready** - Can be installed as a Progressive Web App

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Library |
| TypeScript | 5.0.0 | Type Safety |
| Tailwind CSS | 3.3.0 | Styling |
| Framer Motion | 10.0.0 | Animations |
| React Router | 6.14.0 | Routing |
| React Icons | 4.10.0 | Icons |
| React Hook Form | 7.45.0 | Form Handling |
| Vite | 4.4.0 | Build Tool |

### Backend & Services

| Service | Purpose |
|---------|---------|
| Firebase Firestore | Database |
| Firebase Authentication | Admin Login |
| Firebase Hosting | Deployment |
| Firebase Storage | (Optional) File Storage |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code Linting |
| Prettier | Code Formatting |
| TypeScript | Static Typing |

---

## 📁 Project Structure

src/
├── components/
│   ├── layouts/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   └── Services.tsx
│   ├── ui/
│   │   ├── Modal.tsx
│   │   └── LoadingSkeleton.tsx
│   └── common/
│       └── LoadingLine.tsx
│
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── ProjectDetail.tsx
│   ├── Services.tsx
│   ├── ServiceDetail.tsx
│   ├── Contact.tsx
│   └── Admin/
│       ├── AdminLogin.tsx
│       ├── Dashboard.tsx
│       ├── ProjectsAdmin.tsx
│       ├── SkillsAdmin.tsx
│       ├── ServicesAdmin.tsx
│       ├── MessagesAdmin.tsx
│       ├── ProfileSettings.tsx
│       └── Settings.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useFirestore.ts
│   └── useTheme.ts
│
├── context/
│   ├── AuthContext.tsx
│   └── ThemeProvider.tsx
│
├── firebase/
│   ├── firebaseClient.ts
│   └── models.ts
│
├── utils/
│   ├── animations.ts
│   └── validators.ts
│
├── routes/
│   └── AppRoutes.tsx
│
├── styles/
│   └── globals.css
│
├── App.tsx
└── main.tsx

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Firebase Account**

### Installation

1. **Clone the repository**

git clone <https://github.com/usmanahmad/portfolio.git>
cd portfolio

1. **Install dependencies**
npm install

# or

yarn install

1. **Set up environment variables** (see [Environment Variables](#-environment-variables))

2. **Configure Firebase** (see [Firebase Setup](#-firebase-setup))

3. **Start the development server**
npm run dev

# or

yarn dev

1. **Build for production**
npm run build

# or

yarn build

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

---

## 🔥 Firebase Setup

### 1. Create a Firebase Project

- Go to [Firebase Console](https://console.firebase.google.com/)
- Click "Add Project" and follow the setup wizard

### 2. Register Your Web App

- In your project, click "Add App" → "Web"
- Register with a nickname (e.g., "Portfolio Web")
- Copy the Firebase configuration

### 3. Enable Required Services

| Service | Purpose |
|---------|---------|
| **Authentication** | Email/Password sign-in for admin |
| **Firestore Database** | Store all portfolio data |
| **Hosting** (optional) | Deploy the website |

### 4. Create Admin User

1. Go to **Authentication** → **Users**
2. Click "Add User"
3. Enter admin email and password
4. Copy the **User UID** for Firestore rules

### 5. Configure Firestore Rules

Deploy the following rules (update the UID):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && request.auth.uid == "YOUR_ADMIN_UID_HERE";
    }
    // Public read collections
    match /projects/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /projectDetails/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /skills/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /services/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /profile/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Admin-only collections
    match /messages/{document} {
      allow read, write: if isAdmin();
    }
    
    match /hireRequests/{document} {
      allow read, write: if isAdmin();
    }
  }
}

### 6. Create Firestore Indexes

Create the following indexes for optimal query performance:

| Collection | Fields | Order |
|------------|--------|-------|
| projects | createdAt | Descending |
| skills | proficiency | Descending |
| messages | createdAt | Descending |
| hireRequests | createdAt | Descending |
| services | order | Ascending |

---

## 👨‍💼 Admin Panel

### Access

- URL: `https://your-domain.com/admin/login`
- Use the email/password created in Firebase Authentication

### Dashboard Overview

The admin dashboard provides:

- 📊 Real-time statistics (projects, skills, messages)
- ⚡ Quick action buttons
- 📨 Recent messages preview
- 🔔 Unread notifications

### Content Management

All content can be managed through the admin panel:

- **Projects**: Add/edit projects with images, tech stack, and detailed case studies
- **Skills**: Manage skills with categories, icons, and proficiency levels
- **Services**: Create service offerings with features and process steps
- **Profile**: Update personal information, education, and social links
- **Messages**: View and reply to contact form submissions

---

## 🚢 Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
npm install -g firebase-tools

2. **Login to Firebase**
firebase login

3. **Initialize Firebase**
firebase init

- Select **Hosting**
- Choose your Firebase project
- Set `dist` as the public directory
- Configure as a single-page app: **Yes**

1. **Build and Deploy**

npm run build
firebase deploy

### Alternative: Deploy to Vercel

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Alternative: Deploy to Netlify

1. Push your code to GitHub
2. Import project on [Netlify](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy

---

## 🎨 Customization

### Changing Colors

Edit the color palette in `tailwind.config.js`:

theme: {
  extend: {
    colors: {
      primary: '#8B5CF6',     // Main purple
      secondary: '#1E1B4B',    // Dark purple
      // ... add your colors
    }
  }
}

### Updating Personal Information

All personal information can be updated through:

- **Admin Panel** → **Profile Settings**
- Or directly edit the default values in `hooks/useFirestore.ts`

### Adding New Icons

Icons are managed in `pages/Admin/SkillsAdmin.tsx`. To add new icons:

1. Import from `react-icons`
2. Add to the `EXTENDED_ICON_OPTIONS` array
3. Add to the `iconMap` in `pages/Skills.tsx`

### Modifying Animations

Animation variants are centralized in `utils/animations.ts`. Modify or add new animations there.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Coding Standards

- Use TypeScript for all new files
- Follow the existing component structure
- Use Tailwind CSS for styling
- Test responsive design on mobile and desktop
- Run `npm run lint` before committing

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### You are free to

- ✅ Use this project for personal or commercial purposes
- ✅ Modify the code to suit your needs
- ✅ Distribute the code

### Requirements

- 📋 Include the original license and copyright notice
- 🔗 Link back to the original repository (appreciated but not required)

---

## 📞 Contact

### Usman Ahmad

- 🌐 **Website**: [usman-portfolio.web.app](https://usman-portfolio.web.app)
- 📧 **Email**: <usman@example.com>
- 💼 **LinkedIn**: [linkedin.com/in/usman-ahmad](https://linkedin.com/in/usman-ahmad)
- 🐙 **GitHub**: [github.com/usmanahmad](https://github.com/usmanahmad)

### Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/usmanahmad/portfolio/issues)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/usmanahmad/portfolio/issues)

---

## 🙏 Acknowledgments

- [React Icons](https://react-icons.github.io/react-icons/) - Comprehensive icon library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Firebase](https://firebase.google.com/) - Backend and hosting
- [Unsplash](https://unsplash.com/) - Stock images

---

### ⭐ Star this repo if you found it useful! ⭐

Made with ❤️ by **Usman Ahmad**

This README includes:

1. **Badges** for tech stack visibility
2. **Table of Contents** for easy navigation
3. **Overview** with key highlights
4. **Detailed Features** list for both public and admin pages
5. **Complete Tech Stack** breakdown
6. **Project Structure** for developers
7. **Step-by-step Setup Guide**
8. **Firebase Configuration** with rules
9. **Admin Panel** documentation
10. **Deployment Instructions** for multiple platforms
11. **Customization Guide**
12. **Contributing Guidelines**
13. **License Information**
14. **Contact Details**
