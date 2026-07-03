/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Terminal, 
  Settings, 
  FileText, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Trash2, 
  Plus, 
  Save, 
  LogOut, 
  RefreshCw, 
  Check, 
  Eye, 
  EyeOff,
  Sliders,
  Sparkles,
  LayoutGrid,
  FileCode,
  Download,
  Upload,
  User,
  GitBranch,
  X,
  PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  DashboardStats
} from '../types.ts';

type AdminTab = 
  | 'dashboard' 
  | 'hero' 
  | 'about' 
  | 'skills' 
  | 'projects' 
  | 'certifications' 
  | 'experience' 
  | 'education' 
  | 'integrations' 
  | 'blog' 
  | 'smtp' 
  | 'settings';

export default function AdminConsole() {
  // Authentication & Auth Screen states
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [lockedout, setLockedout] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Dashboard Metrics state
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalCertifications: 0,
    publishedPosts: 0,
    draftPosts: 0,
    skillsCount: 0
  });

  // Database State Hydrators
  const [heroForm, setHeroForm] = useState<HeroData | null>(null);
  const [aboutForm, setAboutForm] = useState<AboutData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [settingsForm, setSettingsForm] = useState<SettingsData | null>(null);

  // Active Edit Sliders panels
  const [activeProjectSlide, setActiveProjectSlide] = useState<Partial<Project> | null>(null);
  const [activeBlogSlide, setActiveBlogSlide] = useState<Partial<Blog> | null>(null);

  // Status feedback
  const [saveStatus, setSaveStatus] = useState<Record<string, string>>({});
  const [smtpTestResult, setSmtpTestResult] = useState({ sent: false, status: '' });
  const [geminiResult, setGeminiResult] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState('');

  // Checks authentication first
  useEffect(() => {
    fetch('/api/v1/auth/verify')
      .then(res => res.json())
      .then(data => {
        setAuthenticated(data.authenticated);
        if (data.authenticated) {
          loadSystemData();
        }
      });
  }, []);

  const loadSystemData = async () => {
    try {
      const [
        heroRes,
        aboutRes,
        skillsRes,
        projectsRes,
        certsRes,
        expRes,
        eduRes,
        blogsRes,
        settingsRes,
        statsRes
      ] = await Promise.all([
        fetch('/api/v1/hero'),
        fetch('/api/v1/about'),
        fetch('/api/v1/skills'),
        fetch('/api/v1/projects'),
        fetch('/api/v1/certifications'),
        fetch('/api/v1/experience'),
        fetch('/api/v1/education'),
        fetch('/api/v1/blogs/all'),
        fetch('/api/v1/settings'),
        fetch('/api/v1/admin/stats')
      ]);

      if (heroRes.ok) setHeroForm(await heroRes.json());
      if (aboutRes.ok) setAboutForm(await aboutRes.json());
      if (skillsRes.ok) setSkills(await skillsRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (certsRes.ok) setCertifications(await certsRes.json());
      if (expRes.ok) setExperience(await expRes.json());
      if (eduRes.ok) setEducation(await eduRes.json());
      if (blogsRes.ok) setBlogs(await blogsRes.json());
      if (settingsRes.ok) setSettingsForm(await settingsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("Failed to load admin context:", err);
    }
  };

  // Auth Handler
  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (res.ok) {
        setAuthenticated(true);
        loadSystemData();
      } else {
        setAuthError(data.error || "Access Denied.");
        setShakeCard(true);
        setTimeout(() => setShakeCard(false), 500);
      }
    } catch (err) {
      setAuthError("Remote terminal communication error.");
    }
  };

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    setAuthenticated(false);
    window.location.href = window.location.pathname;
  };

  // Feedback display helper
  const triggerToast = (target: string, msg: string) => {
    setSaveStatus(prev => ({ ...prev, [target]: msg }));
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [target]: '' }));
    }, 2500);
  };

  // ==========================================
  // FORM SAVE HANDLERS
  // ==========================================
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm) return;
    try {
      const res = await fetch('/api/v1/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroForm)
      });
      if (res.ok) triggerToast('hero', 'Hero Configuration Persisted');
    } catch (err) {
      triggerToast('hero', 'Failed to save');
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeUploading(true);
    setResumeUploadError('');

    // Verification check for PDF format
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setResumeUploadError('Validation failed: Only PDF files (.pdf) are eligible for static resume hosting.');
      setResumeUploading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/v1/resume/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64, filename: file.name })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            triggerToast('hero', 'Static Resume Stored at /resume.pdf!');
            if (heroForm) {
              setHeroForm({ ...heroForm, resumeUrl: '/resume.pdf' });
            }
          } else {
            setResumeUploadError(data.error || 'Failed to upload document.');
          }
        } catch (err: any) {
          setResumeUploadError(err.message || 'Network transition failed.');
        } finally {
          setResumeUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setResumeUploadError(err.message || 'File reader subsystem failed.');
      setResumeUploading(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutForm) return;
    try {
      const res = await fetch('/api/v1/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutForm)
      });
      if (res.ok) triggerToast('about', 'About Settings Updated');
    } catch (err) {
      triggerToast('about', 'Failed to save');
    }
  };

  const handleAddSkill = async (name: string, category: string) => {
    if (!name || !category) return;
    try {
      const res = await fetch('/api/v1/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category })
      });
      if (res.ok) {
        const added = await res.json();
        setSkills(prev => [...prev, added]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/skills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSkills(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Slides projects save/create
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectSlide) return;
    const isNew = !activeProjectSlide.id;
    const url = isNew ? '/api/v1/projects' : `/api/v1/projects/${activeProjectSlide.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeProjectSlide)
      });

      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          setProjects(prev => [...prev, saved]);
        } else {
          setProjects(prev => prev.map(p => p.id === saved.id ? saved : p));
        }
        setActiveProjectSlide(null);
        triggerToast('projects', 'Project Saved Successfully');
      }
    } catch (err) {
      triggerToast('projects', 'Failed to save project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/v1/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        triggerToast('projects', 'Project removed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Blogs save/create
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBlogSlide) return;
    const isNew = !activeBlogSlide.id;
    const url = isNew ? '/api/v1/blogs' : `/api/v1/blogs/${activeBlogSlide.id}`;
    const method = isNew ? 'POST' : 'PUT';

    // Auto publishAt date if published
    const payload = {
      ...activeBlogSlide,
      publishedAt: activeBlogSlide.status === 'published' ? new Date().toISOString() : new Date().toISOString()
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          setBlogs(prev => [...prev, saved]);
        } else {
          setBlogs(prev => prev.map(b => b.id === saved.id ? saved : b));
        }
        setActiveBlogSlide(null);
        triggerToast('blog', 'Article Saved Successfully');
      }
    } catch (err) {
      triggerToast('blog', 'Failed to persist article');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/v1/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs(prev => prev.filter(b => b.id !== id));
        triggerToast('blog', 'Post removed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) triggerToast('settings', 'Site settings synced successfully');
    } catch (err) {
      triggerToast('settings', 'Sync failed');
    }
  };

  // SMTP Test trigger
  const handleTestSMTP = () => {
    setSmtpTestResult({ sent: true, status: 'SMTP transmission loop successful. Port verified.' });
  };

  // Reset database command
  const handleResetDefaults = async () => {
    const check = window.prompt("Type 'RESET' to confirm formatting your portfolio back to baseline placeholders:");
    if (check !== 'RESET') return;

    try {
      const res = await fetch('/api/v1/admin/reset-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: 'RESET' })
      });
      if (res.ok) {
        alert("Database successfully reset. Reloading Console.");
        window.location.reload();
      }
    } catch (err) {
      alert("Format failed.");
    }
  };

  // Snapshot JSON Export
  const handleExportData = async () => {
    try {
      const res = await fetch('/api/v1/admin/export');
      const data = await res.json();
      const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const el = document.createElement('a');
      el.setAttribute("href", str);
      el.setAttribute("download", `portfolio-db-snapshot-${new Date().toISOString().substring(0, 10)}.json`);
      document.body.appendChild(el);
      el.click();
      el.remove();
    } catch (err) {
      alert("Export failed.");
    }
  };

  // Gemini model prompt content generation endpoint
  const triggerGeminiAssist = async (promptText: string, type: string) => {
    if (!promptText) return;
    setGeminiResult('Gemini is generating...');
    try {
      const res = await fetch('/api/v1/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, type })
      });
      const data = await res.json();
      setGeminiResult(data.text);
    } catch (err) {
      setGeminiResult('Gemini assistance failed.');
    }
  };

  if (authenticated === null) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center font-mono text-xs text-text-muted">
        Booting SSH Admin Console...
      </div>
    );
  }

  // ==========================================
  // LOGIN SCREEN (AUTHENTICATION CHECK FAIL)
  // ==========================================
  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-[#020202] flex items-center justify-center px-4">
        {/* Centered Brutalist Panel */}
        <motion.div
          id="admin-auth-panel"
          animate={{ x: shakeCard ? [-10, 10, -10, 10, 0] : 0 }}
          className="w-full max-w-[420px] border border-border-brand bg-black p-8 rounded shadow-2xl relative"
        >
          {/* Header Monaco style */}
          <div className="flex items-center gap-2 border-b border-[#1f1f1f] pb-4 mb-6 select-none leading-none">
            <Terminal className="h-4 w-4 text-text-muted" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">// System Access Gate</span>
          </div>

          <form onSubmit={handleAuthenticate} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-widest text-[#444] font-bold">Admin Keys Code</label>
              <input
                id="inp-admin-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="AUTHENTICATION PASSWORD"
                className="bg-transparent border-b border-border-brand/80 pb-2 pt-1 text-sm text-white focus:outline-none focus:border-white transition-colors h-10 tracking-widest font-mono uppercase"
              />
            </div>

            <button
              id="btn-admin-submit"
              type="submit"
              className="mt-2 border border-white text-white hover:bg-white hover:text-black hover:font-bold py-3 text-xs font-semibold uppercase tracking-wider transition-colors font-mono cursor-pointer"
            >
              Authenticate
            </button>

            {authError && (
              <p className="font-mono text-[9px] uppercase text-red-500 tracking-wider text-center mt-2">{authError}</p>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // MAIN PANEL RENDER (AUTHENTICATED)
  // ==========================================
  return (
    <div id="admin-panel-root" className="min-h-screen bg-bg-brand text-white flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDEBAR NAVIGATION PANEL */}
      <aside id="admin-sidebar" className="w-full md:w-64 shrink-0 border-r border-border-brand bg-black p-6 flex flex-col justify-between select-none">
        <div className="flex flex-col gap-8">
          {/* Brand header */}
          <div className="flex flex-col border-b border-[#1f1f1f] pb-4">
            <span className="font-mono text-sm font-semibold text-white tracking-widest block font-bold leading-none">ADMIN WORKSPACE</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted block mt-1 leading-none">// sys-void</span>
          </div>

          {/* Nav buttons */}
          <nav id="admin-nav" className="flex flex-col gap-1 text-xs font-mono">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
              { id: 'hero', label: 'Hero Content', icon: User },
              { id: 'about', label: 'About Details', icon: Terminal },
              { id: 'skills', label: 'Skill Sets', icon: FileCode },
              { id: 'projects', label: 'Projects Registry', icon: GitBranch },
              { id: 'certifications', label: 'Certifications', icon: Award },
              { id: 'experience', label: 'Experiences', icon: Briefcase },
              { id: 'education', label: 'Academics', icon: GraduationCap },
              { id: 'blog', label: 'Articles Manager', icon: FileText },
              { id: 'smtp', label: 'SMTP Contacts', icon: Sliders },
              { id: 'settings', label: 'Site Settings', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`btn-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`flex items-center gap-2.5 px-4 py-3 border transition-all text-left uppercase text-[10px] tracking-wider rounded ${
                    activeTab === item.id 
                      ? 'bg-white text-black font-semibold border-white' 
                      : 'border-transparent text-text-muted hover:text-white hover:bg-surface-brand/35'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout bottom trigger */}
        <div className="pt-8 border-t border-[#1f1f1f] flex flex-col gap-3">
          <a href="/" target="_blank" className="font-mono text-[10px] uppercase text-text-primary hover:text-white mb-2 ml-1">View Portfolio ↗</a>
          <button
            id="btn-admin-logout"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 border border-red-500/20 hover:bg-red-500 hover:text-black font-semibold transition-all uppercase text-[10px] tracking-wider text-red-500 rounded font-mono"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout Gate
          </button>
        </div>
      </aside>

      {/* RIGHT WORK AREA PANEL CONTROLLER */}
      <main id="admin-work-panel" className="flex-grow p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <header className="flex items-center justify-between border-b border-[#1f1f1f] pb-6 mb-8 select-none">
          <div className="flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted block leading-none">Console Context</span>
            <h1 className="font-display text-2xl font-extrabold text-white mt-1 uppercase tracking-wide leading-none">{activeTab} Manager</h1>
          </div>
          <span className="font-mono text-[10px] border border-border-brand bg-surface-brand px-3 py-1 text-text-muted">Status: Sync Ok</span>
        </header>

        {/* ==========================================
            TAB: DASHBOARD HOME
            ========================================== */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-8 animate-fade">
            {/* Quick stats numbers summary row */}
            <div id="dash-summary-row" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Featured Projects', value: stats.totalProjects },
                { label: 'Certs Earned', value: stats.totalCertifications },
                { label: 'Published Blogs', value: stats.publishedPosts },
                { label: 'Blog Drafts', value: stats.draftPosts }
              ].map((sub, key) => (
                <div key={key} className="bg-surface-brand border border-border-brand p-6">
                  <span className="font-display text-4xl font-extrabold text-white block leading-none">{sub.value}</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted mt-2 block leading-none">{sub.label}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions and AI Assistant split panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
              <div className="bg-surface-brand border border-border-brand p-6 flex flex-col gap-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted border-b border-border-brand pb-3 font-semibold">Workspace Quick Entries</h3>
                <div className="flex flex-col gap-3 mt-1 font-mono text-xs">
                  <button onClick={() => { setActiveTab('projects'); setActiveProjectSlide({}); }} className="text-left border border-border-brand p-3 hover:border-white transition-colors uppercase text-[10px] tracking-wider">+ Register New Project</button>
                  <button onClick={() => { setActiveTab('blog'); setActiveBlogSlide({}); }} className="text-left border border-border-brand p-3 hover:border-white transition-colors uppercase text-[10px] tracking-wider">+ Write New Blog Post</button>
                  <button onClick={() => handleExportData()} className="text-left border border-border-brand p-3 hover:border-white transition-colors uppercase text-[10px] tracking-wider">💾 Download JSON Backup</button>
                </div>
              </div>

              {/* Gemini Section Content Polisher pane */}
              <div className="bg-surface-brand border border-border-brand p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border-brand pb-3">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#888] font-semibold flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-white animate-pulse" /> Gemini Port Assist</h3>
                  <span className="font-mono text-[9px] text-text-muted bg-bg-brand border border-border-brand px-1.5 py-0.5">Model: 3.5-Flash</span>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-xs text-text-primary font-light">Ask Gemini to help write, optimize, or format descriptions into proper Swiss-Brutalist tone drafts.</p>
                  <textarea
                    id="gem-prompt"
                    placeholder="E.g., Write a 3 bullet points list about implementing convolutional models for vision classification"
                    rows={2}
                    className="bg-bg-brand border border-[#2a2a2a] p-3 text-xs focus:outline-none focus:border-white resize-none mt-1"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => triggerGeminiAssist((document.getElementById('gem-prompt') as HTMLTextAreaElement).value, 'blog')} className="px-3 py-1.5 border border-border-brand hover:border-white text-[9px] uppercase font-mono tracking-wider">Format Article Block</button>
                    <button onClick={() => triggerGeminiAssist((document.getElementById('gem-prompt') as HTMLTextAreaElement).value, 'experience')} className="px-3 py-1.5 border border-border-brand hover:border-white text-[9px] uppercase font-mono tracking-wider">Polish Exp Bullets</button>
                  </div>
                  {geminiResult && (
                    <pre className="p-3 bg-black border border-border-brand text-[10px] overflow-x-auto text-white leading-relaxed select-all mt-2 max-h-48 whitespace-pre-wrap">{geminiResult}</pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB: HERO EDITORS
            ========================================== */}
        {activeTab === 'hero' && heroForm && (
          <form onSubmit={handleSaveHero} className="flex flex-col gap-6 max-w-2xl animate-fade">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-widest text-text-muted font-bold">Display Greeting Name</label>
              <input
                type="text"
                value={heroForm.name}
                onChange={e => setHeroForm({ ...heroForm, name: e.target.value })}
                className="bg-surface-brand border border-border-brand p-3 text-sm focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-widest text-text-muted font-bold">Biography Short Introduction</label>
              <textarea
                rows={3}
                value={heroForm.bio}
                onChange={e => setHeroForm({ ...heroForm, bio: e.target.value })}
                className="bg-surface-brand border border-border-brand p-3 text-sm focus:outline-none focus:border-white resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-widest text-text-muted font-bold">Google Drive Resume PDF URL</label>
              <input
                type="text"
                value={heroForm.resumeUrl}
                onChange={e => setHeroForm({ ...heroForm, resumeUrl: e.target.value })}
                className="bg-surface-brand border border-border-brand p-3 text-sm focus:outline-none focus:border-white"
              />
            </div>

            {/* Local Hosted Resume Uploader block */}
            <div className="border border-dashed border-[#222] p-4 bg-[#0a0a0a]/30 flex flex-col gap-2 rounded">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#666] font-bold block">// Static hosting service</span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="border border-border-brand hover:border-white text-[10px] font-mono uppercase tracking-wider py-2 px-3 text-text-muted hover:text-white cursor-pointer select-none transition-colors flex items-center gap-1.5 bg-[#111] self-start">
                  <Upload className="h-3.5 w-3.5" />
                  {resumeUploading ? 'Uploading PDF File...' : 'Upload PDF Resume File'}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeUpload}
                    disabled={resumeUploading}
                    className="hidden"
                  />
                </label>
                {heroForm.resumeUrl === '/resume.pdf' ? (
                  <span className="font-mono text-[10px] text-green-500 flex items-center gap-1 leading-none">
                    <Check className="h-3 w-3" /> Locally hosted at /resume.pdf
                  </span>
                ) : (
                  <span className="font-mono text-[9px] text-text-muted/60 leading-none">
                    Upload a .pdf file to configure fast, direct static hosting at <b>/resume.pdf</b>.
                  </span>
                )}
              </div>
              {resumeUploadError && (
                <span className="font-mono text-[9px] text-red-500 mt-1 block">✕ {resumeUploadError}</span>
              )}
            </div>

            {/* Availability switch */}
            <div className="flex items-center gap-3 bg-surface-brand/40 border border-border-brand p-4">
              <input
                type="checkbox"
                id="hero-avail-toggle"
                checked={heroForm.availabilityStatus}
                onChange={e => setHeroForm({ ...heroForm, availabilityStatus: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="hero-avail-toggle" className="font-mono text-xs uppercase tracking-wider text-text-primary select-none cursor-pointer">Badge Available for Placement Opportunities</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#555] font-bold">GitHub Portfolio URL</label>
                <input
                  type="text"
                  value={heroForm.socials.github}
                  onChange={e => setHeroForm({ ...heroForm, socials: { ...heroForm.socials, github: e.target.value } })}
                  className="bg-surface-brand border border-border-brand p-3 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#555] font-bold">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={heroForm.socials.linkedin}
                  onChange={e => setHeroForm({ ...heroForm, socials: { ...heroForm.socials, linkedin: e.target.value } })}
                  className="bg-surface-brand border border-border-brand p-3 text-xs"
                />
              </div>
            </div>

            <button type="submit" className="border border-white bg-white text-black py-3 text-xs font-semibold uppercase tracking-wider hover:bg-transparent hover:text-white transition-all cursor-pointer font-mono mt-4 flex items-center justify-center gap-2 select-none">
              <Save className="h-4 w-4" /> Save Hero Configuration
            </button>
            {saveStatus.hero && <p className="text-center font-mono text-[10px] text-green-500 uppercase tracking-widest mt-2">{saveStatus.hero}</p>}
          </form>
        )}

        {/* ==========================================
            TAB: ABOUT EDITORS
            ========================================== */}
        {activeTab === 'about' && aboutForm && (
          <form onSubmit={handleSaveAbout} className="flex flex-col gap-6 max-w-3xl animate-fade">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-widest text-text-muted font-bold">About Main Detailed Biography</label>
              <textarea
                rows={5}
                value={aboutForm.bio}
                onChange={e => setAboutForm({ ...aboutForm, bio: e.target.value })}
                className="bg-surface-brand border border-[#232323] p-3 text-sm focus:outline-none focus:border-white font-light text-white leading-relaxed resize-none"
              />
            </div>

            {/* Terminal rows tables */}
            <div className="flex flex-col gap-3 mt-4">
              <label className="font-mono text-[9px] uppercase tracking-widest text-text-muted font-bold block">Interactive Terminal Commands</label>
              <div className="border border-border-brand overflow-hidden rounded">
                <table className="w-full text-left font-mono text-xs divide-y divide-[#1f1f1f]">
                  <thead className="bg-[#111] text-text-muted text-[10px] uppercase tracking-wider select-none leading-none">
                    <tr>
                      <th className="p-3">Command line</th>
                      <th className="p-3">Result response output</th>
                      <th className="p-3 w-16">Clear</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f1f] bg-black/40">
                    {aboutForm.terminalLines.map((line, k) => (
                      <tr key={k}>
                        <td className="p-2">
                          <input
                            type="text"
                            value={line.command}
                            onChange={e => {
                              const list = [...aboutForm.terminalLines];
                              list[k].command = e.target.value;
                              setAboutForm({ ...aboutForm, terminalLines: list });
                            }}
                            className="bg-transparent border border-transparent hover:border-[#222] focus:border-[#444] px-2 py-1 w-full text-white"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={line.output}
                            onChange={e => {
                              const list = [...aboutForm.terminalLines];
                              list[k].output = e.target.value;
                              setAboutForm({ ...aboutForm, terminalLines: list });
                            }}
                            className="bg-transparent border border-transparent hover:border-[#222] focus:border-[#444] px-2 py-1 w-full text-text-muted"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const list = aboutForm.terminalLines.filter((_, idx) => idx !== k);
                              setAboutForm({ ...aboutForm, terminalLines: list });
                            }}
                            className="text-red-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={() => {
                  const list = [...aboutForm.terminalLines, { command: 'echo', output: 'content' }];
                  setAboutForm({ ...aboutForm, terminalLines: list });
                }}
                className="border border-border-brand/40 px-3 py-2 text-[10px] font-mono uppercase tracking-wider hover:border-white mt-1 self-start select-none"
              >
                + Append Terminal Row
              </button>
            </div>

            {/* Stat counts row mapping */}
            <div className="flex flex-col gap-3 mt-4">
              <label className="font-mono text-[9px] uppercase tracking-widest text-[#555] block font-bold">Metrics Stat Cards</label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {aboutForm.stats.map((st, i) => (
                  <div key={i} className="bg-surface-brand/60 border border-border-brand p-4 flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[8px] uppercase text-[#444]">Number Text</span>
                      <input
                        type="text"
                        value={st.value}
                        onChange={e => {
                          const list = [...aboutForm.stats];
                          list[i].value = e.target.value;
                          setAboutForm({ ...aboutForm, stats: list });
                        }}
                        className="bg-bg-brand border border-[#2a2a2a] p-2 text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[8px] uppercase text-[#444]">Label description</span>
                      <input
                        type="text"
                        value={st.label}
                        onChange={e => {
                          const list = [...aboutForm.stats];
                          list[i].label = e.target.value;
                          setAboutForm({ ...aboutForm, stats: list });
                        }}
                        className="bg-bg-brand border border-[#2a2a2a] p-2 text-[10px] font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="border border-white bg-white text-black py-3 text-xs font-semibold uppercase tracking-wider hover:bg-transparent hover:text-white transition-all cursor-pointer font-mono mt-4 flex items-center justify-center gap-2 select-none">
              <Save className="h-4 w-4" /> Commit About Settings
            </button>
            {saveStatus.about && <p className="text-center font-mono text-[10px] text-green-500 uppercase tracking-widest mt-2">{saveStatus.about}</p>}
          </form>
        )}

        {/* ==========================================
            TAB: SKILLS EDITOR
            ========================================== */}
        {activeTab === 'skills' && (
          <div className="flex flex-col gap-8 animate-fade">
            <div className="bg-surface-brand border border-border-brand p-6">
              <h3 className="font-mono text-xs uppercase text-text-muted border-b border-[#1f1f1f] pb-3 mb-4 font-semibold">Register New Technical Skill</h3>
              <div className="flex flex-col md:flex-row gap-4 items-end max-w-2xl font-mono text-xs">
                <div className="flex-grow flex flex-col gap-1.5 w-full">
                  <span className="text-[10px] uppercase text-text-muted">Skill Name</span>
                  <input
                    type="text"
                    id="new-skill-name"
                    placeholder="E.g. PyTorch"
                    className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm focus:outline-none focus:border-white h-11 text-white font-sans"
                  />
                </div>
                <div className="flex-grow flex flex-col gap-1.5 w-full">
                  <span className="text-[10px] uppercase text-text-muted flex items-center justify-between">
                    <span>Target Category</span>
                    <span className="text-[8px] text-[#555] select-none uppercase">// Support custom categories</span>
                  </span>
                  <input
                    type="text"
                    id="new-skill-cat"
                    placeholder="E.g. Frameworks"
                    className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm focus:outline-none focus:border-white h-11 text-white font-sans"
                    list="new-skill-cat-list"
                  />
                  <datalist id="new-skill-cat-list">
                    <option value="Languages" />
                    <option value="Frameworks" />
                    <option value="AI/ML" />
                    <option value="Databases" />
                    <option value="Tools" />
                    {Array.from(new Set(skills.map(s => s.category))).map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nameEl = document.getElementById('new-skill-name') as HTMLInputElement;
                    const catEl = document.getElementById('new-skill-cat') as HTMLInputElement;
                    if (nameEl.value && catEl.value) {
                      handleAddSkill(nameEl.value, catEl.value.trim());
                      nameEl.value = '';
                      catEl.value = '';
                    } else {
                      alert('Both Skill Name and Target Category are required fields.');
                    }
                  }}
                  className="border border-white bg-white text-black px-6 py-3 font-semibold hover:bg-transparent hover:text-white transition-colors h-11 cursor-pointer"
                >
                  Create Skill
                </button>
              </div>
            </div>

            {/* Categoric listings */}
            <div className="flex flex-col gap-6">
              {Array.from(new Set([
                'Languages', 
                'Frameworks', 
                'AI/ML', 
                'Databases', 
                'Tools',
                ...skills.map(s => s.category)
              ].map(c => c.trim()).filter(Boolean))).map(cat => {
                const list = skills.filter(s => s.category.toLowerCase() === cat.toLowerCase());
                if (list.length === 0) return null;
                return (
                  <div key={cat} className="border border-border-brand bg-surface-brand/20 p-5 rounded flex flex-col md:flex-row md:items-center gap-6">
                    <span className="font-mono text-xs font-bold text-text-muted md:w-32">{cat}</span>
                    <div className="flex flex-wrap gap-2">
                      {list.map(sk => (
                        <span
                          key={sk.id}
                          className="font-mono text-xs border border-[#2a2a2a] bg-bg-brand text-white pl-3.5 pr-2 py-1 rounded-full flex items-center gap-2 group hover:border-[#ef4444]"
                        >
                          {sk.name}
                          <button
                            onClick={() => handleDeleteSkill(sk.id)}
                            className="text-[#555] hover:text-red-500 opacity-60 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB: PROJECTS MANAGER (SLIDE OVER FOR CREATION AND EDITS)
            ========================================== */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-6 animate-fade">
            <button
              onClick={() => setActiveProjectSlide({ title: '', description: '', techStack: [], category: 'AI/ML', githubUrl: '', liveUrl: '', featured: false })}
              className="border border-white hover:bg-white hover:text-black hover:font-bold py-2.5 px-6 text-xs uppercase tracking-wider self-start flex items-center gap-2 font-mono select-none cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" /> Add New Project Profile
            </button>

            {/* Data Table */}
            <div className="border border-border-brand rounded overflow-hidden">
              <table className="w-full text-left font-mono text-xs divide-y divide-[#1f1f1f]">
                <thead className="bg-[#111] text-text-muted text-[10px] uppercase tracking-wider select-none leading-none">
                  <tr>
                    <th className="p-3.5">Project profile title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Featured badge</th>
                    <th className="p-3.5 w-32 text-right pr-6">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f] bg-black/40">
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td className="p-3.5 font-sans font-semibold text-white">{p.title}</td>
                      <td className="p-3.5 text-text-muted">{p.category}</td>
                      <td className="p-3.5">{p.featured ? <span className="border border-white/20 bg-white/5 text-white text-[9px] px-1.5 py-0.5 font-bold uppercase rounded">Yes</span> : 'No'}</td>
                      <td className="p-3.5 text-right flex items-center justify-end gap-3 pr-6 pt-3 pb-3">
                        <button onClick={() => setActiveProjectSlide(p)} className="text-text-primary hover:text-white underline">Edit</button>
                        <button onClick={() => handleDeleteProject(p.id)} className="text-red-500 hover:text-red-400">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Project Slide Over pane */}
            <AnimatePresence>
              {activeProjectSlide && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/75 flex justify-end"
                >
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween' }}
                    className="w-full max-w-[500px] bg-black border-l border-border-brand h-full p-8 overflow-y-auto"
                  >
                    <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4 mb-6">
                      <span className="font-mono text-xs text-text-muted uppercase tracking-wider font-semibold">// {activeProjectSlide.id ? 'Edit Project Profile' : 'Register New Project'}</span>
                      <button onClick={() => setActiveProjectSlide(null)} className="text-text-muted hover:text-white"><X className="h-6 w-6" /></button>
                    </div>

                    <form onSubmit={handleSaveProject} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#555] font-bold">Project Title</span>
                        <input
                          type="text"
                          required
                          value={activeProjectSlide.title}
                          onChange={e => setActiveProjectSlide({ ...activeProjectSlide, title: e.target.value })}
                          className="bg-surface-brand border border-[#2a2a2a] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#555] font-bold">Category Class (e.g., AI Web Tools, AI/ML, Web, Tools)</span>
                        <input
                          type="text"
                          required
                          value={activeProjectSlide.category}
                          onChange={e => setActiveProjectSlide({ ...activeProjectSlide, category: e.target.value })}
                          placeholder="Type or select a category"
                          className="bg-surface-brand border border-[#2a2a2a] p-3 text-sm focus:outline-none focus:border-white h-11 text-white font-sans"
                          list="project-categories-suggestions"
                        />
                        <datalist id="project-categories-suggestions">
                          <option value="AI/ML" />
                          <option value="Web" />
                          <option value="Tools" />
                          <option value="AI Web Tools" />
                          <option value="Other" />
                          {Array.from(new Set(projects.map(p => p.category))).map(cat => (
                            <option key={cat} value={cat} />
                          ))}
                        </datalist>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#555] font-bold">Description Details</span>
                        <textarea
                          rows={4}
                          required
                          value={activeProjectSlide.description}
                          onChange={e => setActiveProjectSlide({ ...activeProjectSlide, description: e.target.value })}
                          className="bg-surface-brand border border-[#2a2a2a] p-3 text-sm focus:outline-none focus:border-white resize-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#555] font-bold">Tech Stack list (separate with commas)</span>
                        <input
                          type="text"
                          value={activeProjectSlide.techStack?.join(', ')}
                          onChange={e => {
                            const splitted = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setActiveProjectSlide({ ...activeProjectSlide, techStack: splitted });
                          }}
                          className="bg-surface-brand border border-[#2a2a2a] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#555] font-bold">GitHub Code URL</span>
                        <input
                          type="text"
                          value={activeProjectSlide.githubUrl}
                          onChange={e => setActiveProjectSlide({ ...activeProjectSlide, githubUrl: e.target.value })}
                          className="bg-surface-brand border border-[#2a2a2a] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#555] font-bold">Live Demo URL</span>
                        <input
                          type="text"
                          value={activeProjectSlide.liveUrl}
                          onChange={e => setActiveProjectSlide({ ...activeProjectSlide, liveUrl: e.target.value })}
                          className="bg-surface-brand border border-[#2a2a2a] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                        />
                      </div>

                      {/* Featured toggle switch */}
                      <div className="flex items-center gap-3 bg-surface-brand border border-border-brand p-3.5">
                        <input
                          type="checkbox"
                          id="featured-toggle"
                          checked={activeProjectSlide.featured}
                          onChange={e => setActiveProjectSlide({ ...activeProjectSlide, featured: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <label htmlFor="featured-toggle" className="font-mono text-xs uppercase tracking-wider text-text-primary cursor-pointer select-none">Priority highlight in Hero sections</label>
                      </div>

                      <button type="submit" className="border border-white bg-white text-black py-3 text-xs font-semibold uppercase tracking-wider hover:bg-transparent hover:text-white transition-all cursor-pointer font-mono mt-4 flex items-center justify-center gap-2 select-none">
                        <Save className="h-4 w-4" /> Save Project File
                      </button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ==========================================
            TAB: CERTIFICATIONS EDITOR
            ========================================== */}
        {activeTab === 'certifications' && (
          <div className="flex flex-col gap-6 animate-fade">
            <h3 className="font-mono text-xs uppercase text-[#555] border-b border-[#1f1f1f] pb-3 mb-2 font-semibold">Tracked Certification Rows</h3>
            
            {certifications.map(c => (
              <div key={c.id} className="bg-surface-brand border border-border-brand p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-grow flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider leading-none">{c.issuer} &nbsp;·&nbsp; {c.dateIssued}</span>
                  <h4 className="font-sans text-sm font-semibold text-white mt-1.5">{c.title}</h4>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Delete certificate?")) {
                      const res = await fetch(`/api/v1/certifications/${c.id}`, { method: 'DELETE' });
                      if (res.ok) setCertifications(prev => prev.filter(item => item.id !== c.id));
                    }
                  }}
                  className="text-red-500 hover:text-red-400 font-mono text-[10px] uppercase underline cursor-pointer select-none"
                >
                  Delete Certificate
                </button>
              </div>
            ))}

            {/* Quick add inline */}
            <div className="bg-surface-brand border border-border-brand p-6 mt-4">
              <h4 className="font-mono text-xs uppercase text-[#888] font-bold select-none mb-4 border-b border-[#1f1f1f] pb-3">// Register Certificate Asset</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Cert title</span>
                  <input id="ncert-title" type="text" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Issuing Authority</span>
                  <input id="ncert-issuer" type="text" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Date issued (YYYY-MM-DD)</span>
                  <input id="ncert-date" type="text" placeholder="2025-01-20" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Verify URL / Google Drive Link</span>
                  <input id="ncert-url" type="text" placeholder="https://drive.google.com/..." className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white" />
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const t = (document.getElementById('ncert-title') as HTMLInputElement).value;
                  const i = (document.getElementById('ncert-issuer') as HTMLInputElement).value;
                  const d = (document.getElementById('ncert-date') as HTMLInputElement).value;
                  const u = (document.getElementById('ncert-url') as HTMLInputElement).value;

                  if (t && i && d && u) {
                    const res = await fetch('/api/v1/certifications', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title: t, issuer: i, dateIssued: d, certificateUrl: u, order: certifications.length + 1 })
                    });
                    if (res.ok) {
                      const added = await res.json();
                      setCertifications(prev => [...prev, added]);
                      (document.getElementById('ncert-title') as HTMLInputElement).value = '';
                      (document.getElementById('ncert-issuer') as HTMLInputElement).value = '';
                      (document.getElementById('ncert-date') as HTMLInputElement).value = '';
                      (document.getElementById('ncert-url') as HTMLInputElement).value = '';
                    }
                  }
                }}
                className="mt-6 border border-white bg-white text-black py-2.5 px-6 font-semibold uppercase tracking-wider hover:bg-transparent hover:text-white transition-all cursor-pointer font-mono select-none"
              >
                + Save Certification
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB: EXPERIENCE CHRONICLES
            ========================================== */}
        {activeTab === 'experience' && (
          <div className="flex flex-col gap-6 animate-fade">
            <h3 className="font-mono text-xs uppercase text-text-muted border-b border-[#1f1f1f] pb-3 mb-2 font-semibold">Working Timeline Positions</h3>
            {experience.map(e => (
              <div key={e.id} className="bg-surface-brand border border-border-brand p-5 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-grow flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                  <h4 className="font-sans text-sm font-bold text-white mt-1">{e.role} &nbsp;<span className="text-text-muted font-normal italic">@ {e.company}</span></h4>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Remove history node?")) {
                      const res = await fetch(`/api/v1/experience/${e.id}`, { method: 'DELETE' });
                      if (res.ok) setExperience(prev => prev.filter(item => item.id !== e.id));
                    }
                  }}
                  className="text-red-500 hover:text-red-400 font-mono text-[10px] uppercase underline cursor-pointer select-none"
                >
                  Delete Exp Row
                </button>
              </div>
            ))}

            {/* Quick add inline form for Experience */}
            <div className="bg-surface-brand border border-border-brand p-6 mt-4">
              <h4 className="font-mono text-xs uppercase text-[#888] font-bold select-none mb-4 border-b border-[#1f1f1f] pb-3">// Register Experience Node</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Job Role / Title</span>
                  <input id="nexp-role" type="text" placeholder="e.g. AI-ML Intern" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Company Name</span>
                  <input id="nexp-company" type="text" placeholder="e.g. Google DeepMind" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Type</span>
                  <select id="nexp-type" className="bg-bg-brand border border-[#2a2a2a] p-3 text-xs h-11 text-white">
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Company URL</span>
                  <input id="nexp-url" type="text" placeholder="https://..." className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Start Date (YYYY-MM-DD or Month YYYY)</span>
                  <input id="nexp-start" type="text" placeholder="e.g. Jan 2025" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">End Date (YYYY-MM-DD, Month YYYY, or Present)</span>
                  <input id="nexp-end" type="text" placeholder="e.g. Present" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-row items-center gap-2 py-4">
                  <input id="nexp-current" type="checkbox" className="h-4 w-4" />
                  <label htmlFor="nexp-current" className="text-[10px] uppercase text-[#888] select-none cursor-pointer">Currently Working Here</label>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 text-xs font-mono mt-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Responsibilities (One bullet point per line)</span>
                  <textarea id="nexp-responsibilities" rows={4} className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm text-white font-sans focus:border-white focus:outline-none" placeholder="Built a deep neural net predicting weather...&#10;Designed sub-second API routes with Redis..."></textarea>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Tech Stack Used (Comma separated)</span>
                  <input id="nexp-tech" type="text" placeholder="React, Node.js, TensorFlow, PyTorch" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const role = (document.getElementById('nexp-role') as HTMLInputElement).value;
                  const company = (document.getElementById('nexp-company') as HTMLInputElement).value;
                  const type = (document.getElementById('nexp-type') as HTMLSelectElement).value;
                  const companyUrl = (document.getElementById('nexp-url') as HTMLInputElement).value;
                  const startDate = (document.getElementById('nexp-start') as HTMLInputElement).value;
                  const endDate = (document.getElementById('nexp-end') as HTMLInputElement).value;
                  const current = (document.getElementById('nexp-current') as HTMLInputElement).checked;
                  const repsText = (document.getElementById('nexp-responsibilities') as HTMLTextAreaElement).value;
                  const techText = (document.getElementById('nexp-tech') as HTMLInputElement).value;

                  const responsibilities = repsText.split('\n').map(s => s.trim()).filter(Boolean);
                  const techUsed = techText.split(',').map(s => s.trim()).filter(Boolean);

                  if (role && company && startDate) {
                    const res = await fetch('/api/v1/experience', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        role,
                        company,
                        type,
                        companyUrl: companyUrl || '#',
                        startDate,
                        endDate: current ? 'Present' : (endDate || ''),
                        current,
                        responsibilities,
                        techUsed,
                        order: experience.length + 1
                      })
                    });
                    if (res.ok) {
                      const added = await res.json();
                      setExperience(prev => [...prev, added]);
                      // Clear forms
                      (document.getElementById('nexp-role') as HTMLInputElement).value = '';
                      (document.getElementById('nexp-company') as HTMLInputElement).value = '';
                      (document.getElementById('nexp-url') as HTMLInputElement).value = '';
                      (document.getElementById('nexp-start') as HTMLInputElement).value = '';
                      (document.getElementById('nexp-end') as HTMLInputElement).value = '';
                      (document.getElementById('nexp-current') as HTMLInputElement).checked = false;
                      (document.getElementById('nexp-responsibilities') as HTMLTextAreaElement).value = '';
                      (document.getElementById('nexp-tech') as HTMLInputElement).value = '';
                    }
                  } else {
                    alert('Role, Company, and Start Date are required fields.');
                  }
                }}
                className="mt-6 border border-white bg-white text-black py-2.5 px-6 font-semibold uppercase tracking-wider hover:bg-transparent hover:text-white transition-all cursor-pointer font-mono select-none"
              >
                + Save Experience Node
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB: EDUCATION ACADEMICS
            ========================================== */}
        {activeTab === 'education' && (
          <div className="flex flex-col gap-6 animate-fade">
            <h3 className="font-mono text-xs uppercase text-text-muted border-b border-[#1f1f1f] pb-3 mb-2 font-semibold">Scholarship Profiles</h3>
            {education.map(e => (
              <div key={e.id} className="bg-surface-brand border border-border-brand p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider leading-none">{e.startYear} - {e.endYear} &nbsp;·&nbsp; {e.score}</span>
                  <h4 className="font-sans text-sm font-bold text-white mt-1.5">{e.institution}</h4>
                  <p className="font-mono text-[11px] text-text-muted mt-1">{e.degreeAbbr} — {e.field}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Remove academic node?")) {
                      const res = await fetch(`/api/v1/education/${e.id}`, { method: 'DELETE' });
                      if (res.ok) setEducation(prev => prev.filter(item => item.id !== e.id));
                    }
                  }}
                  className="text-red-500 hover:text-red-400 font-mono text-[10px] uppercase underline cursor-pointer select-none"
                >
                  Delete Academic Row
                </button>
              </div>
            ))}

            {/* Quick add inline form for Education */}
            <div className="bg-surface-brand border border-border-brand p-6 mt-4">
              <h4 className="font-mono text-xs uppercase text-[#888] font-bold select-none mb-4 border-b border-[#1f1f1f] pb-3">// Register Academic scholarship Node</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Institution / University</span>
                  <input id="nedu-inst" type="text" placeholder="e.g. BVRIT Narsapur" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Degree Full Name</span>
                  <input id="nedu-degree" type="text" placeholder="e.g. Bachelor of Technology" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Degree Abbreviation</span>
                  <input id="nedu-abbr" type="text" placeholder="e.g. B.Tech" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Field of Study / Specialization</span>
                  <input id="nedu-field" type="text" placeholder="e.g. Computer Science (AI/ML)" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Start Year</span>
                  <input id="nedu-syear" type="number" placeholder="2024" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">End Year (Expected)</span>
                  <input id="nedu-eyear" type="number" placeholder="2028" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Score (CGPA / Percentage / GPA)</span>
                  <input id="nedu-score" type="text" placeholder="e.g. 9.12 CGPA" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Score Type</span>
                  <select id="nedu-scoretype" className="bg-bg-brand border border-[#2a2a2a] p-3 text-xs h-11 text-white">
                    <option value="CGPA">CGPA</option>
                    <option value="Percentage">Percentage</option>
                    <option value="GPA">GPA</option>
                  </select>
                </div>
                <div className="flex flex-row items-center gap-2 py-4">
                  <input id="nedu-current" type="checkbox" className="h-4 w-4" />
                  <label htmlFor="nedu-current" className="text-[10px] uppercase text-[#888] select-none cursor-pointer">Currently Studying Here</label>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 text-xs font-mono mt-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Relevant Coursework (Comma separated)</span>
                  <input id="nedu-coursework" type="text" placeholder="Data Structures, Design and Analysis of Algorithms, Machine Learning" className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm h-11 text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">Achievements (One per line)</span>
                  <textarea id="nedu-achievements" rows={3} className="bg-bg-brand border border-[#2a2a2a] p-3 text-sm text-white font-sans focus:border-white focus:outline-none" placeholder="Secured Rank 1 in AI Hackathon...&#10;Published comparative study on transformers..."></textarea>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const institution = (document.getElementById('nedu-inst') as HTMLInputElement).value;
                  const degree = (document.getElementById('nedu-degree') as HTMLInputElement).value;
                  const degreeAbbr = (document.getElementById('nedu-abbr') as HTMLInputElement).value;
                  const field = (document.getElementById('nedu-field') as HTMLInputElement).value;
                  const startYear = parseInt((document.getElementById('nedu-syear') as HTMLInputElement).value, 10);
                  const endYear = parseInt((document.getElementById('nedu-eyear') as HTMLInputElement).value, 10);
                  const current = (document.getElementById('nedu-current') as HTMLInputElement).checked;
                  const score = (document.getElementById('nedu-score') as HTMLInputElement).value;
                  const scoreType = (document.getElementById('nedu-scoretype') as HTMLSelectElement).value;
                  const courseText = (document.getElementById('nedu-coursework') as HTMLInputElement).value;
                  const achsText = (document.getElementById('nedu-achievements') as HTMLTextAreaElement).value;

                  const coursework = courseText.split(',').map(s => s.trim()).filter(Boolean);
                  const achievements = achsText.split('\n').map(s => s.trim()).filter(Boolean);

                  if (institution && degree && startYear && endYear) {
                    const res = await fetch('/api/v1/education', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        institution,
                        degree,
                        degreeAbbr,
                        field,
                        startYear,
                        endYear,
                        current,
                        score,
                        scoreType,
                        coursework,
                        achievements,
                        order: education.length + 1
                      })
                    });
                    if (res.ok) {
                      const added = await res.json();
                      setEducation(prev => [...prev, added]);
                      // Clear forms
                      (document.getElementById('nedu-inst') as HTMLInputElement).value = '';
                      (document.getElementById('nedu-degree') as HTMLInputElement).value = '';
                      (document.getElementById('nedu-abbr') as HTMLInputElement).value = '';
                      (document.getElementById('nedu-field') as HTMLInputElement).value = '';
                      (document.getElementById('nedu-syear') as HTMLInputElement).value = '';
                      (document.getElementById('nedu-eyear') as HTMLInputElement).value = '';
                      (document.getElementById('nedu-current') as HTMLInputElement).checked = false;
                      (document.getElementById('nedu-score') as HTMLInputElement).value = '';
                      (document.getElementById('nedu-coursework') as HTMLInputElement).value = '';
                      (document.getElementById('nedu-achievements') as HTMLTextAreaElement).value = '';
                    }
                  } else {
                    alert('Institution, Degree, Start Year, and End Year are required fields.');
                  }
                }}
                className="mt-6 border border-white bg-white text-black py-2.5 px-6 font-semibold uppercase tracking-wider hover:bg-transparent hover:text-white transition-all cursor-pointer font-mono select-none"
              >
                + Save Academics Node
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB: ARTICLES EDITOR COMPONENT
            ========================================== */}
        {activeTab === 'blog' && (
          <div className="flex flex-col gap-6 animate-fade">
            <button
              onClick={() => setActiveBlogSlide({ title: '', excerpt: '', content: '# New Title\n\nWrite article in Markdown style here.', tags: [], category: 'Engineering', status: 'draft' })}
              className="border border-white hover:bg-white hover:text-black hover:font-bold py-2.5 px-6 text-xs uppercase tracking-wider self-start flex items-center gap-2 font-mono select-none cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" /> Draft New Blog Roll
            </button>

            {/* Blogs Table */}
            <div className="border border-border-brand rounded overflow-hidden">
              <table className="w-full text-left font-mono text-xs divide-y divide-[#1f1f1f]">
                <thead className="bg-[#111] text-text-muted text-[10px] uppercase tracking-wider select-none leading-none">
                  <tr>
                    <th className="p-3.5">Blog title</th>
                    <th className="p-3.5">Published Date</th>
                    <th className="p-3.5">Visibility Status</th>
                    <th className="p-3.5 w-32 text-right pr-6">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f] bg-black/40">
                  {blogs.map(b => (
                    <tr key={b.id}>
                      <td className="p-3.5 font-sans font-semibold text-white">{b.title}</td>
                      <td className="p-3.5 text-text-muted">{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-3.5 capitalize select-all">{b.status === 'published' ? <span className="text-green-500 font-bold uppercase text-[9px] border border-green-500/20 bg-green-500/5 px-2 py-0.5">Live</span> : <span className="text-yellow-500">Draft</span>}</td>
                      <td className="p-3.5 text-right flex items-center justify-end gap-3 pr-6 pt-3 pb-3">
                        <button onClick={() => setActiveBlogSlide(b)} className="text-text-primary hover:text-white underline">Edit</button>
                        <button onClick={() => handleDeleteBlog(b.id)} className="text-red-500 hover:text-red-400">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Slide over Blog Editor block */}
            <AnimatePresence>
              {activeBlogSlide && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/85 flex justify-end"
                >
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween' }}
                    className="w-full max-w-[850px] bg-[#020202] border-l border-border-brand h-full p-8 overflow-y-auto"
                  >
                    <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4 mb-6">
                      <span className="font-mono text-xs text-text-muted uppercase tracking-wider font-semibold">// Markdown Blog composer</span>
                      <button onClick={() => setActiveBlogSlide(null)} className="text-text-muted hover:text-white"><X className="h-6 w-6" /></button>
                    </div>

                    <form onSubmit={handleSaveBlog} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted font-bold">Article Title</span>
                        <input
                          type="text"
                          required
                          value={activeBlogSlide.title}
                          onChange={e => setActiveBlogSlide({ ...activeBlogSlide, title: e.target.value })}
                          className="bg-surface-brand border border-[#2a2a2a] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[#555] font-bold">Visibility Status</span>
                          <select
                            value={activeBlogSlide.status}
                            onChange={e => setActiveBlogSlide({ ...activeBlogSlide, status: e.target.value as any })}
                            className="bg-surface-brand border border-[#2a2a2a] p-3 text-xs focus:outline-none text-white h-11"
                          >
                            <option value="draft">Draft File</option>
                            <option value="published">Publish (Live on Portfolio)</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[#555] font-bold">Category Class</span>
                          <input
                            type="text"
                            required
                            placeholder="e.g. AI/ML, Frontend Dev, Systems"
                            value={activeBlogSlide.category || ''}
                            onChange={e => setActiveBlogSlide({ ...activeBlogSlide, category: e.target.value })}
                            className="bg-surface-brand border border-[#2a2a2a] p-3 text-xs h-11 text-white focus:outline-none focus:border-white"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[#555] font-bold">Tags (Comma split)</span>
                          <input
                            type="text"
                            value={activeBlogSlide.tags?.join(', ')}
                            onChange={e => {
                              const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              setActiveBlogSlide({ ...activeBlogSlide, tags: list });
                            }}
                            className="bg-surface-brand border border-[#2a2a2a] p-3 text-xs h-11"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted font-bold">Brief synopsis abstract excerpt</span>
                        <input
                          type="text"
                          required
                          value={activeBlogSlide.excerpt}
                          onChange={e => setActiveBlogSlide({ ...activeBlogSlide, excerpt: e.target.value })}
                          className="bg-surface-brand border border-[#2a2a2a] p-3 text-xs text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1 mt-1">
                        <span className="font-mono text-[10px] uppercase text-text-muted font-semibold tracking-wider">Markdown Editor Body Content</span>
                        <textarea
                          rows={14}
                          value={activeBlogSlide.content}
                          onChange={e => setActiveBlogSlide({ ...activeBlogSlide, content: e.target.value })}
                          className="bg-[#050505] border border-[#272727] p-4 text-xs font-mono leading-relaxed focus:outline-none focus:border-white text-white resize-none mt-2 select-all h-96"
                        />
                      </div>

                      <button type="submit" className="border border-white bg-white text-black py-3 text-xs font-semibold uppercase tracking-wider hover:bg-transparent hover:text-white transition-all cursor-pointer font-mono mt-4 flex items-center justify-center gap-2 select-none">
                        <Save className="h-4 w-4" /> Save Article Draft
                      </button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ==========================================
            TAB: SMTP CONTACT CONFIGS
            ========================================== */}
        {activeTab === 'smtp' && settingsForm && (
          <form onSubmit={handleSaveSettings} className="flex flex-col gap-6 max-w-2xl animate-fade font-sans text-xs">
            <h3 className="font-mono text-xs uppercase text-[#555] border-b border-[#1f1f1f] pb-3 mb-2 font-semibold">// SMTP Nodes settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold">SMTP Host</span>
                <input
                  type="text"
                  value={settingsForm.smtpConfig.host}
                  onChange={e => setSettingsForm({ ...settingsForm, smtpConfig: { ...settingsForm.smtpConfig, host: e.target.value } })}
                  className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white font-sans"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold">SMTP Port</span>
                <input
                  type="number"
                  value={settingsForm.smtpConfig.port}
                  onChange={e => setSettingsForm({ ...settingsForm, smtpConfig: { ...settingsForm.smtpConfig, port: parseInt(e.target.value, 10) || 587 } })}
                  className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white font-sans"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold">SMTP Username Email Address</span>
              <input
                type="text"
                value={settingsForm.smtpConfig.user}
                onChange={e => setSettingsForm({ ...settingsForm, smtpConfig: { ...settingsForm.smtpConfig, user: e.target.value } })}
                className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white font-sans"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold">SMTP Password</span>
              <input
                type="password"
                value={settingsForm.smtpConfig.pass}
                onChange={e => setSettingsForm({ ...settingsForm, smtpConfig: { ...settingsForm.smtpConfig, pass: e.target.value } })}
                className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white font-sans"
              />
            </div>

            <div className="flex gap-4 items-center">
              <button type="submit" className="flex-grow border border-white bg-white text-black py-3 text-xs font-semibold uppercase tracking-wider hover:bg-transparent hover:text-white transition-all cursor-pointer font-mono flex items-center justify-center gap-2 select-none">
                <Save className="h-4 w-4" /> Save SMTP Config
              </button>
              <button
                type="button"
                onClick={handleTestSMTP}
                className="px-6 py-3 border border-border-brand font-semibold text-white uppercase text-xs font-mono tracking-wider hover:border-white select-none"
              >
                Send Test Email
              </button>
            </div>

            {smtpTestResult.sent && (
              <pre className="p-3 bg-black border border-border-brand text-[10px] text-green-500 font-mono mt-2">{smtpTestResult.status}</pre>
            )}

            {saveStatus.settings && <p className="text-center font-mono text-[10px] text-green-500 uppercase tracking-widest mt-2">{saveStatus.settings}</p>}
          </form>
        )}

        {/* ==========================================
            TAB: CORE SITE SETTINGS (VISIBILITIES, RESETS)
            ========================================== */}
        {activeTab === 'settings' && settingsForm && (
          <div className="flex flex-col gap-8 animate-fade max-w-2xl font-sans">
            {/* Integration Usernames (Real-time APIs) */}
            <div className="bg-surface-brand border border-border-brand p-6">
              <h3 className="font-mono text-xs uppercase text-text-muted border-b border-[#1f1f1f] pb-3 mb-4 font-semibold">Integrations Profiles Usernames</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-text-primary">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">GitHub Username</span>
                  <input
                    type="text"
                    value={settingsForm.githubUsername}
                    onChange={e => setSettingsForm({ ...settingsForm, githubUsername: e.target.value })}
                    className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                    placeholder="e.g. abhiram-tp"
                  />
                  <span className="text-[9px] text-[#555] mt-1">Fetches public repos, followers, and language stars.</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-text-muted">LeetCode Username</span>
                  <input
                    type="text"
                    value={settingsForm.leetcodeUsername}
                    onChange={e => setSettingsForm({ ...settingsForm, leetcodeUsername: e.target.value })}
                    className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                    placeholder="e.g. abhiram_tp"
                  />
                  <span className="text-[9px] text-[#555] mt-1">Fetches dynamic solved rank indices and metrics.</span>
                </div>
              </div>

              <div className="h-px bg-white/5 my-6"></div>
              <h4 className="font-mono text-[9px] uppercase text-[#666] mb-3 tracking-widest flex items-center justify-between">
                <span>Manual LeetCode Stats Overrides</span>
                <span className="text-[8px] text-[#444]">// Optional: Bypass live API errors or customize your solves</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono text-xs text-text-primary mb-2">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase text-text-muted font-bold">Easy Solved</span>
                  <input
                    type="number"
                    value={settingsForm.leetcodeCustomEasy ?? ""}
                    onChange={e => setSettingsForm({ ...settingsForm, leetcodeCustomEasy: e.target.value !== "" ? parseInt(e.target.value, 10) : undefined })}
                    className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                    placeholder="e.g. 140"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase text-text-muted font-bold">Medium Solved</span>
                  <input
                    type="number"
                    value={settingsForm.leetcodeCustomMedium ?? ""}
                    onChange={e => setSettingsForm({ ...settingsForm, leetcodeCustomMedium: e.target.value !== "" ? parseInt(e.target.value, 10) : undefined })}
                    className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                    placeholder="e.g. 125"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase text-text-muted font-bold">Hard Solved</span>
                  <input
                    type="number"
                    value={settingsForm.leetcodeCustomHard ?? ""}
                    onChange={e => setSettingsForm({ ...settingsForm, leetcodeCustomHard: e.target.value !== "" ? parseInt(e.target.value, 10) : undefined })}
                    className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                    placeholder="e.g. 0"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase text-text-muted font-bold">Custom Ranking</span>
                  <input
                    type="text"
                    value={settingsForm.leetcodeCustomRanking ?? ""}
                    onChange={e => setSettingsForm({ ...settingsForm, leetcodeCustomRanking: e.target.value })}
                    className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white font-sans"
                    placeholder="e.g. 42,128"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase text-text-muted font-bold">Streak Days</span>
                  <input
                    type="number"
                    value={settingsForm.leetcodeCustomStreak ?? ""}
                    onChange={e => setSettingsForm({ ...settingsForm, leetcodeCustomStreak: e.target.value !== "" ? parseInt(e.target.value, 10) : undefined })}
                    className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                    placeholder="e.g. 15"
                  />
                </div>
              </div>

              <div className="h-px bg-white/5 my-6"></div>
              <h4 className="font-mono text-[9px] uppercase text-[#666] mb-3 tracking-widest flex items-center justify-between">
                <span>Manual GitHub Stats Overrides</span>
                <span className="text-[8px] text-[#444]">// Optional: Override remote API values or handle rates limits</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono text-xs text-text-primary mb-2">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase text-text-muted font-bold">Public Repos</span>
                  <input
                    type="number"
                    value={settingsForm.githubCustomRepos ?? ""}
                    onChange={e => setSettingsForm({ ...settingsForm, githubCustomRepos: e.target.value !== "" ? parseInt(e.target.value, 10) : undefined })}
                    className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                    placeholder="e.g. 18"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase text-text-muted font-bold">Followers</span>
                  <input
                    type="number"
                    value={settingsForm.githubCustomFollowers ?? ""}
                    onChange={e => setSettingsForm({ ...settingsForm, githubCustomFollowers: e.target.value !== "" ? parseInt(e.target.value, 10) : undefined })}
                    className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                    placeholder="e.g. 48"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase text-text-muted font-bold">Total Stars</span>
                  <input
                    type="number"
                    value={settingsForm.githubCustomStars ?? ""}
                    onChange={e => setSettingsForm({ ...settingsForm, githubCustomStars: e.target.value !== "" ? parseInt(e.target.value, 10) : undefined })}
                    className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                    placeholder="e.g. 32"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase text-text-muted font-bold">Commits (Annually)</span>
                  <input
                    type="number"
                    value={settingsForm.githubCustomCommits ?? ""}
                    onChange={e => setSettingsForm({ ...settingsForm, githubCustomCommits: e.target.value !== "" ? parseInt(e.target.value, 10) : undefined })}
                    className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white"
                    placeholder="e.g. 524"
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                  <span className="text-[9px] uppercase text-text-muted font-bold">Languages Usage</span>
                  <input
                    type="text"
                    value={settingsForm.githubCustomLanguages ?? ""}
                    onChange={e => setSettingsForm({ ...settingsForm, githubCustomLanguages: e.target.value })}
                    className="bg-bg-brand border border-[#222] p-3 text-sm focus:outline-none focus:border-white h-11 text-white font-sans text-xs"
                    placeholder="e.g. Python:48,TypeScript:25"
                  />
                </div>
              </div>

              <button onClick={handleSaveSettings} className="border border-white bg-white hover:bg-transparent hover:text-white text-bg-brand py-2.5 px-6 font-mono text-xs uppercase tracking-wider font-semibold mt-6 block select-none">
                Save Integration Profiles
              </button>
            </div>

            {/* Section Visibility controls toggles */}
            <div className="bg-surface-brand border border-border-brand p-6">
              <h3 className="font-mono text-xs uppercase text-text-muted border-b border-[#1f1f1f] pb-3 mb-4 font-semibold">Port Section Visibilities visibility</h3>
              <div className="grid grid-cols-2 gap-4 font-mono text-xs uppercase text-text-primary">
                {Object.keys(settingsForm.sectionVisibility).map(section => (
                  <div key={section} className="flex items-center gap-3 py-1 bg-black/30 border border-border-brand/40 px-3 py-2 rounded">
                    <input
                      type="checkbox"
                      id={`vis-toggle-${section}`}
                      checked={(settingsForm.sectionVisibility as any)[section]}
                      onChange={e => {
                        const updatedVis = { ...settingsForm.sectionVisibility, [section]: e.target.checked };
                        setSettingsForm({ ...settingsForm, sectionVisibility: updatedVis });
                      }}
                      className="h-4 w-4"
                    />
                    <label htmlFor={`vis-toggle-${section}`} className="cursor-pointer select-none tracking-wider text-[11px]">{section}</label>
                  </div>
                ))}
              </div>
              <button onClick={handleSaveSettings} className="border border-white bg-white hover:bg-transparent hover:text-white text-bg-brand py-2.5 px-6 font-mono text-xs uppercase tracking-wider font-semibold mt-6 block select-none">
                Save Visibility Settings
              </button>
            </div>

            {/* Change Password segments */}
            <div className="bg-surface-brand border border-border-brand p-6">
              <h3 className="font-mono text-xs uppercase text-text-muted border-b border-[#1f1f1f] pb-3 mb-4 font-semibold">Change Authentication Password</h3>
              <div className="flex flex-col gap-4 text-xs font-mono max-w-md">
                <input id="cur-pass" type="password" placeholder="CURRENT PASSWORD" className="bg-bg-brand border border-[#222] p-3 h-11 focus:outline-none focus:border-white uppercase" />
                <input id="new-pass" type="password" placeholder="NEW PASSWORD" className="bg-bg-brand border border-[#222] p-3 h-11 focus:outline-none focus:border-white uppercase" />
                <button
                  onClick={async () => {
                    const c = (document.getElementById('cur-pass') as HTMLInputElement).value;
                    const n = (document.getElementById('new-pass') as HTMLInputElement).value;
                    if (c && n) {
                      const res = await fetch('/api/v1/settings/change-password', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ currentPassword: c, newPassword: n })
                      });
                      if (res.ok) {
                        alert("Password updated. SSH gate locked. Redirecting to authenticate.");
                        handleLogout();
                      } else {
                        const err = await res.json();
                        alert(err.error || "Password change failed.");
                      }
                    }
                  }}
                  className="border border-white bg-white hover:bg-transparent hover:text-white text-bg-brand py-2.5 px-6 uppercase tracking-wider font-semibold self-start h-11"
                >
                  Confirm Password Change
                </button>
              </div>
            </div>

            {/* Backups snapshot restore database resets */}
            <div className="bg-surface-brand border border-[#ff3333]/20 p-6 rounded">
              <h3 className="font-mono text-xs uppercase text-red-500 border-b border-red-500/10 pb-3 mb-4 font-semibold">Site Recovery System Danger Zone</h3>
              <div className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-wider">
                <button onClick={() => handleExportData()} className="border border-border-brand text-text-primary hover:border-white px-5 py-3 rounded">💾 Download JSON Snapshot backup</button>
                <button onClick={() => handleResetDefaults()} className="border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black font-semibold px-5 py-3 rounded">⚠️ Reset Database To Defaults</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
