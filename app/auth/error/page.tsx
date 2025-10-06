import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, FileText } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <FileText className="h-8 w-8" />
            <span className="text-2xl font-bold">ResumeReview</span>
          </Link>
        </div>

        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="rounded-full bg-destructive/10 w-16 h-16 flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Authentication Error</h3>
              <p className="text-muted-foreground">
                There was a problem signing you in. The link may have expired or already been used.
              </p>
            </div>
            <Link href="/auth/login">
              <Button className="w-full">Try Again</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
