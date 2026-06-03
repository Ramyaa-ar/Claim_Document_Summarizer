import { useState } from 'react';
import axios from 'axios';
import { Layers } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import InputForm from './components/InputForm';
import ResultCards from './components/ResultCards';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async ({ text, file }) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (file) formData.append('file', file);

      // Using the local backend API running on port 5000
      const response = await axios.post('http://localhost:5000/api/analyze-claim', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during analysis. Please check the backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Layers className="text-white h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Claim Summarizer <span className="text-blue-600 dark:text-blue-400">AI</span>
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Analyze Claims in Seconds
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Upload an insurance claim PDF or paste the text directly. Our AI will instantly extract the reason, coverage, and provide a concise summary.
            </p>
          </div>

          <InputForm onSubmit={handleAnalyze} isLoading={isLoading} />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8">
              <ResultCards result={result} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;