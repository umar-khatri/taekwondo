import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { clerkClient } from "@clerk/nextjs/server"
import { render } from "@react-email/render"
import { TrialStatusEmail } from "@/emails/trial-status-email"



export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json()
    const { id } = await params

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update trial request status
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
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
        const client = await clerkClient()
        const user = await client.users.getUser(trial.user_id)
        const userEmail = user.emailAddresses[0]?.emailAddress

        if (userEmail) {
          const subject = status === "approved"  
            ? "Your Trial Class Request is Approved!" 
            : "Update on Your Trial Class Request"
          
          // Get the base URL from the request origin to construct the absolute dashboard URL
          const origin = new URL(request.url).origin
          
          // Generate the HTML from our React Email template
          const htmlContent = await render(
            TrialStatusEmail({
              studentName: trial.name,
              status: status as "approved" | "rejected",
              dashboardUrl: `${origin}/dashboard`
            })
          )

          // Send Email via Resend
          try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
              from: "Master Farooq's Club <onboarding@resend.dev>", // Replace with your domain once verified on Resend
              to: userEmail,
              subject: subject,
              html: htmlContent,
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
  } catch (error) {
    console.error("Error updating trial request:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
