import React from 'react';
import { ITest } from '../types/index.js';
import { 
  ArrowLeft, 
  Clock, 
  Droplet, 
  AlertCircle, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

interface TestDetailPageProps {
  test: ITest;
  onBack: () => void;
  onBookNow: (test: ITest) => void;
}

export const TestDetailPage: React.FC<TestDetailPageProps> = ({ test, onBack, onBookNow }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Diagnostic Tests</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                {test.category}
              </span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                NABL Accredited
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {test.name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              {test.description}
            </p>

            {/* Quick Specimen & Delivery Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Sample Required</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-teal-600" />
                  {test.sampleType}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Report Available In</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  {test.reportTime}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Testing Methodology</span>
                <span className="font-semibold text-slate-800">
                  Fully Automated Analyzer
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Booking Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:w-72 shrink-0 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs text-slate-500 font-medium">Test Booking Fee</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-sm font-semibold text-slate-600">₹</span>
                <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                  {test.price}
                </span>
              </div>
              <p className="text-[11px] text-teal-700 font-medium mt-1">
                ✓ Includes Home Sample Collection
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => onBookNow(test)}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-slate-400">
                Safe & hygienic sample handling guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Preparation Instructions & Parameters Included */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Preparation & Guidelines */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">Preparation Instructions</h2>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/60 border border-amber-100 p-3.5 rounded-xl">
              {test.preparation}
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">General Patient Advice:</p>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Drink 1–2 glasses of plain water before blood collection for smoother venipuncture.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Keep any recent prescription slips handy if requested by your treating physician.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Wear loose-sleeved clothing to allow easy access to the arm.</span>
              </div>
            </div>
          </div>

          {/* Lab Accreditation Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              MediLab Clinical Assurance
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Samples are transported in validated vacuum insulated carriers at 2°C – 8°C. Reports are signed off by accredited clinical pathologists.
            </p>
          </div>
        </div>

        {/* Right Column: Parameters Included */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-teal-600" />
                <h2 className="text-base font-bold text-slate-900">Parameters Tested ({test.parameters.length})</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Standard Clinical Panel</span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
              {test.parameters.map((param, index) => {
                const isObj = typeof param === 'object' && param !== null;
                const name = isObj ? param.name : String(param);
                const unit = isObj ? param.unit : '';
                const range = isObj ? param.referenceRange : '';

                return (
                  <div key={index} className="p-3.5 hover:bg-slate-50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-mono text-[10px] shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{name}</span>
                    </div>

                    {(unit || range) && (
                      <div className="text-right text-[11px] text-slate-500 shrink-0 font-mono">
                        {unit && <span className="text-slate-400 mr-2">{unit}</span>}
                        {range && <span className="text-slate-600">Ref: {range}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Ready to book this diagnostic test?</span>
              <button
                onClick={() => onBookNow(test)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Proceed to Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
