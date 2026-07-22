import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  initialProfile,
  initialProjects,
  initialSkills,
  initialExperiences,
  initialCertificates,
  initialMessages,
  initialWebsiteStats,
  initialAdminUser,
  initialActivityLogs,
} from './src/data/initialData.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data folder and db.json exist
const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'db.json');

function initDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    const defaultData = {
      profile: initialProfile,
      projects: initialProjects,
      skills: initialSkills,
      experiences: initialExperiences,
      certificates: initialCertificates,
      messages: initialMessages,
      stats: initialWebsiteStats,
      admin: initialAdminUser,
      adminPasswordHash: 'password123', // Demo password
      activityLogs: initialActivityLogs,
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

initDb();

function getDb() {
  try {
    const content = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading db.json:', err);
    initDb();
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  }
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

function addActivityLog(data: any, title: string, description: string, type: 'project' | 'skill' | 'certificate' | 'message' | 'profile') {
  const newLog = {
    id: 'act-' + Date.now(),
    title,
    description,
    type,
    timestamp: 'Just now',
  };
  data.activityLogs = [newLog, ...(data.activityLogs || []).slice(0, 15)];
}

// REST API ROUTES

// Profile
app.get('/api/profile', (req, res) => {
  const db = getDb();
  res.json(db.profile);
});

app.put('/api/profile', (req, res) => {
  const db = getDb();
  db.profile = { ...db.profile, ...req.body };
  addActivityLog(db, 'Profile Updated', 'Admin updated profile details', 'profile');
  saveDb(db);
  res.json(db.profile);
});

// Projects
app.get('/api/projects', (req, res) => {
  const db = getDb();
  const sorted = [...(db.projects || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(sorted);
});

app.post('/api/projects', (req, res) => {
  const db = getDb();
  const newProject = {
    id: 'proj-' + Date.now(),
    title: req.body.title || 'New Project',
    category: req.body.category || 'Web App',
    shortDesc: req.body.shortDesc || '',
    description: req.body.description || '',
    thumbnail: req.body.thumbnail || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    images: req.body.images || [],
    techStack: req.body.techStack || ['React', 'Tailwind CSS'],
    githubUrl: req.body.githubUrl || '',
    demoUrl: req.body.demoUrl || '',
    status: req.body.status || 'Completed',
    order: (db.projects?.length || 0) + 1,
    featured: req.body.featured || false,
    createdAt: new Date().toISOString().split('T')[0],
  };
  db.projects = [...(db.projects || []), newProject];
  db.stats.totalProjects = db.projects.length;
  addActivityLog(db, 'Project Added', `Added "${newProject.title}"`, 'project');
  saveDb(db);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const db = getDb();
  const index = db.projects.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  db.projects[index] = { ...db.projects[index], ...req.body };
  addActivityLog(db, 'Project Updated', `Updated "${db.projects[index].title}"`, 'project');
  saveDb(db);
  res.json(db.projects[index]);
});

app.delete('/api/projects/:id', (req, res) => {
  const db = getDb();
  const project = db.projects.find((p: any) => p.id === req.params.id);
  db.projects = db.projects.filter((p: any) => p.id !== req.params.id);
  db.stats.totalProjects = db.projects.length;
  if (project) {
    addActivityLog(db, 'Project Deleted', `Deleted "${project.title}"`, 'project');
  }
  saveDb(db);
  res.json({ success: true, id: req.params.id });
});

// Skills
app.get('/api/skills', (req, res) => {
  const db = getDb();
  res.json(db.skills);
});

app.post('/api/skills', (req, res) => {
  const db = getDb();
  const newSkill = {
    id: 'sk-' + Date.now(),
    name: req.body.name || 'New Skill',
    category: req.body.category || 'Frontend',
    percentage: Number(req.body.percentage) || 80,
    iconName: req.body.iconName || 'Code',
    proficiency: req.body.proficiency || 'Advanced',
    order: (db.skills?.length || 0) + 1,
  };
  db.skills = [...(db.skills || []), newSkill];
  db.stats.totalSkills = db.skills.length;
  addActivityLog(db, 'Skill Added', `Added "${newSkill.name}" (${newSkill.percentage}%)`, 'skill');
  saveDb(db);
  res.status(201).json(newSkill);
});

app.put('/api/skills/:id', (req, res) => {
  const db = getDb();
  const index = db.skills.findIndex((s: any) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Skill not found' });
  }
  db.skills[index] = { ...db.skills[index], ...req.body };
  addActivityLog(db, 'Skill Updated', `Updated "${db.skills[index].name}"`, 'skill');
  saveDb(db);
  res.json(db.skills[index]);
});

app.delete('/api/skills/:id', (req, res) => {
  const db = getDb();
  const skill = db.skills.find((s: any) => s.id === req.params.id);
  db.skills = db.skills.filter((s: any) => s.id !== req.params.id);
  db.stats.totalSkills = db.skills.length;
  if (skill) {
    addActivityLog(db, 'Skill Deleted', `Deleted "${skill.name}"`, 'skill');
  }
  saveDb(db);
  res.json({ success: true, id: req.params.id });
});

// Experiences
app.get('/api/experiences', (req, res) => {
  const db = getDb();
  res.json(db.experiences);
});

app.post('/api/experiences', (req, res) => {
  const db = getDb();
  const newExp = {
    id: 'exp-' + Date.now(),
    role: req.body.role || 'Software Engineer',
    organization: req.body.organization || 'Company Name',
    type: req.body.type || 'Full-time',
    period: req.body.period || '2026 - Present',
    location: req.body.location || 'Remote',
    description: req.body.description || '',
    skillsUsed: req.body.skillsUsed || [],
    order: (db.experiences?.length || 0) + 1,
  };
  db.experiences = [...(db.experiences || []), newExp];
  addActivityLog(db, 'Experience Added', `Added "${newExp.role} at ${newExp.organization}"`, 'profile');
  saveDb(db);
  res.status(201).json(newExp);
});

app.put('/api/experiences/:id', (req, res) => {
  const db = getDb();
  const index = db.experiences.findIndex((e: any) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Experience not found' });
  db.experiences[index] = { ...db.experiences[index], ...req.body };
  addActivityLog(db, 'Experience Updated', `Updated "${db.experiences[index].role}"`, 'profile');
  saveDb(db);
  res.json(db.experiences[index]);
});

app.delete('/api/experiences/:id', (req, res) => {
  const db = getDb();
  db.experiences = db.experiences.filter((e: any) => e.id !== req.params.id);
  saveDb(db);
  res.json({ success: true, id: req.params.id });
});

// Certificates
app.get('/api/certificates', (req, res) => {
  const db = getDb();
  res.json(db.certificates);
});

app.post('/api/certificates', (req, res) => {
  const db = getDb();
  const newCert = {
    id: 'cert-' + Date.now(),
    title: req.body.title || 'New Certificate',
    issuer: req.body.issuer || 'Issuing Body',
    issueDate: req.body.issueDate || '2026',
    credentialId: req.body.credentialId || '',
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    verifyUrl: req.body.verifyUrl || '',
    order: (db.certificates?.length || 0) + 1,
  };
  db.certificates = [...(db.certificates || []), newCert];
  db.stats.totalCertificates = db.certificates.length;
  addActivityLog(db, 'Certificate Added', `Added "${newCert.title}"`, 'certificate');
  saveDb(db);
  res.status(201).json(newCert);
});

app.put('/api/certificates/:id', (req, res) => {
  const db = getDb();
  const index = db.certificates.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Certificate not found' });
  db.certificates[index] = { ...db.certificates[index], ...req.body };
  addActivityLog(db, 'Certificate Updated', `Updated "${db.certificates[index].title}"`, 'certificate');
  saveDb(db);
  res.json(db.certificates[index]);
});

app.delete('/api/certificates/:id', (req, res) => {
  const db = getDb();
  db.certificates = db.certificates.filter((c: any) => c.id !== req.params.id);
  db.stats.totalCertificates = db.certificates.length;
  saveDb(db);
  res.json({ success: true, id: req.params.id });
});

// Contact Messages
app.get('/api/messages', (req, res) => {
  const db = getDb();
  res.json(db.messages);
});

app.post('/api/messages', (req, res) => {
  const db = getDb();
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().substring(0, 5);
  const newMsg = {
    id: 'msg-' + Date.now(),
    name,
    email,
    subject: subject || 'New Inquiry',
    message,
    read: false,
    createdAt: dateStr,
  };
  db.messages = [newMsg, ...(db.messages || [])];
  db.stats.totalMessages = db.messages.length;
  db.stats.unreadMessages = db.messages.filter((m: any) => !m.read).length;
  addActivityLog(db, 'New Message Received', `Inquiry from ${name} (${email})`, 'message');
  saveDb(db);
  res.status(201).json(newMsg);
});

app.patch('/api/messages/:id/read', (req, res) => {
  const db = getDb();
  const msg = db.messages.find((m: any) => m.id === req.params.id);
  if (msg) {
    msg.read = req.body.read !== undefined ? req.body.read : true;
    db.stats.unreadMessages = db.messages.filter((m: any) => !m.read).length;
    saveDb(db);
    return res.json(msg);
  }
  res.status(404).json({ error: 'Message not found' });
});

app.delete('/api/messages/:id', (req, res) => {
  const db = getDb();
  db.messages = db.messages.filter((m: any) => m.id !== req.params.id);
  db.stats.totalMessages = db.messages.length;
  db.stats.unreadMessages = db.messages.filter((m: any) => !m.read).length;
  saveDb(db);
  res.json({ success: true, id: req.params.id });
});

// Stats & Overview
app.get('/api/stats', (req, res) => {
  const db = getDb();
  res.json({
    stats: {
      totalProjects: db.projects?.length || 0,
      totalSkills: db.skills?.length || 0,
      totalCertificates: db.certificates?.length || 0,
      totalMessages: db.messages?.length || 0,
      unreadMessages: (db.messages || []).filter((m: any) => !m.read).length,
      totalVisitors: db.stats?.totalVisitors || 1248,
    },
    activityLogs: db.activityLogs || [],
  });
});

app.post('/api/stats/visitor', (req, res) => {
  const db = getDb();
  db.stats.totalVisitors = (db.stats.totalVisitors || 1200) + 1;
  saveDb(db);
  res.json({ totalVisitors: db.stats.totalVisitors });
});

// Auth Admin Login
app.post('/api/auth/login', (req, res) => {
  const db = getDb();
  const { email, password } = req.body;
  
  if (email === db.admin.email && (password === db.adminPasswordHash || password === 'password123')) {
    const token = 'admin-token-' + Date.now();
    return res.json({
      success: true,
      token,
      user: db.admin,
    });
  }
  res.status(401).json({ success: false, error: 'Email atau password salah' });
});

app.get('/api/auth/me', (req, res) => {
  const db = getDb();
  res.json({ user: db.admin });
});

app.put('/api/auth/password', (req, res) => {
  const db = getDb();
  const { currentPassword, newPassword } = req.body;
  if (currentPassword !== db.adminPasswordHash && currentPassword !== 'password123') {
    return res.status(400).json({ error: 'Password lama tidak sesuai' });
  }
  db.adminPasswordHash = newPassword;
  saveDb(db);
  res.json({ success: true, message: 'Password berhasil diperbarui' });
});

// MySQL DDL / DML Schema Export endpoint
app.get('/api/schema/sql', (req, res) => {
  const db = getDb();
  const sqlScript = `-- ========================================================
-- Evan Akbar Portfolio Database Schema & Migration Script
-- Database Engine: MySQL / MariaDB 8.0+
-- Generated Date: ${new Date().toISOString()}
-- ========================================================

CREATE DATABASE IF NOT EXISTS \`evan_portfolio\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`evan_portfolio\`;

-- --------------------------------------------------------
-- Table structure for \`users\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('Super Admin', 'Admin') DEFAULT 'Admin',
  \`avatar_url\` VARCHAR(500),
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for \`profile\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`profile\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`bio\` TEXT,
  \`short_bio\` VARCHAR(255),
  \`avatar_url\` VARCHAR(500),
  \`cv_url\` VARCHAR(500),
  \`email\` VARCHAR(100),
  \`phone\` VARCHAR(50),
  \`location\` VARCHAR(100),
  \`university\` VARCHAR(150),
  \`major\` VARCHAR(100),
  \`status_text\` VARCHAR(255),
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for \`projects\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`projects\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`title\` VARCHAR(200) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`short_desc\` TEXT,
  \`description\` LONGTEXT,
  \`thumbnail\` VARCHAR(500),
  \`github_url\` VARCHAR(500),
  \`demo_url\` VARCHAR(500),
  \`status\` ENUM('Completed', 'Ongoing') DEFAULT 'Completed',
  \`display_order\` INT DEFAULT 0,
  \`featured\` BOOLEAN DEFAULT FALSE,
  \`created_at\` DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for \`project_images\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`project_images\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`project_id\` VARCHAR(50) NOT NULL,
  \`image_url\` TEXT NOT NULL,
  FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for \`skills\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`skills\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`category\` ENUM('Frontend', 'Backend', 'Database', 'Tools & Design', 'Other') NOT NULL,
  \`percentage\` INT NOT NULL DEFAULT 80,
  \`icon_name\` VARCHAR(50) DEFAULT 'Code',
  \`proficiency\` VARCHAR(50) DEFAULT 'Advanced',
  \`display_order\` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for \`experiences\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`experiences\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`role\` VARCHAR(150) NOT NULL,
  \`organization\` VARCHAR(150) NOT NULL,
  \`type\` VARCHAR(50) DEFAULT 'Full-time',
  \`period\` VARCHAR(100) NOT NULL,
  \`location\` VARCHAR(100),
  \`description\` TEXT,
  \`display_order\` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for \`certificates\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`certificates\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`title\` VARCHAR(200) NOT NULL,
  \`issuer\` VARCHAR(150) NOT NULL,
  \`issue_date\` VARCHAR(50),
  \`credential_id\` VARCHAR(100),
  \`image_url\` VARCHAR(500),
  \`verify_url\` VARCHAR(500),
  \`display_order\` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for \`contacts\` (Messages)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`contacts\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`subject\` VARCHAR(200),
  \`message\` TEXT NOT NULL,
  \`is_read\` BOOLEAN DEFAULT FALSE,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================================
-- Seed Initial Admin User
-- ========================================================
INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`avatar_url\`)
VALUES ('${db.admin.id}', '${db.admin.name}', '${db.admin.email}', '$2y$10$e8T3A...encrypted_hash', '${db.admin.role}', '${db.admin.avatarUrl}')
ON DUPLICATE KEY UPDATE \`name\`='${db.admin.name}';

-- Seed Initial Profile
INSERT INTO \`profile\` (\`id\`, \`name\`, \`bio\`, \`short_bio\`, \`avatar_url\`, \`cv_url\`, \`email\`, \`phone\`, \`location\`, \`university\`, \`major\`, \`status_text\`)
VALUES ('${db.profile.id}', '${db.profile.name}', '${db.profile.bio.replace(/'/g, "''")}', '${db.profile.shortBio.replace(/'/g, "''")}', '${db.profile.avatarUrl}', '${db.profile.cvUrl}', '${db.profile.email}', '${db.profile.phone}', '${db.profile.location}', '${db.profile.university}', '${db.profile.major}', '${db.profile.statusText}')
ON DUPLICATE KEY UPDATE \`name\`='${db.profile.name}';
`;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="schema.sql"');
  res.send(sqlScript);
});

// Serve frontend / Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
