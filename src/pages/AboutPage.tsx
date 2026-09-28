import React from 'react';
import { ShieldCheck, Award, Microscope, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          About MediLab
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Precision Diagnostics Delivered to Your Doorstep
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Founded with a mission to make routine health monitoring frictionless, reliable, and accessible for everyone — especially senior citizens, busy parents, and individuals needing frequent monitoring.
        </p>
      </div>

      {/* Laboratory Image Showcase */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-[16/9] bg-slate-100">
        <img
          src="/src/assets/images/diagnostic_laboratory_1790592174957.jpg"
          alt="MediLab Reference Pathology Laboratory"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 4 Pillars of MediLab */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">NABL & ISO 15189 Accredited</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our automated analyzers are calibrated daily using certified international control sera. Every test report meets rigorous medical standards recognized by healthcare specialists worldwide.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Gentle & Certified Phlebotomists</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All our phlebotomists have completed 500+ hours of clinical venipuncture training. We use single-use, safety-engineered butterfly needles for a virtually painless sample draw experience.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Microscope className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Cold-Chain Temperature Integrity</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            From the moment the sample is drawn in your living room to arrival at our central pathology facility, samples remain inside thermally sealed, calibrated containers at 2°C – 8°C.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Fast Digital Turnaround</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Get SMS alerts and instant dashboard access to your verified PDF reports as soon as they are signed off by our consulting pathologists.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">Ready to check your health status?</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Explore our complete catalog of diagnostic blood tests, vitamin panels, and full body checkups.
        </p>
        <button
          onClick={() => onNavigate('tests')}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer text-white"
        >
          <span>Browse Available Tests</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
