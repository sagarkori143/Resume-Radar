"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { ResumeUpload } from "@/components/resume-upload"
import { ResumeList } from "@/components/resume-list"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"
import type { User } from "@/lib/types"
import type { Resume } from "@/lib/types"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        
        if (!currentUser) {
          router.push("/auth/login")
          return
        }

        // Fetch user data from our database
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .single()

        if (userData) {
          setUser(userData)
        }

        // Fetch resumes
        const { data: resumesData } = await supabase
          .from("resumes")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false })

        setResumes(resumesData || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    // Show skeleton immediately, then fetch data
    fetchData()
  }, [router, supabase])

  // Always show skeleton first, then content when loaded
  if (loading) {
    return <DashboardSkeleton />
  }

  if (!user) {
    return null // Will redirect to login
  }

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
            <ResumeList resumes={resumes} />
          </div>
        </div>
      </main>
    </div>
  )
}
