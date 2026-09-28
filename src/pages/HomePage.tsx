import React, { useState } from 'react';
import { ITest } from '../types/index.js';
import { TestCard } from '../components/TestCard.js';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Home, 
  FileText, 
  CheckCircle2, 
  CalendarCheck,
  UserCheck,
  PhoneCall,
  Activity
} from 'lucide-react';

interface HomePageProps {
  popularTests: ITest[];
  onViewDetails: (test: ITest) => void;
  onBookNow: (test: ITest) => void;
  onNavigate: (tab: string, param?: any) => void;
  onSearchQuery: (query: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  popularTests,
  onViewDetails,
  onBookNow,
  onNavigate,
  onSearchQuery,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchQuery(searchInput.trim());
      onNavigate('tests');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-teal-50/70 via-slate-50 to-white pt-10 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading, Value Prop, Search & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-teal-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>NABL & ISO 15189 Certified Reference Lab</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] text-balance">
                Book Your Lab Tests Easily
              </h1>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Reliable diagnostic testing with convenient home sample collection. Accurate results, verified by medical specialists, delivered directly to your device.
              </p>

              {/* Instant Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl">
                <div className="relative flex items-center shadow-sm rounded-xl overflow-hidden border border-slate-300 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 bg-white">
                  <div className="pl-4 text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by test name (e.g., CBC, Thyroid, Vitamin D, HbA1c)..."
                    className="w-full py-3.5 pl-3 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors cursor-pointer shrink-0"
                  >
                    Search
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-500 font-sans">
                  <span className="font-medium text-slate-600">Quick Searches:</span>
                  <button
                    type="button"
                    onClick={() => {
                      onSearchQuery('CBC');
                      onNavigate('tests');
                    }}
                    className="hover:text-teal-700 underline underline-offset-2 cursor-pointer"
                  >
                    CBC
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      onSearchQuery('Thyroid');
                      onNavigate('tests');
                    }}
                    className="hover:text-teal-700 underline underline-offset-2 cursor-pointer"
                  >
                    Thyroid
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      onSearchQuery('Diabetes');
                      onNavigate('tests');
                    }}
                    className="hover:text-teal-700 underline underline-offset-2 cursor-pointer"
                  >
                    HbA1c
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      onSearchQuery('Full Body');
                      onNavigate('tests');
                    }}
                    className="hover:text-teal-700 underline underline-offset-2 cursor-pointer"
                  >
                    Full Body
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('tests')}
                  className="px-6 py-3.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Book a Test</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="px-5 py-3.5 text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-white rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  How MediLab Works
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 max-w-lg">
                <div>
                  <p className="text-xl font-bold font-mono text-slate-900">100,000+</p>
                  <p className="text-xs text-slate-500 font-medium">Tests Processed</p>
                </div>
                <div>
                  <p className="text-xl font-bold font-mono text-slate-900">60 Mins</p>
                  <p className="text-xs text-slate-500 font-medium">Home Pickup Window</p>
                </div>
                <div>
                  <p className="text-xl font-bold font-mono text-slate-900">99.8%</p>
                  <p className="text-xs text-slate-500 font-medium">Diagnostic Precision</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[16/10] bg-slate-100">
                <img
                  src="/src/assets/images/hero_lab_testing_1790592142282.jpg"
                  alt="State of the art MediLab diagnostic testing equipment"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs font-semibold tracking-wider uppercase text-teal-300">Automated Clinical Instrumentation</p>
                    <p className="text-base font-bold text-white mt-1">High-Precision Molecular & Hematology Analysis</p>
                  </div>
                </div>
              </div>

              {/* Floating Reassuring Callout */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg border border-slate-200 p-3.5 flex items-center gap-3 hidden sm:flex max-w-xs">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Free Home Collection</p>
                  <p className="text-[11px] text-slate-500">Available across all residential sectors</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3-Step Simple Booking Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Simple 3-Step Booking Process
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Designed for effortless use by patients and family members of all ages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-mono font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Select Your Test</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose from individual blood tests, organ profiles, or complete health checkup packages with clear, upfront pricing.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-teal-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Transparent test parameters</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-mono font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Choose Date & Time</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select between home sample collection by a certified phlebotomist or walk in to the nearest MediLab center at your preferred slot.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-teal-700 font-semibold">
              <CalendarCheck className="w-4 h-4 text-teal-600" />
              <span>Morning fasting slots available</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-mono font-bold text-lg mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Confirm & Get Reports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review patient details and confirm. Track live testing progress on your dashboard and download certified PDF reports.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-teal-700 font-semibold">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Digital report in 6 - 24 hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Laboratory Tests Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Diagnostic Tests
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Most frequently prescribed health screenings and routine checkup panels.
            </p>
          </div>
          <button
            onClick={() => onNavigate('tests')}
            className="inline-flex items-center gap-1 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer"
          >
            <span>View All Tests</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTests.slice(0, 6).map((test) => (
            <TestCard
              key={test._id}
              test={test}
              onViewDetails={onViewDetails}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      </section>

      {/* Why Choose MediLab Section (Bento Grid Style) */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Choose MediLab?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Combining clinical excellence, certified medical staff, and convenient patient-centric technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Bento Card 1: Home Collection Focus */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Safe Home Sample Collection</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our vaccinated, trained phlebotomists follow rigorous aseptic protocols and arrive at your doorstep in your selected 1-hour time window.
                </p>
              </div>
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src="/src/assets/images/home_sample_collection_1790592160577.jpg"
                  alt="MediLab Phlebotomist conducting gentle home blood collection"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Bento Card 2: Pathology Expertise */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Specialist MD Pathologist Review</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every abnormal parameter is personally reviewed and cross-checked by senior clinical pathologists prior to digital sign-off and release.
                </p>
              </div>
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src="/src/assets/images/chief_pathologist_1790592190711.jpg"
                  alt="Dr. Ananya Sharma, Senior Consulting Pathologist"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Bento Card 3: Quality Standards & Turnaround */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Fast, Accurate Turnaround</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Most standard blood tests are reported within 6 to 12 hours. Download directly from your dashboard or receive instant email and SMS notifications.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Barcoded vacutainers prevent sample mix-up</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Temperature-controlled cold-chain logistics</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Zero hidden fees or surprise sample draw charges</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('tests')}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Explore All Diagnostic Tests
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Reassuring Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-700 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold tracking-wider uppercase text-teal-200">Book in Less Than 2 Minutes</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Take Charge of Your Health Today
            </h2>
            <p className="text-sm text-teal-100 leading-relaxed">
              Book online now or call our care coordinators for guidance on choosing the right diagnostic package for you or your family members.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('tests')}
                className="px-6 py-3.5 bg-white text-teal-900 hover:bg-teal-50 font-bold text-sm rounded-xl transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Find Your Test</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-3.5 bg-teal-800/80 hover:bg-teal-800 text-white font-semibold text-sm rounded-xl border border-teal-600 transition-colors cursor-pointer"
              >
                Contact Care Desk
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
