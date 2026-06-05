import { AlertCircle, FileCheck, ShieldCheck, Calculator } from 'lucide-react';

const formatINR = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  const numericAmount = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
};

export default function ResultCards({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6 mt-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white tracking-tight">
          <FileCheck className="text-green-600 dark:text-green-400" size={28} />
          {result.heading || "Analysis Results"}
        </h2>
        {result.claim_type && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
            {result.claim_type} Claim
          </span>
        )}
      </div>
      
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
            <ShieldCheck size={16} className="text-blue-500" />
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

      {/* Financial Settlement Section */}
      {(result.gross_claim_amount !== undefined && result.gross_claim_amount !== null) && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 md:p-8 mt-8 border-l-4 border-l-purple-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
             <Calculator size={120} className="text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 relative z-10 flex items-center gap-2">
            <Calculator className="text-purple-500" size={24} />
            Financial Settlement
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Gross Claim</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatINR(result.gross_claim_amount)}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Total Deductions</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">-{formatINR(result.total_deductions)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
              <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">Final Approved</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{formatINR(result.final_approved_amount)}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">Insured Liability</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{formatINR(result.insured_liability)}</p>
            </div>
          </div>
        </div>
      )}

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
