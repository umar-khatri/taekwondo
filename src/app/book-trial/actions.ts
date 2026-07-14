"use server"

import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export async function submitTrialRequest(formData: { name: string; phone: string; age: number | null }) {
  const { userId } = await auth()
  
  if (!userId) {
    return { error: "Unauthorized" }
  }

  const { name, phone, age } = formData

  const { data, error } = await supabaseAdmin
    .from("trial_requests")
    .insert({
      name,
      phone,
      age,
      status: "pending",
      user_id: userId,
    })
    .select()
    .single()

  if (error) {
    console.error("Trial request insertion error:", error)
    return { error: "Failed to submit request" }
  }

  revalidatePath("/book-trial")
  return { success: true, data }
}
