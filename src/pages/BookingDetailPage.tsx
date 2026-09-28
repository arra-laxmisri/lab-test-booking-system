import React, { useState, useEffect } from 'react';
import { IBooking } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { ProgressTracker } from '../components/ProgressTracker.js';
import { api } from '../services/api.js';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  Home, 
  Building2, 
  User, 
  AlertCircle,
  ShieldCheck,
  Phone,
  Printer,
  Loader2
} from 'lucide-react';

interface BookingDetailPageProps {
  bookingId?: string;
  initialBooking?: IBooking | null;
  booking?: IBooking | null;
  onBack: () => void;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onDownloadReport: (booking: IBooking) => void;
}

export const BookingDetailPage: React.FC<BookingDetailPageProps> = ({
  bookingId,
  initialBooking,
  booking: propBooking,
  onBack,
  onCancelBooking,
  onDownloadReport,
}) => {
  const [booking, setBooking] = useState<IBooking | null>(propBooking || initialBooking || null);
  const [loading, setLoading] = useState<boolean>(!booking && !!bookingId);
  const [error, setError] = useState<string>('');
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (propBooking) {
      setBooking(propBooking);
    } else if (initialBooking) {
      setBooking(initialBooking);
    }
  }, [propBooking, initialBooking]);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!booking && bookingId) {
        setLoading(true);
        setError('');
        try {
          const res = await api.bookings.getById(bookingId);
          setBooking(res.booking);
        } catch (err: any) {
          setError(err.message || 'Unable to locate this booking. It may have expired or belongs to another session.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDetail();
  }, [bookingId, booking]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-600">Retrieving diagnostic booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Booking Details Not Available</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          {error || 'We could not locate this laboratory booking record. Please check the booking ID or verify your sign-in details.'}
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
        >
          Return to My Bookings
        </button>
      </div>
    );
  }

  const canCancel = booking.status === 'Pending' || booking.status === 'Confirmed';
  const hasReport = booking.status === 'Report Ready' || booking.status === 'Completed';

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await onCancelBooking(booking._id);
      setBooking((prev) => (prev ? { ...prev, status: 'Cancelled' } : null));
      setShowCancelConfirm(false);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Back Action */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookings</span>
        </button>
      </div>

      {/* Main Booking Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Booking ID:
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {booking.bookingId}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {booking.testName}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={booking.status} className="text-xs px-3 py-1.5" />
            {hasReport && (
              <button
                onClick={() => onDownloadReport(booking)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>View Report</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual 5-Step Progress Tracker */}
        <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-100">
          <h2 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
            Live Testing Status Tracker
          </h2>
          <ProgressTracker status={booking.status} collectionMethod={booking.collectionMethod} />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Patient Details */}
          <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Patient Demographics
            </h3>
            <div className="space-y-1.5 text-slate-600">
              <p>
                <span className="text-slate-400">Name:</span> <strong className="text-slate-800">{booking.patientDetails.name}</strong>
              </p>
              <p>
                <span className="text-slate-400">Age / Gender:</span> {booking.patientDetails.age} Years · {booking.patientDetails.gender}
              </p>
              <p className="flex items-center gap-1">
                <span className="text-slate-400">Phone:</span>{' '}
                <span className="font-mono text-slate-800">{booking.patientDetails.phone}</span>
              </p>
              {booking.patientDetails.relation && (
                <p>
                  <span className="text-slate-400">Relationship:</span> {booking.patientDetails.relation}
                </p>
              )}
            </div>
          </div>

          {/* Schedule & Collection Details */}
          <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              {booking.collectionMethod === 'home' ? (
                <Home className="w-4 h-4 text-teal-600" />
              ) : (
                <Building2 className="w-4 h-4 text-teal-600" />
              )}
              Collection Logistics
            </h3>
            <div className="space-y-1.5 text-slate-600">
              <p>
                <span className="text-slate-400">Date:</span>{' '}
                <span className="font-mono font-semibold text-slate-800">{booking.date}</span>
              </p>
              <p>
                <span className="text-slate-400">Time Window:</span>{' '}
                <span className="font-mono font-semibold text-slate-800">{booking.timeSlot}</span>
              </p>
              <p>
                <span className="text-slate-400">Method:</span>{' '}
                <span className="font-semibold text-teal-800">
                  {booking.collectionMethod === 'home' ? 'Home Sample Pickup' : 'Visit Laboratory'}
                </span>
              </p>
              {booking.collectionMethod === 'home' && booking.address && (
                <p className="text-[11px] text-slate-500">
                  {booking.address.street}, {booking.address.city} - {booking.address.pincode}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Actions Row */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-500 font-semibold">Total Amount:</span>
            <span className="text-xl font-bold font-mono text-slate-900">₹{booking.price}</span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              Payment Confirmed
            </span>
          </div>

          <div className="flex items-center gap-3">
            {canCancel && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel Booking
              </button>
            )}

            {hasReport && (
              <button
                onClick={() => onDownloadReport(booking)}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official PDF Report</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Confirm Cancellation</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to cancel booking <strong className="font-mono text-slate-800">{booking.bookingId}</strong>?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
