/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  visibleSections: Record<string, boolean>;
  activeSection?: string;
  isHome?: boolean;
}

export default function Navbar({ visibleSections, activeSection: externalActive, isHome = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [isOpen, setIsOpen] = useState(false);

  // Monitor Scroll for Glassmorphism Background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync scroll tracker with active layout sections (Scrollspy)
  useEffect(() => {
    if (!isHome) return;
    
    const sections = Object.keys(visibleSections).filter(key => visibleSections[key]);
    // Also track hero
    const allSections = ['hero', ...sections];
    
    const observers = allSections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveTab(id);
            }
          });
        },
        { rootMargin: '-40% 0px -45% 0px' } // sweet spot for dynamic scrollspy focus trigger
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach(pair => {
        if (pair) pair.observer.unobserve(pair.el);
      });
    };
  }, [visibleSections, isHome]);

  const active = externalActive || activeTab;

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Canonical Section Label mapping
  const labelMap: Record<string, string> = {
    hero: 'Home',
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certs',
    experience: 'Work',
    education: 'Education',
    leetcode: 'LeetCode',
    github: 'GitHub',
    blog: 'Blog',
    contact: 'Contact'
  };

  const navItems = ['hero', ...Object.keys(visibleSections).filter(key => visibleSections[key])];

  return (
    <>
      <nav
        id="desktop-nav"
        className={`fixed top-0 left-0 z-40 w-full transition-all duration-300 ${
          scrolled 
            ? 'bg-bg-brand/90 border-b border-border-brand backdrop-blur-md py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
          {/* LOGO */}
          <a
            id="nav-logo"
            href="/"
            className="font-display text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-85"
          >
            <span className="font-bold text-white">Tekulapalli</span> <span className="font-light text-text-muted text-sm font-mono ml-1">Abhiram</span>
          </a>

          {/* DESKTOP LINKS */}
          <div id="desktop-links" className="hidden lg:flex items-center gap-8">
            {navItems.map(id => (
              <button
                key={id}
                id={`btn-nav-${id}`}
                onClick={() => handleNavClick(id)}
                className={`text-xs font-mono tracking-wider transition-colors duration-200 relative py-1 capitalize border-b-2 hover:text-white ${
                  active === id ? 'text-white border-white' : 'text-text-muted border-transparent'
                }`}
              >
                {labelMap[id] || id}
              </button>
            ))}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="flex lg:hidden text-text-primary hover:text-white transition-colors z-50 select-none pb-0.5"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE FULL-SCREEN OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-30 flex flex-col justify-start bg-bg-brand/98 px-12 pt-28 pb-12 overflow-y-auto text-left"
          >
            <div id="mobile-nav-items" className="flex flex-col gap-4 sm:gap-5">
              {navItems.map((id, index) => (
                <motion.button
                  key={id}
                  id={`btn-mobile-nav-${id}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => handleNavClick(id)}
                  className={`text-xl sm:text-2xl font-display font-medium text-left transition-colors relative py-1 select-none border-l-2 pl-4 ${
                    active === id ? 'text-white border-white' : 'text-text-muted border-transparent'
                  }`}
                >
                  <span className="font-mono text-xs text-text-muted mr-3">0{index + 1}.</span>
                  {labelMap[id] || id}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
