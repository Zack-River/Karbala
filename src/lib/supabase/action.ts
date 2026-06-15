import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";

/**
 * Prefer authenticated admin session for DB writes (matches RLS policies).
 * Falls back to service role when no session is available.
 */
export async function createActionClient(): Promise<SupabaseClient> {
  try {
    const authClient = await createAuthenticatedServerClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();
    if (user) return authClient;
  } catch {
    // fall through to service role
  }
  return createAdminClient();
}
