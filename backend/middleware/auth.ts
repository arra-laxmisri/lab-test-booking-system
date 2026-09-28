import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'medilab_super_secret_jwt_key_2026';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: 'user' | 'admin';
    email: string;
  };
}

export function generateToken(payload: { userId: string; role: 'user' | 'admin'; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required. Please sign in.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: 'user' | 'admin'; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired session. Please sign in again.' });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: 'user' | 'admin'; email: string };
    req.user = decoded;
  } catch (err) {
    // Continue as guest if token is invalid or expired
  }
  next();
}

export function verifyAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  verifyAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
      return;
    }
    next();
  });
}
