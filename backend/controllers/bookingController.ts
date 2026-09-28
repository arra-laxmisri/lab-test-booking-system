import { Response } from 'express';
import { BookingModel } from '../models/Booking.js';
import { TestModel } from '../models/Test.js';
import { UserModel } from '../models/User.js';
import { AuthRequest, generateToken } from '../middleware/auth.js';

export class BookingController {
  static async createBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { testId, patientDetails, collectionMethod, address, date, timeSlot } = req.body;

      if (!testId || !patientDetails || !collectionMethod || !date || !timeSlot) {
        res.status(400).json({ message: 'Missing required booking details.' });
        return;
      }

      if (!patientDetails.name || !patientDetails.age || !patientDetails.gender || !patientDetails.phone) {
        res.status(400).json({ message: 'Please provide patient name, age, gender, and contact phone number.' });
        return;
      }

      if (collectionMethod === 'home') {
        if (!address || !address.street || !address.city || !address.pincode) {
          res.status(400).json({ message: 'Home sample collection requires street address, city, and pincode.' });
          return;
        }
      }

      const test = await TestModel.findById(testId);
      if (!test) {
        res.status(404).json({ message: 'The selected laboratory test is no longer available.' });
        return;
      }

      // Determine userId: if authenticated use session, otherwise create/find patient user
      let userId = req.user?.userId;
      let autoToken: string | undefined;
      let createdUser: any;

      if (!userId) {
        const cleanPhone = String(patientDetails.phone).trim();
        let existingUser = await UserModel.findOne({ phone: cleanPhone });
        
        if (!existingUser) {
          const digitsOnly = cleanPhone.replace(/\D/g, '') || String(Date.now());
          const tempEmail = `patient_${digitsOnly}@medilab.com`;
          existingUser = await UserModel.create({
            name: patientDetails.name.trim(),
            email: tempEmail,
            phone: cleanPhone,
            password: 'Patient@123',
            role: 'user',
            address: collectionMethod === 'home' && address ? `${address.street}, ${address.city} - ${address.pincode}` : '',
            familyMembers: patientDetails.type === 'family' ? [{
              id: 'fam-' + Date.now(),
              name: patientDetails.name.trim(),
              relation: patientDetails.relation?.trim() || 'Family Member',
              age: Number(patientDetails.age),
              gender: patientDetails.gender,
              phone: cleanPhone
            }] : []
          });
        }
        
        userId = existingUser._id;
        autoToken = generateToken({
          userId: existingUser._id,
          role: existingUser.role,
          email: existingUser.email
        });
        createdUser = {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          role: existingUser.role,
          address: existingUser.address
        };
      }

      const booking = await BookingModel.create({
        userId,
        testId: test._id,
        testName: test.name,
        patientDetails: {
          type: patientDetails.type || 'self',
          name: patientDetails.name.trim(),
          age: Number(patientDetails.age),
          gender: patientDetails.gender,
          phone: patientDetails.phone.trim(),
          relation: patientDetails.relation?.trim()
        },
        collectionMethod: collectionMethod === 'home' ? 'home' : 'lab',
        address: collectionMethod === 'home' ? {
          street: address.street.trim(),
          city: address.city.trim(),
          pincode: address.pincode.trim()
        } : undefined,
        date: date.trim(),
        timeSlot: timeSlot.trim(),
        price: test.price,
        status: 'Confirmed' // Initial confirmed status for instant ease of use
      });

      res.status(201).json({
        message: 'Your laboratory test booking has been confirmed!',
        booking,
        token: autoToken,
        user: createdUser
      });
    } catch (err: any) {
      console.error('createBooking error:', err);
      res.status(500).json({ message: 'Failed to create booking. Please try again.' });
    }
  }

  static async getBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, search, phone } = req.query;

      let bookings: any[] = [];
      if (req.user) {
        if (req.user.role === 'admin') {
          bookings = await BookingModel.find({
            status: status as string,
            search: search as string
          });
        } else {
          bookings = await BookingModel.find({
            userId: req.user.userId,
            status: status as string,
            search: search as string
          });
        }
      } else if (phone || search) {
        // Guest / tracking lookup by phone or search query
        bookings = await BookingModel.find({
          status: status as string,
          search: (search || phone) as string
        });
      } else {
        bookings = [];
      }

      res.json({
        count: bookings.length,
        bookings
      });
    } catch (err: any) {
      console.error('getBookings error:', err);
      res.status(500).json({ message: 'Unable to load bookings.' });
    }
  }

  static async getBookingById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const booking = await BookingModel.findById(id);

      if (!booking) {
        res.status(404).json({ message: 'Booking not found.' });
        return;
      }

      // Check ownership or admin if authenticated
      if (req.user && req.user.role !== 'admin' && booking.userId !== req.user.userId) {
        const currentUser = await UserModel.findById(req.user.userId);
        if (currentUser?.phone !== booking.patientDetails.phone) {
          res.status(403).json({ message: 'You do not have permission to view this booking.' });
          return;
        }
      }

      res.json({ booking });
    } catch (err: any) {
      console.error('getBookingById error:', err);
      res.status(500).json({ message: 'Failed to retrieve booking details.' });
    }
  }

  static async updateBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized.' });
        return;
      }

      const { id } = req.params;
      const { status } = req.body;

      const booking = await BookingModel.findById(id);
      if (!booking) {
        res.status(404).json({ message: 'Booking not found.' });
        return;
      }

      // If regular user, only allow cancelling if status is not completed/cancelled
      if (req.user.role !== 'admin') {
        if (booking.userId !== req.user.userId) {
          res.status(403).json({ message: 'Unauthorized to modify this booking.' });
          return;
        }

        if (status !== 'Cancelled') {
          res.status(403).json({ message: 'Users can only request cancellation of their booking.' });
          return;
        }

        if (booking.status === 'Completed' || booking.status === 'Report Ready') {
          res.status(400).json({ message: 'Cannot cancel a booking once testing has completed.' });
          return;
        }
      }

      const updated = await BookingModel.updateById(id, req.body);
      res.json({
        message: 'Booking updated successfully.',
        booking: updated
      });
    } catch (err: any) {
      console.error('updateBooking error:', err);
      res.status(500).json({ message: 'Failed to update booking status.' });
    }
  }

  static async deleteBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized.' });
        return;
      }

      const { id } = req.params;
      const booking = await BookingModel.findById(id);

      if (!booking) {
        res.status(404).json({ message: 'Booking not found.' });
        return;
      }

      if (req.user.role !== 'admin' && booking.userId !== req.user.userId) {
        res.status(403).json({ message: 'Unauthorized to cancel this booking.' });
        return;
      }

      // Mark as cancelled rather than hard deleting to preserve audit history
      const updated = await BookingModel.updateById(id, { status: 'Cancelled' });
      res.json({
        message: 'Booking has been cancelled.',
        booking: updated
      });
    } catch (err: any) {
      console.error('deleteBooking error:', err);
      res.status(500).json({ message: 'Failed to cancel booking.' });
    }
  }
}
