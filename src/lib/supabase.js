import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
  );
}

// Anon public key only — safe to expose in client code. Row Level Security
// (see supabase/migration.sql) controls what it can actually read/write.
export const supabase = createClient(url ?? "", anonKey ?? "");
