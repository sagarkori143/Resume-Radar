"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { AdminResumeList } from "@/components/admin-resume-list"
import { AdminStats } from "@/components/admin-stats"
import { AdminRequestList } from "@/components/admin-request-list"
import { AdminSkeleton } from "@/components/skeletons/admin-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User } from "@/lib/types"
import type { ResumeWithUser, AdminRequestWithUser } from "@/lib/types"

interface AdminStats {
  total: number
  pending: number
  approved: number
  needs_revision: number
  rejected: number
  adminRequests: number
  pendingAdminRequests: number
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [resumes, setResumes] = useState<ResumeWithUser[]>([])
  const [adminRequests, setAdminRequests] = useState<AdminRequestWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        
        if (!currentUser) {
          router.push("/dashboard")
          return
        }

        // Fetch user data from our database
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .single()

        if (!userData?.is_admin) {
          router.push("/dashboard")
          return
        }

        setUser(userData)

        // Fetch all resumes with user information
        const { data: resumesData } = await supabase
          .from("resumes")
          .select(
            `
            *,
            user:users!resumes_user_id_fkey(email, full_name)
          `,
          )
          .order("created_at", { ascending: false })

        // Fetch admin requests
        const { data: adminRequestsData } = await supabase
          .from("admin_requests")
          .select(
            `
            *,
            user:users!admin_requests_user_id_fkey(email, full_name),
            reviewer:users!admin_requests_reviewed_by_fkey(email, full_name)
          `,
          )
          .order("created_at", { ascending: false })

        setResumes(resumesData || [])
        setAdminRequests(adminRequestsData || [])
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    // Show skeleton immediately, then fetch data
    fetchData()
  }, [router, supabase])

  // Always show skeleton first, then content when loaded
  if (loading) {
    return <AdminSkeleton />
  }

  if (!user) {
    return null // Will redirect
  }

  // Calculate stats
  const stats: AdminStats = {
    total: resumes.length,
    pending: resumes.filter((r) => r.status === "pending").length,
    approved: resumes.filter((r) => r.status === "approved").length,
    needs_revision: resumes.filter((r) => r.status === "needs_revision").length,
    rejected: resumes.filter((r) => r.status === "rejected").length,
    adminRequests: adminRequests.length,
    pendingAdminRequests: adminRequests.filter((r) => r.status === "pending").length,
  }

  const pendingResumes = resumes.filter((r) => r.status === "pending")
  const reviewedResumes = resumes.filter((r) => r.status !== "pending")
  const pendingAdminRequests = adminRequests.filter((r) => r.status === "pending")
  const allAdminRequests = adminRequests

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} variant="dashboard" />

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
              <AdminResumeList resumes={resumes} />
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
