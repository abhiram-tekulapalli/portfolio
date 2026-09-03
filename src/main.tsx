import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Production always uses the same Vercel origin. This preserves JWT cookies and
// keeps the frontend independent of the legacy Render backend. A custom base is
// supported only for local development against a separately started API server.
const envApiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const apiBaseUrl = import.meta.env.DEV ? (envApiBase || 'http://localhost:3000') : '';
const originalFetch = window.fetch.bind(window);

window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    const targetUrl = apiBaseUrl ? `${apiBaseUrl}${input}` : input;
    return originalFetch(targetUrl, { ...init, credentials: 'include' });
  }

  if (input instanceof Request && input.url.startsWith(window.location.origin + '/api/')) {
    const requestUrl = new URL(input.url);
    const targetUrl = apiBaseUrl ? `${apiBaseUrl}${requestUrl.pathname}${requestUrl.search}` : input.url;
    return originalFetch(targetUrl, { ...init, credentials: 'include', method: input.method, headers: input.headers, body: input.body, signal: input.signal });
  }

  return originalFetch(input, { ...init, credentials: 'include' });
}) as typeof window.fetch;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
