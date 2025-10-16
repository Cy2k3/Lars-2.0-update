"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MessageSquare, Brain, BookOpen, Trophy, Flame, TrendingUp, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface DashboardContentProps {
  profile: any
  stats: any
  conversations: any[]
  badges: any[]
  recentQuizzes: any[]
}

export function DashboardContent({ profile, stats, conversations, badges, recentQuizzes }: DashboardContentProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const level = stats?.level || 1
  const currentXP = stats?.total_xp || 0
  const xpForNextLevel = level * 100
  const xpProgress = ((currentXP % 100) / xpForNextLevel) * 100

  const activityData = [
    { name: "Mon", messages: 12 },
    { name: "Tue", messages: 19 },
    { name: "Wed", messages: 15 },
    { name: "Thu", messages: 25 },
    { name: "Fri", messages: 22 },
    { name: "Sat", messages: 18 },
    { name: "Sun", messages: 20 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            LARS
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-balance">Welcome back, {profile?.display_name}!</h2>
            <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
          </div>
          <Button asChild size="lg">
            <Link href="/chat">
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Learning
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Level</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{level}</div>
              <Progress value={xpProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {currentXP % 100} / {xpForNextLevel} XP
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.current_streak || 0} days</div>
              <p className="text-xs text-muted-foreground mt-2">Longest: {stats?.longest_streak || 0} days</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_messages || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">Keep the conversation going!</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_quizzes_completed || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">Test your knowledge</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Activity Chart */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="messages" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Badges */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {badges.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Start learning to earn badges!</p>
              ) : (
                <div className="space-y-3">
                  {badges.slice(0, 4).map((userBadge: any) => (
                    <div key={userBadge.badge_id} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                      <div className="text-3xl">{userBadge.badges.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{userBadge.badges.name}</h4>
                        <p className="text-xs text-muted-foreground">{userBadge.badges.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button asChild variant="outline" className="h-24 flex-col gap-2 bg-transparent">
                <Link href="/chat">
                  <MessageSquare className="h-6 w-6" />
                  <span>Chat with LARS</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col gap-2 bg-transparent">
                <Link href="/quizzes">
                  <Brain className="h-6 w-6" />
                  <span>Take a Quiz</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col gap-2 bg-transparent">
                <Link href="/flashcards">
                  <BookOpen className="h-6 w-6" />
                  <span>Study Flashcards</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col gap-2 bg-transparent">
                <Link href="/notes">
                  <BookOpen className="h-6 w-6" />
                  <span>My Notes</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Conversations */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            {conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No conversations yet. Start chatting with LARS!
              </p>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv: any) => (
                  <Link
                    key={conv.id}
                    href={`/chat?conversation=${conv.id}`}
                    className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <h4 className="font-medium text-sm line-clamp-1">{conv.title}</h4>
                    {conv.subject && <p className="text-xs text-muted-foreground">{conv.subject}</p>}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
