"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

// Middleware already protects this route, but we can do a secondary check if needed
export async function getTrials() {
  const { data, error } = await supabaseAdmin
    .from("trial_requests")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch trials:", error)
    return []
  }

  return data
}

export async function deleteTrial(id: string) {
  const { error } = await supabaseAdmin.from("trial_requests").delete().eq("id", id)
  
  if (error) {
    console.error("Failed to delete trial:", error)
    return { error: "Failed to delete trial" }
  }

  revalidatePath("/dashboard/trials")
  return { success: true }
}
