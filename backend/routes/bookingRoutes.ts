import { Router } from 'express';
import { BookingController } from '../controllers/bookingController.js';
import { verifyAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', optionalAuth, BookingController.createBooking);
router.get('/', optionalAuth, BookingController.getBookings);
router.get('/:id', optionalAuth, BookingController.getBookingById);
router.put('/:id', verifyAuth, BookingController.updateBooking);
router.delete('/:id', verifyAuth, BookingController.deleteBooking);

export default router;
