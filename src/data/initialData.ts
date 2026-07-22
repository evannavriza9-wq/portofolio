import { ProfileData, ProjectItem, SkillItem, ExperienceItem, CertificateItem, ContactMessage, AdminUser, ActivityLog, WebsiteStats } from '../types';

export const initialProfile: ProfileData = {
  id: 'prof-1',
  name: 'Evan Akbar',
  titles: ['Web Developer', 'UI/UX Designer', 'Informatics Student'],
  bio: 'Passionate Informatics Student and Full-Stack Web Developer with a strong eye for UI/UX design. Experienced in building high-performance web applications using React, Laravel, Tailwind CSS, and modern backend architectures.',
  shortBio: 'Building modern, high-performance web solutions & sleek UI/UX experiences.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
  cvUrl: '#download-cv',
  cvFileName: 'CV_Evan_Akbar_Web_Developer.pdf',
  email: 'evannavriza9@gmail.com',
  phone: '+62 812 3456 7890',
  location: 'Indonesia',
  university: 'State University of Informatics',
  major: 'Informatics Engineering',
  statusText: 'Available for Freelance & Collaborative Projects',
  socials: {
    github: 'https://github.com/evanakbar',
    linkedin: 'https://linkedin.com/in/evanakbar',
    instagram: 'https://instagram.com/evanakbar',
    figma: 'https://figma.com/@evanakbar',
    twitter: 'https://twitter.com/evanakbar',
  },
};

export const initialProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'SaaS Analytics Dashboard',
    category: 'Web App',
    shortDesc: 'A full-stack real-time analytics web dashboard with dark blue theme, interactive charts, and user management.',
    description: 'A modern SaaS application designed for enterprise analytics. Features live data visualization using Recharts, dark glassmorphism UI layout, custom export options, and complete user role control built with React, Laravel, and Tailwind CSS.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    ],
    techStack: ['React', 'Laravel', 'Tailwind CSS', 'MySQL', 'REST API'],
    githubUrl: 'https://github.com/evanakbar/saas-analytics-dashboard',
    demoUrl: 'https://analytics-demo.evan.dev',
    status: 'Completed',
    order: 1,
    featured: true,
    createdAt: '2026-05-10',
  },
  {
    id: 'proj-2',
    title: 'E-Commerce Marketplace Platform',
    category: 'Laravel',
    shortDesc: 'Modern online store with shopping cart, midtrans payment gateway integration, and multi-vendor admin dashboard.',
    description: 'An end-to-end e-commerce solution featuring product variant configuration, inventory tracking, secure checkout flows, review system, and vendor metrics.',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800',
    ],
    techStack: ['Laravel', 'Blade', 'Tailwind CSS', 'MySQL', 'Midtrans API'],
    githubUrl: 'https://github.com/evanakbar/laravel-ecommerce-store',
    demoUrl: 'https://store-demo.evan.dev',
    status: 'Completed',
    order: 2,
    featured: true,
    createdAt: '2026-03-22',
  },
  {
    id: 'proj-3',
    title: 'Fintech Mobile Banking App UI Design',
    category: 'UI/UX',
    shortDesc: 'Comprehensive UI/UX design case study for a next-gen digital mobile banking and wealth app.',
    description: 'Created user journeys, wireframes, high-fidelity prototypes, and design systems in Figma for a modern fintech app focused on seamless transfers, expense categorization, and smart savings goals.',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
    ],
    techStack: ['Figma', 'UI/UX Design', 'Design System', 'Prototyping'],
    githubUrl: 'https://github.com/evanakbar/fintech-ui-case-study',
    demoUrl: 'https://figma.com/@evanakbar',
    status: 'Completed',
    order: 3,
    featured: true,
    createdAt: '2026-02-15',
  },
  {
    id: 'proj-4',
    title: 'University Campus Portal & Event System',
    category: 'React',
    shortDesc: 'Campus management platform for students and faculty to track academic records, schedule, and events.',
    description: 'A web application built to streamline campus student affairs. Integrates schedule management, real-time announcements, organization event ticketing, and document submission.',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    ],
    techStack: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL'],
    githubUrl: 'https://github.com/evanakbar/campus-portal-app',
    demoUrl: 'https://campus-demo.evan.dev',
    status: 'Ongoing',
    order: 4,
    featured: false,
    createdAt: '2026-06-01',
  },
];

export const initialSkills: SkillItem[] = [
  { id: 'sk-1', name: 'HTML5', category: 'Frontend', percentage: 95, iconName: 'Code', proficiency: 'Expert', order: 1 },
  { id: 'sk-2', name: 'CSS3', category: 'Frontend', percentage: 90, iconName: 'Palette', proficiency: 'Expert', order: 2 },
  { id: 'sk-3', name: 'JavaScript', category: 'Frontend', percentage: 90, iconName: 'Zap', proficiency: 'Advanced', order: 3 },
  { id: 'sk-4', name: 'PHP', category: 'Backend', percentage: 88, iconName: 'Server', proficiency: 'Advanced', order: 4 },
  { id: 'sk-5', name: 'MySQL', category: 'Database', percentage: 85, iconName: 'Database', proficiency: 'Advanced', order: 5 },
  { id: 'sk-6', name: 'Laravel', category: 'Backend', percentage: 88, iconName: 'Box', proficiency: 'Advanced', order: 6 },
  { id: 'sk-7', name: 'React', category: 'Frontend', percentage: 92, iconName: 'Atom', proficiency: 'Expert', order: 7 },
  { id: 'sk-8', name: 'Tailwind CSS', category: 'Frontend', percentage: 95, iconName: 'Layers', proficiency: 'Expert', order: 8 },
  { id: 'sk-9', name: 'Git & GitHub', category: 'Tools & Design', percentage: 90, iconName: 'GitBranch', proficiency: 'Advanced', order: 9 },
  { id: 'sk-10', name: 'Figma', category: 'Tools & Design', percentage: 85, iconName: 'Figma', proficiency: 'Advanced', order: 10 },
];

export const initialExperiences: ExperienceItem[] = [
  {
    id: 'exp-bca-1',
    role: 'IT & Software Engineering Intern',
    organization: 'PT Bank Central Asia Tbk (BCA)',
    type: 'Internship',
    period: '2025 - 2026',
    location: 'Jakarta, Indonesia',
    description: 'Developed and optimized enterprise web application features, internal banking portals, and RESTful APIs for PT Bank Central Asia Tbk (BCA). Collaborated with senior IT engineers in agile sprints to ensure high security, low latency, and smooth user experience.',
    skillsUsed: ['React', 'TypeScript', 'Java', 'Spring Boot', 'MySQL', 'REST API', 'Git'],
    order: 1,
  },
];

export const initialCertificates: CertificateItem[] = [
  {
    id: 'cert-1',
    title: 'Full Stack Web Developer Professional',
    issuer: 'Dicoding Indonesia & Kemendikbud',
    issueDate: '2025',
    credentialId: 'DICODING-FS-998821',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    verifyUrl: 'https://dicoding.com/certificates/DICODING-FS-998821',
    order: 1,
  },
  {
    id: 'cert-2',
    title: 'Laravel Backend RESTful API Specialist',
    issuer: 'BuildWithAngga Certification',
    issueDate: '2025',
    credentialId: 'BWA-LARAVEL-7721',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    verifyUrl: 'https://buildwithangga.com/certificates/BWA-LARAVEL-7721',
    order: 2,
  },
  {
    id: 'cert-3',
    title: 'UI/UX Design Masterclass & Figma Systems',
    issuer: 'Coursera / Google UX Certification',
    issueDate: '2024',
    credentialId: 'COURSERA-UX-44310',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    verifyUrl: 'https://coursera.org/verify/COURSERA-UX-44310',
    order: 3,
  },
];

export const initialMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Budi Santoso',
    email: 'budi.santoso@company.co.id',
    subject: 'Web Development Project Inquiry',
    message: 'Halo Evan, saya melihat portofolio Anda dan sangat terkesan. Kami memiliki proyek pembuatan aplikasi manajemen toko dan ingin mendiskusikan penawaran kerjasama.',
    read: false,
    createdAt: '2026-07-20 14:32',
  },
  {
    id: 'msg-2',
    name: 'Sarah Wijaya',
    email: 'sarah.ux@techagency.com',
    subject: 'UI/UX Design Collaboration',
    message: 'Hi Evan! Amazing work on your Figma designs and React projects. Are you open for freelance UI/UX design opportunities this month?',
    read: true,
    createdAt: '2026-07-18 09:15',
  },
];

export const initialAdminUser: AdminUser = {
  id: 'admin-1',
  email: 'admin@evan.dev',
  name: 'Evan Akbar (Admin)',
  role: 'Super Admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
};

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'act-1',
    title: 'Project Published',
    description: 'Added new project "SaaS Analytics Dashboard"',
    type: 'project',
    timestamp: '2 hours ago',
  },
  {
    id: 'act-2',
    title: 'Message Received',
    description: 'New inquiry from Budi Santoso',
    type: 'message',
    timestamp: '5 hours ago',
  },
  {
    id: 'act-3',
    title: 'Skill Updated',
    description: 'Updated React proficiency to 92%',
    type: 'skill',
    timestamp: '1 day ago',
  },
];

export const initialWebsiteStats: WebsiteStats = {
  totalProjects: 4,
  totalSkills: 10,
  totalCertificates: 3,
  totalMessages: 2,
  unreadMessages: 1,
  totalVisitors: 1248,
};
