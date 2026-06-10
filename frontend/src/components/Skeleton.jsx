import { FileSearch, Sparkles } from 'lucide-react';

export default function Skeleton() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 animate-in fade-in duration-500 mt-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none"></div>
      
      <div className="relative mb-6">
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/50 animate-ping opacity-20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-400 dark:border-blue-700/50 animate-pulse opacity-40" style={{ animationDelay: '150ms' }}></div>
        
        <div className="relative bg-white dark:bg-gray-800 p-5 rounded-full shadow-lg border border-blue-100 dark:border-blue-800 z-10">
          <FileSearch size={48} className="text-blue-600 dark:text-blue-400 animate-pulse" />
          
          {/* Laser scan line */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite] z-20 rounded-full"></div>
        </div>
      </div>

      <div className="text-center relative z-10">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="text-blue-500 animate-spin-slow" size={20} />
          AI is analyzing your claim...
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
          Extracting key insights, cross-referencing coverages, and preparing a detailed financial breakdown.
        </p>
      </div>

      <style jsx="true">{`
        @keyframes scan {
          0%, 100% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { top: 90%; }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
