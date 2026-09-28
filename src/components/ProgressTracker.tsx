import React from 'react';
import { BookingStatus } from '../types/index.js';
import { Check, Clock, FlaskConical, FileText, Bike, AlertCircle } from 'lucide-react';

interface ProgressTrackerProps {
  status: BookingStatus;
  collectionMethod: 'home' | 'lab';
}

interface StepItem {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ status, collectionMethod }) => {
  if (status === 'Cancelled') {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
        <div className="w-10 h-10 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
          <AlertCircle className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-slate-800">Booking Cancelled</p>
        <p className="text-xs text-slate-500 mt-1">This test booking was cancelled. No further sample processing will occur.</p>
      </div>
    );
  }

  const steps: StepItem[] = [
    {
      id: 'Confirmed',
      name: 'Booking Confirmed',
      desc: 'Order verified by laboratory',
      icon: Check,
    },
    {
      id: 'Collection',
      name: collectionMethod === 'home' ? 'Sample Collection' : 'Lab Visit Scheduled',
      desc: collectionMethod === 'home' ? 'Phlebotomist dispatched' : 'Arrive at collection center',
      icon: collectionMethod === 'home' ? Bike : Clock,
    },
    {
      id: 'Sample Collected',
      name: 'Sample Collected',
      desc: 'Barcoded and temperature-controlled',
      icon: Check,
    },
    {
      id: 'Testing',
      name: 'Testing in Lab',
      desc: 'Automated clinical analysis',
      icon: FlaskConical,
    },
    {
      id: 'Report Ready',
      name: 'Report Ready',
      desc: 'Verified by chief pathologist',
      icon: FileText,
    },
  ];

  const getStepIndex = (st: BookingStatus): number => {
    switch (st) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 0;
      case 'Sample Collected':
        return 2;
      case 'Testing':
        return 3;
      case 'Report Ready':
      case 'Completed':
        return 4;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(status);

  return (
    <div className="w-full py-4">
      {/* Desktop Horizontal Stepper */}
      <div className="hidden md:grid md:grid-cols-5 relative gap-2">
        {/* Connecting Line */}
        <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-0">
          <div
            className="h-full bg-teal-600 transition-all duration-500"
            style={{ width: `${(Math.min(activeIndex, 4) / 4) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isDone = idx < activeIndex || (idx === 4 && (status === 'Report Ready' || status === 'Completed'));
          const isCurrent = idx === activeIndex && status !== 'Completed';
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-semibold transition-all duration-300 ${
                  isDone
                    ? 'bg-teal-600 text-white shadow-sm ring-4 ring-teal-50'
                    : isCurrent
                    ? 'bg-white border-2 border-teal-600 text-teal-700 ring-4 ring-teal-100 shadow-sm'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
              </div>
              <p
                className={`mt-2.5 text-xs font-semibold leading-tight ${
                  isCurrent ? 'text-teal-900 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {step.name}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500 max-w-[130px] leading-snug">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="md:hidden space-y-4">
        {steps.map((step, idx) => {
          const isDone = idx < activeIndex || (idx === 4 && (status === 'Report Ready' || status === 'Completed'));
          const isCurrent = idx === activeIndex && status !== 'Completed';
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-start gap-3">
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    isDone
                      ? 'bg-teal-600 text-white'
                      : isCurrent
                      ? 'bg-white border-2 border-teal-600 text-teal-700 ring-2 ring-teal-100'
                      : 'bg-white border border-slate-200 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-8 mt-1 ${
                      idx < activeIndex ? 'bg-teal-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
              <div className="pt-0.5">
                <p
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-teal-900 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.name}
                </p>
                <p className="text-[11px] text-slate-500 leading-snug">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
