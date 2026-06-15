"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { SITE_NAME } from "@/constants";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setSessionReady(true);
      setCheckingSession(false);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setSessionReady(true);
        setCheckingSession(false);
      }
    });
    checkSession();
    return () => { subscription.unsubscribe(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"); return; }
    if (password !== confirmPassword) { setError("كلمتا المرور غير متطابقتين"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message.includes("same password") ? "لا يمكن استخدام نفس كلمة المرور القديمة" : "حدث خطأ أثناء تحديث كلمة المرور. حاول مرة أخرى.");
      } else { setSuccess(true); }
    } catch { setError("حدث خطأ غير متوقع."); }
    finally { setLoading(false); }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto text-karbala-gold mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500 font-kufi text-sm">جارٍ التحقق...</p>
        </div>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
          <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="font-scheherazade text-2xl text-gray-900 font-bold">رابط غير صالح أو منتهي الصلاحية</h2>
          <p className="text-sm text-gray-500 font-kufi">يرجى طلب رابط جديد لإعادة تعيين كلمة المرور.</p>
          <Link href="/admin/forgot-password" className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-white bg-karbala-gold hover:bg-karbala-gold-dark transition-colors font-kufi">طلب رابط جديد</Link>
          <Link href="/admin/login" className="text-sm font-medium text-karbala-gold hover:text-karbala-gold-dark transition-colors font-kufi">العودة إلى تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="font-scheherazade text-4xl text-karbala-gold font-bold mb-2">{SITE_NAME}</h2>
          <p className="text-sm text-gray-500 font-kufi">تعيين كلمة مرور جديدة</p>
        </div>
        {success ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-md text-sm font-kufi text-center">
              <svg className="w-10 h-10 mx-auto text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium mb-1">تم تحديث كلمة المرور بنجاح</p>
              <p className="text-green-600 text-xs">يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.</p>
            </div>
            <Link href="/admin" className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-white bg-karbala-gold hover:bg-karbala-gold-dark transition-colors font-kufi">الذهاب إلى لوحة التحكم</Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-kufi">{error}</div>)}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-kufi mb-1">كلمة المرور الجديدة</label>
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karbala-gold focus:border-karbala-gold transition-colors font-kufi text-gray-900" dir="ltr" placeholder="••••••••" />
                <p className="mt-1 text-xs text-gray-400 font-kufi">6 أحرف على الأقل</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 font-kufi mb-1">تأكيد كلمة المرور</label>
                <input type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karbala-gold focus:border-karbala-gold transition-colors font-kufi text-gray-900" dir="ltr" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-karbala-gold hover:bg-karbala-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-karbala-gold transition-colors font-kufi disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (<span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>جارٍ التحديث...</span>) : "تحديث كلمة المرور"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
