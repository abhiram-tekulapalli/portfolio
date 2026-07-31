export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return res.status(500).json({
      error: 'BACKEND_URL is not configured. Set it in Vercel Environment Variables.'
    });
  }

  const targetPath = req.url?.replace(/^\/api/, '') || '/';
  const targetUrl = `${backendUrl}/api${targetPath}`;

  try {
    const headers = { ...req.headers };
    delete headers.host;

    const body = ['GET', 'HEAD'].includes(req.method)
      ? undefined
      : typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body ?? {});

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const contentType = response.headers.get('content-type') || '';
    const body = await response.text();

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
      return res.send(body);
    }

    res.setHeader('content-type', contentType);
    return res.send(body);
  } catch (error) {
    return res.status(502).json({
      error: 'Proxy request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
