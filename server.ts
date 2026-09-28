import http from 'http';
import path from 'path';
import express from 'express';
import { app } from './backend/app.js';

const PORT = process.env.PORT || 3000;

// Serve static frontend in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// Fallback all non-API GET routes to index.html for SPA routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`MediLab full-stack server running on http://localhost:${PORT}`);
});

export default server;
