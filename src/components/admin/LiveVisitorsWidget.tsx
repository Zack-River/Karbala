"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export function LiveVisitorsWidget() {
  const [onlineUsers, setOnlineUsers] = useState<number>(0);

  useEffect(() => {
    // We use a fresh client here so we don't share the same RealtimeChannel instance
    // with PageViewTracker, which would cause "cannot add callbacks after subscribe" error.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase.channel("online-users");

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      // presenceState returns an object where keys are the presence keys (sessionIds)
      // and values are arrays of presence objects. We count unique session keys.
      const uniqueSessions = Object.keys(state).length;
      setOnlineUsers(uniqueSessions);
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-between relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10">
        <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {onlineUsers > 0 && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          الزوار المباشرين الآن
        </p>
        <p className="text-3xl font-bold text-gray-900">{onlineUsers}</p>
      </div>
      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center relative z-10 shadow-sm">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>
    </div>
  );
}
