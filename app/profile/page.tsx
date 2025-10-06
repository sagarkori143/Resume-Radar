import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProfileForm } from "@/components/profile-form"
import { AdminRequestForm } from "@/components/admin-request-form"
import { UserStats } from "@/components/user-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Settings, Shield, BarChart3 } from "lucide-react"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServerClient()

  // Fetch user's resumes
  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch user's admin requests
  const { data: adminRequests } = await supabase
    .from("admin_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Calculate user stats
  const stats = {
    totalResumes: resumes?.length || 0,
    approvedResumes: resumes?.filter((r) => r.status === "approved").length || 0,
    pendingResumes: resumes?.filter((r) => r.status === "pending").length || 0,
    averageScore: resumes?.filter((r) => r.score !== null).reduce((acc, r) => acc + (r.score || 0), 0) / (resumes?.filter((r) => r.score !== null).length || 1) || 0,
    adminRequests: adminRequests?.length || 0,
    pendingAdminRequests: adminRequests?.filter((r) => r.status === "pending").length || 0,
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>
          </div>

          <UserStats stats={stats} />

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="admin-request" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Request
                {stats.pendingAdminRequests > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                    {stats.pendingAdminRequests}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileForm user={user} />
            </TabsContent>

            <TabsContent value="admin-request" className="space-y-6">
              <AdminRequestForm user={user} adminRequests={adminRequests || []} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Account Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <h4 className="font-medium mb-2">Account Information</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your account was created on {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Full Name:</span>
                        <span>{user.full_name || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Admin Status:</span>
                        <span className={user.is_admin ? "text-green-600" : "text-muted-foreground"}>
                          {user.is_admin ? "Administrator" : "Regular User"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card">
                    <h4 className="font-medium mb-2">Resume Statistics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Resumes:</span>
                        <span>{stats.totalResumes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Approved:</span>
                        <span className="text-green-600">{stats.approvedResumes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pending:</span>
                        <span className="text-yellow-600">{stats.pendingResumes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Score:</span>
                        <span>{stats.averageScore.toFixed(1)}/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
