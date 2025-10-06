"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ResumeWithUser, ResumeStatus } from "@/lib/types"
import { updateResumeReview } from "@/lib/actions/resumes"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ReviewDialogProps {
  resume: ResumeWithUser
  onClose: () => void
}

export function ReviewDialog({ resume, onClose }: ReviewDialogProps) {
  const router = useRouter()
  const [status, setStatus] = useState<ResumeStatus>(resume.status)
  const [score, setScore] = useState<string>(resume.score?.toString() || "")
  const [notes, setNotes] = useState(resume.reviewer_notes || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const scoreValue = score ? Number.parseInt(score, 10) : null

      if (scoreValue !== null && (scoreValue < 0 || scoreValue > 100)) {
        setError("Score must be between 0 and 100")
        setIsSubmitting(false)
        return
      }

      const result = await updateResumeReview(resume.id, {
        status,
        score: scoreValue,
        notes,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.refresh()
          onClose()
        }, 1500)
      }
    } catch (err) {
      setError("Failed to update review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Resume</DialogTitle>
          <DialogDescription>Update the status, score, and provide feedback for {resume.user.email}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ResumeStatus)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="needs_revision">Needs Revision</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="score">Score (0-100)</Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="100"
              placeholder="Enter score (optional)"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Reviewer Notes</Label>
            <Textarea
              id="notes"
              placeholder="Provide detailed feedback for the candidate..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">Review updated successfully!</p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting || success} className="flex-1">
              {isSubmitting ? "Saving..." : success ? "Saved!" : "Save Review"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
