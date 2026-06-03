export default function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse mt-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 h-40">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
            <div className="h-3 w-2/3 bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 h-40">
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
            <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 mt-6">
        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
        <div className="space-y-3">
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
          <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
