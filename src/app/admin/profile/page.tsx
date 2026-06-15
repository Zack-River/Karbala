"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Email update state
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  // Password update state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    if (!newEmail.trim()) { setEmailError("يرجى إدخال بريد إلكتروني جديد"); return; }
    if (newEmail === user?.email) { setEmailError("البريد الإلكتروني الجديد مطابق للبريد الحالي"); return; }

    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) {
        setEmailError("حدث خطأ أثناء تحديث البريد الإلكتروني: " + error.message);
      } else {
        setEmailSuccess("تم إرسال رابط تأكيد إلى البريد الإلكتروني الجديد. تحقق من بريدك لتأكيد التغيير.");
        setNewEmail("");
      }
    } catch { setEmailError("حدث خطأ غير متوقع."); }
    finally { setEmailLoading(false); }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) { setPasswordError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"); return; }
    if (newPassword !== confirmNewPassword) { setPasswordError("كلمتا المرور غير متطابقتين"); return; }

    setPasswordLoading(true);
    try {
      // Verify current password by re-authenticating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });
      if (signInError) { setPasswordError("كلمة المرور الحالية غير صحيحة"); setPasswordLoading(false); return; }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordError(error.message.includes("same password") ? "لا يمكن استخدام نفس كلمة المرور القديمة" : "حدث خطأ أثناء تحديث كلمة المرور.");
      } else {
        setPasswordSuccess("تم تحديث كلمة المرور بنجاح.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch { setPasswordError("حدث خطأ غير متوقع."); }
    finally { setPasswordLoading(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-karbala-gold" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karbala-gold focus:border-karbala-gold transition-colors font-kufi text-gray-900";
  const labelCls = "block text-sm font-medium text-gray-700 font-kufi mb-1";
  const btnCls = "flex justify-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-karbala-gold hover:bg-karbala-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-karbala-gold transition-colors font-kufi disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <div className="font-kufi max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 font-scheherazade">الملف الشخصي</h1>
      <p className="text-sm text-gray-500 mb-8">إدارة بيانات حسابك وتغيير كلمة المرور</p>

      {/* Current Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 font-scheherazade">معلومات الحساب</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">البريد الإلكتروني</span>
            <span className="text-sm font-medium text-gray-900" dir="ltr">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">آخر تسجيل دخول</span>
            <span className="text-sm text-gray-700" dir="ltr">
              {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("ar-SA") : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">تاريخ الإنشاء</span>
            <span className="text-sm text-gray-700" dir="ltr">
              {user?.created_at ? new Date(user.created_at).toLocaleString("ar-SA") : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Update Email */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 font-scheherazade">تغيير البريد الإلكتروني</h2>
        <form onSubmit={handleEmailUpdate} className="space-y-4">
          {emailError && (<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-kufi">{emailError}</div>)}
          {emailSuccess && (<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm font-kufi">{emailSuccess}</div>)}
          <div>
            <label className={labelCls}>البريد الإلكتروني الجديد</label>
            <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={inputCls} dir="ltr" placeholder="new@example.com" />
          </div>
          <button type="submit" disabled={emailLoading} className={btnCls}>
            {emailLoading ? "جارٍ التحديث..." : "تحديث البريد الإلكتروني"}
          </button>
        </form>
      </div>

      {/* Update Password */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 font-scheherazade">تغيير كلمة المرور</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          {passwordError && (<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-kufi">{passwordError}</div>)}
          {passwordSuccess && (<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm font-kufi">{passwordSuccess}</div>)}
          <div>
            <label className={labelCls}>كلمة المرور الحالية</label>
            <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputCls} dir="ltr" />
          </div>
          <div>
            <label className={labelCls}>كلمة المرور الجديدة</label>
            <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} dir="ltr" placeholder="••••••••" />
            <p className="mt-1 text-xs text-gray-400 font-kufi">6 أحرف على الأقل</p>
          </div>
          <div>
            <label className={labelCls}>تأكيد كلمة المرور الجديدة</label>
            <input type="password" required minLength={6} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={inputCls} dir="ltr" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={passwordLoading} className={btnCls}>
            {passwordLoading ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
          </button>
        </form>
      </div>
    </div>
  );
}
