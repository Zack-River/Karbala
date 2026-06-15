"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { SITE_NAME } from "@/constants";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login Error:", error);
        if (error.message.includes("Email not confirmed")) {
          setError("لم يتم تأكيد البريد الإلكتروني بعد.");
        } else {
          setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }
        setLoading(false);
      } else if (data?.session) {
        // SUCCESS: Bypass Next.js router cache by forcing a hard reload
        // This ensures the middleware receives the new cookie and doesn't use a cached redirect
        window.location.href = "/admin";
      } else {
        setError("حدث خطأ غير متوقع أثناء تسجيل الدخول");
        setLoading(false);
      }
    } catch (err: unknown) {
      console.error("Unexpected Error:", err);
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="font-scheherazade text-4xl text-karbala-gold font-bold mb-2">{SITE_NAME}</h2>
          <p className="text-sm text-gray-500 font-kufi">سجل الدخول لإدارة المنصة</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-kufi">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-kufi mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karbala-gold focus:border-karbala-gold transition-colors font-kufi text-gray-900"
                dir="ltr"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 font-kufi">كلمة المرور</label>
                <Link
                  href="/admin/forgot-password"
                  className="text-xs font-medium text-karbala-gold hover:text-karbala-gold-dark transition-colors font-kufi"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karbala-gold focus:border-karbala-gold transition-colors font-kufi text-gray-900"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-karbala-gold hover:bg-karbala-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-karbala-gold transition-colors font-kufi disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
