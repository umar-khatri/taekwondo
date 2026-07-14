"use server"

import { auth } from "@clerk/nextjs/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function checkIsAdmin() {
  const { userId } = await auth()
  if (!userId) return false

  const { data } = await getSupabaseAdmin()
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single()

  return data?.role === "admin"
}
