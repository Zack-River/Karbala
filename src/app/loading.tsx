export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-karbala-dark">
      <div className="relative">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 border-2 border-karbala-gold/20 rounded-full animate-ping"></div>
        {/* Inner spinning loader */}
        <div className="w-16 h-16 border-4 border-transparent border-t-karbala-gold border-r-karbala-gold rounded-full animate-spin"></div>
        {/* Core pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-karbala-gold rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
