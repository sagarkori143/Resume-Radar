import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/email"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      },
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get user and create/update user record
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single()

        const { data: userData } = await supabase
          .from("users")
          .upsert({
            id: user.id,
            email: user.email!,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        // Send welcome email for new users
        if (!existingUser && userData) {
          try {
            await sendWelcomeEmail(
              user.email!,
              userData.full_name || null
            )
          } catch (emailError) {
            console.error("Failed to send welcome email:", emailError)
            // Don't fail the auth process if email fails
          }
        }
      }

      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL("/auth/error", request.url))
}
