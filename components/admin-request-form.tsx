"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Send, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { User as UserType, AdminRequest } from "@/lib/types"
import { submitAdminRequest } from "@/lib/actions/auth"

interface AdminRequestFormProps {
  user: UserType
  adminRequests: AdminRequest[]
}

export function AdminRequestForm({ user, adminRequests }: AdminRequestFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [reason, setReason] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    setIsLoading(true)

    try {
      await submitAdminRequest(reason)
      setReason("")
      // Show success message
    } catch (error) {
      console.error("Error submitting admin request:", error)
      // Show error message
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
      case "approved":
        return "bg-green-500/20 text-green-600 dark:text-green-400"
      case "rejected":
        return "bg-red-500/20 text-red-600 dark:text-red-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const hasPendingRequest = adminRequests.some((req) => req.status === "pending")

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Shield className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Request Admin Access</h3>
            <p className="text-sm text-muted-foreground">
              Submit a request to become an administrator
            </p>
          </div>
        </div>

        {user.is_admin ? (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">You are already an administrator</span>
            </div>
            <p className="text-sm text-green-600/80 mt-1">
              You have full access to the admin panel and can review resumes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Why do you want admin access?</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please explain why you would like to become an administrator. Include any relevant experience or qualifications..."
                className="min-h-[120px]"
                disabled={hasPendingRequest}
              />
              <p className="text-xs text-muted-foreground">
                Be specific about your qualifications and why you want to help review resumes.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || hasPendingRequest || !reason.trim()}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>

            {hasPendingRequest && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">You have a pending admin request</span>
                </div>
                <p className="text-xs text-yellow-600/80 mt-1">
                  Please wait for your current request to be reviewed before submitting a new one.
                </p>
              </div>
            )}
          </form>
        )}
      </Card>

      {adminRequests.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Your Admin Requests</h4>
          <div className="space-y-4">
            {adminRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-lg border bg-card/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(request.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Your Request:</p>
                  <p className="text-sm text-muted-foreground">{request.reason}</p>
                </div>

                {request.admin_notes && (
                  <div>
                    <p className="text-sm font-medium mb-1">Admin Response:</p>
                    <p className="text-sm text-muted-foreground">{request.admin_notes}</p>
                  </div>
                )}

                {request.reviewed_at && (
                  <p className="text-xs text-muted-foreground">
                    Reviewed on {new Date(request.reviewed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
