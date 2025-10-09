import { LoginForm } from "@/components/login-form"
import { Navbar } from "@/components/navbar"
import { getCurrentUser } from "@/lib/actions/auth"

export default async function LoginPage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} variant="landing" />
      
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
