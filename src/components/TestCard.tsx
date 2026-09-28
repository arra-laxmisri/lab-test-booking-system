import React from 'react';
import { ITest } from '../types/index.js';
import { Clock, Droplet, ArrowRight, ShieldCheck } from 'lucide-react';

interface TestCardProps {
  test: ITest;
  onViewDetails: (test: ITest) => void;
  onBookNow: (test: ITest) => void;
}

export const TestCard: React.FC<TestCardProps> = ({ test, onViewDetails, onBookNow }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-teal-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between p-5 relative group">
      <div>
        {/* Category & Status Indicator */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2.5">
          <span className="font-semibold text-teal-700 tracking-wide uppercase text-[11px]">
            {test.category}
          </span>
          {test.popular && (
            <span className="text-[11px] font-medium text-amber-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
              Most Booked
            </span>
          )}
        </div>

        {/* Test Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 mb-2">
          {test.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {test.description}
        </p>

        {/* Specimen & Report Delivery Metadata (Zero-Pill with typographic separators) */}
        <div className="border-t border-slate-100 pt-3 flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mb-4 font-sans">
          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
            <Droplet className="w-3.5 h-3.5 text-teal-600" />
            {test.sampleType}
          </span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            Report in {test.reportTime}
          </span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="text-slate-600">
            {test.parameters?.length || 1} parameter{test.parameters?.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Pricing & Interactive Action Row */}
      <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-400 block leading-none mb-1">Standard Fee</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xs font-semibold text-slate-600">₹</span>
            <span className="text-xl font-bold font-mono tabular-nums text-slate-900 leading-none">
              {test.price}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(test)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors whitespace-nowrap cursor-pointer"
          >
            Details
          </button>
          <button
            onClick={() => onBookNow(test)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs hover:shadow-sm transition-all whitespace-nowrap inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
