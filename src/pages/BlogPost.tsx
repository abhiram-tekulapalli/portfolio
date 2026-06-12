/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Share2, Clipboard, Twitter, Check } from 'lucide-react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Blog, SettingsData } from '../types.ts';

// ==========================================
// ELITE CUSTOM MARKDOWN RENDERER
// ==========================================
function parseInlineStyles(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentWord = '';
  let idx = 0;

  while (idx < text.length) {
    if (text[idx] === '*' && text[idx + 1] === '*') {
      if (currentWord) {
        parts.push(currentWord);
        currentWord = '';
      }
      const endIdx = text.indexOf('**', idx + 2);
      if (endIdx !== -1) {
        parts.push(
          <strong key={idx} className="font-bold text-white">
            {text.substring(idx + 2, endIdx)}
          </strong>
        );
        idx = endIdx + 2;
        continue;
      }
    }

    if (text[idx] === '`') {
      if (currentWord) {
        parts.push(currentWord);
        currentWord = '';
      }
      const endIdx = text.indexOf('`', idx + 1);
      if (endIdx !== -1) {
        parts.push(
          <code key={idx} className="font-mono text-[11px] bg-black border border-border-brand px-1.5 py-0.5 text-white select-all">
            {text.substring(idx + 1, endIdx)}
          </code>
        );
        idx = endIdx + 1;
        continue;
      }
    }

    currentWord += text[idx];
    idx++;
  }

  if (currentWord) parts.push(currentWord);
  return parts;
}

export function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let isInsideCode = false;
  let codeSnippet: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (isInsideCode) {
        const codeText = codeSnippet.join('\n');
        elements.push(
          <pre
            key={`code-block-${i}`}
            className="my-6 p-4 bg-black border border-border-brand overflow-x-auto font-mono text-xs text-white leading-relaxed select-all"
          >
            <code>{codeText}</code>
          </pre>
        );
        isInsideCode = false;
        codeSnippet = [];
      } else {
        isInsideCode = true;
      }
      continue;
    }

    if (isInsideCode) {
      codeSnippet.push(line);
      continue;
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="font-display text-3xl font-extrabold mt-10 mb-4 text-white leading-tight">
          {parseInlineStyles(line.substring(2))}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="font-display text-2xl font-bold mt-8 mb-4 text-white leading-tight">
          {parseInlineStyles(line.substring(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="font-display text-xl font-semibold mt-6 mb-3 text-white leading-tight">
          {parseInlineStyles(line.substring(4))}
        </h3>
      );
      continue;
    }

    // Quotes
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="my-6 border-l border-white pl-4 italic text-text-muted text-sm font-sans">
          {parseInlineStyles(line.substring(2))}
        </blockquote>
      );
      continue;
    }

    // Unordered lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="ml-5 list-disc mt-1.5 text-sm text-text-primary pl-1 font-light leading-relaxed">
          {parseInlineStyles(line.substring(2))}
        </li>
      );
      continue;
    }

    // Ordered Lists
    if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^\d+\.\s(.*)/);
      const inner = match ? match[1] : line;
      elements.push(
        <li key={i} className="ml-5 list-decimal mt-1.5 text-sm text-text-primary pl-1 font-light leading-relaxed">
          {parseInlineStyles(inner)}
        </li>
      );
      continue;
    }

    // Divider Line
    if (line.trim() === '---') {
      elements.push(<hr key={i} className="my-8 border-border-brand" />);
      continue;
    }

    // Paragraph
    if (line.trim() !== '') {
      elements.push(
        <p key={i} className="my-4 text-sm md:text-base text-text-primary font-light leading-relaxed whitespace-pre-line">
          {parseInlineStyles(line)}
        </p>
      );
    }
  }

  return <div className="markdown-body font-sans leading-relaxed">{elements}</div>;
}

export default function BlogPost() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const slug = window.location.pathname.split('/').pop() || '';

  useEffect(() => {
    const loadBlogAndSettings = async () => {
      try {
        const [blogRes, settingsRes] = await Promise.all([
          fetch(`/api/v1/blogs/${slug}`),
          fetch('/api/v1/settings')
        ]);
        if (blogRes.ok) setBlog(await blogRes.json());
        if (settingsRes.ok) setSettings(await settingsRes.json());
      } catch (err) {
        console.error("Failed to load blog parameters:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBlogAndSettings();
  }, [slug]);

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-brand text-white">
        <span className="font-mono text-xs text-text-muted">Loading article template...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-brand text-white gap-4">
        <span className="font-mono text-xs text-text-muted">Article not found.</span>
        <a href="/blog" className="text-xs uppercase border border-[#1f1f1f] px-4 py-2 hover:bg-white hover:text-black">Return to Catalog</a>
      </div>
    );
  }

  const finalSettings = settings || {
    sectionVisibility: { about: true, skills: true, projects: true, certifications: true, experience: true, education: true, leetcode: true, github: true, blog: true, contact: true }
  };

  return (
    <div id="blog-post-root" className="relative bg-bg-brand text-white selection:bg-white selection:text-black min-h-screen">
      <Navbar visibleSections={finalSettings.sectionVisibility} activeSection="blog" isHome={false} />

      <article id="blog-article" className="relative z-10 pt-36 pb-24 px-6 md:px-12 mx-auto max-w-4xl">
        <div className="flex flex-col gap-6">
          {/* Back button */}
          <a
            id="link-article-back"
            href="/blog"
            className="inline-flex cursor-pointer select-none items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-muted hover:text-white transition-colors self-start"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
          </a>

          {/* Metadata information Row */}
          <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-text-muted mt-2 border-b border-border-brand pb-4">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {blog.readTime} min read</span>
            <span className="ml-auto flex items-center gap-1.5 bg-surface-brand border border-border-brand px-2 py-0.5 rounded uppercase tracking-wider">{blog.tags[0]}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl mt-2 select-all">
            {blog.title}
          </h1>

          {/* Excerpt */}
          <p className="text-text-muted text-sm md:text-base font-light border-l border-[#2a2a2a] pl-4 italic leading-relaxed py-1">
            {blog.excerpt}
          </p>

          {/* Content Body */}
          <div id="blog-markdown-container" className="prose prose-invert mt-8">
            <MarkdownRenderer content={blog.content} />
          </div>

          <div className="h-px bg-border-brand my-8 w-full"></div>

          {/* Share links */}
          <div id="blog-share-panel" className="flex items-center justify-between py-2.5 px-4 bg-surface-brand/40 border border-border-brand rounded">
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Interested in this topic?</span>
            <div className="flex gap-4">
              <button
                id="btn-article-copy"
                onClick={copyLinkToClipboard}
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-text-muted hover:text-white transition-colors cursor-pointer select-none"
              >
                {copied ? (
                  <>
                    Copied! <Check className="h-3.5 w-3.5 text-green-500" />
                  </>
                ) : (
                  <>
                    Copy Link <Clipboard className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
              <a
                id="link-article-share-twitter"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-text-muted hover:text-white transition-colors"
              >
                Share <Twitter className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
