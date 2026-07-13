import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { clerkClient } from "@clerk/nextjs/server"

const resend = new Resend(process.env.RESEND_API_KEY)
// We need service role key to get user email
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const { id } = params

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update trial request status
    const { data: trial, error } = await supabaseAdmin
      .from("trial_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // If it has a user_id (Clerk ID), fetch the user's email to send notification
    if (trial.user_id) {
      try {
        const user = await clerkClient.users.getUser(trial.user_id)
        const userEmail = user.emailAddresses[0]?.emailAddress

        if (userEmail) {
          const subject = status === "approved"  
          ? "Your Trial Class Request is Approved!" 
          : "Update on Your Trial Class Request"
        
        const content = status === "approved"
          ? `<p>Hi ${trial.name},</p><p>Great news! Your trial class request has been approved.</p><p>Please log in to your dashboard for further details on scheduling your class.</p><p>Best,<br/>Master Farooq's Club</p>`
          : `<p>Hi ${trial.name},</p><p>Thank you for your interest. Unfortunately, we cannot accommodate your trial request at this time.</p><p>Best,<br/>Master Farooq's Club</p>`

          // Send Email via Resend
          try {
            await resend.emails.send({
              from: "Taekwondo Academy <onboarding@resend.dev>", // Replace with your domain once verified on Resend
              to: userEmail,
              subject: subject,
              html: content,
            })
          } catch (emailError) {
            console.error("Failed to send email:", emailError)
            // We don't throw here, as the status update was still successful
          }
        }
      } catch (clerkError) {
        console.error("Failed to fetch user from Clerk:", clerkError)
      }
    }

    return NextResponse.json({ success: true, trial })
  } catch (error: any) {
    console.error("Trial update error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
