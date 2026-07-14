"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle2, Clock, XCircle } from "lucide-react"
import { toast } from "sonner"
import { SignOutButton } from "@clerk/nextjs"
import Link from "next/link"
import { submitTrialRequest } from "./actions"

interface BookTrialClientProps {
  user: {
    id: string
    name: string
    email: string
  }
  existingRequest: any
}

export function BookTrialClient({ user, existingRequest }: BookTrialClientProps) {
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState("")
  const [age, setAge] = useState("")
  const [loading, setLoading] = useState(false)
  const [request, setRequest] = useState(existingRequest)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in your name and phone number.")
      return
    }

    setLoading(true)
    const result = await submitTrialRequest({
      name: name.trim(),
      phone: phone.trim(),
      age: age ? parseInt(age) : null,
    })

    if (result.error) {
      toast.error(result.error)
    } else if (result.data) {
      setRequest(result.data)
      toast.success("Trial request submitted successfully!")
    }
    setLoading(false)
  }

  if (request) {
    const statusMap = {
      new: { icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", label: "Pending Review" },
      pending: { icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", label: "Pending Review" },
      contacted: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "Contacted" },
      approved: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", label: "Approved!" },
      rejected: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", label: "Not Approved" },
    }
    
    const statusInfo = statusMap[request.status as keyof typeof statusMap] || statusMap.pending
    const StatusIcon = statusInfo.icon

    return (
      <Card className="max-w-md mx-auto border-border/50 bg-card/80">
        <CardHeader className="text-center pb-2">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${statusInfo.bg}`}>
            <StatusIcon className={`h-8 w-8 ${statusInfo.color}`} />
          </div>
          <CardTitle className="text-2xl font-bold">Request {statusInfo.label}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-8 text-center space-y-6">
          <div className="text-muted-foreground text-sm text-left space-y-4">
            {request.status === "approved" 
              ? (
                <>
                  <p>Great news! Your trial class request has been approved.</p>
                  <p>Please check out our schedule on the website for visiting us. Make sure to be there <strong>10 mins earlier</strong>.</p>
                  <p>Wear comfortable workout clothes and carry a water bottle and a small towel.</p>
                </>
              )
              : request.status === "rejected"
              ? <p>We're sorry, but we cannot accommodate your trial request at this time.</p>
              : <p>Thank you for your interest! Your request is currently being reviewed by an instructor. We will notify you by email.</p>}
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{request.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">{request.phone}</span>
            </div>
            {request.age && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age:</span>
                <span className="font-medium">{request.age}</span>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4">
            {request.status === "approved" ? (
              <Link href="/#schedule" className="block w-full">
                <Button className="w-full cursor-pointer">
                  View Schedule
                </Button>
              </Link>
            ) : (
              <Link href="/" className="block w-full">
                <Button variant="secondary" className="w-full cursor-pointer">
                  Back to Website
                </Button>
              </Link>
            )}
            <SignOutButton>
              <Button variant="outline" className="w-full cursor-pointer">
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto border-border/50 bg-card/80">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">Book a Free Trial</CardTitle>
            <CardDescription>Experience a class before committing. No obligations!</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trial-name">Full Name *</Label>
            <Input
              id="trial-name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Pre-filled from your Google account.</p>
            <p className="text-[11px] font-medium text-destructive mt-1">
              Note: The full name entered must be correct. Any falsified information will lead to immediate rejection of your request.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trial-phone">Phone Number *</Label>
            <Input
              id="trial-phone"
              placeholder="+971 50 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trial-age">
              Age <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="trial-age"
              type="number"
              placeholder="e.g. 12"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min={3}
              max={99}
            />
          </div>

          <Button
            type="submit"
            className="w-full gap-2 mt-4 cursor-pointer"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Submitting...
              </span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
