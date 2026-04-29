export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-black">
      <div className="relative">
        {/* Skeleton Circle */}
        <div className="w-20 h-20 border-4 border-gray-100 dark:border-white/5 rounded-full"></div>
        {/* Spinner */}
        <div className="absolute inset-0 w-20 h-20 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        
        {/* Subtle Text */}
        <div className="mt-6 text-center">
          <div className="h-2 w-24 bg-gray-100 dark:bg-white/10 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
