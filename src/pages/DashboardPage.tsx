import React, { useState } from 'react';
import { IBooking, BookingStatus } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { useAuth } from '../context/AuthContext.js';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  Home, 
  Building2,
  Filter,
  Plus
} from 'lucide-react';

interface DashboardPageProps {
  bookings: IBooking[];
  onViewBookingDetails: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onBookNewTest: () => void;
  onDownloadReport: (booking: IBooking) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  bookings,
  onViewBookingDetails,
  onCancelBooking,
  onBookNewTest,
  onDownloadReport,
}) => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [cancelModalBooking, setCancelModalBooking] = useState<IBooking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Metrics
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(
    (b) => b.status === 'Pending' || b.status === 'Confirmed' || b.status === 'Sample Collected' || b.status === 'Testing'
  );
  const completedBookings = bookings.filter((b) => b.status === 'Completed' || b.status === 'Report Ready');
  const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled');

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Upcoming') {
      return b.status === 'Pending' || b.status === 'Confirmed' || b.status === 'Sample Collected' || b.status === 'Testing';
    }
    if (filterStatus === 'Completed') {
      return b.status === 'Completed' || b.status === 'Report Ready';
    }
    if (filterStatus === 'Cancelled') {
      return b.status === 'Cancelled';
    }
    return b.status === filterStatus;
  });

  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      await onCancelBooking(cancelModalBooking._id);
      setCancelModalBooking(null);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Welcome back, <span className="font-semibold text-slate-900">{user?.name}</span>. Manage your laboratory test appointments and view diagnostic reports.
          </p>
        </div>

        <button
          onClick={onBookNewTest}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book a New Test</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Bookings</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {totalBookings}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Lifetime appointments</p>
        </div>

        {/* Upcoming */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-sky-700 block mb-1">Upcoming</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {upcomingBookings.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Scheduled or processing</p>
        </div>

        {/* Completed / Reports Ready */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-emerald-700 block mb-1">Completed</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {completedBookings.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Reports ready</p>
        </div>

        {/* Cancelled */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Cancelled</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-slate-700 tabular-nums">
            {cancelledBookings.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Cancelled requests</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => {
          const isActive = filterStatus === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const canCancel =
              booking.status === 'Pending' || booking.status === 'Confirmed';
            const hasReport =
              booking.status === 'Report Ready' || booking.status === 'Completed';

            return (
              <div
                key={booking._id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {booking.bookingId}
                    </span>
                    <StatusBadge status={booking.status} />
                    <span className="text-xs text-slate-400 font-sans">
                      Patient: <strong className="text-slate-700">{booking.patientDetails.name}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {booking.testName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {booking.timeSlot}
                    </span>
                    <span className="flex items-center gap-1">
                      {booking.collectionMethod === 'home' ? (
                        <>
                          <Home className="w-3.5 h-3.5 text-teal-600" />
                          <span>Home Collection</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-teal-600" />
                          <span>Lab Visit</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Right side: Price & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-400 block leading-none">Total Fee</span>
                    <span className="text-lg font-bold font-mono text-slate-900">
                      ₹{booking.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasReport && (
                      <button
                        onClick={() => onDownloadReport(booking)}
                        className="px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Report</span>
                      </button>
                    )}

                    <button
                      onClick={() => onViewBookingDetails(booking._id)}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Track Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {canCancel && (
                      <button
                        onClick={() => setCancelModalBooking(booking)}
                        className="px-2.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No bookings in this category</h3>
            <p className="text-xs text-slate-500 mt-1">
              You do not have any {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} laboratory test bookings.
            </p>
            <button
              onClick={onBookNewTest}
              className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Browse Laboratory Tests
            </button>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Cancel Test Booking?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to cancel booking <strong className="font-mono text-slate-800">{cancelModalBooking.bookingId}</strong> ({cancelModalBooking.testName})? This action cannot be reversed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
