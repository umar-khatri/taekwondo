import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookTrialClient } from "./client-page"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"

export default async function BookTrialPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if they already have a trial request
  const { data: trialRequest } = await supabase
    .from("trial_requests")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background/50 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <BookTrialClient 
            user={{
              id: user.id,
              name: user.user_metadata?.full_name || "",
              email: user.email || "",
            }} 
            existingRequest={trialRequest} 
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
