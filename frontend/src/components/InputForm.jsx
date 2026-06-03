import { FileText, Upload, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function InputForm({ onSubmit, isLoading }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !file) {
      toast.error('Please enter text or upload a PDF document.');
      return;
    }
    onSubmit({ text, file });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Unsupported file format. Please upload a PDF.');
        e.target.value = ''; // Reset input
        return;
      }
      setFile(selectedFile);
      setText(''); // clear text if file is uploaded
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <FileText className="text-blue-600 dark:text-blue-400" />
        Input Claim Document
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paste Document Text
          </label>
          <textarea
            className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 resize-none transition-colors"
            placeholder="Paste the insurance claim details here..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setFile(null); // clear file if text is entered
            }}
            disabled={!!file || isLoading}
          />
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">OR</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload PDF Document
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="application/pdf" onChange={handleFileChange} disabled={isLoading} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {file ? file.name : "PDF up to 10MB"}
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={(!text.trim() && !file) || isLoading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={18} />
              Analyze Document
            </>
          )}
        </button>
      </form>
    </div>
  );
}
