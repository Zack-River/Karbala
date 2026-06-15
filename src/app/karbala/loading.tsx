export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-karbala-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-transparent border-t-karbala-gold border-r-karbala-gold rounded-full animate-spin"></div>
        <p className="font-kufi text-karbala-gold/60 text-sm animate-pulse">جاري التحميل...</p>
      </div>
    </div>
  );
}
