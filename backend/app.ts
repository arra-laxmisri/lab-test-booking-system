import express from 'express';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { seedDatabase } from './config/seed.js';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize seed data
seedDatabase().catch(err => {
  console.error('Seed database error:', err);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MediLab Laboratory API', timestamp: new Date().toISOString() });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Fallback 404 for unmatched /api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'The requested API endpoint does not exist.' });
});

// Centralized error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Something went wrong on the server. Please try again.' });
});

export default app;
