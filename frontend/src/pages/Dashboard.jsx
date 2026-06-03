import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import InputForm from '../components/InputForm';
import ResultCards from '../components/ResultCards';
import Skeleton from '../components/Skeleton';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async ({ text, file }) => {
    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (file) formData.append('file', file);

      // Using the local backend API
      const response = await axios.post('http://localhost:5000/api/analyze-claim', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.cached) {
        setResult(response.data.data);
        toast('Loaded existing analysis from history', { icon: '🔄' });
      } else {
        setResult(response.data.data);
        toast.success('Analysis complete!');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || 'An error occurred during analysis.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSample = () => {
    handleAnalyze({
      text: "Claimant: John Doe\nDate of Loss: 2023-10-15\nIncident: Water damage from burst pipe in the kitchen. Floor and cabinets damaged. Plumber verified issue.\nPolicy coverage: Homeowners standard, $500 deductible.",
      file: null
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Analyze Claims in Seconds
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Upload an insurance claim PDF or paste the text directly. Our AI will instantly extract the reason, coverage, and provide a concise summary.
          </p>
          <button
            onClick={handleSample}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors"
          >
            Try a sample claim
          </button>
        </div>

        <InputForm onSubmit={handleAnalyze} isLoading={isLoading} />

        {isLoading && <Skeleton />}

        {!isLoading && result && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <ResultCards result={result} />
          </div>
        )}
      </div>
    </div>
  );
}
