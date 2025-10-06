import { Card } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, AlertCircle, XCircle, Shield } from "lucide-react"

interface AdminStatsProps {
  stats: {
    total: number
    pending: number
    approved: number
    needs_revision: number
    rejected: number
    adminRequests?: number
    pendingAdminRequests?: number
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-5 lg:grid-cols-7">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-yellow-500/10 p-3">
            <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-green-500/10 p-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-blue-500/10 p-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Needs Revision</p>
            <p className="text-2xl font-bold">{stats.needs_revision}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-red-500/10 p-3">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-2xl font-bold">{stats.rejected}</p>
          </div>
        </div>
      </Card>

      {stats.adminRequests !== undefined && (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-500/10 p-3">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admin Requests</p>
              <p className="text-2xl font-bold">{stats.adminRequests}</p>
            </div>
          </div>
        </Card>
      )}

      {stats.pendingAdminRequests !== undefined && (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-orange-500/10 p-3">
              <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
              <p className="text-2xl font-bold">{stats.pendingAdminRequests}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
