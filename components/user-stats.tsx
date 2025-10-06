"use client"

import { Card } from "@/components/ui/card"
import { FileText, CheckCircle, Clock, BarChart3, Shield, AlertCircle } from "lucide-react"

interface UserStatsProps {
  stats: {
    totalResumes: number
    approvedResumes: number
    pendingResumes: number
    averageScore: number
    adminRequests: number
    pendingAdminRequests: number
  }
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalResumes}</p>
            <p className="text-sm text-muted-foreground">Total Resumes</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-500/10">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.approvedResumes}</p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-yellow-500/10">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingResumes}</p>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-500/10">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{stats.averageScore.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Average Score</p>
          </div>
        </div>
      </Card>

      {stats.adminRequests > 0 && (
        <Card className="p-6 md:col-span-2 lg:col-span-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-500/10">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">Admin Requests</p>
                {stats.pendingAdminRequests > 0 && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{stats.pendingAdminRequests} pending</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.adminRequests} total request{stats.adminRequests !== 1 ? 's' : ''} submitted
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
