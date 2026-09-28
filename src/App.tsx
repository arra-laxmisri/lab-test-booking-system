import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { api } from './services/api.js';
import { ITest, IBooking } from './types/index.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ReportModal } from './components/ReportModal.js';
import { HomePage } from './pages/HomePage.js';
import { TestsPage } from './pages/TestsPage.js';
import { TestDetailPage } from './pages/TestDetailPage.js';
import { BookingFlowPage } from './pages/BookingFlowPage.js';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { BookingDetailPage } from './pages/BookingDetailPage.js';
import { PatientBookingsPortal } from './components/PatientBookingsPortal.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, isAdmin, loading: authLoading } = useAuth();

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedTest, setSelectedTest] = useState<ITest | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<IBooking | null>(null);
  const [reportModalBooking, setReportModalBooking] = useState<IBooking | null>(null);

  // Search query propagated from HomePage to TestsPage
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  // Tests & Bookings Data Cache
  const [tests, setTests] = useState<ITest[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Load tests on mount
  const fetchTests = async () => {
    try {
      const res = await api.tests.getAll();
      setTests(res.tests);
    } catch (err) {
      console.error('Failed fetching tests:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Load bookings for current user or admin
  const fetchBookings = async () => {
    if (!user) {
      setBookings([]);
      return;
    }
    try {
      const res = await api.bookings.getAll();
      setBookings(res.bookings);
    } catch (err) {
      console.error('Failed fetching bookings:', err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Routing navigation helper
  const navigate = (tab: string, param?: any) => {
    if (tab === 'test-detail' && param) {
      setSelectedTest(param);
    } else if (tab === 'booking-flow' && param) {
      setSelectedTest(param);
    } else if (tab === 'booking-detail' && param) {
      setSelectedBookingId(param);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookNow = (test: ITest) => {
    setSelectedTest(test);
    setCurrentTab('booking-flow');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewTestDetails = (test: ITest) => {
    setSelectedTest(test);
    setCurrentTab('test-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSuccess = (booking: IBooking) => {
    setConfirmedBooking(booking);
    setBookings((prev) => {
      const exists = prev.some((b) => b._id === booking._id || b.bookingId === booking.bookingId);
      if (exists) return prev;
      return [booking, ...prev];
    });
    fetchBookings();
    setCurrentTab('booking-confirm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await api.bookings.cancel(bookingId);
      await fetchBookings();
    } catch (err) {
      console.error('Failed cancelling booking:', err);
      throw err;
    }
  };

  if (authLoading || (loadingData && tests.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Initializing MediLab Laboratory Portal...</p>
        </div>
      </div>
    );
  }

  // Find active booking for detail view
  const currentBooking = 
    bookings.find((b) => b._id === selectedBookingId || b.bookingId === selectedBookingId) ||
    (confirmedBooking && (confirmedBooking._id === selectedBookingId || confirmedBooking.bookingId === selectedBookingId) ? confirmedBooking : null);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar currentTab={currentTab} onNavigate={navigate} />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            popularTests={tests.filter((t) => t.popular || t.featured)}
            onViewDetails={handleViewTestDetails}
            onBookNow={handleBookNow}
            onNavigate={navigate}
            onSearchQuery={(q) => {
              setCatalogSearch(q);
              navigate('tests');
            }}
          />
        )}

        {currentTab === 'tests' && (
          <TestsPage
            tests={tests}
            initialSearch={catalogSearch}
            onViewDetails={handleViewTestDetails}
            onBookNow={handleBookNow}
          />
        )}

        {currentTab === 'test-detail' && selectedTest && (
          <TestDetailPage
            test={selectedTest}
            onBack={() => navigate('tests')}
            onBookNow={handleBookNow}
          />
        )}

        {currentTab === 'booking-flow' && selectedTest && (
          <BookingFlowPage
            test={selectedTest}
            onBack={() => navigate('test-detail', selectedTest)}
            onBookingSuccess={handleBookingSuccess}
            onRequireLogin={() => navigate('login')}
          />
        )}

        {currentTab === 'booking-confirm' && confirmedBooking && (
          <BookingConfirmationPage
            booking={confirmedBooking}
            onViewBookingDetails={(id) => navigate('booking-detail', id)}
            onGoToDashboard={() => navigate('dashboard')}
            onBookAnotherTest={() => navigate('tests')}
          />
        )}

        {(currentTab === 'dashboard' || currentTab === 'bookings') && (
          user ? (
            <DashboardPage
              bookings={bookings}
              onViewBookingDetails={(id) => navigate('booking-detail', id)}
              onCancelBooking={handleCancelBooking}
              onBookNewTest={() => navigate('tests')}
              onDownloadReport={(b) => setReportModalBooking(b)}
            />
          ) : (
            <PatientBookingsPortal
              onViewBookingDetails={(id) => navigate('booking-detail', id)}
              onBookNewTest={() => navigate('tests')}
              onDownloadReport={(b) => setReportModalBooking(b)}
              onNavigateLogin={() => navigate('login')}
              onNavigateRegister={() => navigate('register')}
              onLoginSuccess={() => {
                fetchBookings();
                navigate('dashboard');
              }}
            />
          )
        )}

        {currentTab === 'booking-detail' && (
          <BookingDetailPage
            bookingId={selectedBookingId || ''}
            initialBooking={currentBooking}
            onBack={() => navigate(user ? 'dashboard' : 'bookings')}
            onCancelBooking={handleCancelBooking}
            onDownloadReport={(b) => setReportModalBooking(b)}
          />
        )}

        {currentTab === 'profile' && (
          user ? (
            <ProfilePage />
          ) : (
            <LoginPage
              onSuccess={() => navigate('profile')}
              onNavigateRegister={() => navigate('register')}
            />
          )
        )}

        {currentTab === 'admin' && (
          isAdmin ? (
            <AdminDashboardPage onDownloadReport={(b) => setReportModalBooking(b)} />
          ) : (
            <div className="max-w-md mx-auto py-16 text-center space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
              <p className="text-xs text-slate-600">
                You must be signed in with administrator credentials (e.g., admin@medilab.com) to access the management center.
              </p>
              <button
                onClick={() => navigate('login')}
                className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Go to Sign In
              </button>
            </div>
          )
        )}

        {currentTab === 'login' && (
          <LoginPage
            onSuccess={() => {
              fetchBookings();
              navigate('dashboard');
            }}
            onNavigateRegister={() => navigate('register')}
          />
        )}

        {currentTab === 'register' && (
          <RegisterPage
            onSuccess={() => {
              fetchBookings();
              navigate('dashboard');
            }}
            onNavigateLogin={() => navigate('login')}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage onNavigate={navigate} />
        )}

        {currentTab === 'contact' && (
          <ContactPage />
        )}

        {/* Fallback */}
        {![
          'home',
          'tests',
          'test-detail',
          'booking-flow',
          'booking-confirm',
          'dashboard',
          'bookings',
          'booking-detail',
          'profile',
          'admin',
          'login',
          'register',
          'about',
          'contact',
        ].includes(currentTab) && (
          <NotFoundPage onGoHome={() => navigate('home')} />
        )}
      </main>

      <Footer onNavigate={navigate} />

      {/* Global Diagnostic Report Modal */}
      {reportModalBooking && (
        <ReportModal
          booking={reportModalBooking}
          onClose={() => setReportModalBooking(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
