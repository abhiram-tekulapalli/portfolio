import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '')).replace(/\/$/, '');
const originalFetch = window.fetch.bind(window);

window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    const targetUrl = apiBaseUrl ? `${apiBaseUrl}${input}` : input;
    return originalFetch(targetUrl, { ...init, credentials: 'include' });
  }

  if (input instanceof Request && input.url.startsWith(window.location.origin + '/api/')) {
    const targetUrl = apiBaseUrl ? `${apiBaseUrl}${new URL(input.url).pathname}` : input.url;
    return originalFetch(targetUrl, { ...init, credentials: 'include', method: input.method, headers: input.headers, body: input.body });
  }

  return originalFetch(input, { ...init, credentials: 'include' });
}) as typeof window.fetch;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
