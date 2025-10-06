"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Shield, CheckCircle, XCircle, Clock, User, MessageSquare } from "lucide-react"
import { AdminRequestWithUser } from "@/lib/types"
import { reviewAdminRequest } from "@/lib/actions/auth"

interface AdminRequestListProps {
  requests: AdminRequestWithUser[]
}

export function AdminRequestList({ requests }: AdminRequestListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [adminNotes, setAdminNotes] = useState("")

  const handleReview = async (requestId: string, status: "approved" | "rejected") => {
    setIsLoading(requestId)
    
    try {
      await reviewAdminRequest(requestId, status, adminNotes)
      setAdminNotes("")
      // Refresh the page or update the state
      window.location.reload()
    } catch (error) {
      console.error("Error reviewing admin request:", error)
      // Show error message
    } finally {
      setIsLoading(null)
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
        return <Clock className="h-4 w-4 text-muted-foreground" />
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

  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Admin Requests</h3>
        <p className="text-muted-foreground">There are no admin requests to review at this time.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {request.user.full_name || request.user.email}
                    </span>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.user.email}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Submitted: {new Date(request.created_at).toLocaleDateString()}</p>
                {request.reviewed_at && (
                  <p>Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Request Reason:</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {request.reason}
              </p>
            </div>

            {request.admin_notes && (
              <div>
                <h4 className="font-medium mb-2">Admin Response:</h4>
                <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                  {request.admin_notes}
                </p>
              </div>
            )}

            {request.reviewer && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Reviewed by:</span> {request.reviewer.full_name || request.reviewer.email}
              </div>
            )}

            {request.status === "pending" && (
              <div className="flex items-center gap-4 pt-4 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-600 hover:bg-green-50 cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Approve Admin Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="admin-notes">Admin Notes (Optional)</Label>
                        <Textarea
                          id="admin-notes"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add any notes for the user..."
                          className="mt-2"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleReview(request.id, "approved")}
                          disabled={isLoading === request.id}
                          className="bg-green-600 hover:bg-green-700 cursor-pointer"
                        >
                          {isLoading === request.id ? "Approving..." : "Approve Request"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Admin Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="admin-notes-reject">Reason for Rejection</Label>
                        <Textarea
                          id="admin-notes-reject"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Please provide a reason for rejection..."
                          className="mt-2"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleReview(request.id, "rejected")}
                          disabled={isLoading === request.id}
                          variant="destructive"
                          className="cursor-pointer"
                        >
                          {isLoading === request.id ? "Rejecting..." : "Reject Request"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
