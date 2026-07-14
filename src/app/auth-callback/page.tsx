"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { checkIsAdmin } from "./actions"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleRedirect() {
      const isAdmin = await checkIsAdmin()
      if (isAdmin) {
        router.push("/dashboard")
      } else {
        router.push("/book-trial")
      }
    }
    
    handleRedirect()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground animate-pulse">Routing you to the right place...</p>
      </div>
    </div>
  )
}
