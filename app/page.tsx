import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-xl font-bold">ResumeReview</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/leaderboard">
              <Button variant="ghost">Leaderboard</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/login">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-5xl font-bold tracking-tight text-balance">Get Professional Resume Feedback</h2>
          <p className="text-xl text-muted-foreground text-balance">
            Upload your resume and receive expert review with actionable feedback to improve your chances of landing
            your dream job.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/auth/login">
              <Button size="lg">Upload Your Resume</Button>
            </Link>
            <Link href="/leaderboard">
              <Button size="lg" variant="outline">
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 text-center">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Easy Upload</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your PDF resume with instant preview before submission
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Expert Review</h3>
            <p className="text-sm text-muted-foreground">
              Get detailed feedback from experienced reviewers with actionable insights
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your review status and see how you rank on the leaderboard
            </p>
          </Card>
        </div>
      </section>

      {/* Status Types */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Review Process</h3>
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-card border">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-semibold">Pending Review</h4>
                <p className="text-sm text-muted-foreground">Your resume is in the queue and will be reviewed soon</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card border">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold">Approved</h4>
                <p className="text-sm text-muted-foreground">Great job! Your resume meets professional standards</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card border">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold">Needs Revision</h4>
                <p className="text-sm text-muted-foreground">
                  Review the feedback and make improvements to your resume
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card border">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="font-semibold">Rejected</h4>
                <p className="text-sm text-muted-foreground">
                  Significant improvements needed. Check the detailed feedback
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, Supabase, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  )
}
