import React from 'react';
import { FileQuestion, ArrowRight } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-500">
          The requested page could not be located. You can explore our catalog of laboratory diagnostic tests or return to the MediLab home page.
        </p>
        <button
          onClick={onGoHome}
          className="mt-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Return to Home</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
