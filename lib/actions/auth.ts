"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signInWithMagicLink(email: string, redirectTo?: string) {
  const supabase = await getSupabaseServerClient()

  // Determine the correct redirect URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://resume-radar-ochre.vercel.app'
  const redirectUrl = `${siteUrl}/auth/callback`

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

  // If approved, also update the user's admin status
  if (status === "approved") {
    const { data: request } = await supabase
      .from("admin_requests")
      .select("user_id")
      .eq("id", requestId)
      .single()

    if (request) {
      await supabase
        .from("users")
        .update({ is_admin: true })
        .eq("id", request.user_id)
    }
  }

  return { success: true }
}