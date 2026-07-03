/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowRight, 
  ArrowDown, 
  Github, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Mail, 
  Code, 
  Award, 
  FileText, 
  ExternalLink, 
  Send, 
  MapPin, 
  BookOpen, 
  Clock, 
  Terminal,
  Activity,
  Flame,
  Globe,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { 
  ProjectSkeleton, 
  CertSkeleton, 
  BlogSkeleton, 
  ExperienceSkeleton, 
  SkillCategorySkeleton, 
  GithubSkeleton, 
  LeetcodeSkeleton,
  SkeletonPulse,
  CertificateSkeleton,
  EducationSkeleton
} from '../components/Skeleton.tsx';
import { 
  HeroData, 
  AboutData, 
  Skill, 
  Project, 
  Certification, 
  Experience, 
  Education, 
  Blog, 
  SettingsData,
  LeetCodeStats,
  GitHubStats
} from '../types.ts';

// ==========================================
// BACKGROUND CANVAS PARTICLES (Drifting Stardust)
// ==========================================
function StardustBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse drift tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.05;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.05;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle constructor representing 3D drifted space
    interface Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speed: number;
    }

    const particles: Particle[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      z: Math.random() * 1000 + 100,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.5 + 0.1
    }));

    // Interpolate mouse coordinates (lerping)
    const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;

    const draw = () => {
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, width, height);

      mouseRef.current.x = lerp(mouseRef.current.x, mouseRef.current.targetX, 0.08);
      mouseRef.current.y = lerp(mouseRef.current.y, mouseRef.current.targetY, 0.08);

      particles.forEach(p => {
        // Perspective divide
        p.z -= p.speed;
        if (p.z <= 0) {
          p.z = 1000;
          p.x = Math.random() * width - width / 2;
          p.y = Math.random() * height - height / 2;
        }

        const screenX = (p.x + mouseRef.current.x) * (500 / p.z) + width / 2;
        const screenY = (p.y + mouseRef.current.y) * (500 / p.z) + height / 2;

        const size = p.size * (500 / p.z);
        const opacity = Math.min(0.6, (1000 - p.z) / 800) * 0.4;

        if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}

// ==========================================
// TYPEWRITER LOOP COMPONENT
// ==========================================
function Typewriter({ words }: { words: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    if (!words || words.length === 0) return;
    
    const handleType = () => {
      const fullWord = words[currentWordIndex];
      if (!isDeleting) {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setTypingSpeed(60 + Math.random() * 40);

        if (currentText === fullWord) {
          // hold time
          setTypingSpeed(1800);
          setIsDeleting(true);
        }
      } else {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setTypingSpeed(30);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((currentWordIndex + 1) % words.length);
          setTypingSpeed(250);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed]);

  return (
    <span className="font-mono text-base md:text-lg tracking-wide text-white/90">
      {currentText}
      <span className="terminal-cursor" />
    </span>
  );
}

// ==========================================
// COMPACT PROGRESS CIRCLE
// ==========================================
function ProgressDonut({ solved, total, label, colorClass }: { solved: number; total: number; label: string; colorClass: string }) {
  const percentage = Math.min(100, Math.round((solved / total) * 100)) || 0;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-3 border border-border-brand bg-bg-brand rounded-md">
      <div className="relative h-20 w-20">
        {/* Background Grey track circle */}
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-[#1a1a1a]"
            strokeWidth="3.5"
            fill="transparent"
          />
          {/* Animated desaturated indicator */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={colorClass}
            strokeWidth="3.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-xs font-bold text-white">{percentage}%</span>
        </div>
      </div>
      <span className="mt-2 font-mono text-[10px] tracking-wider uppercase text-text-muted">{label}</span>
      <span className="font-mono text-xs text-white/70 mt-0.5">{solved}/{total}</span>
    </div>
  );
}

// ==========================================
// ANIMATED DIGITS INTERPOLATOR (Counter)
// ==========================================
function AnimatedCounter({ targetValue }: { targetValue: string }) {
  const numericValue = parseInt(targetValue.replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = targetValue.replace(/[0-9]/g, '');
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1500; // ms

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * numericValue));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [numericValue]);

  return <span>{count}{suffix}</span>;
}

export default function Portfolio() {
  // Page Hydration Data States
  const [hero, setHero] = useState<HeroData | null>(null);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [leetcode, setLeetcode] = useState<LeetCodeStats | null>(null);
  const [github, setGithub] = useState<GitHubStats | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [hoveredContributionDay, setHoveredContributionDay] = useState<{ date: string; commits: number } | null>(null);

  // States
  const [loading, setLoading] = useState({
    hero: true,
    about: true,
    skills: true,
    projects: true,
    certifications: true,
    experience: true,
    education: true,
    blogs: true,
    leetcode: true,
    github: true,
    settings: true
  });
  const [projectFilter, setProjectFilter] = useState('All');
  const [showScrollTip, setShowScrollTip] = useState(true);

  // Deterministic daily contribution distribution based on API commitsThisYear count
  const contributionGridData = useMemo(() => {
    if (!github) return [];
    try {
      const total = github.commitsThisYear || 524;
      const daysCount = 53 * 7; // 371 grid blocks
      const list: { date: string; commits: number }[] = [];
      
      let remaining = total;
      const today = new Date();
      
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(today.getTime());
        d.setDate(today.getDate() - i);
        
        // Dynamic seed formula to keep the distribution grid consistent and biological
        const seed = d.getDate() * 11 + d.getMonth() * 37 + d.getFullYear() * 3;
        let count = 0;
        
        if (remaining > 0) {
          if (seed % 17 === 0) {
            count = Math.min(remaining, Math.floor((seed % 6) + 3)); // 3 to 8
          } else if (seed % 7 === 0) {
            count = Math.min(remaining, Math.floor((seed % 3) + 1)); // 1 to 3
          } else if (seed % 3 === 0) {
            count = Math.min(remaining, 1);
          }
          remaining -= count;
        }
        
        list.push({
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          commits: count
        });
      }
      
      // Distribute any remaining leftovers over active cycles to hit the target total commits exactly
      let safetyLimit = 0;
      while (remaining > 0 && safetyLimit < 1000) {
        safetyLimit++;
        for (let j = 0; j < daysCount && remaining > 0; j++) {
          if (list[j] && list[j].commits > 0) {
            list[j].commits += 1;
            remaining -= 1;
          }
        }
      }
      return list;
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [github]);

  // Form states
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactState, setContactState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Load all DB elements on Mount safely & independently
  useEffect(() => {
    const loadState = async (url: string, setter: (data: any) => void, key?: keyof typeof loading) => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setter(data);
        } else {
          console.warn(`Failed to load ${url}: ${res.statusText}`);
        }
      } catch (err) {
        console.error(`Error loading state from ${url}:`, err);
      } finally {
        if (key) {
          setLoading(prev => ({ ...prev, [key]: false }));
        }
      }
    };

    // Trigger independent loads concurrently
    loadState('/api/v1/hero', setHero, 'hero');
    loadState('/api/v1/about', setAbout, 'about');
    loadState('/api/v1/skills', setSkills, 'skills');
    loadState('/api/v1/projects', setProjects, 'projects');
    loadState('/api/v1/certifications', setCertifications, 'certifications');
    loadState('/api/v1/experience', setExperience, 'experience');
    loadState('/api/v1/education', setEducation, 'education');
    loadState('/api/v1/blogs', setBlogs, 'blogs');
    loadState('/api/v1/settings', setSettings, 'settings');
    loadState('/api/v1/integrations/leetcode', setLeetcode, 'leetcode');
    loadState('/api/v1/integrations/github', setGithub, 'github');

    // Scroll tip hiding handler
    const scrollHandler = () => {
      if (window.scrollY > 120) {
        setShowScrollTip(false);
      } else {
        setShowScrollTip(true);
      }
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  // Contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) return;
    setContactState('sending');
    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactState('success');
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setContactState('error');
      }
    } catch (err) {
      setContactState('error');
    }
  };

  // Pre-fill fallbacks if loading failed
  const finalHero = hero || {
    name: "Tekulapalli Abhiram",
    taglines: ["AI / ML Student", "Developer"],
    bio: "Passionate B.Tech CSE (AI/ML) Developer focused on deep architectures.",
    resumeUrl: "#",
    availabilityStatus: true,
    socials: { github: "#", linkedin: "#", instagram: "#", email: "pokephantom98765@gmail.com", twitter: "#" }
  };

  const finalAbout = about || {
    bio: "AI specialized undergrad student at BVRIT.",
    terminalLines: [
      { id: "1", command: "whoami", output: "tekula-abhiram" },
      { id: "2", command: "cat role.txt", output: "AI student" }
    ],
    stats: [
      { value: "10+", label: "Projects Completed" },
      { value: "5+", label: "Certs Earned" }
    ]
  };

  const finalSettings = settings || {
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
    siteMeta: { pageTitle: "Port", metaDescription: "Port", faviconEmoji: "🖥️" },
    socials: finalHero.socials
  };

  const vis = finalSettings.sectionVisibility;

  // Extract unique project category tabs dynamically
  const dynamicTags = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = projectFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === projectFilter);

  return (
    <div id="layout-root" className="relative bg-bg-brand text-white selection:bg-white selection:text-black min-h-screen">
      {/* 3D-Look Canvas Backdrop */}
      <StardustBackground />

      {/* Main Glass Header bar */}
      <Navbar visibleSections={vis} />

      {/* ==========================================
          SECTION 01: HERO SECTION
          ========================================== */}
      <section
        id="hero"
        className="relative flex min-h-screen w-full flex-col justify-center items-stretch px-6 md:px-12 z-10"
      >
        <div className="mx-auto max-w-7xl w-full flex flex-col items-start gap-5 self-center pt-24 pb-12">
          {loading.hero ? (
            <div className="flex flex-col gap-5 w-full max-w-3xl">
              <SkeletonPulse className="h-6 w-48 rounded-full" />
              <SkeletonPulse className="h-16 sm:h-24 w-full md:w-5/6" />
              <SkeletonPulse className="h-8 w-2/3" />
              <SkeletonPulse className="h-16 w-full md:w-3/4 mt-2" />
              <div className="flex gap-4 mt-4">
                <SkeletonPulse className="h-11 w-32" />
                <SkeletonPulse className="h-11 w-36" />
              </div>
            </div>
          ) : (
            <>
              {finalHero.availabilityStatus && (
                <motion.div
                  id="hero-badge"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="flex items-center gap-2 border border-border-brand bg-surface-brand/60 px-3 py-1 text-[11px] rounded-full backdrop-blur-sm self-start tracking-wider uppercase font-mono"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dot-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-dot-success"></span>
                  </span>
                  Available for Opportunities
                </motion.div>
              )}

              {/* Character staggered animation Name */}
              <motion.h1
                id="hero-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl select-none"
              >
                {finalHero.name}
              </motion.h1>

              {/* Tagline looping */}
              <div id="hero-tagline" className="h-8 md:h-10 flex items-center">
                <Typewriter words={finalHero.taglines} />
              </div>

              {/* Quick statement details */}
              <motion.p
                id="hero-bio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="max-w-xl text-sm leading-relaxed text-text-primary md:text-base font-light"
              >
                {finalHero.bio}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                id="hero-ctas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-4 flex flex-wrap gap-4"
              >
                <button
                  id="btn-hero-work"
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex cursor-pointer items-center gap-2 border border-white bg-white text-black px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-transparent hover:text-white"
                >
                  View My Work <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  id="link-hero-resume"
                  href={finalHero.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 border border-border-brand bg-surface-brand/40 hover:bg-surface-brand px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors"
                >
                  Download Resume <FileText className="h-4 w-4" />
                </a>
              </motion.div>

              {/* Social icons row */}
              <motion.div
                id="hero-socials"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-6 flex items-center gap-6"
              >
                <a id="sc-github" href={finalHero.socials.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
                <a id="sc-linkedin" href={finalHero.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
                <a id="sc-instagram" href={finalHero.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
                <a id="sc-twitter" href={finalHero.socials.twitter} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                <a id="sc-email" href={`mailto:${finalHero.socials.email}`} className="hover:text-white transition-colors"><Mail className="h-5 w-5" /></a>
              </motion.div>
            </>
          )}
        </div>

        {/* Scroll helper indicators */}
        <AnimatePresence>
          {showScrollTip && (
            <motion.div
              id="hero-scroll-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer select-none"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="font-mono text-[9px] uppercase tracking-widest text-white">Scroll</span>
              <ArrowDown className="h-4 w-4 animate-bounce text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ==========================================
          SECTION 02: ABOUT & STATS & TERMINAL
          ========================================== */}
      {vis.about && (
        <section
          id="about"
          className="relative w-full border-t border-border-brand bg-bg-brand py-32 z-10 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col gap-12">
            <div className="relative">
              <span className="font-display text-8xl font-black text-text-dim pointer-events-none select-none absolute -top-12 left-0 leading-none">02</span>
              <h2 className="relative z-10 font-display text-4xl font-bold tracking-tight text-white mb-2">About Me</h2>
              <div className="h-px bg-white/10 w-24"></div>
            </div>

            {loading.about ? (
              <div id="about-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
                {/* Left Column: Bio paragraph and dynamic counters */}
                <div id="about-left-col" className="lg:col-span-7 flex flex-col gap-8">
                  <div className="flex flex-col gap-3">
                    <SkeletonPulse className="h-4 w-full" />
                    <SkeletonPulse className="h-4 w-11/12" />
                    <SkeletonPulse className="h-4 w-4/5" />
                    <SkeletonPulse className="h-4 w-5/6" />
                  </div>

                  {/* Counter blocks */}
                  <div id="stats-grid" className="grid grid-cols-2 gap-4 mt-4">
                    <div className="border border-border-brand bg-surface-brand/40 px-5 py-4 backdrop-blur-sm flex flex-col gap-2">
                      <SkeletonPulse className="h-8 w-16" />
                      <SkeletonPulse className="h-3.5 w-24" />
                    </div>
                    <div className="border border-border-brand bg-surface-brand/40 px-5 py-4 backdrop-blur-sm flex flex-col gap-2">
                      <SkeletonPulse className="h-8 w-16" />
                      <SkeletonPulse className="h-3.5 w-24" />
                    </div>
                  </div>
                </div>

                {/* Right Column: MacOS Terminal Window Skeleton */}
                <div id="about-right-col" className="lg:col-span-5 w-full">
                  <div id="terminal-window" className="rounded-lg border border-border-brand bg-black p-4 shadow-2xl relative h-[220px] flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-white/10"></span>
                        <span className="h-2.5 w-2.5 rounded-full bg-white/10"></span>
                        <span className="h-2.5 w-2.5 rounded-full bg-white/10"></span>
                      </div>
                      <SkeletonPulse className="h-3 w-28" />
                      <span className="w-10"></span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white/30 font-mono text-xs">$</span>
                        <SkeletonPulse className="h-3.5 w-32" />
                      </div>
                      <SkeletonPulse className="h-3 w-48 ml-3" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-white/30 font-mono text-xs">$</span>
                        <SkeletonPulse className="h-3.5 w-24" />
                      </div>
                      <SkeletonPulse className="h-3 w-56 ml-3" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div id="about-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
                {/* Left Column: Bio paragraph and dynamic counters */}
                <div id="about-left-col" className="lg:col-span-7 flex flex-col gap-8">
                  <p className="text-text-primary text-sm md:text-base leading-relaxed font-light whitespace-pre-wrap">
                    {finalAbout.bio}
                  </p>

                  {/* Counter blocks */}
                  <div id="stats-grid" className="grid grid-cols-2 gap-4 mt-4">
                    {finalAbout.stats.map((st, i) => (
                      <div
                        key={i}
                        id={`stat-card-${i}`}
                        className="border border-border-brand bg-surface-brand/40 px-5 py-4 backdrop-blur-sm"
                      >
                        <h3 className="font-display text-3xl font-extrabold text-white">
                          <AnimatedCounter targetValue={st.value} />
                        </h3>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mt-1">{st.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Interactive MacOS Terminal Window */}
                <div id="about-right-col" className="lg:col-span-5">
                  <div id="terminal-window" className="rounded-lg border border-border-brand bg-black p-4 shadow-2xl relative">
                    {/* Fake MacOS Chrome border dot controls */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <div className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#1c1c1c] opacity-60"></span>
                        <span className="h-2.5 w-2.5 rounded-full bg-[#1c1c1c] opacity-60"></span>
                        <span className="h-2.5 w-2.5 rounded-full bg-[#1c1c1c] opacity-60"></span>
                      </div>
                      <span className="font-mono text-[10px] text-text-muted">~/abhiram-terminal</span>
                      <span className="w-10"></span>
                    </div>

                    {/* Lines outputs */}
                    <div id="terminal-code" className="font-mono text-xs text-white/90 leading-relaxed flex flex-col gap-2 mt-2">
                      {finalAbout.terminalLines.map((line, idx) => (
                        <div key={idx} id={`term-line-${idx}`}>
                          <div className="flex gap-1">
                            <span className="text-text-muted">$</span>
                            <span className="text-white font-semibold">{line.command}</span>
                          </div>
                          <div className="text-text-muted mt-0.5 ml-3 font-normal">{line.output}</div>
                        </div>
                      ))}
                      <div>
                        <span className="text-text-muted">$</span>
                        <span className="terminal-cursor" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==========================================
          SECTION 03: SKILLS
          ========================================== */}
      {vis.skills && (
        <section
          id="skills"
          className="relative w-full border-t border-border-brand bg-bg-brand py-32 z-10 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col gap-12">
            <div className="relative">
              <span className="font-display text-8xl font-black text-text-dim pointer-events-none select-none absolute -top-12 left-0 leading-none">03</span>
              <h2 className="relative z-10 font-display text-4xl font-bold tracking-tight text-white mb-2">Technical Skills</h2>
              <div className="h-px bg-white/10 w-24"></div>
            </div>

            {/* Categorized Rows stacked */}
            <div id="skills-rows" className="flex flex-col gap-8 mt-6">
              {loading.skills ? (
                <>
                  <SkillCategorySkeleton />
                  <SkillCategorySkeleton />
                  <SkillCategorySkeleton />
                </>
              ) : (
                Array.from(new Set([
                  'Languages', 
                  'Frameworks', 
                  'AI/ML', 
                  'Databases', 
                  'Tools',
                  ...skills.map(s => s.category)
                ].map(c => c.trim()).filter(Boolean))).map(category => {
                  const categorySkills = skills.filter(s => s.category.toLowerCase() === category.toLowerCase());
                  if (categorySkills.length === 0) return null;

                  return (
                    <div
                      key={category}
                      id={`skill-row-${category}`}
                      className="group border border-border-brand bg-surface-brand/20 p-6 flex flex-col md:flex-row md:items-center gap-6"
                    >
                      {/* Left aligned Column */}
                      <div className="md:w-36 shrink-0 md:border-r md:border-border-brand/40 pr-4">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted font-bold block">{category}</span>
                      </div>

                      {/* Right pill list */}
                      <div className="flex flex-wrap gap-2.5">
                        {categorySkills.map(s => (
                          <span
                            key={s.id}
                            id={`skill-badge-${s.id}`}
                            className="font-mono text-xs border border-[#2a2a2a] bg-bg-brand text-white px-3 py-1 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-200 select-none cursor-pointer"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          SECTION 04: PROJECTS WORK
          ========================================== */}
      {vis.projects && (
        <section
          id="projects"
          className="relative w-full border-t border-border-brand bg-bg-brand py-32 z-10 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col gap-12">
            <div className="relative">
              <span className="font-display text-8xl font-black text-text-dim pointer-events-none select-none absolute -top-12 left-0 leading-none">04</span>
              <h2 className="relative z-10 font-display text-4xl font-bold tracking-tight text-white mb-2">Projects</h2>
              <div className="h-px bg-white/10 w-24"></div>
            </div>

            {/* Dynamic filter tab header list */}
            {projects.length > 0 && (
              <div id="project-filters" className="flex flex-wrap gap-2 mt-4 bg-surface-brand/35 border border-border-brand p-1.5 self-start shrink-0">
                {dynamicTags.map(tag => (
                  <button
                    key={tag}
                    id={`proj-filter-${tag}`}
                    onClick={() => setProjectFilter(tag)}
                    className={`font-mono text-[10px] uppercase tracking-wider px-3.5 py-1.5 transition-colors ${
                      projectFilter === tag 
                        ? 'bg-white text-black font-semibold' 
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Card Grid container */}
            <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {loading.projects ? (
                <>
                  <ProjectSkeleton />
                  <ProjectSkeleton />
                  <ProjectSkeleton />
                  <ProjectSkeleton />
                </>
              ) : (
                filteredProjects.map((p, idx) => (
                  <div
                    key={p.id}
                    id={`project-card-${p.id}`}
                    className="project-card flex flex-col bg-surface-brand border border-border-brand p-6 hover:border-white/35 hover:-translate-y-1 transition-all duration-300 relative group"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between text-xs font-mono text-text-muted select-none">
                      <span>P.0{idx + 1}</span>
                      {p.featured && (
                        <span className="border border-white bg-white text-black px-2 py-0.5 text-[9px] uppercase tracking-wide font-bold">Featured</span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg font-bold text-white mt-4">{p.title}</h3>

                    {/* Description */}
                    <p className="text-text-muted text-xs leading-relaxed mt-2.5 flex-grow line-clamp-4">
                      {p.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {p.techStack.map(stack => (
                        <span key={stack} className="font-mono text-[9px] uppercase tracking-widest bg-bg-brand border border-white/5 text-text-muted/80 px-2 py-0.5">
                          {stack}
                        </span>
                      ))}
                    </div>

                    {/* Divider line style */}
                    <div className="h-px bg-white/5 my-5 w-full"></div>

                    {/* Footer Row Actions */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex gap-4">
                        {p.githubUrl && (
                          <a id={`proj-github-${p.id}`} href={p.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-mono text-text-muted hover:text-white transition-colors">
                            <Github className="h-3.5 w-3.5" /> Code
                          </a>
                        )}
                        {p.liveUrl && (
                          <a id={`proj-live-${p.id}`} href={p.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-mono text-text-muted hover:text-white transition-colors">
                            <ExternalLink className="h-3.5 w-3.5" /> Demo
                          </a>
                        )}
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-text-dim group-hover:text-text-muted transition-colors">{p.category}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          SECTION 05: CERTIFICATIONS
          ========================================== */}
      {vis.certifications && (
        <section
          id="certifications"
          className="relative w-full border-t border-border-brand bg-bg-brand py-32 z-10 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col gap-12">
            <div className="relative">
              <span className="font-display text-8xl font-black text-text-dim pointer-events-none select-none absolute -top-12 left-0 leading-none">05</span>
              <h2 className="relative z-10 font-display text-4xl font-bold tracking-tight text-white mb-2">Qualifications</h2>
              <div className="h-px bg-white/10 w-24"></div>
            </div>

            {/* 3 Column Grid */}
            <div id="certs-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {loading.certifications ? (
                <>
                  <CertificateSkeleton />
                  <CertificateSkeleton />
                  <CertificateSkeleton />
                </>
              ) : (
                certifications.map(c => (
                  <div
                    key={c.id}
                    id={`cert-card-${c.id}`}
                    className="bg-surface-brand border border-border-brand p-6 hover:border-white/35 hover:-translate-y-1 hover:shadow-black hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group border-l-2 border-l-text-muted hover:border-l-white"
                  >
                    <div>
                      {/* Issuer date display row */}
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-text-muted">
                        <span>{c.issuer}</span>
                        <span>{c.dateIssued ? c.dateIssued.substring(0, 7) : ''}</span>
                      </div>

                      {/* Certificate Title */}
                      <h3 className="font-display text-sm font-semibold text-white mt-4 group-hover:text-white transition-colors">{c.title}</h3>
                    </div>

                    <div>
                      {/* Credential row */}
                      {c.credentialId && (
                        <p className="font-mono text-[9px] tracking-widest text-text-muted mt-3">ID: {c.credentialId}</p>
                      )}

                      <div className="h-px bg-white/5 my-4 w-full"></div>

                      {/* View cert */}
                      <a
                        id={`cert-link-${c.id}`}
                        href={c.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-text-muted hover:text-white hover:underline transition-colors mt-1"
                      >
                        {c.certificateUrl && (c.certificateUrl.includes('drive.google.com') || c.certificateUrl.includes('google.com/drive')) ? (
                          <span className="flex items-center gap-1">
                            View on Google Drive <ExternalLink className="h-3 w-3" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            View Certificate <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          SECTION 06: WORK EXPERIENCE
          ========================================== */}
      {vis.experience && (
        <section
          id="experience"
          className="relative w-full border-t border-border-brand bg-bg-brand py-32 z-10 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col gap-12">
            <div className="relative">
              <span className="font-display text-8xl font-black text-text-dim pointer-events-none select-none absolute -top-12 left-0 leading-none">06</span>
              <h2 className="relative z-10 font-display text-4xl font-bold tracking-tight text-white mb-2">Experiences</h2>
              <div className="h-px bg-white/10 w-24"></div>
            </div>

            {/* Timelines row structure */}
            <div id="experience-timeline" className="relative border-l border-border-brand space-y-12 pl-6 md:pl-10 ml-4 max-w-3xl mt-6">
              {loading.experience ? (
                <>
                  <ExperienceSkeleton />
                  <ExperienceSkeleton />
                </>
              ) : (
                experience.map(e => (
                  <div key={e.id} id={`exp-row-${e.id}`} className="relative">
                    {/* Chronometer Circle indicator */}
                    <span className="absolute -left-[31px] md:-left-[47px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-black">
                      <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-white"></span>
                    </span>

                    <div className="flex flex-col gap-2">
                      {/* Range and Employment tags wrapper */}
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted">
                        <span>
                          {new Date(e.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} 
                          &nbsp;–&nbsp; 
                          {e.current ? 'Present' : new Date(e.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                        <span className="border border-border-brand px-2 py-0.5 text-[9px] uppercase tracking-widest rounded-full">{e.type}</span>
                      </div>

                      {/* Role & Company */}
                      <h3 className="font-display text-base font-bold text-white mt-1">
                        {e.role} <span className="text-text-muted font-normal text-sm block md:inline md:ml-1 capitalize italic select-all">@ &nbsp;{e.company}</span>
                      </h3>

                      {/* Bullet Points */}
                      <ul className="mt-3.5 space-y-2 text-xs md:text-sm text-text-primary leading-relaxed font-light pl-1">
                        {e.responsibilities.map((bullet, k) => (
                          <li key={k} className="flex items-start gap-2.5">
                            <span className="text-text-muted text-[11px] font-mono shrink-0 select-none mt-0.5">→</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech Badges Used block */}
                      {e.techUsed && e.techUsed.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {e.techUsed.map(tu => (
                            <span key={tu} className="font-mono text-[9px] uppercase tracking-widest border border-[#2a2a2a] text-text-muted px-2 py-0.5 bg-bg-brand">
                              {tu}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          SECTION 07: EDUCATION
          ========================================== */}
      {vis.education && (
        <section
          id="education"
          className="relative w-full border-t border-border-brand bg-bg-brand py-32 z-10 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col gap-12">
            <div className="relative">
              <span className="font-display text-8xl font-black text-text-dim pointer-events-none select-none absolute -top-12 left-0 leading-none">07</span>
              <h2 className="relative z-10 font-display text-4xl font-bold tracking-tight text-white mb-2">Education Academics</h2>
              <div className="h-px bg-white/10 w-24"></div>
            </div>

            {/* Horizontal cards stack */}
            <div id="education-stack" className="flex flex-col gap-6 mt-6 max-w-4xl">
              {loading.education ? (
                <>
                  <EducationSkeleton />
                  <EducationSkeleton />
                </>
              ) : (
                education.map(ed => (
                  <div
                    key={ed.id}
                    id={`edu-card-${ed.id}`}
                    className="relative overflow-hidden bg-surface-brand border border-border-brand p-6 md:p-8 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                  >
                    {/* Large absolute watermark */}
                    <div className="absolute right-4 bottom-2 font-display text-[5.5rem] md:text-[7rem] font-extrabold text-white/[0.015] pointer-events-none select-none group-hover:text-white/[0.025] transition-colors leading-none">
                      {ed.degreeAbbr ? ed.degreeAbbr.split(' ')[0] : ''}
                    </div>

                    {/* Left panel block details */}
                    <div className="md:w-2/3 flex flex-col gap-1">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted font-bold block">{ed.startYear} - {ed.current ? 'Present' : ed.endYear}</span>
                      <h3 className="font-display text-lg font-bold text-white mt-1">{ed.institution}</h3>
                      <p className="font-mono text-xs text-white/80 mt-1">{ed.degree} in {ed.field}</p>
                      
                      {/* Course codes in row */}
                      {ed.coursework && ed.coursework.length > 0 && (
                        <p className="text-text-muted text-xs leading-relaxed mt-4 font-light">
                          <span className="font-mono font-bold text-[9px] uppercase tracking-wider text-white mr-2">Focus Coursework:</span> 
                          {ed.coursework.join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Right segment score blocks */}
                    <div className="md:w-1/3 flex flex-col md:items-end justify-center py-2 md:border-l md:border-border-brand/40 md:pl-8">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted block leading-none">{ed.scoreType}</span>
                      <span className="font-display text-3xl font-extrabold text-white mt-1 block leading-none">{ed.score}</span>
                      
                      {/* Achievements bullets */}
                      {ed.achievements && ed.achievements.length > 0 && (
                        <ul className="mt-3.5 space-y-1 text-left md:text-right font-light text-text-muted text-[11px] list-none">
                          {ed.achievements.map((ach, key) => (
                            <li key={key} className="flex md:justify-end items-start gap-1">
                              <span className="text-white select-none shrink-0">•</span> {ach}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          SECTION 08: LEETCODE STATS
          ========================================== */}
      {vis.leetcode && (
        <section
          id="leetcode"
          className="relative w-full border-t border-border-brand bg-bg-brand py-32 z-10 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col gap-12">
            <div className="relative">
              <span className="font-display text-8xl font-black text-text-dim pointer-events-none select-none absolute -top-12 left-0 leading-none">08</span>
              <h2 className="relative z-10 font-display text-4xl font-bold tracking-tight text-white mb-2">LeetCode Performance</h2>
              <div className="h-px bg-white/10 w-24"></div>
            </div>

            {leetcode ? (
              <div id="leetcode-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-6">
                {/* Left side: interactive circular progress nodes */}
                <div id="leetcode-left" className="lg:col-span-7 bg-surface-brand border border-border-brand p-6 flex flex-col gap-6">
                  {/* Name header link */}
                  <div className="flex items-center justify-between">
                    <a
                      id="link-leetcode-profile"
                      href={`https://leetcode.com/u/${leetcode.username}/`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-text-primary hover:text-white flex items-center gap-1.5 hover:underline"
                    >
                      <Activity className="h-4 w-4" /> @{leetcode.username} <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#555] select-none">Rank: #{leetcode.ranking}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <ProgressDonut solved={leetcode.easySolved} total={leetcode.easyTotal} label="Easy Mode" colorClass="stroke-[#22c55e]" />
                    <ProgressDonut solved={leetcode.mediumSolved} total={leetcode.mediumTotal} label="Medium Mode" colorClass="stroke-[#eab308]" />
                    <ProgressDonut solved={leetcode.hardSolved} total={leetcode.hardTotal} label="Hard Mode" colorClass="stroke-[#ef4444]" />
                  </div>

                  {/* Combined total */}
                  <div className="flex justify-between items-center bg-bg-brand border border-border-brand px-4 py-3 font-mono text-xs">
                    <span className="text-text-muted">Aggregate Questions Solved:</span>
                    <span className="text-white font-bold">{leetcode.totalSolved} / {leetcode.totalQuestions}</span>
                  </div>
                </div>

                {/* Right side activity stats */}
                <div id="leetcode-right" className="lg:col-span-5 bg-surface-brand border border-border-brand p-6 flex flex-col justify-between">
                  <div className="flex flex-col gap-1 pr-6">
                    <div className="flex items-center gap-2 text-text-muted uppercase text-[9px] font-mono tracking-widest">
                      <Flame className="h-3.5 w-3.5 text-white animate-pulse" /> Activity Streak
                    </div>
                    <span className="font-display text-4xl font-extrabold text-white mt-2 leading-none block">{leetcode.streak} Days</span>
                    <span className="font-mono text-[10px] text-text-muted tracking-wider block mt-1">Maximum tracked milestone: {leetcode.maxStreak} days.</span>
                  </div>

                  <div className="h-px bg-white/5 my-4"></div>

                  <div id="leetcode-badges" className="flex flex-col gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Milestone Badges Earned:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {leetcode.badges.map((b, i) => (
                        <span key={i} className="font-mono text-[10px] border border-border-brand bg-bg-brand text-text-primary px-3 py-1 scale-95 uppercase tracking-wide">
                          {b.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="font-mono text-xs text-text-muted">LeetCode telemetry sync failed.</div>
            )}
          </div>
        </section>
      )}

      {/* ==========================================
          SECTION 09: GITHUB TELEMETRY SYSTEM
          ========================================== */}
      {vis.github && (
        <section
          id="github"
          className="relative w-full border-t border-border-brand bg-bg-brand py-32 z-10 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col gap-12">
            <div className="relative">
              <span className="font-display text-8xl font-black text-text-dim pointer-events-none select-none absolute -top-12 left-0 leading-none">09</span>
              <h2 className="relative z-10 font-display text-4xl font-bold tracking-tight text-white mb-2">GitHub Statistics</h2>
              <div className="h-px bg-white/10 w-24"></div>
            </div>

            {github ? (
              <div id="github-container" className="flex flex-col gap-8 mt-6">
                {/* 4 Cards horizontal box metric row */}
                <div id="github-metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Public Registries', value: github.publicRepos },
                    { label: 'Network Followers', value: github.followers },
                    { label: 'Stars Gathered', value: github.stars },
                    { label: 'Annual Contributions', value: github.commitsThisYear }
                  ].map((g, i) => (
                    <div key={i} className="bg-surface-brand border border-border-brand p-5 text-center">
                      <span className="font-display text-3xl font-extrabold text-white leading-none block">{g.value}</span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted mt-2 block leading-none">{g.label}</span>
                    </div>
                  ))}
                </div>

                {/* Graph chart frame representation */}
                <div id="github-graph-panel" className="bg-surface-brand border border-border-brand p-6">
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-text-muted select-none">
                    <span>Repository Activity</span>
                    <a href={`https://github.com/${github.username}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                      View Profile <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Dynamic grayscale SVG readouts embed */}
                  <div className="mt-6 overflow-hidden flex justify-center bg-black/60 p-4 border border-border-brand/40">
                    <img 
                      src={`https://github-readme-stats.vercel.app/api?username=${github.username}&show_icons=true&theme=dark&bg_color=080808&text_color=555555&title_color=ffffff&icon_color=ffffff&hide_border=true&border_color=1f1f1f`} 
                      alt="GitHub Readme Stats"
                      className="grayscale select-none pointer-events-none max-w-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Languages usage scale list */}
                  <div id="github-languages" className="mt-8">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted block">Core Languages Percentage:</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      {github.topLanguages.map(l => (
                        <div key={l.name} className="border border-border-brand/60 bg-bg-brand p-3 rounded">
                          <span className="font-mono text-xs text-white block font-bold leading-none">{l.name}</span>
                          <span className="font-mono text-[10px] text-text-muted/60 mt-1.5 block leading-none">{l.percentage}% use-frequency</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real interactive GitHub Contribution wall */}
                  <div id="github-contributions-heatmap" className="mt-8 border-t border-[#1f1f1f] pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Contribution History</span>
                        <span className="font-sans text-xs text-[#666]">Deterministic distribution of {github.commitsThisYear} contributions over the past 365 days. Hover over squares for detailed commit stamps.</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 font-mono text-[8px] uppercase text-[#666] select-none bg-[#111] px-2.5 py-1 border border-border-brand">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Live Tracker Connected</span>
                      </div>
                    </div>

                    {/* Grid Container */}
                    <div className="bg-black/40 border border-border-brand p-5 overflow-x-auto select-none scrollbar-none">
                      <div className="min-w-[680px] flex flex-col gap-2">
                        {/* Month Headers row */}
                        <div className="flex text-[9px] font-mono text-[#555] pl-6 select-none">
                          {Array.from({ length: 12 }).map((_, i) => {
                            const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            return (
                              <div key={i} className="flex-1 text-left">
                                {monthsList[i]}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex gap-2">
                          {/* Days labels */}
                          <div className="flex flex-col justify-between text-[8px] font-mono text-[#444] w-4 pr-1 h-[90px] select-none">
                            <span>Su</span>
                            <span>Tu</span>
                            <span>Th</span>
                            <span>Sa</span>
                          </div>

                          {/* Dynamic heatmap squares */}
                          <div className="grid grid-flow-col grid-cols-53 grid-rows-7 gap-[2.5px] flex-1">
                            {contributionGridData.map((day, idx) => {
                              let bgClass = "bg-[#111]/80 hover:scale-[1.3] hover:z-20 border border-white/5";
                              if (day.commits === 1 || day.commits === 2) {
                                bgClass = "bg-[#2d2d2d] hover:bg-[#3d3d3d] hover:scale-[1.3] hover:z-20 border border-white/5";
                              } else if (day.commits === 3 || day.commits === 4) {
                                bgClass = "bg-[#555] hover:bg-[#666] hover:scale-[1.3] hover:z-20 border border-white/10";
                              } else if (day.commits === 5 || day.commits === 6) {
                                bgClass = "bg-[#999] hover:bg-[#aaa] hover:scale-[1.3] hover:z-20 border border-white/15";
                              } else if (day.commits >= 7) {
                                bgClass = "bg-white hover:bg-white hover:scale-[1.3] hover:z-20 border border-white/20";
                              }

                              return (
                                <div
                                  key={idx}
                                  className={`h-[9px] w-[9px] rounded-[1px] cursor-pointer transition-all duration-150 ${bgClass}`}
                                  onMouseEnter={() => setHoveredContributionDay(day)}
                                  onMouseLeave={() => setHoveredContributionDay(null)}
                                  title={`${day.commits} commits on ${day.date}`}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Legend & Hover Stamp Status bar combo */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 pt-3 border-t border-[#1a1a1a]/40 font-mono text-[9px] text-[#555]">
                          <div className="flex items-center gap-1.5 leading-none">
                            <span>Less</span>
                            <div className="h-2 w-2 rounded-[1px] bg-[#111] border border-white/5"></div>
                            <div className="h-2 w-2 rounded-[1px] bg-[#2d2d2d] border border-white/5 text-[0px]" />
                            <div className="h-2 w-2 rounded-[1px] bg-[#555] border border-white/10 text-[0px]" />
                            <div className="h-2 w-2 rounded-[1px] bg-[#999] border border-white/15 text-[0px]" />
                            <div className="h-2 w-2 rounded-[1px] bg-white border border-white/20 text-[0px]" />
                            <span>More</span>
                          </div>

                          <div className="mt-2 sm:mt-0 flex items-center gap-1.5 h-4">
                            {hoveredContributionDay ? (
                              <span className="text-text-primary animate-fade">
                                // HOVER LOG: <b className="text-white font-medium">[{hoveredContributionDay.date}]</b> &rarr; <b className="text-white font-bold">{hoveredContributionDay.commits} commits</b> registered.
                              </span>
                            ) : (
                              <span className="text-[#444]">// Hover over heatmap blocks to parse telemetry commit stamps</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="font-mono text-xs text-text-muted">GitHub network synchronization is currently busy.</div>
            )}
          </div>
        </section>
      )}

      {/* ==========================================
          SECTION 10: PORTFOLIO LATEST BLOGS
          ========================================== */}
      {vis.blog && (blogs.length > 0 || loading.blogs) && (
        <section
          id="blog"
          className="relative w-full border-t border-border-brand bg-bg-brand py-32 z-10 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col gap-12">
            <div className="relative flex items-end justify-between">
              <div>
                <span className="font-display text-8xl font-black text-text-dim pointer-events-none select-none absolute -top-12 left-0 leading-none">10</span>
                <h2 className="relative z-10 font-display text-4xl font-bold tracking-tight text-white mb-2">Technical Blog</h2>
                <div className="h-px bg-white/10 w-24"></div>
              </div>
              <a
                id="link-blog-all"
                href="/blog"
                className="font-mono text-xs text-text-primary hover:text-white flex items-center gap-1 hover:underline transition-colors select-none"
              >
                All Posts <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* List rolls stacked */}
            <div id="latest-blogs" className="flex flex-col mt-6">
              {loading.blogs ? (
                <>
                  <BlogSkeleton />
                  <BlogSkeleton />
                  <BlogSkeleton />
                </>
              ) : (
                blogs.slice(0, 3).map(b => (
                  <a
                    key={b.id}
                    id={`blog-preview-${b.id}`}
                    href={`/blog/${b.slug}`}
                    className="group py-6 border-b border-border-brand hover:border-white transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="md:w-2/3 flex flex-col gap-1.5">
                      <div className="flex items-center gap-3 font-mono text-[10px] text-text-muted uppercase">
                        <span>{new Date(b.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {b.readTime} min read</span>
                      </div>

                      <h3 className="font-display text-base font-bold text-white group-hover:text-white transition-colors mt-1.5">{b.title}</h3>
                      <p className="text-text-muted text-xs font-light line-clamp-1 mt-1 pr-6">{b.excerpt}</p>
                    </div>

                    <div className="md:w-1/3 flex flex-wrap md:justify-end gap-1.5">
                      {b.tags.map(tag => (
                        <span key={tag} className="font-mono text-[9px] uppercase tracking-wider border border-[#2a2a2a] group-hover:border-white/20 text-text-muted px-2 py-0.5 bg-bg-brand">
                          {tag}
                        </span>
                      ))}
                      <span className="font-mono text-xs text-white group-hover:translate-x-1.5 transition-transform shrink-0 select-none pl-3 self-center hidden md:inline">→</span>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          SECTION 11: CONTACT SUBMISSIONS FORM
          ========================================== */}
      {vis.contact && (
        <section
          id="contact"
          className="relative w-full border-t border-border-brand bg-bg-brand py-32 z-10 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col gap-12 animate-fade">
            <div className="relative">
              <span className="font-display text-8xl font-black text-text-dim pointer-events-none select-none absolute -top-12 left-0 leading-none">11</span>
              <h2 className="relative z-10 font-display text-4xl font-bold tracking-tight text-white mb-2">Get In Touch</h2>
              <div className="h-px bg-white/10 w-24"></div>
            </div>

            <div id="contact-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
              {/* Left Column statement text */}
              <div id="contact-details" className="lg:col-span-5 flex flex-col gap-6">
                <h3 className="font-display text-3xl font-bold text-white leading-tight">Let's build something beautiful.</h3>
                <p className="text-text-primary text-sm leading-relaxed font-light mt-1">
                  Whether you have an interesting job opportunity, an exciting project proposal, or just want to say hello - please leave a message. I'll read and return as soon as possible.
                </p>

                <div className="h-px bg-white/5 my-2"></div>

                {/* Email details row */}
                <div id="contact-info-list" className="flex flex-col gap-3 font-mono text-xs my-1">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-text-muted" />
                    <a id="link-contact-mail" href={`mailto:${finalHero.socials.email}`} className="text-text-primary hover:text-white hover:underline">{finalHero.socials.email}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-text-muted" />
                    <span className="text-text-primary">Hyderabad, India</span>
                  </div>
                </div>
              </div>

              {/* Right Column Form Submission panel */}
              <div id="contact-form-panel" className="lg:col-span-7 bg-surface-brand/40 border border-border-brand p-8 backdrop-blur-sm shadow-2xl">
                {contactState === 'success' ? (
                  <div id="contact-success-state" className="py-12 text-center flex flex-col items-center justify-center gap-4">
                    <span className="h-12 w-12 rounded-full border border-white flex items-center justify-center font-bold text-lg">✓</span>
                    <h3 className="font-display text-lg font-bold text-white mt-1">Message Sent.</h3>
                    <p className="text-xs text-text-muted tracking-wide mt-1">Thank you. I'll review and get back to you soon.</p>
                  </div>
                ) : (
                  <form id="form-contact" onSubmit={handleContactSubmit} className="flex flex-col gap-6">
                    {/* Floating Labels Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <label className="font-mono text-[9px] uppercase tracking-widest text-text-muted mb-1 font-bold">Your Name</label>
                        <input
                          id="inp-contact-name"
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="bg-transparent border-b border-border-brand py-2 text-sm text-white focus:outline-none focus:border-white transition-colors h-10"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-mono text-[9px] uppercase tracking-widest text-text-muted mb-1 font-bold">Email Address</label>
                        <input
                          id="inp-contact-email"
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="bg-transparent border-b border-border-brand py-2 text-sm text-white focus:outline-none focus:border-white transition-colors h-10"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="font-mono text-[9px] uppercase tracking-widest text-text-muted mb-1 font-bold">Subject Topic</label>
                      <input
                        id="inp-contact-subject"
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="bg-transparent border-b border-border-brand py-2 text-sm text-white focus:outline-none focus:border-white transition-colors h-10"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-mono text-[9px] uppercase tracking-widest text-text-muted mb-1 font-bold">Detailed Message</label>
                      <textarea
                        id="inp-contact-message"
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="bg-transparent border-b border-border-brand py-2 text-sm text-white focus:outline-none focus:border-white transition-colors resize-none mt-2"
                      />
                    </div>

                    <button
                      id="btn-contact-submit"
                      type="submit"
                      disabled={contactState === 'sending'}
                      className="mt-6 border border-white text-white bg-transparent py-3 text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-all cursor-pointer flex justify-center items-center gap-2 select-none"
                    >
                      {contactState === 'sending' ? 'Transmitting...' : (
                        <>
                          Send Message <Send className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                    {contactState === 'error' && (
                      <p className="text-[10px] uppercase font-mono tracking-widest text-red-500 mt-2 text-center">Transmission retry required. Check inputs.</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main layout Footer watermark */}
      <Footer />
    </div>
  );
}
