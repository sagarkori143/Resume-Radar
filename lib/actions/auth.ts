"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { sendWelcomeEmail, sendAdminRequestApprovedEmail, sendAdminRequestRejectedEmail } from "@/lib/email"

export async function signInWithMagicLink(email: string, redirectTo?: string) {
  const supabase = await getSupabaseServerClient()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL  
  const redirectUrl = redirectTo || `${siteUrl}/auth/callback`

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  return userData
}

export async function updateUserProfile(data: { full_name: string }) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase
    .from("users")
    .update({ full_name: data.full_name })
    .eq("id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}

export async function submitAdminRequest(reason: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Check if user already has a pending request
  const { data: existingRequest } = await supabase
    .from("admin_requests")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .single()

  if (existingRequest) {
    throw new Error("You already have a pending admin request")
  }

  const { error } = await supabase
    .from("admin_requests")
    .insert({
      user_id: user.id,
      reason,
    })

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}

export async function reviewAdminRequest(
  requestId: string,
  status: "approved" | "rejected",
  adminNotes?: string
) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.user_metadata.is_admin) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("admin_requests")
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      admin_notes: adminNotes || null,
    })
    .eq("id", requestId)

  if (error) {
    throw new Error(error.message)
  }

  // Get user details for email notification
  const { data: requestData } = await supabase
    .from("admin_requests")
    .select(`
      user_id,
      users!admin_requests_user_id_fkey(email, full_name)
    `)
    .eq("id", requestId)
    .single()

  // If approved, also update the user's admin status
  if (status === "approved") {
    if (requestData) {
      await supabase
        .from("users")
        .update({ is_admin: true })
        .eq("id", requestData.user_id)

      // Send approval email
      try {
        if (requestData.users) {
          await sendAdminRequestApprovedEmail(
            requestData.users.email,
            requestData.users.full_name,
            adminNotes
          )
        }
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError)
      }
    }
  } else if (status === "rejected") {
    // Send rejection email
    try {
      if (requestData?.users) {
        await sendAdminRequestRejectedEmail(
          requestData.users.email,
          requestData.users.full_name,
          adminNotes
        )
      }
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError)
    }
  }

  return { success: true }
}