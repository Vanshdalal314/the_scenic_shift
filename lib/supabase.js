import { createClient } from "@supabase/supabase-js";

// Public client — uses the anon key, safe for browser + read-only queries.
// RLS policies restrict this to SELECT only.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
