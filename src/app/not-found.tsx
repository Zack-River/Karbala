import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 font-kufi" dir="rtl">
      <div className="space-y-6 max-w-md">
        <h1 className="text-8xl font-bold text-karbala-gold font-scheherazade">٤٠٤</h1>
        <h2 className="text-2xl font-bold text-karbala-primary">الصفحة غير موجودة</h2>
        <p className="text-karbala-secondary leading-relaxed">
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد يكون الرابط خاطئاً أو تم نقل المحتوى.
        </p>
        <Link 
          href="/karbala"
          className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-karbala-gold text-karbala-dark font-medium hover:bg-karbala-gold-dark transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
