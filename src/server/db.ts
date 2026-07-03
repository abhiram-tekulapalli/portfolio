/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import bcryptjs from 'bcryptjs';
import { MongoClient } from 'mongodb';
import {
  HeroData,
  AboutData,
  Skill,
  Project,
  Certification,
  Experience,
  Education,
  Blog,
  SettingsData
} from '../types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface DatabaseSchema {
  adminHash: string;
  hero: HeroData;
  about: AboutData;
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  experience: Experience[];
  education: Education[];
  blogs: Blog[];
  settings: SettingsData;
  resumePdfBase64?: string;
}

// Dynamically generate the default password hash
const DEFAULT_PASSWORD = 'admin123';
const DEFAULT_HASH = bcryptjs.hashSync(DEFAULT_PASSWORD, 12);

const INITIAL_DB: DatabaseSchema = {
  adminHash: DEFAULT_HASH,
  hero: {
    name: "Tekulapalli Abhiram",
    taglines: [
      "AI / ML Engineer",
      "Full-Stack Web Developer",
      "Data Structures & Algorithms Enthusiast",
      "Problem Solver"
    ],
    bio: "B.Tech Computer Science student specializing in Artificial Intelligence and Machine Learning. Passionate about engineering production-grade intelligent software, deep learning architectures, and scalable web platforms.",
    resumeUrl: "https://drive.google.com/file/d/1XexampleResumeURL/view",
    availabilityStatus: true,
    socials: {
      github: "https://github.com/abhiram-tp",
      linkedin: "https://linkedin.com/in/tekula-palli-abhiram",
      instagram: "https://instagram.com/abhiram_tp",
      email: "pokephantom98765@gmail.com",
      twitter: "https://twitter.com/abhiram_tp"
    }
  },
  about: {
    bio: "I am a B.Tech Computer Science and Engineering student at BVRIT Narsapur (2024-2028), heavily index-focused on Artificial Intelligence and Machine Learning. I combine theoretical statistics with clean, full-stack software development to build apps that perform. I love designing optimized databases, building high-speed network APIs, and training computer vision and natural language processing models.",
    terminalLines: [
      { command: "whoami", output: "tekulapalli-abhiram" },
      { command: "cat role.txt", output: "AI/ML Engineer & Full-Stack Developer" },
      { command: "echo $LOCATION", output: "Hyderabad, India" },
      { command: "cat education.txt", output: "B.Tech CSE (AI/ML) @ BVRIT, 2024 - 2028" },
      { command: "ls interests/", output: "DeepLearning ComputerVision REST-APIs DSA OpenSource" },
      { command: "git log --oneline -n 1", output: "1a2b3c4 - Initialized portfolio with premium Swiss Brutalist UI/UX - Tekulapalli Abhiram" }
    ],
    stats: [
      { value: "12+", label: "Projects Completed" },
      { value: "8+", label: "Certifications" },
      { value: "500+", label: "GitHub Commits" },
      { value: "250+", label: "DSA Problems Solved" }
    ]
  },
  skills: [
    // Languages
    { id: "s1", name: "Python", category: "Languages", order: 1 },
    { id: "s2", name: "C++", category: "Languages", order: 2 },
    { id: "s3", name: "JavaScript", category: "Languages", order: 3 },
    { id: "s4", name: "TypeScript", category: "Languages", order: 4 },
    { id: "s5", name: "HTML5 & CSS3", category: "Languages", order: 5 },
    { id: "s6", name: "SQL", category: "Languages", order: 6 },
    
    // Frameworks
    { id: "f1", name: "React", category: "Frameworks", order: 1 },
    { id: "f2", name: "Node.js", category: "Frameworks", order: 2 },
    { id: "f3", name: "Express.js", category: "Frameworks", order: 3 },
    { id: "f4", name: "Tailwind CSS", category: "Frameworks", order: 4 },
    { id: "f5", name: "FastAPI", category: "Frameworks", order: 5 },

    // AI/ML
    { id: "a1", name: "TensorFlow", category: "AI/ML", order: 1 },
    { id: "a2", name: "Keras", category: "AI/ML", order: 2 },
    { id: "a3", name: "Scikit-Learn", category: "AI/ML", order: 3 },
    { id: "a4", name: "Pandas", category: "AI/ML", order: 4 },
    { id: "a5", name: "NumPy", category: "AI/ML", order: 5 },
    { id: "a6", name: "OpenCV", category: "AI/ML", order: 6 },
    
    // Databases
    { id: "d1", name: "MongoDB", category: "Databases", order: 1 },
    { id: "d2", name: "MySQL", category: "Databases", order: 2 },
    { id: "d3", name: "Firebase Firestore", category: "Databases", order: 3 },

    // Tools
    { id: "t1", name: "Git & GitHub", category: "Tools", order: 1 },
    { id: "t2", name: "Postman", category: "Tools", order: 2 },
    { id: "t3", name: "Figma", category: "Tools", order: 3 },
    { id: "t4", name: "Linux Terminal", category: "Tools", order: 4 },
    { id: "t5", name: "VS Code", category: "Tools", order: 5 }
  ],
  projects: [
    {
      id: "p1",
      title: "Pneumonia-Vision Diagnostic AI",
      description: "A highly robust deep learning pipeline using PyTorch/Keras to scan, load, and classify chest X-ray images into Pneumonia vs Normal classes. Implemented a custom CNN architecture achieving 96.2% accuracy. Designed a reactive React/Vite dashboard allowing pathologists to upload X-rays and preview real-time grad-CAM localization heatmaps.",
      techStack: ["Python", "TensorFlow", "Keras", "React", "Node.js", "OpenCV"],
      category: "AI/ML",
      githubUrl: "https://github.com/abhiram-tp/pneumonia-vision-ai",
      liveUrl: "https://pneumonia-vision.live-demo.io",
      featured: true,
      order: 1
    },
    {
      id: "p2",
      title: "QuantFlow Portfolio Optimizer",
      description: "A full-stack, responsive investment analysis engine. It processes user asset allocations, gathers historical trading prices via the AlphaVantage API, constructs mean-variance portfolios, and plots efficient frontiers. Features high-speed REST endpoints, JWT-secured auth, and SVG-drawn custom interactive investment charts.",
      techStack: ["React", "TypeScript", "Node.js", "Express", "SQLite", "Tailwind CSS"],
      category: "Web",
      githubUrl: "https://github.com/abhiram-tp/quant-flow",
      liveUrl: "https://quantflow.abhiram.dev",
      featured: true,
      order: 2
    },
    {
      id: "p3",
      title: "Aura AI: Personal Desktop Orchestrator",
      description: "An AI-powered voice assistant capable of running completely offline using local Whisper speech recognition and Llama-cpp-python. Features automated scheduling, calendar updates, files management, smart home simulation, and fully customizable Python script plugins.",
      techStack: ["Python", "Whisper-API", "Llama-3", "Tkinter", "OS-Library"],
      category: "Tools",
      githubUrl: "https://github.com/abhiram-tp/aura-voice-assistant",
      liveUrl: "",
      featured: false,
      order: 3
    },
    {
      id: "p4",
      title: "ScribeAI Meeting Notes Summarizer",
      description: "A secure web platform utilizing general-purpose server-side SDKs to process audio and transcripts of meeting notes. Integrates Gemini 3.5 Flash to automatically detect speakers, organize action plans, extract critical dates, and export formatted meeting minutes directly to Slack standard formats.",
      techStack: ["React", "Express", "Vite", "Gemini-API", "Web-Audio", "Tailwind"],
      category: "AI/ML",
      githubUrl: "https://github.com/abhiram-tp/scribe-ai-notes",
      liveUrl: "https://scribeai.abhiram.dev",
      featured: true,
      order: 4
    }
  ],
  certifications: [
    {
      id: "c1",
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI (Coursera)",
      dateIssued: "2025-01-15",
      credentialId: "DL-9988-ABC",
      certificateUrl: "https://coursera.org/verify/dl-specialization",
      order: 1
    },
    {
      id: "c2",
      title: "Google Cloud Associate Cloud Engineer",
      issuer: "Google Cloud",
      dateIssued: "2025-03-10",
      credentialId: "GCP-ACE-7762",
      certificateUrl: "https://credential.net/gcp-ace",
      order: 2
    },
    {
      id: "c3",
      title: "TensorFlow Developer Certificate",
      issuer: "Coursera",
      dateIssued: "2024-11-05",
      credentialId: "TF-DEV-3341",
      certificateUrl: "https://coursera.org/verify/tensorflow-dev",
      order: 3
    }
  ],
  experience: [
    {
      id: "e1",
      role: "AI Developer Intern",
      company: "TechSpark Solutions",
      type: "Internship",
      startDate: "2025-01-01",
      endDate: "Present",
      current: true,
      responsibilities: [
        "Developing vision-based target classifiers using YOLOv8 models for factory floor safety audits.",
        "Refining LLM prompt chains and testing inference outputs for corporate client bots.",
        "Building Node.js and Express REST endpoints to manage ML pipeline training queues."
      ],
      techUsed: ["Python", "YOLOv8", "OpenCV", "Node.js", "React"],
      companyUrl: "https://techsparksolutions.com",
      order: 1
    },
    {
      id: "e2",
      role: "Core Technical Member",
      company: "BVRIT AI Club",
      type: "Part-time",
      startDate: "2024-09-01",
      endDate: "Present",
      current: true,
      responsibilities: [
        "Conducting interactive weekly workshops on Git, Web Dev, and NumPy basics for 80+ active undergraduates.",
        "Mentoring first-year computer engineering cohorts in C++ data structures and algorithm design.",
        "Developing the official open-source hackathon registration platform for college hack events."
      ],
      techUsed: ["React", "TypeScript", "Tailwind CSS", "MongoDB", "C++"],
      companyUrl: "https://bvrit.ac.in",
      order: 2
    }
  ],
  education: [
    {
      id: "ed1",
      institution: "BVRIT Narsapur",
      degree: "Bachelor of Technology",
      field: "Computer Science and Engineering (AI & ML)",
      degreeAbbr: "B.Tech CSE (AI/ML)",
      startYear: 2024,
      endYear: 2028,
      current: true,
      score: "9.12 CGPA",
      scoreType: "CGPA",
      coursework: [
        "Data Structures and Algorithms",
        "Design and Analysis of Algorithms",
        "Artificial Intelligence & Machine Learning Foundations",
        "Linear Algebra & Multivariable Calculus",
        "Object Oriented Programming through Java"
      ],
      achievements: [
        "Department rank #2 in current CSE academic semesters.",
        "First-place award at the intra-university DeepTech Hackathon 2025."
      ],
      order: 1
    }
  ],
  blogs: [
    {
      id: "b1",
      title: "Building a Modern Developer Portfolio: Swiss Brutalism with React 19",
      slug: "building-modern-developer-portfolio-swiss-brutalism",
      excerpt: "Explore how Swiss typography, modular grids, monochrome aesthetics, and Framer Motion culminate into a hypercontextual, elite developer portfolio designed to land recruiter offers.",
      content: `# Design and Implementation of Premium Portfolios

In a digital space saturated with default dashboard templates, rounded purple gradients, and generic UI structures, stepping back to **Brutalist grid disciplines** and raw typography layout creates immediate visual contrast.

## 1. Aesthetic Framework
The core color scheme relies on strict constraints:
- Main page background: \`#080808\`
- Card surfaced paneling: \`#111111\`
- Crisp structural line borders: \`#1f1f1f\`
- High-contrast typography colors: \`#f2f2f2\` vs \`#555555\`

By omitting saturated brand gradients, the developer communicates **discipline, precision, and architectural logic**.

\`\`\`tsx
export default function ProjectCard({ title, description }) {
  return (
    <div className="bg-[#111111] border border-[#1f1f1f] p-6 hover:border-[#ffffff20] transition duration-300">
      <h3 className="text-xl font-medium font-sans text-white mb-2">{title}</h3>
      <p className="text-sm font-sans text-gray-500 line-clamp-3">{description}</p>
    </div>
  );
}
\`\`\`

## 2. Animation Rhythm
Micro-interactions must remain humble. A custom cursor utilizing lerpin, subtle border expansions, and staggered translateY translations provide a reactive ecosystem for the recruiter.
`,
      tags: ["Web", "Design", "React"],
      category: "Frontend Dev",
      status: "published",
      readTime: 4,
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
      publishedAt: "2026-05-15T12:00:00Z"
    },
    {
      id: "b2",
      title: "Deep Learning Demystified: Constructing CNNs with PyTorch",
      slug: "deep-learning-demystified-constructing-cnns-pytorch",
      excerpt: "Step-by-step mathematical guide to building convolutional neural networks (CNNs), understanding pooling kernels, and tuning hyperparameters for custom vision diagnostics.",
      content: `# Understanding Convolutional Architectures

Convolutional Neural Networks (CNNs) emulate mammalian biological vision workflows. Instead of fully connected layers analyzing static flattened pixels, CNNs extract feature kernels locally.

## The Math Behind a Kernels Multiplier
Let $I$ represent the input matrix and $K$ denote the convolutional filter kernel of size $m \\times n$. The output feature map element $S(i,j)$ is mathematically derived as:

$$S(i,j) = (I * K)(i,j) = \\sum_{m} \\sum_{n} I(i-m, j-n) K(m,n)$$

## Building in Python

Here is a typical clean PyTorch structure for mapping diagnostic chest scans:

\`\`\`python
import torch
import torch.nn as nn
import torch.nn.functional as F

class PneumoniaNet(nn.Module):
    def __init__(self):
        super(PneumoniaNet, self).__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.fc1 = nn.Linear(64 * 56 * 56, 128)
        self.fc2 = nn.Linear(128, 2) # Binary: Normal vs Pneumonia

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1, 64 * 56 * 56)
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return x
\`\`\`

In the next article, we will go over loading custom chest X-ray datasets from Kaggle. See you there!
`,
      tags: ["AI/ML", "Python", "DeepLearning"],
      category: "AI/ML Engineering",
      status: "published",
      readTime: 6,
      coverImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80",
      publishedAt: "2026-05-28T14:30:00Z"
    }
  ],
  settings: {
    leetcodeUsername: "abhiram_tp",
    githubUsername: "abhiram-tp",
    sectionVisibility: {
      about: true,
      skills: true,
      projects: true,
      certifications: true,
      experience: true,
      education: true,
      leetcode: true,
      github: true,
      blog: true,
      contact: true
    },
    siteMeta: {
      pageTitle: "Tekulapalli Abhiram | Portfolio",
      metaDescription: "AI/ML Engineer and Full-Stack Developer Personal Portfolio.",
      faviconEmoji: "🖥️"
    },
    smtpConfig: {
      host: "smtp.gmail.com",
      port: 587,
      user: "pokephantom98765@gmail.com",
      pass: "",
      fromName: "Portfolio Portal",
      toEmail: "pokephantom98765@gmail.com"
    },
    socials: {
      github: "https://github.com/abhiram-tp",
      linkedin: "https://linkedin.com/in/tekula-palli-abhiram",
      instagram: "https://instagram.com/abhiram_tp",
      email: "pokephantom98765@gmail.com",
      twitter: "https://twitter.com/abhiram_tp"
    }
  }
};

class LocalDatabase {
  private data: DatabaseSchema;
  private mongoClient: MongoClient | null = null;
  private mongoCollection: any = null;

  constructor() {
    this.data = INITIAL_DB;
    this.init();
  }

  private async init() {
    // 1. Initial file loading (serves as immediate offline/dev default)
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        
        // Ensure settings visible sections has default if missing
        if (!this.data.settings) {
          this.data.settings = INITIAL_DB.settings;
        }
        // Force sync Admin credentials if none exist
        if (!this.data.adminHash) {
          this.data.adminHash = DEFAULT_HASH;
        }
      } else {
        this.saveToDisk();
      }
    } catch (err) {
      console.error("[DATABASE] Local database initialization error, using memory fallback.", err);
    }

    // 2. Dynamic MongoDB Cloud Sync
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      console.log("[DATABASE] MONGODB_URI environment variable detected. Connecting to Cloud Database...");
      try {
        const client = new MongoClient(mongoUri);
        await client.connect();
        
        const dbName = process.env.MONGODB_DB_NAME || 'portfolio_db';
        const collectionName = process.env.MONGODB_COLLECTION_NAME || 'portfolio_data';
        const collection = client.db(dbName).collection(collectionName);
        
        this.mongoClient = client;
        this.mongoCollection = collection;

        // Fetch existing cloud document
        const cloudDoc = await collection.findOne({ _id: 'main_portfolio_db' as any });
        if (cloudDoc) {
          console.log("[DATABASE] Successfully loaded and synchronized database from MongoDB Atlas!");
          const { _id, ...rest } = cloudDoc as any;
          this.data = rest as DatabaseSchema;
          
          // Double-check settings and adminHash are complete
          if (!this.data.settings) this.data.settings = INITIAL_DB.settings;
          if (!this.data.adminHash) this.data.adminHash = DEFAULT_HASH;
          
          // Restore resume.pdf from MongoDB binary base64 if present
          if (this.data.resumePdfBase64) {
            try {
              const buffer = Buffer.from(this.data.resumePdfBase64, 'base64');
              const folderPath = path.join(process.cwd(), 'data');
              if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
              }
              const filePath = path.join(folderPath, 'resume.pdf');
              fs.writeFileSync(filePath, buffer);
              console.log("[DATABASE] Restored resume.pdf dynamically from MongoDB Cloud data!");
            } catch (pdfErr) {
              console.error("[DATABASE] Failed to write resume.pdf on startup:", pdfErr);
            }
          }
          
          // Save a synchronized local disk copy to keep them aligned
          this.saveToDisk(true);
        } else {
          console.log("[DATABASE] No existing cloud document found. Initializing initial cloud database seed...");
          await collection.updateOne(
            { _id: 'main_portfolio_db' as any },
            { $set: { ...this.data } },
            { upsert: true }
          );
        }
      } catch (err) {
        console.error("[DATABASE] Failed to connect or synchronize with MongoDB, using local fallback:", err);
      }
    } else {
      console.log("[DATABASE] Running in Local Storage mode using 'data/database.json'. To persist changes on ephemeral servers (like Render or Vercel), provide 'MONGODB_URI' in environment variables.");
    }
  }

  private saveToDisk(skipCloud = false) {
    // Save to local disk
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error("[DATABASE] Failed to write database to disk:", err);
    }

    // Asynchronously save to MongoDB (non-blocking)
    if (!skipCloud && this.mongoCollection) {
      this.mongoCollection.updateOne(
        { _id: 'main_portfolio_db' as any },
        { $set: { ...this.data } },
        { upsert: true }
      ).then(() => {
        console.log("[DATABASE] Successfully synchronized update to cloud database!");
      }).catch((err: any) => {
        console.error("[DATABASE] Failed to synchronize update to cloud database:", err);
      });
    }
  }

  // Admin and auth
  public verifyPassword(password: string): boolean {
    return bcryptjs.compareSync(password, this.data.adminHash);
  }

  public updatePassword(newPassword: string) {
    this.data.adminHash = bcryptjs.hashSync(newPassword, 12);
    this.saveToDisk();
  }

  // Hero
  public getHero(): HeroData {
    return this.data.hero;
  }

  public updateHero(newHero: Partial<HeroData>) {
    this.data.hero = { ...this.data.hero, ...newHero };
    this.saveToDisk();
  }

  // About
  public getAbout(): AboutData {
    return this.data.about;
  }

  public updateAbout(newAbout: Partial<AboutData>) {
    this.data.about = { ...this.data.about, ...newAbout };
    this.saveToDisk();
  }

  // Skills
  public getSkills(): Skill[] {
    return this.data.skills.sort((a,b) => a.order - b.order);
  }

  public addSkill(name: string, category: string): Skill {
    const skillsInCategory = this.data.skills.filter(s => s.category === category);
    const maxOrder = skillsInCategory.reduce((max, s) => s.order > max ? s.order : max, 0);
    const newSkill: Skill = {
      id: 'sk_' + Math.random().toString(36).substr(2, 9),
      name,
      category,
      order: maxOrder + 1
    };
    this.data.skills.push(newSkill);
    this.saveToDisk();
    return newSkill;
  }

  public deleteSkill(id: string) {
    this.data.skills = this.data.skills.filter(s => s.id !== id);
    this.saveToDisk();
  }

  public reorderSkills(skills: Skill[]) {
    // Merge order updates based on id matching
    skills.forEach(updatedSkill => {
      const idx = this.data.skills.findIndex(s => s.id === updatedSkill.id);
      if (idx !== -1) {
        this.data.skills[idx].order = updatedSkill.order;
        this.data.skills[idx].category = updatedSkill.category;
      }
    });
    this.saveToDisk();
  }

  // Projects
  public getProjects(): Project[] {
    return this.data.projects.sort((a,b) => a.order - b.order);
  }

  public addProject(proj: Omit<Project, 'id'>): Project {
    const maxOrder = this.data.projects.reduce((max, p) => p.order > max ? p.order : max, 0);
    const newProject: Project = {
      ...proj,
      id: 'pr_' + Math.random().toString(36).substr(2, 9),
      order: maxOrder + 1,
      createdAt: new Date().toISOString()
    };
    this.data.projects.push(newProject);
    this.saveToDisk();
    return newProject;
  }

  public updateProject(id: string, updated: Partial<Project>): Project {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Project not found");
    this.data.projects[idx] = { ...this.data.projects[idx], ...updated };
    this.saveToDisk();
    return this.data.projects[idx];
  }

  public deleteProject(id: string) {
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    this.saveToDisk();
  }

  public reorderProjects(orders: { id: string; order: number }[]) {
    orders.forEach(({ id, order }) => {
      const p = this.data.projects.find(proj => proj.id === id);
      if (p) p.order = order;
    });
    this.saveToDisk();
  }

  // Certifications
  public getCertifications(): Certification[] {
    return this.data.certifications.sort((a,b) => a.order - b.order);
  }

  public addCertification(cert: Omit<Certification, 'id'>): Certification {
    const maxOrder = this.data.certifications.reduce((max, c) => c.order > max ? c.order : max, 0);
    const newCert: Certification = {
      ...cert,
      id: 'cr_' + Math.random().toString(36).substr(2, 9),
      order: maxOrder + 1
    };
    this.data.certifications.push(newCert);
    this.saveToDisk();
    return newCert;
  }

  public updateCertification(id: string, updated: Partial<Certification>): Certification {
    const idx = this.data.certifications.findIndex(c => c.id === id);
    if (idx === -1) throw new Error("Certification not found");
    this.data.certifications[idx] = { ...this.data.certifications[idx], ...updated };
    this.saveToDisk();
    return this.data.certifications[idx];
  }

  public deleteCertification(id: string) {
    this.data.certifications = this.data.certifications.filter(c => c.id !== id);
    this.saveToDisk();
  }

  // Experience
  public getExperiences(): Experience[] {
    return this.data.experience.sort((a,b) => a.order - b.order);
  }

  public addExperience(exp: Omit<Experience, 'id'>): Experience {
    const maxOrder = this.data.experience.reduce((max, e) => e.order > max ? e.order : max, 0);
    const newExp: Experience = {
      ...exp,
      id: 'ex_' + Math.random().toString(36).substr(2, 9),
      order: maxOrder + 1
    };
    this.data.experience.push(newExp);
    this.saveToDisk();
    return newExp;
  }

  public updateExperience(id: string, updated: Partial<Experience>): Experience {
    const idx = this.data.experience.findIndex(e => e.id === id);
    if (idx === -1) throw new Error("Experience not found");
    this.data.experience[idx] = { ...this.data.experience[idx], ...updated };
    this.saveToDisk();
    return this.data.experience[idx];
  }

  public deleteExperience(id: string) {
    this.data.experience = this.data.experience.filter(e => e.id !== id);
    this.saveToDisk();
  }

  // Education
  public getEducations(): Education[] {
    return this.data.education.sort((a,b) => a.order - b.order);
  }

  public addEducation(edu: Omit<Education, 'id'>): Education {
    const maxOrder = this.data.education.reduce((max, e) => e.order > max ? e.order : max, 0);
    const newEdu: Education = {
      ...edu,
      id: 'ed_' + Math.random().toString(36).substr(2, 9),
      order: maxOrder + 1
    };
    this.data.education.push(newEdu);
    this.saveToDisk();
    return newEdu;
  }

  public updateEducation(id: string, updated: Partial<Education>): Education {
    const idx = this.data.education.findIndex(e => e.id === id);
    if (idx === -1) throw new Error("Education not found");
    this.data.education[idx] = { ...this.data.education[idx], ...updated };
    this.saveToDisk();
    return this.data.education[idx];
  }

  public deleteEducation(id: string) {
    this.data.education = this.data.education.filter(e => e.id !== id);
    this.saveToDisk();
  }

  // Blogs
  public getBlogs(): Blog[] {
    const list = this.data.blogs.map(b => ({
      ...b,
      category: b.category || b.tags[0] || 'Engineering'
    }));
    return list.sort((a,b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  public getBlogBySlug(slug: string): Blog | undefined {
    const b = this.data.blogs.find(b => b.slug === slug);
    if (!b) return undefined;
    return {
      ...b,
      category: b.category || b.tags[0] || 'Engineering'
    };
  }

  public addBlog(blog: Omit<Blog, 'id' | 'slug' | 'readTime'>): Blog {
    const slug = blog.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    // Simple words estimate for read-time
    const words = blog.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.round(words / 200));

    const newBlog: Blog = {
      ...blog,
      id: 'bl_' + Math.random().toString(36).substr(2, 9),
      slug,
      readTime,
      createdAt: new Date().toISOString()
    };
    this.data.blogs.push(newBlog);
    this.saveToDisk();
    return newBlog;
  }

  public updateBlog(id: string, updated: Partial<Blog>): Blog {
    const idx = this.data.blogs.findIndex(b => b.id === id);
    if (idx === -1) throw new Error("Blog not found");

    const merged = { ...this.data.blogs[idx], ...updated };
    
    if (updated.title) {
      merged.slug = updated.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (updated.content) {
      const words = updated.content.split(/\s+/).length;
      merged.readTime = Math.max(1, Math.round(words / 200));
    }

    this.data.blogs[idx] = merged;
    this.saveToDisk();
    return merged;
  }

  public deleteBlog(id: string) {
    this.data.blogs = this.data.blogs.filter(b => b.id !== id);
    this.saveToDisk();
  }

  // Settings
  public getSettings(): SettingsData {
    return this.data.settings;
  }

  public updateSettings(updated: Partial<SettingsData>) {
    this.data.settings = { ...this.data.settings, ...updated };
    this.saveToDisk();
  }

  // Backup and restore
  public exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public importData(jsonString: string) {
    try {
      const parsed = JSON.parse(jsonString);
      if (
        parsed.hero && 
        parsed.about && 
        parsed.skills && 
        parsed.projects && 
        parsed.certifications && 
        parsed.experience && 
        parsed.education && 
        parsed.blogs && 
        parsed.settings
      ) {
        this.data = parsed;
        this.saveToDisk();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to import JSON data:", err);
      return false;
    }
  }

  public saveResumePdf(base64Str: string) {
    this.data.resumePdfBase64 = base64Str;
    this.saveToDisk();
  }

  public resetToDefaults() {
    this.data = {
      ...INITIAL_DB,
      adminHash: this.data.adminHash // preserve password hash
    };
    this.saveToDisk();
  }
}

export const db = new LocalDatabase();
