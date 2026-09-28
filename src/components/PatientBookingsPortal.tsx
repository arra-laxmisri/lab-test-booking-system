import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { IBooking } from '../types/index.js';
import { StatusBadge } from './StatusBadge.js';
import { 
  Search, 
  Calendar, 
  Clock, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  LogIn, 
  AlertCircle,
  Loader2,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface PatientBookingsPortalProps {
  onViewBookingDetails: (bookingId: string) => void;
  onBookNewTest: () => void;
  onDownloadReport: (booking: IBooking) => void;
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
  onLoginSuccess: () => void;
}

export const PatientBookingsPortal: React.FC<PatientBookingsPortalProps> = ({
  onViewBookingDetails,
  onBookNewTest,
  onDownloadReport,
  onNavigateLogin,
  onNavigateRegister,
  onLoginSuccess,
}) => {
  const { login } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [trackedBookings, setTrackedBookings] = useState<IBooking[]>([]);
  const [searchError, setSearchError] = useState('');
  const [demoLoggingIn, setDemoLoggingIn] = useState(false);

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchError('Please enter your Booking ID (e.g. MLB-72810) or registered phone number.');
      return;
    }

    setSearching(true);
    setSearchError('');
    setSearched(true);

    try {
      // First try by ID directly
      if (query.toUpperCase().startsWith('MLB') || query.startsWith('bk-')) {
        try {
          const directRes = await api.bookings.getById(query);
          if (directRes && directRes.booking) {
            setTrackedBookings([directRes.booking]);
            setSearching(false);
            return;
          }
        } catch {
          // Fall back to general search
        }
      }

      const res = await api.bookings.getAll({ search: query, phone: query });
      setTrackedBookings(res.bookings || []);
      if (!res.bookings || res.bookings.length === 0) {
        setSearchError(`No diagnostic bookings found matching "${query}". Please verify the booking ID or phone number.`);
      }
    } catch (err: any) {
      setSearchError(err.message || 'Unable to track booking at this time.');
      setTrackedBookings([]);
    } finally {
      setSearching(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setDemoLoggingIn(true);
    try {
      await login({ email: 'demo@medilab.com', password: 'User@123' });
      onLoginSuccess();
    } catch (err: any) {
      setSearchError(err.message || 'Demo login failed');
    } finally {
      setDemoLoggingIn(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-full">
          <Activity className="w-3.5 h-3.5" />
          <span>Patient Portal & Sample Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Lab Test Bookings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Enter your Booking Reference Number or registered mobile number to check sample collection status and download verified pathology reports.
        </p>
      </div>

      {/* Quick Lookup Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <form onSubmit={handleTrackSearch} className="space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            Search by Booking ID or Contact Number
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchError('');
                }}
                placeholder="e.g. MLB-72810, MLB-61944, or 9876501234"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {searching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Test</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
            <span className="font-semibold text-slate-700">Quick Try Examples:</span>
            <button
              type="button"
              onClick={() => setSearchQuery('MLB-72810')}
              className="font-mono text-teal-700 hover:underline cursor-pointer"
            >
              MLB-72810
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setSearchQuery('9876501234')}
              className="font-mono text-teal-700 hover:underline cursor-pointer"
            >
              9876501234
            </button>
          </div>
        </form>

        {searchError && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>{searchError}</p>
          </div>
        )}

        {/* Search Results */}
        {searched && trackedBookings.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Found {trackedBookings.length} Matching Booking{trackedBookings.length > 1 ? 's' : ''}
            </h2>

            <div className="space-y-3">
              {trackedBookings.map((b) => (
                <div
                  key={b._id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-teal-300 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {b.bookingId}
                      </span>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="font-bold text-sm text-slate-900">{b.testName}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span>Patient: <strong className="text-slate-800">{b.patientDetails.name}</strong></span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        {b.date} ({b.timeSlot})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {(b.status === 'Report Ready' || b.status === 'Completed') && (
                      <button
                        type="button"
                        onClick={() => onDownloadReport(b)}
                        className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Report</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onViewBookingDetails(b._id)}
                      className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Track Progress</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sign In & Account Access Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Account Login */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <UserCheck className="w-5 h-5" />
            <h3>Already a MediLab Patient?</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sign in to view your complete appointment history, manage saved family members, reschedule tests, and download certified laboratory reports anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={onNavigateLogin}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-teal-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </button>
            <button
              onClick={onNavigateRegister}
              className="px-4 py-2.5 text-xs font-bold text-teal-700 hover:bg-teal-50 rounded-xl border border-teal-200 transition-colors flex items-center justify-center cursor-pointer"
            >
              Register New Account
            </button>
          </div>
        </div>

        {/* Instant 1-Click Demo Login */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h3>Try With Demo Patient Account</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Instantly explore MediLab with pre-populated patient data, active appointments, sample tracking, family members, and test reports.
          </p>
          <div className="pt-2">
            <button
              onClick={handleQuickDemoLogin}
              disabled={demoLoggingIn}
              className="w-full px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {demoLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In as Demo Patient...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1-Click Sign In (Aarav Sharma)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Book a New Test CTA */}
      <div className="text-center p-6 bg-slate-100/70 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <h4 className="text-sm font-bold text-slate-900">Looking to book a new laboratory test?</h4>
          <p className="text-xs text-slate-500 mt-0.5">Choose from over 25+ blood tests and health checkup packages with home collection.</p>
        </div>
        <button
          onClick={onBookNewTest}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
        >
          Browse All Tests
        </button>
      </div>
    </div>
  );
};
