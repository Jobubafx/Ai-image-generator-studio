
import React from 'react';

const Loader = ({ message }: { message: string }) => {
  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
      <p className="text-white text-xl mt-4 font-semibold">{message}</p>
    </div>
  );
};

export default Loader;
