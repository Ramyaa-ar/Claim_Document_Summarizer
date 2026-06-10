import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Search, FileText, Calculator, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';

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

export default function History() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/history');
        setClaims(response.data);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredClaims = claims.filter(claim => 
    (claim.heading || '').toLowerCase().includes(search.toLowerCase()) ||
    (claim.claim_reason || '').toLowerCase().includes(search.toLowerCase()) ||
    (claim.final_summary || '').toLowerCase().includes(search.toLowerCase())
  );

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    if (sortOrder === 'latest') return new Date(b.created_at) - new Date(a.created_at);
    return new Date(a.created_at) - new Date(b.created_at);
  });

  const totalClaims = claims.length;
  const totalApproved = claims.reduce((acc, claim) => acc + (Number(claim.final_approved_amount) || 0), 0);
  const totalDeductions = claims.reduce((acc, claim) => acc + (Number(claim.total_deductions) || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Claim History</h2>
          <p className="text-gray-500 dark:text-gray-400 text-base mt-2">Review and manage your previously analyzed claims.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="Search claims..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="block w-full sm:w-auto px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors cursor-pointer"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>



      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 h-48 animate-pulse">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
              <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
              <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
              <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : sortedClaims.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <FileText className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No claims found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">We couldn't find any claims matching your search.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedClaims.map((claim) => (
            <div 
              key={claim.id} 
              onClick={() => setSelectedClaim(claim)}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 cursor-pointer flex flex-col h-full relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
                  {claim.claim_type || 'Analysis'}
                </span>
                <span className="text-xs font-medium text-gray-400">
                  {format(new Date(claim.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 flex-1 relative z-10">
                {claim.heading || claim.claim_reason || 'Unknown Reason'}
              </h3>
              
              {(claim.final_approved_amount !== undefined && claim.final_approved_amount !== null) && (
                <div className="mb-3 text-sm font-bold text-green-600 dark:text-green-400 relative z-10">
                  Approved: {formatINR(claim.final_approved_amount)}
                </div>
              )}
              
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 relative z-10">
                {claim.preview || claim.final_summary || 'No summary available.'}
              </p>
              
              <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform relative z-10">
                View Details &rarr;
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={!!selectedClaim} 
        onClose={() => setSelectedClaim(null)} 
        title={
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
              <FileText size={20} />
            </span>
            Claim Details
          </div>
        }
      >
        {selectedClaim && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 dark:text-gray-400 pb-4 border-b border-gray-100 dark:border-gray-700 gap-2">
              <span>Analyzed on {format(new Date(selectedClaim.created_at), 'MMMM d, yyyy h:mm a')}</span>
              {selectedClaim.claim_type && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  {selectedClaim.claim_type}
                </span>
              )}
            </div>

            {selectedClaim.heading && (
              <div className="mb-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedClaim.heading}</h3>
              </div>
            )}

            <div className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 p-5 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-2">Claim Reason</h4>
              <p className="text-gray-900 dark:text-white font-medium text-lg">{selectedClaim.claim_reason}</p>
            </div>
            
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-5 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Coverage Summary</h4>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{selectedClaim.coverage_summary}</p>
            </div>
            
            {(selectedClaim.gross_claim_amount !== undefined && selectedClaim.gross_claim_amount !== null) && (
              <div className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-900/50 p-5 rounded-2xl border-l-4 border-l-purple-500">
                <h4 className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
                  <Calculator size={16} />
                  Financial Settlement
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gross Claim</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formatINR(selectedClaim.gross_claim_amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-red-500 dark:text-red-400">Deductions</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">-{formatINR(selectedClaim.total_deductions)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-600 dark:text-green-400">Final Approved</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-400">{formatINR(selectedClaim.final_approved_amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-600 dark:text-orange-400">Insured Liability</p>
                    <p className="text-lg font-bold text-orange-700 dark:text-orange-400">{formatINR(selectedClaim.insured_liability)}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 p-5 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Final Summary</h4>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {selectedClaim.final_summary}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
