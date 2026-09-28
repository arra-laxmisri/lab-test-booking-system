import React from 'react';
import { IBooking } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { CheckCircle2, Calendar, Clock, Home, Building2, User, ArrowRight, FileText } from 'lucide-react';

interface BookingConfirmationPageProps {
  booking: IBooking;
  onViewBookingDetails: (bookingId: string) => void;
  onGoToDashboard: () => void;
  onBookAnotherTest: () => void;
}

export const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({
  booking,
  onViewBookingDetails,
  onGoToDashboard,
  onBookAnotherTest,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Hero Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Test Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Thank you for choosing MediLab. A confirmation SMS with details has been sent to{' '}
          <span className="font-semibold text-slate-800">{booking.patientDetails.phone}</span>.
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Booking ID Header */}
        <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-teal-300 font-semibold tracking-wider uppercase block">
              Booking Reference Number
            </span>
            <span className="text-xl font-mono font-bold text-white tracking-wide">
              {booking.bookingId}
            </span>
          </div>

          <div>
            <StatusBadge status={booking.status} className="border-slate-700 bg-slate-800 text-teal-300" />
          </div>
        </div>

        {/* Key Info Details */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">Diagnostic Test</span>
              <span className="font-bold text-slate-900 text-sm">{booking.testName}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">Patient Name</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                {booking.patientDetails.name} ({booking.patientDetails.age} yrs, {booking.patientDetails.gender})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">Scheduled Date</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                {booking.date}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">Time Slot</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                {booking.timeSlot}
              </span>
            </div>
          </div>

          <div className="pb-4 border-b border-slate-100">
            <span className="text-slate-400 block text-[11px] mb-0.5">Sample Collection Mode</span>
            <div className="flex items-start gap-2 text-slate-800">
              {booking.collectionMethod === 'home' ? (
                <>
                  <Home className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Home Sample Collection</span>
                    {booking.address && (
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {booking.address.street}, {booking.address.city} - {booking.address.pincode}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Direct Laboratory Visit</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      MediLab Central Tower, 42 Healthcare Boulevard
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-slate-800">Total Paid / Payable</span>
            <span className="text-xl font-bold font-mono text-teal-800">₹{booking.price}</span>
          </div>
        </div>

        {/* Helpful Advice */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs text-slate-600">
          <p className="font-bold text-slate-800 mb-0.5">Next Steps:</p>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Our lab coordinator will call 30 minutes prior to arrival. Keep your phone accessible. You can track live sample status anytime in your dashboard.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => onViewBookingDetails(booking._id)}
          className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Track Booking Progress</span>
        </button>

        <button
          onClick={onGoToDashboard}
          className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-white rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Go to My Dashboard</span>
        </button>

        <button
          onClick={onBookAnotherTest}
          className="w-full sm:w-auto px-4 py-3 text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
        >
          Book Another Test
        </button>
      </div>
    </div>
  );
};
