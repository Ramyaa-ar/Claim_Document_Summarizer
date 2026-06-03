import { AlertCircle, FileCheck, ShieldCheck } from 'lucide-react';

export default function ResultCards({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
        <FileCheck className="text-green-600 dark:text-green-400" />
        Analysis Results
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Claim Reason Card */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 border-l-4 border-l-orange-500 p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <AlertCircle size={80} className="text-orange-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-3 flex items-center gap-2">
              <AlertCircle size={16} className="text-orange-500" />
              Claim Reason
            </h3>
            <p className="text-gray-900 dark:text-white text-lg font-medium leading-relaxed">
              {result.claim_reason || "Not specified"}
            </p>
          </div>
        </div>

        {/* Coverage Summary Card */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 border-l-4 border-l-blue-500 p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <ShieldCheck size={80} className="text-blue-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-500" />
              Coverage Summary
            </h3>
            <p className="text-gray-900 dark:text-white text-lg font-medium leading-relaxed">
              {result.coverage_summary || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Final Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 md:p-8 mt-8 border-t-4 border-t-green-500 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
           <FileCheck size={120} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
          Final Summary
        </h3>
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-base relative z-10 whitespace-pre-wrap">
          {result.summary || "No summary generated."}
        </div>
      </div>
    </div>
  );
}
