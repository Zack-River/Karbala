"use client";

import React, { useRef, useState } from "react";

interface MediaUploaderProps {
  label: string;
  name: string;
  accept: string;
  description?: string;
  onFileSelect?: (file: File | null) => void;
}

export function MediaUploader({ label, name, accept, description, onFileSelect }: MediaUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div 
        onClick={() => inputRef.current?.click()}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors cursor-pointer ${
          fileName ? 'border-karbala-gold bg-yellow-50' : 'border-gray-300 hover:border-karbala-gold bg-gray-50'
        }`}
      >
        <div className="space-y-1 text-center">
          {!fileName ? (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <span className="relative cursor-pointer bg-transparent font-medium text-karbala-gold hover:text-karbala-gold-dark">
                  انقر لاختيار ملف
                </span>
              </div>
              {description && <p className="text-xs text-gray-500">{description}</p>}
            </>
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-karbala-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div className="flex text-sm text-gray-900 justify-center font-medium mt-2">
                تم اختيار: {fileName}
              </div>
              <span className="text-xs text-karbala-gold-dark mt-1 block">انقر لتغيير الملف</span>
            </>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
