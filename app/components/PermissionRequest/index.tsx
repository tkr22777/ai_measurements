import React from 'react';

interface PermissionRequestProps {
  isLoading: boolean;
  hasPermission: boolean | null;
  onRequest: () => void;
}

const PermissionRequest: React.FC<PermissionRequestProps> = ({
  isLoading,
  hasPermission,
  onRequest,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 gap-4 w-full min-h-[200px]">
        <div className="w-10 h-10 border-4 border-blue-200 rounded-full border-l-blue-600 animate-spin mb-4"></div>
        <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">Accessing camera...</p>
        <button
          className="bg-blue-600 text-white border-none rounded-md py-3 px-6 text-base font-medium cursor-pointer transition-all duration-200 m-2 outline-none hover:bg-blue-700 hover:translate-y-[-1px] hover:shadow-sm active:translate-y-0 active:shadow-none"
          onClick={onRequest}
        >
          Retry Camera Access
        </button>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 gap-4 w-full min-h-[200px]">
        <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          This app needs access to your camera to take photos.
        </p>
        <button
          className="bg-blue-600 text-white border-none rounded-md py-3 px-6 text-base font-medium cursor-pointer transition-all duration-200 m-2 outline-none hover:bg-blue-700 hover:translate-y-[-1px] hover:shadow-sm active:translate-y-0 active:shadow-none"
          onClick={onRequest}
        >
          Allow Camera Access
        </button>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 gap-4 w-full min-h-[200px]">
        <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          Camera access was denied. Please grant permission to use this feature.
        </p>
        <button
          className="bg-blue-600 text-white border-none rounded-md py-3 px-6 text-base font-medium cursor-pointer transition-all duration-200 m-2 outline-none hover:bg-blue-700 hover:translate-y-[-1px] hover:shadow-sm active:translate-y-0 active:shadow-none"
          onClick={onRequest}
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
};

export default PermissionRequest;
