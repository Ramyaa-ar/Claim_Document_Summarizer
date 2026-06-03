import { AlertCircle, FileCheck, ShieldCheck } from 'lucide-react';

export default function ResultCards({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <FileCheck className="text-green-600 dark:text-green-400" />
        Analysis Results
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Claim Reason Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-orange-100 dark:border-orange-900/30 p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertCircle size={80} className="text-orange-600" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase mb-3 flex items-center gap-2">
              <AlertCircle size={16} />
              Claim Reason
            </h3>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
              {result.claim_reason || "Not specified"}
            </p>
          </div>
        </div>

        {/* Coverage Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-900/30 p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck size={80} className="text-blue-600" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3 flex items-center gap-2">
              <ShieldCheck size={16} />
              Coverage Summary
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {result.coverage_summary || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Final Summary Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 rounded-2xl shadow-sm border border-blue-100 dark:border-gray-700 p-6 md:p-8 mt-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Final Summary
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {result.summary || "No summary generated."}
        </p>
      </div>
    </div>
  );
}
