"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { ResumeStatus } from "@/lib/types"

interface UpdateReviewData {
  status: ResumeStatus
  score: number | null
  notes: string
}

export async function updateResumeReview(resumeId: string, data: UpdateReviewData) {
  try {
    const supabase = await getSupabaseServerClient()

    // Check authentication and admin status
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const { data: userData } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

    if (!userData?.is_admin) {
      return { error: "Unauthorized - Admin access required" }
    }

    // Update resume review
    const { error } = await supabase
      .from("resumes")
      .update({
        status: data.status,
        score: data.score,
        reviewer_notes: data.notes,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", resumeId)

    if (error) {
      console.error("[v0] Update review error:", error)
      return { error: "Failed to update review" }
    }

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("[v0] Update review error:", error)
    return { error: "Internal server error" }
  }
}
