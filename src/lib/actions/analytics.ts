"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";

export async function trackPageView(path: string) {
  try {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("qarbla_session_id")?.value;

    if (!sessionId) {
      // Generate a simple random string for session if none exists
      sessionId = crypto.randomUUID();
      cookieStore.set("qarbla_session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
    }

    const supabase = await createServerClient();
    
    // De-duplicate: check if this session already viewed this path in the last 30 minutes
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const { data: recentViews } = await supabase
      .from("page_views")
      .select("id")
      .eq("session_id", sessionId)
      .eq("path", path)
      .gte("created_at", thirtyMinsAgo)
      .limit(1);

    if (!recentViews || recentViews.length === 0) {
      // Fire and forget insertion
      await supabase.from("page_views").insert({
        path,
        session_id: sessionId,
      });
    }

    return { success: true, sessionId };
  } catch (error) {
    console.error("Failed to track page view:", error);
    return { success: false };
  }
}
