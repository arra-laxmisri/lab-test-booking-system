import React from 'react';
import { IBooking } from '../types/index.js';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';

interface ReportModalProps {
  booking: IBooking;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ booking, onClose }) => {
  const report = booking.reportData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Controls Bar (hidden during print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-semibold">Official Diagnostic Pathology Report</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Lab Report Document */}
        <div className="p-8 sm:p-10 font-sans text-slate-800 bg-white">
          {/* Header */}
          <div className="border-b-2 border-teal-600 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-black text-lg">
                  M
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">MediLab Diagnostics</h1>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">ISO 15189:2022 & NABL Accredited Reference Laboratory</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Central Laboratory: 42 Health Boulevard, Diagnostic Tower, Mumbai 400001
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-slate-600 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              <p className="font-semibold text-slate-900">LAB REF ID: {booking.bookingId}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Accreditation: NABL-MC-9082</p>
              <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold mt-1">
                <CheckCircle className="w-3 h-3" /> Digitally Verified
              </div>
            </div>
          </div>

          {/* Patient & Specimen Demographics Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-6">
            <div>
              <span className="text-slate-400 block text-[11px]">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{booking.patientDetails.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Age / Gender</span>
              <span className="font-semibold text-slate-800">{booking.patientDetails.age} Yrs / {booking.patientDetails.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contact Number</span>
              <span className="font-mono text-slate-800">{booking.patientDetails.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Collection Mode</span>
              <span className="font-semibold text-slate-800 capitalize">{booking.collectionMethod === 'home' ? 'Home Sample Pickup' : 'Direct Lab Visit'}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Booking Date</span>
              <span className="font-mono text-slate-800">{booking.date}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Time Slot</span>
              <span className="font-mono text-slate-800">{booking.timeSlot}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Sample Drawn</span>
              <span className="font-mono text-slate-800">
                {report?.sampleCollectedAt ? new Date(report.sampleCollectedAt).toLocaleDateString() : booking.date}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Report Generated</span>
              <span className="font-mono text-slate-800">
                {report?.generatedAt ? new Date(report.generatedAt).toLocaleDateString() : new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Test Title */}
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
              Investigation: {booking.testName}
            </h2>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Test Parameter</th>
                  <th className="py-2.5 px-3">Observed Value</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Biological Reference Interval</th>
                  <th className="py-2.5 px-3 text-right">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {report?.results && report.results.length > 0 ? (
                  report.results.map((res, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-800">{res.parameter}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 tabular-nums">{res.value}</td>
                      <td className="py-2.5 px-3 text-slate-500">{res.unit || '-'}</td>
                      <td className="py-2.5 px-3 text-slate-600">{res.referenceRange || 'Standard Range'}</td>
                      <td className="py-2.5 px-3 text-right font-sans">
                        {res.status === 'normal' ? (
                          <span className="text-emerald-700 font-semibold text-[11px]">NORMAL</span>
                        ) : res.status === 'high' ? (
                          <span className="text-rose-600 font-bold text-[11px]">HIGH ▲</span>
                        ) : (
                          <span className="text-amber-600 font-bold text-[11px]">LOW ▼</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center font-sans text-slate-500">
                      Detailed parameter results are compiling. Sample undergoing automated photometric analysis.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Clinical Notes & Disclaimers */}
          <div className="mt-6 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <p className="font-semibold text-slate-800 mb-1">Clinical Remarks:</p>
            <p className="text-[11px] leading-relaxed">
              {report?.notes || 'Biological reference intervals reflect 95% of healthy reference populations. Clinical correlation with attending physician is advised for medical diagnosis.'}
            </p>
          </div>

          {/* Signatures & Certification */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="text-xs text-slate-500">
              <p className="font-medium text-slate-700">Lab Technologist:</p>
              <p className="font-mono text-slate-800">{report?.technicianName || 'Suresh Verma (Sr. Technologist)'}</p>
              <p className="text-[10px] text-slate-400 mt-1">Instrument: Sysmex XN-1000 / Roche Cobas 6000</p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <div className="h-10 flex items-center justify-end">
                <span className="font-serif italic font-semibold text-teal-800 tracking-wide text-sm underline decoration-teal-300">
                  Dr. Ananya Sharma, MD
                </span>
              </div>
              <p className="font-semibold text-slate-800">Dr. Ananya Sharma, MD (Pathology)</p>
              <p className="text-slate-500 text-[11px]">Chief Consulting Pathologist & Medical Director</p>
              <p className="text-[10px] text-slate-400">Reg. No: MMC-2012/04/0987</p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
            End of Laboratory Diagnostic Report · Generated securely via MediLab Diagnostic Cloud
          </div>
        </div>
      </div>
    </div>
  );
};
