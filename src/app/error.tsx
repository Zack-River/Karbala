"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("Application Error:", error);

    // Auto-reload on ChunkLoadError to fetch new static assets after a deployment
    if (
      error.message?.includes("ChunkLoadError") ||
      error.message?.includes("Loading chunk") ||
      error.message?.includes("Failed to fetch dynamically imported module")
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 font-kufi" dir="rtl">
      <div className="space-y-6 max-w-md bg-white/5 p-8 rounded-2xl border border-white/10">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-karbala-primary">حدث خطأ غير متوقع</h2>
        <p className="text-karbala-secondary text-sm">
          نعتذر عن هذا الخلل. يرجى المحاولة مرة أخرى أو العودة للرئيسية.
        </p>
        <div className="pt-4 flex gap-4 justify-center">
          <Button variant="primary" onClick={() => reset()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    </div>
  );
}
