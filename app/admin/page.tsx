import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminResumeList } from "@/components/admin-resume-list"
import { AdminStats } from "@/components/admin-stats"
import { AdminRequestList } from "@/components/admin-request-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || !user.is_admin) {
    redirect("/dashboard")
  }

  const supabase = await getSupabaseServerClient()

  // Fetch all resumes with user information
  const { data: resumes } = await supabase
    .from("resumes")
    .select(
      `
      *,
      user:users!resumes_user_id_fkey(email, full_name)
    `,
    )
    .order("created_at", { ascending: false })

  // Fetch admin requests
  const { data: adminRequests } = await supabase
    .from("admin_requests")
    .select(
      `
      *,
      user:users!admin_requests_user_id_fkey(email, full_name),
      reviewer:users!admin_requests_reviewed_by_fkey(email, full_name)
    `,
    )
    .order("created_at", { ascending: false })

  // Calculate stats
  const stats = {
    total: resumes?.length || 0,
    pending: resumes?.filter((r) => r.status === "pending").length || 0,
    approved: resumes?.filter((r) => r.status === "approved").length || 0,
    needs_revision: resumes?.filter((r) => r.status === "needs_revision").length || 0,
    rejected: resumes?.filter((r) => r.status === "rejected").length || 0,
    adminRequests: adminRequests?.length || 0,
    pendingAdminRequests: adminRequests?.filter((r) => r.status === "pending").length || 0,
  }

  const pendingResumes = resumes?.filter((r) => r.status === "pending") || []
  const reviewedResumes = resumes?.filter((r) => r.status !== "pending") || []
  const pendingAdminRequests = adminRequests?.filter((r) => r.status === "pending") || []
  const allAdminRequests = adminRequests || []

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Review and manage resume submissions</p>
          </div>

          <AdminStats stats={stats} />

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pending">
                Pending Review
                {stats.pending > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                    {stats.pending}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
              <TabsTrigger value="all">All Resumes</TabsTrigger>
              <TabsTrigger value="admin-requests">
                Admin Requests
                {stats.pendingAdminRequests > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400">
                    {stats.pendingAdminRequests}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="all-requests">All Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <AdminResumeList resumes={pendingResumes} />
            </TabsContent>

            <TabsContent value="reviewed" className="space-y-4">
              <AdminResumeList resumes={reviewedResumes} />
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <AdminResumeList resumes={resumes || []} />
            </TabsContent>

            <TabsContent value="admin-requests" className="space-y-4">
              <AdminRequestList requests={pendingAdminRequests} />
            </TabsContent>

            <TabsContent value="all-requests" className="space-y-4">
              <AdminRequestList requests={allAdminRequests} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
