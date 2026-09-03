import { IncomingMessage, ServerResponse } from 'http';

let app: any;
let db: any;
let initialized = false;

async function ensureServerLoaded() {
  if (!initialized) {
    const serverModule = await import('../dist/server.cjs');
    app = serverModule.default;
    db = serverModule.db;
    initialized = true;
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Load Express app and db singleton on first use
  await ensureServerLoaded();

  // Ensure database is initialized before processing request
  try {
    if (typeof db.ensureInitialized === 'function') {
      await db.ensureInitialized();
    }
  } catch (err: any) {
    console.error('[Vercel Function] Database initialization failed:', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Database initialization failed' }));
    return;
  }

  // Invoke the Express app as a request handler
  return app(req, res);
}
