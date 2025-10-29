import React, { useEffect, useState } from 'react';
import { LoadingIcon } from './icons/IconComponents';

const FullScreenLoader: React.FC = () => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 3000); // 3 seconds delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 gradient-bg flex flex-col items-center justify-center text-white z-[999]">
      <LoadingIcon className="h-12 w-12 animate-spin text-brand-primary mb-4" />
      <p className="text-xl font-semibold animate-pulse">Loading QuickLink...</p>

      {showText && (
        <div className="mt-4 text-sm text-gray-200 animate-fadeIn">
          <p>If you are stuck here then reload the page please.</p>
        </div>
      )}
    </div>
  );
};

export default FullScreenLoader;
