import React from 'react';

const Loading = ({ fullScreen, text }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-400">{text || 'Loading...'}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      {text && <p className="ml-3 text-gray-500">{text}</p>}
    </div>
  );
};

export default Loading;
