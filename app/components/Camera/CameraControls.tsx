import React from 'react';
import { cn } from '@/utils/styles';

interface CameraControlsProps {
  onCapture: () => void;
  onSwitch: () => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({ onCapture, onSwitch }) => {
  return (
    <div className={cn('absolute bottom-5 w-full z-10 gap-5', 'flex justify-center items-center')}>
      <button
        className={cn(
          'bg-red-600 text-white border-none rounded-full w-[55px] h-[55px] cursor-pointer shadow-lg relative transition-all duration-200 outline-none',
          'flex items-center justify-center hover:scale-105 active:scale-95',
          "after:content-[''] after:absolute after:w-[48px] after:h-[48px] after:rounded-full after:border-2 after:border-white"
        )}
        onClick={onCapture}
        aria-label="Take Photo"
      />
      <button
        className={cn(
          'bg-black/50 text-white border-none rounded-full w-[45px] h-[45px] cursor-pointer shadow-md transition-all duration-200 outline-none',
          'flex items-center justify-center hover:scale-110 hover:bg-black/70 active:scale-95',
          'absolute right-5 bottom-2.5'
        )}
        onClick={onSwitch}
        aria-label="Switch Camera"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 15l4-4-4-4M8 9l-4 4 4 4M12 3v18" />
        </svg>
      </button>
    </div>
  );
};

export default CameraControls;
