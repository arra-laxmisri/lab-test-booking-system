import React from 'react';
import { Activity, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Accreditation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-slate-900">
                <Activity className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">MediLab</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Trusted diagnostic testing with temperature-controlled home sample pickup and certified laboratory analysis.
            </p>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="text-[11px]">NABL & ISO 15189 Certified Pathology Labs</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-white tracking-wide">Quick Links</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tests')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Browse Lab Tests
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Bookings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About MediLab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Test Categories */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-white tracking-wide">Popular Checkups</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('tests')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Complete Blood Count (CBC)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tests')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Thyroid Profile (T3, T4, TSH)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tests')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Diabetes HbA1c Screening
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tests')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Liver & Kidney Function Tests
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tests')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Full Body Comprehensive Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Emergency Notice */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-white tracking-wide">Helpline & Hours</p>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="font-mono text-slate-300">1800-209-4455 (Toll Free)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="text-slate-300">support@medilab-diagnostics.com</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">Sample Collection: 6:00 AM – 8:00 PM (All 7 Days)</span>
              </p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-[11px] leading-relaxed text-slate-300">
              <span className="font-semibold text-amber-300 block mb-0.5">Clinical Disclaimer:</span>
              Online lab test bookings are intended for diagnostic and clinical monitoring. In case of severe symptoms or emergency, call your local ambulance or visit an emergency room immediately.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} MediLab Diagnostic Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300">Privacy Policy</button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300">Terms of Clinical Service</button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300">Patient Rights</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
