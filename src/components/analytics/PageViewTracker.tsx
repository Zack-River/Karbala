"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/actions/analytics";
import { createBrowserClient } from "@supabase/ssr";

export function PageViewTracker() {
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState<string | null>(null);

  // 1. Track Page View on pathname change
  useEffect(() => {
    if (!pathname) return;
    
    // We call the server action to log the view and get our session ID back
    trackPageView(pathname).then((res) => {
      if (res.success && res.sessionId) {
        setSessionId(res.sessionId);
      }
    });
  }, [pathname]);

  // 2. Manage Realtime Presence
  useEffect(() => {
    if (!sessionId) return; // Wait until we have a session ID

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase.channel("online-users", {
      config: {
        presence: {
          key: sessionId,
        },
      },
    });

    if (channel.state !== "joined" && channel.state !== "joining") {
      channel.on("presence", { event: "sync" }, () => {
        // We don't necessarily need to do anything here on the client side,
        // the admin dashboard will listen to this same channel to count users.
      });

      channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            path: pathname,
          });
        }
      });
    } else {
      // If already joined, just update the tracked path
      channel.track({
        online_at: new Date().toISOString(),
        path: pathname,
      });
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, pathname]);

  return null; // This component doesn't render anything
}
