"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { formatFileSize } from "@/lib/utils/file-validation"
import type { ResumeWithUser } from "@/lib/types"
import { format } from "date-fns"
import { ReviewDialog } from "@/components/review-dialog"

interface AdminResumeListProps {
  resumes: ResumeWithUser[]
}

const statusConfig = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  },
  needs_revision: {
    label: "Needs Revision",
    icon: AlertCircle,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
}

export function AdminResumeList({ resumes }: AdminResumeListProps) {
  const [selectedResume, setSelectedResume] = useState<ResumeWithUser | null>(null)

  if (resumes.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No resumes found</h3>
        <p className="text-muted-foreground">There are no resumes in this category</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {resumes.map((resume) => {
          const config = statusConfig[resume.status]
          const StatusIcon = config.icon

          return (
            <Card key={resume.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{resume.file_name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>{resume.user.email}</span>
                        {resume.user.full_name && (
                          <>
                            <span>•</span>
                            <span>{resume.user.full_name}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>{formatFileSize(resume.file_size)}</span>
                        <span>•</span>
                        <span>Uploaded {format(new Date(resume.created_at), "MMM d, yyyy")}</span>
                      </div>
                    </div>

                    <Badge variant="outline" className={config.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>

                  {resume.score !== null && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Score:</span>
                      <Badge variant="secondary" className="font-mono">
                        {resume.score}/100
                      </Badge>
                    </div>
                  )}

                  {resume.reviewer_notes && (
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-sm font-medium mb-1">Reviewer Notes:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{resume.reviewer_notes}</p>
                      {resume.reviewed_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Reviewed on {format(new Date(resume.reviewed_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Resume
                      </a>
                    </Button>
                    <Button size="sm" onClick={() => setSelectedResume(resume)}>
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {selectedResume && <ReviewDialog resume={selectedResume} onClose={() => setSelectedResume(null)} />}
    </>
  )
}
