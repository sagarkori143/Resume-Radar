"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { ResumeStatus } from "@/lib/types"
import { sendResumeStatusEmail } from "@/lib/email"

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

    // Get resume data before updating
    const { data: resumeData } = await supabase
      .from("resumes")
      .select("user_id, file_name, status")
      .eq("id", resumeId)
      .single()

    if (!resumeData) {
      return { error: "Resume not found" }
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

    // Send email notification to user
    try {
      const { data: userDetails } = await supabase
        .from("users")
        .select("email, full_name")
        .eq("id", resumeData.user_id)
        .single()

      if (userDetails) {
        await sendResumeStatusEmail(
          userDetails.email,
          userDetails.full_name,
          resumeData.file_name,
          resumeData.status, // old status
          data.status,       // new status
          data.score || undefined,
          data.notes || undefined
        )
      }
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the main operation if email fails
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
