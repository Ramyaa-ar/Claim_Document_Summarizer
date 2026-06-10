import { AlertCircle, FileCheck, ShieldCheck, Calculator, MessageSquare, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import DocumentChat from './DocumentChat';

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

const AnimatedNumber = ({ end, duration = 2 }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(easeProgress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return new Intl.NumberFormat('en-IN').format(value);
};

export default function ResultCards({ result }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

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
          
          <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            {/* Financial Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Gross Claim</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <span className="mr-1">₹</span>
                  <AnimatedNumber end={Number(result.gross_claim_amount)} duration={2} />
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex flex-col justify-center">
                <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400 flex items-center">
                  <span className="mr-1">-₹</span>
                  <AnimatedNumber end={Number(result.total_deductions)} duration={2} />
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30 flex flex-col justify-center">
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">Final Approved</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400 flex items-center">
                  <span className="mr-1">₹</span>
                  <AnimatedNumber end={Number(result.final_approved_amount)} duration={2} />
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 flex flex-col justify-center">
                <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">Insured Liability</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400 flex items-center">
                  <span className="mr-1">₹</span>
                  <AnimatedNumber end={Number(result.insured_liability)} duration={2} />
                </p>
              </div>
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

      {/* Interactive AI Chat Section */}
      {result.id && (
        <div className="mt-8">
          {!isChatOpen ? (
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl p-4 flex items-center justify-center gap-2 transition-colors font-medium shadow-sm"
            >
              <MessageSquare size={20} />
              Need help? Ask AI about this claim
            </button>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="text-blue-500" size={24} />
                  Claim Assistant
                </h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center"
                  title="Close Chat"
                >
                  <X size={20} />
                </button>
              </div>
              <DocumentChat claimId={result.id} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
