import { createClient } from "@supabase/supabase-js";
import { requireServiceRoleKey, requireSupabasePublicConfig } from "./config";

/** Server-only privileged client. Never import from client components. */
export function createSupabaseAdminClient() {
  const { url } = requireSupabasePublicConfig();
  const serviceKey = requireServiceRoleKey();
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
