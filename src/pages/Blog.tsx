/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Clock, Hash, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Blog, SettingsData } from '../types.ts';

export default function BlogListing() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [settings, setSettings] = useState<SettingsData | null>(null);

  useEffect(() => {
    const loadBlogsData = async () => {
      try {
        const [blogsRes, settingsRes] = await Promise.all([
          fetch('/api/v1/blogs'),
          fetch('/api/v1/settings')
        ]);
        if (blogsRes.ok) setBlogs(await blogsRes.json());
        if (settingsRes.ok) setSettings(await settingsRes.json());
      } catch (err) {
        console.error("Failed to load blog database rows:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBlogsData();
  }, []);

  // Filter handlers
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Derive unique tags and categories from post sets
  const allTags = Array.from(new Set(blogs.flatMap(b => b.tags)));
  const allCategories = Array.from(new Set(blogs.map(b => b.category || 'Engineering')));

  // Client side fuzzy/filtering selector
  const filteredBlogs = blogs.filter(post => {
    const matchesCategory = 
      selectedCategory === 'All' || 
      (post.category || 'Engineering') === selectedCategory;

    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.category || 'Engineering').toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.every(t => post.tags.includes(t));

    return matchesCategory && matchesSearch && matchesTags;
  });

  const finalSettings = settings || {
    sectionVisibility: { about: true, skills: true, projects: true, certifications: true, experience: true, education: true, leetcode: true, github: true, blog: true, contact: true }
  };

  return (
    <div id="blog-listing-root" className="relative bg-bg-brand text-white selection:bg-white selection:text-black min-h-screen">
      <Navbar visibleSections={finalSettings.sectionVisibility} activeSection="blog" isHome={false} />

      {/* Hero Header Space */}
      <section id="blog-header" className="relative z-10 pt-36 pb-16 px-6 md:px-12 mx-auto max-w-7xl">
        <div className="flex flex-col gap-4">
          <a
            id="link-blog-back"
            href="/"
            className="inline-flex cursor-pointer select-none items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back To Home
          </a>

          <h1 className="font-display text-5xl font-extrabold tracking-tight text-white md:text-7xl">
            My Blog.
          </h1>
          <p className="max-w-xl text-sm md:text-base text-text-muted font-light mt-1">
            Thoughts, technical guides, system architecture reviews, algorithms, and modular design tutorials.
          </p>
        </div>

        {/* Category filtering section */}
        <div id="blog-category-tabs" className="mt-12 border-b border-border-brand flex flex-wrap gap-1 select-none">
          <button
            id="cat-filter-all"
            onClick={() => setSelectedCategory('All')}
            className={`font-mono text-[10px] sm:text-xs uppercase tracking-wider px-5 py-3 transition-colors border-t border-l border-r ${
              selectedCategory === 'All'
                ? 'bg-[#111] text-white border-border-brand font-bold border-b-2 border-b-white'
                : 'text-text-muted border-transparent hover:text-white hover:bg-[#0c0c0c]'
            }`}
          >
            All Roll ({blogs.length})
          </button>
          {allCategories.map(cat => {
            const count = blogs.filter(b => (b.category || 'Engineering') === cat).length;
            return (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`font-mono text-[10px] sm:text-xs uppercase tracking-wider px-5 py-3 transition-colors border-t border-l border-r ${
                  selectedCategory === cat
                    ? 'bg-[#111] text-white border-border-brand font-bold border-b-2 border-b-white'
                    : 'text-text-muted border-transparent hover:text-white hover:bg-[#0c0c0c]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search bar and Filters board */}
        <div id="blog-controls" className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-surface-brand/50 border-x border-b border-border-brand p-4">
          {/* Inputs search */}
          <div className="md:col-span-6 flex items-center gap-3 bg-bg-brand px-4 py-2 border border-[#2a2a2a]">
            <Search className="h-4 w-4 text-text-muted" />
            <input
              id="blog-search-input"
              type="text"
              placeholder="Search posts or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none w-full font-sans"
            />
          </div>

          <div className="md:col-span-6 flex items-center gap-2 overflow-x-auto select-none no-scrollbar py-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted mr-2">Tags:</span>
            {allTags.map(tag => (
              <button
                key={tag}
                id={`tag-filter-${tag}`}
                onClick={() => toggleTag(tag)}
                className={`font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded transition-colors border ${
                  selectedTags.includes(tag)
                    ? 'bg-white text-black border-white'
                    : 'text-text-muted border-border-brand/60 hover:text-white hover:border-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Listing results */}
        {loading ? (
          <div className="py-24 text-center font-mono text-xs text-text-muted">Loading articles...</div>
        ) : filteredBlogs.length > 0 ? (
          <div id="blog-posts-rows" className="flex flex-col mt-12 divide-y divide-border-brand border-y border-border-brand">
            {filteredBlogs.map((b, idx) => (
              <motion.a
                key={b.id}
                id={`blog-row-${b.id}`}
                href={`/blog/${b.slug}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group py-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6 hover:bg-surface-brand/25 transition-all px-4"
              >
                {/* Horizontal left Date label */}
                <div className="md:w-32 shrink-0 flex items-center md:flex-col md:items-start gap-3 font-mono text-xs text-text-muted">
                  <Calendar className="h-4 w-4 md:hidden" />
                  <span className="md:text-sm font-semibold text-white/95">
                    {new Date(b.publishedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                  </span>
                  <span className="md:text-[10px] uppercase font-bold tracking-widest block text-text-muted/60">{new Date(b.publishedAt).getFullYear()}</span>
                  <span className="hidden md:inline-block font-mono text-[9px] uppercase bg-white/5 border border-white/10 px-1.5 py-0.5 text-text-primary mt-1">{b.category || 'Engineering'}</span>
                </div>

                {/* Core title and desc */}
                <div className="flex-grow flex flex-col gap-2">
                  <h2 className="font-display text-xl font-bold text-white group-hover:text-white transition-colors">{b.title}</h2>
                  <p className="text-sm text-text-muted mt-1 leading-relaxed font-light">{b.excerpt}</p>
                </div>

                <div className="md:w-44 lg:w-56 shrink-0 flex flex-wrap md:justify-end gap-1.5 pt-1.5">
                  <span className="font-mono text-[10px] text-text-muted select-none flex items-center gap-1 uppercase mr-2"><Clock className="h-3 w-3" /> {b.readTime}m read</span>
                  {b.tags.map(tag => (
                    <span key={tag} className="font-mono text-[9px] uppercase tracking-wider bg-surface-brand border border-border-brand px-2 py-0.5 text-text-muted">
                      {tag}
                    </span>
                  ))}
                  <span className="font-mono text-xs text-text-primary group-hover:translate-x-1.5 transition-transform hidden md:inline select-none pl-3 block mt-1">🔑</span>
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-sm font-mono text-text-muted">No postings matched search filters.</div>
        )}
      </section>

      <Footer />
    </div>
  );
}
