interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="w-full flex flex-col items-center mt-4 mb-2 p-4">
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin mr-2"></div>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}
