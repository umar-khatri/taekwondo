import { createClient } from "@supabase/supabase-js"

// Note: This client uses the Service Role Key. 
// It MUST ONLY be used in Server Components, Server Actions, or API Routes.
// It bypasses Row Level Security completely.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
