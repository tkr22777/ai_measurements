import React from 'react';
import Image from 'next/image';

interface ImagePreviewProps {
  imageUrl: string;
  onRetake: () => void;
  onUpload: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onRetake, onUpload }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <img
        src={imageUrl}
        alt="Captured"
        className="w-full max-h-[70vh] object-contain rounded-lg mb-4 shadow-sm"
      />
      <div className="flex justify-center gap-4 mt-2 w-full">
        <button
          className="bg-blue-600 text-white border-none rounded-md py-3 px-6 text-base font-medium cursor-pointer transition-all duration-200 m-2 outline-none hover:bg-blue-700 hover:translate-y-[-1px] hover:shadow-sm active:translate-y-0 active:shadow-none"
          onClick={onRetake}
        >
          Retake
        </button>
        <button
          className="bg-green-600 text-white border-none rounded-md py-3 px-6 text-base font-medium cursor-pointer transition-all duration-200 m-2 outline-none hover:bg-green-700 hover:translate-y-[-1px] hover:shadow-sm active:translate-y-0 active:shadow-none"
          onClick={onUpload}
        >
          Upload to Server
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;
