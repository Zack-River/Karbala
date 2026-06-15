"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { SITE_NAME } from "@/constants";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin/reset-password`,
      });

      if (error) {
        console.error("Reset password error:", error);
        setError("حدث خطأ أثناء إرسال رابط إعادة التعيين. حاول مرة أخرى.");
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      console.error("Unexpected error:", err);
      setError("حدث خطأ غير متوقع. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <Link href="/admin/login">
            <h2 className="font-scheherazade text-4xl text-karbala-gold font-bold mb-2">
              {SITE_NAME}
            </h2>
          </Link>
          <p className="text-sm text-gray-500 font-kufi">استعادة كلمة المرور</p>
        </div>

        {success ? (
          <div className="space-y-6">
            {/* Success state */}
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-md text-sm font-kufi text-center">
              <div className="mb-2">
                <svg
                  className="w-10 h-10 mx-auto text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="font-medium mb-1">تم إرسال رابط إعادة التعيين</p>
              <p className="text-green-600 text-xs">
                تحقق من بريدك الإلكتروني <strong dir="ltr">{email}</strong> واتبع
                الرابط لإعادة تعيين كلمة المرور.
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/admin/login"
                className="text-sm font-medium text-karbala-gold hover:text-karbala-gold-dark transition-colors font-kufi"
              >
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600 font-kufi text-center">
              أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-kufi">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 font-kufi mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karbala-gold focus:border-karbala-gold transition-colors font-kufi text-gray-900"
                dir="ltr"
                placeholder="email@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-karbala-gold hover:bg-karbala-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-karbala-gold transition-colors font-kufi disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  جارٍ الإرسال...
                </span>
              ) : (
                "إرسال رابط الاستعادة"
              )}
            </button>

            <div className="text-center">
              <Link
                href="/admin/login"
                className="text-sm font-medium text-karbala-gold hover:text-karbala-gold-dark transition-colors font-kufi"
              >
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
