import React, { useRef } from "react";

const ResumeUpload = () => {
  const fileInputRef = useRef();

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <button
        className="bg-blue-500 text-white text-2xl font-bold px-12 py-6 rounded-2xl mb-4 focus:outline-none"
        onClick={handleFileSelect}
      >
        Select PDF file
      </button>
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        className="hidden"
      />
      <p className="text-gray-500 mt-2">or drop PDF here</p>
      <div className="flex flex-col gap-3 absolute right-10 top-1/2 transform -translate-y-1/2">
        <button className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center shadow">
          {/* Google Drive Icon */}
          <svg width="28" height="28" viewBox="0 0 48 48"><path fill="#fff" d="M15.5 38L24 23l8.5 15z"/><path fill="#4285F4" d="M24 23l8.5 15h8.5L32.5 23z"/><path fill="#34A853" d="M15.5 38H7l8.5-15z"/><path fill="#FBBC05" d="M7 38h8.5l8.5-15H15.5z"/></svg>
        </button>
        <button className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center shadow">
          {/* Dropbox Icon */}
          <svg width="28" height="28" viewBox="0 0 48 48"><path fill="#fff" d="M24 18.5L15.5 13 24 7.5 32.5 13z"/><path fill="#fff" d="M24 18.5l8.5-5.5 8.5 5.5-8.5 5.5z"/><path fill="#fff" d="M24 18.5l-8.5 5.5-8.5-5.5 8.5-5.5z"/><path fill="#fff" d="M24 25.5l8.5 5.5-8.5 5.5-8.5-5.5z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;