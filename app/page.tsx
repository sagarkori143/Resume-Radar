import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, CheckCircle, Clock, XCircle, TrendingUp, Star, Users, Award, ArrowRight, Sparkles, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">ResumeReview</h1>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/leaderboard">
              <Button variant="ghost" className="hidden sm:flex cursor-pointer">
                <Award className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" className="cursor-pointer">Sign In</Button>
            </Link>
            <Link href="/auth/login">
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 cursor-pointer">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Trusted by 1000+ professionals
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold tracking-tight text-balance bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            Get Professional Resume Feedback
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
            Upload your resume and receive expert review with actionable feedback to improve your chances of landing
            your dream job. Join thousands of professionals who've enhanced their careers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/auth/login">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                <FileText className="h-5 w-5 mr-2" />
                Upload Your Resume
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-muted/50 transition-all duration-300 cursor-pointer">
                <Award className="h-5 w-5 mr-2" />
                View Leaderboard
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>1000+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>5000+ Resumes Reviewed</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4">Why Choose ResumeReview?</h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge technology with human expertise to deliver the best resume feedback
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 text-center group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Lightning Fast Upload</h3>
            <p className="text-muted-foreground leading-relaxed">
              Drag and drop your PDF resume with instant preview and validation. Get your resume reviewed in minutes, not days.
            </p>
          </Card>

          <Card className="p-8 text-center group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
            <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Expert Review</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get detailed feedback from certified HR professionals and career experts with actionable insights tailored to your industry.
            </p>
          </Card>

          <Card className="p-8 text-center group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
            <p className="text-muted-foreground leading-relaxed">
              Monitor your review status in real-time, track improvements, and see how you rank on our competitive leaderboard.
            </p>
          </Card>
        </div>
      </section>

      {/* Status Types */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">How It Works</h3>
            <p className="text-xl text-muted-foreground">
              Simple, transparent, and efficient resume review process
            </p>
          </div>
          
          <div className="grid gap-6">
            <div className="flex items-start gap-6 p-6 rounded-2xl bg-card border-2 hover:border-yellow-500/20 transition-all duration-300 group">
              <div className="rounded-full bg-yellow-500/10 p-3 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-2">Pending Review</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Your resume is in our expert review queue. Our certified reviewers will analyze your resume within 24-48 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-2xl bg-card border-2 hover:border-green-500/20 transition-all duration-300 group">
              <div className="rounded-full bg-green-500/10 p-3 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-2">Approved</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Excellent work! Your resume meets professional standards and is ready to impress employers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-2xl bg-card border-2 hover:border-blue-500/20 transition-all duration-300 group">
              <div className="rounded-full bg-blue-500/10 p-3 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-2">Needs Revision</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Review the detailed feedback and make suggested improvements. You can resubmit for another review.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-2xl bg-card border-2 hover:border-red-500/20 transition-all duration-300 group">
              <div className="rounded-full bg-red-500/10 p-3 group-hover:scale-110 transition-transform duration-300">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-2">Rejected</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Significant improvements needed. Check our comprehensive feedback guide and resubmit when ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-4xl font-bold">Ready to Get Started?</h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who have improved their resumes and landed their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-muted/50 transition-all duration-300 cursor-pointer">
                See Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h4 className="text-lg font-bold">ResumeReview</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional resume feedback platform trusted by thousands of job seekers.
              </p>
            </div>
            
            <div className="space-y-4">
              <h5 className="font-semibold">Platform</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><Link href="/leaderboard" className="hover:text-foreground transition-colors cursor-pointer">Leaderboard</Link></div>
                <div><Link href="/auth/login" className="hover:text-foreground transition-colors cursor-pointer">Sign In</Link></div>
                <div><Link href="/auth/login" className="hover:text-foreground transition-colors cursor-pointer">Get Started</Link></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h5 className="font-semibold">Support</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Help Center</div>
                <div>Contact Us</div>
                <div>FAQ</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h5 className="font-semibold">Legal</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Cookie Policy</div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>Built with ❤️ by Sagar Kori • © 2024 ResumeReview. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
