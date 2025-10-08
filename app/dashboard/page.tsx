import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ResumeUpload } from "@/components/resume-upload"
import { ResumeList } from "@/components/resume-list"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServerClient()

  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} variant="dashboard" />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Upload and track your resume submissions</p>
          </div>

          <ResumeUpload />

          <div>
            <h2 className="text-2xl font-semibold mb-4">My Resumes</h2>
            <ResumeList resumes={resumes || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
