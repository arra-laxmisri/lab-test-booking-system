import { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { generateToken, AuthRequest } from '../middleware/auth.js';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password, confirmPassword, address } = req.body;

      if (!name || !email || !phone || !password) {
        res.status(400).json({ message: 'Please provide full name, email, phone number, and password.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        return;
      }

      if (confirmPassword && password !== confirmPassword) {
        res.status(400).json({ message: 'Passwords do not match.' });
        return;
      }

      // Check existing user
      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
        res.status(409).json({ message: 'An account with this email address already exists.' });
        return;
      }

      const existingPhone = await UserModel.findOne({ phone });
      if (existingPhone) {
        res.status(409).json({ message: 'An account with this phone number already exists.' });
        return;
      }

      const newUser = await UserModel.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        address: address?.trim() || '',
        role: 'user',
        familyMembers: []
      });

      const token = generateToken({
        userId: newUser._id,
        role: newUser.role,
        email: newUser.email
      });

      const { password: _, ...safeUser } = newUser;
      res.status(201).json({
        message: 'Account created successfully! Welcome to MediLab.',
        token,
        user: safeUser
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      res.status(500).json({ message: 'Failed to complete registration. Please try again.' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Please provide both email and password.' });
        return;
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Invalid email or password.' });
        return;
      }

      const isMatch = await UserModel.comparePassword(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid email or password.' });
        return;
      }

      const token = generateToken({
        userId: user._id,
        role: user.role,
        email: user.email
      });

      const { password: _, ...safeUser } = user;
      res.json({
        message: 'Logged in successfully.',
        token,
        user: safeUser
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Failed to sign in. Please try again.' });
    }
  }

  static async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated.' });
        return;
      }

      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        res.status(404).json({ message: 'User account not found.' });
        return;
      }

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (err: any) {
      console.error('getMe error:', err);
      res.status(500).json({ message: 'Failed to retrieve user profile.' });
    }
  }
}
