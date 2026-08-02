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
    delete headers.host;

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
    const responseBody = await response.text();

    // Debug: log backend response summary
    try {
      console.log('[proxy] backendStatus=', response.status, 'contentType=', contentType, 'bodyLength=', responseBody.length);
      if (responseBody.length > 0) console.log('[proxy] snippet=', responseBody.slice(0, 400));
    } catch (e) {
      console.log('[proxy] logging-error', e && e.message);
    }

    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        res.setHeader(key, value);
      } else if (!['content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    if (contentType.includes('application/json')) {
      res.setHeader('content-type', 'application/json');
      return res.send(responseBody);
    }

    res.setHeader('content-type', contentType);
    return res.send(responseBody);
  } catch (error) {
    return res.status(502).json({
      error: 'Proxy request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
