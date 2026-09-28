import { Response } from 'express';
import { UserModel } from '../models/User.js';
import { BookingModel } from '../models/Booking.js';
import { AuthRequest } from '../middleware/auth.js';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized.' });
        return;
      }

      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        res.status(404).json({ message: 'User profile not found.' });
        return;
      }

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (err: any) {
      console.error('getProfile error:', err);
      res.status(500).json({ message: 'Failed to retrieve profile.' });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized.' });
        return;
      }

      const { name, phone, address, dob, gender, familyMembers } = req.body;

      const updateData: any = {};
      if (name) updateData.name = name.trim();
      if (phone) updateData.phone = phone.trim();
      if (address !== undefined) updateData.address = address.trim();
      if (dob !== undefined) updateData.dob = dob;
      if (gender !== undefined) updateData.gender = gender;
      if (familyMembers !== undefined) updateData.familyMembers = familyMembers;

      const updated = await UserModel.updateById(req.user.userId, updateData);
      if (!updated) {
        res.status(404).json({ message: 'User profile not found.' });
        return;
      }

      const { password: _, ...safeUser } = updated;
      res.json({
        message: 'Profile updated successfully.',
        user: safeUser
      });
    } catch (err: any) {
      console.error('updateProfile error:', err);
      res.status(500).json({ message: 'Failed to update profile.' });
    }
  }

  static async getAdminUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await UserModel.find();
      const allBookings = await BookingModel.find();

      const userStats = users.map(u => {
        const { password: _, ...safeUser } = u;
        const userBookings = allBookings.filter(b => b.userId === u._id);
        return {
          ...safeUser,
          bookingCount: userBookings.length,
          lastBookingDate: userBookings.length > 0 ? userBookings[0].createdAt : null,
          totalSpent: userBookings.filter(b => b.status !== 'Cancelled').reduce((sum, b) => sum + b.price, 0)
        };
      });

      res.json({ users: userStats });
    } catch (err: any) {
      console.error('getAdminUsers error:', err);
      res.status(500).json({ message: 'Failed to retrieve user registry.' });
    }
  }

  static async getAdminStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await UserModel.find();
      const bookings = await BookingModel.find();

      const totalUsers = users.length;
      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed' || b.status === 'Sample Collected' || b.status === 'Testing').length;
      const completedBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Report Ready').length;
      const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;
      const totalRevenue = bookings
        .filter(b => b.status !== 'Cancelled')
        .reduce((sum, b) => sum + b.price, 0);

      res.json({
        totalUsers,
        totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue
      });
    } catch (err: any) {
      console.error('getAdminStats error:', err);
      res.status(500).json({ message: 'Failed to compile system metrics.' });
    }
  }
}
