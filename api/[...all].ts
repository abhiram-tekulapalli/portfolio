import { IncomingMessage, ServerResponse } from 'http';
import app, { db } from '../server.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Await the shared MongoDB initialization on cold starts before Express
  // accesses its synchronous database API.
  try {
    await db.ensureInitialized();
  } catch (err: any) {
    console.error('[Vercel Function] Database initialization failed:', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Database initialization failed' }));
    return;
  }

  return app(req, res);
}
