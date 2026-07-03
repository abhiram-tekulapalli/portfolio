/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomCursor from './components/CustomCursor.tsx';
import Portfolio from './pages/Portfolio.tsx';
import BlogListing from './pages/Blog.tsx';
import BlogPost from './pages/BlogPost.tsx';
import AdminConsole from './pages/Admin.tsx';

export default function App() {
  return (
    <BrowserRouter>
      {/* Interactive desktop cursor overlay */}
      <CustomCursor />

      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/blog" element={<BlogListing />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin" element={<AdminConsole />} />
        <Route path="/sys-void" element={<AdminConsole />} />
      </Routes>
    </BrowserRouter>
  );
}
