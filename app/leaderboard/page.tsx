"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { LeaderboardSkeleton } from "@/components/skeletons/leaderboard-skeleton"
import { Card } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"

interface LeaderboardEntry {
  id: string
  user_id: string
  file_name: string
  score: number
  reviewed_at: string
  user: {
    email: string
    full_name: string | null
  }
}

export default function LeaderboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        
        if (currentUser) {
          // Fetch user data from our database
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", currentUser.id)
            .single()

          if (userData) {
            setUser(userData)
          }
        }

        // Fetch leaderboard data
        const { data: leaderboardData } = await supabase
          .from("resumes")
          .select(
            `
            id,
            user_id,
            file_name,
            score,
            reviewed_at,
            user:users!resumes_user_id_fkey(email, full_name)
          `,
          )
          .not("score", "is", null)
          .order("score", { ascending: false })
          .order("reviewed_at", { ascending: false })
          .limit(100)

        setLeaderboard(leaderboardData || [])
      } catch (error) {
        console.error("Error fetching leaderboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    // Show skeleton immediately, then fetch data
    fetchData()
  }, [supabase])

  // Always show skeleton first, then content when loaded
  if (loading) {
    return <LeaderboardSkeleton />
  }

  const topThree = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} variant="dashboard" />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              <h1 className="text-4xl font-bold">Leaderboard</h1>
            </div>
            <p className="text-muted-foreground text-lg">Top-scoring resumes reviewed by our expert panel</p>
          </div>

          {leaderboard && leaderboard.length > 0 ? (
            <>
              {/* Top 3 Podium */}
              {topThree.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {topThree.map((entry, index) => {
                    const icons = [
                      { icon: Trophy, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10" },
                      { icon: Medal, color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-500/10" },
                      { icon: Award, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10" },
                    ]
                    const { icon: Icon, color, bg } = icons[index]

                    return (
                      <Card
                        key={entry.id}
                        className={`p-6 text-center ${index === 0 ? "md:col-start-2 md:row-start-1 md:scale-105" : ""}`}
                      >
                        <div className={`rounded-full ${bg} w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                          <Icon className={`h-8 w-8 ${color}`} />
                        </div>
                        <div className="space-y-2">
                          <div className="text-3xl font-bold">{entry.score}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.user.full_name || entry.user.email.split("@")[0]}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{entry.file_name}</div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* Rest of the leaderboard */}
              {rest.length > 0 && (
                <Card className="p-6">
                  <LeaderboardTable entries={rest} startRank={4} />
                </Card>
              )}
            </>
          ) : (
            <Card className="p-12 text-center">
              <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No scores yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to submit your resume and get scored!</p>
              {!user && (
                <Link href="/auth/login">
                  <Button>Get Started</Button>
                </Link>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
