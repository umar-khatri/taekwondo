"use server"

import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function checkIsAdmin() {
  const { userId } = await auth()
  if (!userId) return false

  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single()

  return data?.role === "admin"
}
