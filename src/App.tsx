/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import CustomCursor from './components/CustomCursor.tsx';

const Portfolio = lazy(() => import('./pages/Portfolio.tsx'));
const BlogListing = lazy(() => import('./pages/Blog.tsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.tsx'));
const AdminConsole = lazy(() => import('./pages/Admin.tsx'));

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />

      <Suspense fallback={<div className="min-h-screen bg-bg-brand text-white flex items-center justify-center font-mono text-xs uppercase tracking-[0.3em]">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/blog" element={<BlogListing />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin" element={<AdminConsole />} />
          <Route path="/sys-void" element={<AdminConsole />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
