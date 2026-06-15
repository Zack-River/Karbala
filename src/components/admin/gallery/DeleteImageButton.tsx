"use client";

import React from "react";

export function DeleteImageButton() {
  return (
    <button 
      type="submit" 
      className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors"
      onClick={(e) => {
        if(!window.confirm('هل أنت متأكد من حذف هذه الصورة نهائياً؟')) {
          e.preventDefault();
        }
      }}
    >
      حذف الصورة
    </button>
  );
}
