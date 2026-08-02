export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return res.status(500).json({
      error: 'BACKEND_URL is not configured. Set it in Vercel Environment Variables.'
    });
  }

  const url = new URL(req.url ?? '', 'http://localhost');
  const originalPath = url.searchParams.get('path');
  const targetPath = originalPath
    ? `/${originalPath.replace(/^\/+/, '')}`
    : url.pathname.replace(/^\/api/, '') || '/';

  const targetUrl = new URL(`${backendUrl}/api${targetPath}`);
  for (const [key, value] of url.searchParams) {
    if (key === 'path') continue;
    targetUrl.searchParams.append(key, value);
  }

  try {
    // Debug: log target URL being requested
    console.log('[proxy] targetUrl=', targetUrl.toString());
    const headers = { ...req.headers };
    // Ensure the backend receives a Host header matching the backend URL
    try {
      const parsedBackend = new URL(backendUrl);
      headers.host = parsedBackend.host;
    } catch (e) {}

    // Add forwarded headers for downstream tracing
    headers['x-forwarded-host'] = req.headers.host || '';
    headers['x-forwarded-proto'] = req.headers['x-forwarded-proto'] || (req.protocol || 'https');

    const body = ['GET', 'HEAD'].includes(req.method)
      ? undefined
      : typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body ?? {});

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body,
    });

    const contentType = response.headers.get('content-type') || '';
    // Read raw bytes and forward as-is to preserve content and length
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Debug: log backend response summary
    try {
      console.log('[proxy] backendStatus=', response.status, 'contentType=', contentType, 'bodyLength=', responseBody.length);
      if (responseBody.length > 0) console.log('[proxy] snippet=', responseBody.slice(0, 400));
    } catch (e) {
      console.log('[proxy] logging-error', e && e.message);
    }

    res.status(response.status);
    response.headers.forEach((value, key) => {
      // Forward Set-Cookie and other relevant headers
      if (key.toLowerCase() === 'set-cookie') {
        res.setHeader(key, value);
      } else if (!['transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    // Ensure content-length is set correctly for the proxied body
    res.setHeader('content-length', String(buffer.length));
    if (contentType) res.setHeader('content-type', contentType);
    // Send raw buffer
    return res.send(buffer);
  } catch (error) {
    return res.status(502).json({
      error: 'Proxy request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
