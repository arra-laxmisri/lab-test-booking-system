import React, { useState, useEffect } from 'react';
import { ITest, IBooking, IUser, IAdminStats, BookingStatus } from '../types/index.js';
import { api } from '../services/api.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  FlaskConical, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  AlertCircle,
  FileText,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

interface AdminDashboardPageProps {
  onDownloadReport: (booking: IBooking) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onDownloadReport }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'tests' | 'users'>('overview');
  
  // Data states
  const [stats, setStats] = useState<IAdminStats | null>(null);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [tests, setTests] = useState<ITest[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Booking search & filter
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState('All');

  // Test management modal state
  const [editingTest, setEditingTest] = useState<ITest | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testForm, setTestForm] = useState<{
    name: string;
    description: string;
    category: string;
    price: number;
    sampleType: string;
    reportTime: string;
    preparation: string;
    available: boolean;
  }>({
    name: '',
    description: '',
    category: 'Blood Tests',
    price: 499,
    sampleType: 'Blood (Serum)',
    reportTime: '12 Hours',
    preparation: 'Overnight fasting of 8-10 hours is advised.',
    available: true,
  });

  // Status update modal for booking
  const [statusModalBooking, setStatusModalBooking] = useState<IBooking | null>(null);
  const [newStatus, setNewStatus] = useState<BookingStatus>('Confirmed');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, testsRes, usersRes] = await Promise.all([
        api.admin.getStats(),
        api.bookings.getAll(),
        api.tests.getAll(),
        api.admin.getUsers(),
      ]);

      setStats(statsRes);
      setBookings(bookingsRes.bookings);
      setTests(testsRes.tests);
      setUsers(usersRes.users);
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Failed loading admin data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddTest = () => {
    setEditingTest(null);
    setTestForm({
      name: '',
      description: '',
      category: 'Blood Tests',
      price: 499,
      sampleType: 'Blood (Serum)',
      reportTime: '12 Hours',
      preparation: 'Overnight fasting of 8-10 hours is advised.',
      available: true,
    });
    setShowTestModal(true);
  };

  const handleOpenEditTest = (test: ITest) => {
    setEditingTest(test);
    setTestForm({
      name: test.name,
      description: test.description,
      category: test.category,
      price: test.price,
      sampleType: test.sampleType,
      reportTime: test.reportTime,
      preparation: test.preparation,
      available: test.available,
    });
    setShowTestModal(true);
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTest) {
        await api.tests.update(editingTest._id, testForm);
        setNotice({ type: 'success', message: 'Test catalog entry updated successfully.' });
      } else {
        await api.tests.create({
          ...testForm,
          parameters: ['Standard diagnostic panel'],
        });
        setNotice({ type: 'success', message: 'New diagnostic test added to catalog.' });
      }
      setShowTestModal(false);
      loadData();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Failed saving test.' });
    }
  };

  const handleDeleteTest = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the laboratory test catalog?`)) {
      return;
    }
    try {
      await api.tests.delete(id);
      setNotice({ type: 'success', message: 'Test successfully removed from catalog.' });
      loadData();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Failed to delete test.' });
    }
  };

  const handleUpdateBookingStatus = async () => {
    if (!statusModalBooking) return;
    try {
      await api.bookings.update(statusModalBooking._id, { status: newStatus });
      setNotice({ type: 'success', message: `Booking ${statusModalBooking.bookingId} status updated to "${newStatus}".` });
      setStatusModalBooking(null);
      loadData();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Failed to update booking status.' });
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = bookingFilterStatus === 'All' || b.status.toLowerCase() === bookingFilterStatus.toLowerCase();
    const q = bookingSearch.trim().toLowerCase();
    const matchesSearch = !q ||
      b.bookingId.toLowerCase().includes(q) ||
      b.testName.toLowerCase().includes(q) ||
      b.patientDetails.name.toLowerCase().includes(q) ||
      b.patientDetails.phone.includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Laboratory Administration Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            MediLab Management Center
          </h1>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'tests'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Test Catalog ({tests.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registered Patients ({users.length})
          </button>
        </div>
      </div>

      {/* Global Notice */}
      {notice && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 ${
            notice.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Total Users</span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                {stats.totalUsers}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Verified patient accounts</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-indigo-700 block mb-1">Total Bookings</span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                {stats.totalBookings}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">All-time diagnostic requests</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-amber-700 block mb-1">Pending / Processing</span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-800 tabular-nums">
                {stats.pendingBookings}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Requires sample collection/testing</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-emerald-700 block mb-1">Completed / Ready</span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-800 tabular-nums">
                {stats.completedBookings}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Report generated & delivered</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold text-teal-700 block mb-1">Total Revenue</span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-teal-800 tabular-nums">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Settled bookings</p>
            </div>
          </div>

          {/* Recent Bookings Queue Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Diagnostic Bookings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Quick status management queue</p>
              </div>
              <button
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
              >
                View Full Queue ({bookings.length})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Booking ID</th>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Test Name</th>
                    <th className="py-2.5 px-3">Date & Slot</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{b.bookingId}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {b.patientDetails.name}
                        <span className="block text-[11px] text-slate-400 font-mono">{b.patientDetails.phone}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{b.testName}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                        {b.date} · {b.timeSlot}
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setStatusModalBooking(b);
                            setNewStatus(b.status);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md cursor-pointer"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search by Booking ID, patient name, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Filter Status:</span>
              <select
                value={bookingFilterStatus}
                onChange={(e) => setBookingFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Sample Collected">Sample Collected</option>
                <option value="Testing">Testing</option>
                <option value="Report Ready">Report Ready</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Test Title</th>
                    <th className="py-3 px-4">Scheduled Slot</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Fee</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.bookingId}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{b.patientDetails.name}</span>
                        <span className="block text-[11px] text-slate-500 font-mono">{b.patientDetails.phone}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{b.testName}</td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {b.date}
                        <span className="block text-slate-400">{b.timeSlot}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize font-medium text-slate-700">
                          {b.collectionMethod === 'home' ? 'Home' : 'Lab'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">₹{b.price}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(b.status === 'Report Ready' || b.status === 'Completed') && (
                            <button
                              onClick={() => onDownloadReport(b)}
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer"
                              title="View Generated Report"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setStatusModalBooking(b);
                              setNewStatus(b.status);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md cursor-pointer whitespace-nowrap"
                          >
                            Update Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE TESTS */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Diagnostic Test Catalog</h2>
              <p className="text-xs text-slate-500">Add, edit, or adjust pricing of available laboratory tests.</p>
            </div>
            <button
              onClick={handleOpenAddTest}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Test</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Test Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Sample Type</th>
                    <th className="py-3 px-4">Turnaround</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tests.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 text-sm block">{t.name}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{t.description}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-teal-700">{t.category}</td>
                      <td className="py-3 px-4 text-slate-600">{t.sampleType}</td>
                      <td className="py-3 px-4 text-slate-600">{t.reportTime}</td>
                      <td className="py-3 px-4 font-bold font-mono text-slate-900">₹{t.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          t.available ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {t.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditTest(t)}
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="Edit test"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTest(t._id, t.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Delete test"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REGISTERED USERS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registered Patient Directory</h2>
            <p className="text-xs text-slate-500">View user registration records and lifetime booking history.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Total Bookings</th>
                    <th className="py-3 px-4">Total Spent</th>
                    <th className="py-3 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{u.phone}</td>
                      <td className="py-3 px-4 text-slate-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          u.role === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 tabular-nums">
                        {u.bookingCount || 0}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-teal-800 tabular-nums">
                        ₹{(u.totalSpent || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Test Add/Edit Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingTest ? 'Edit Diagnostic Test' : 'Add New Diagnostic Test'}
              </h3>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Test Name *</label>
                <input
                  type="text"
                  value={testForm.name}
                  onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                  required
                  placeholder="e.g., Vitamin B12 (Cobalamin)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  value={testForm.description}
                  onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                  required
                  rows={3}
                  placeholder="Clinical significance and health utility..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={testForm.category}
                    onChange={(e) => setTestForm({ ...testForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Blood Tests">Blood Tests</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Thyroid">Thyroid</option>
                    <option value="Liver">Liver</option>
                    <option value="Kidney">Kidney</option>
                    <option value="Vitamins">Vitamins</option>
                    <option value="Hormones">Hormones</option>
                    <option value="Full Body Checkups">Full Body Checkups</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    min="50"
                    value={testForm.price}
                    onChange={(e) => setTestForm({ ...testForm, price: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sample Type *</label>
                  <input
                    type="text"
                    value={testForm.sampleType}
                    onChange={(e) => setTestForm({ ...testForm, sampleType: e.target.value })}
                    required
                    placeholder="e.g., Blood (Serum)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Report Time *</label>
                  <input
                    type="text"
                    value={testForm.reportTime}
                    onChange={(e) => setTestForm({ ...testForm, reportTime: e.target.value })}
                    required
                    placeholder="e.g., 12 Hours"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preparation Instructions</label>
                <input
                  type="text"
                  value={testForm.preparation}
                  onChange={(e) => setTestForm({ ...testForm, preparation: e.target.value })}
                  placeholder="e.g., 10-12 hours overnight fasting recommended"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="testAvailable"
                  checked={testForm.available}
                  onChange={(e) => setTestForm({ ...testForm, available: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="testAvailable" className="font-semibold text-slate-800">
                  Available for Online Booking
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  {editingTest ? 'Save Updates' : 'Add Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Status Update Modal */}
      {statusModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Update Booking Status
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ref ID: <strong className="font-mono text-slate-800">{statusModalBooking.bookingId}</strong> · {statusModalBooking.testName}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Select New Status</label>
              <select
                value={newStatus}
                onChange={(e: any) => setNewStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Sample Collected">Sample Collected</option>
                <option value="Testing">Testing</option>
                <option value="Report Ready">Report Ready (Generates Verified PDF)</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {newStatus === 'Report Ready' && (
                <p className="text-[11px] text-teal-700 bg-teal-50 p-2 rounded-lg">
                  ✓ Marking as "Report Ready" will automatically compile verified diagnostic results and enable patient PDF download.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusModalBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateBookingStatus}
                className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
