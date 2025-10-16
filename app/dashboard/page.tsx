import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user stats
  const { data: stats } = await supabase.from("user_stats").select("*").eq("user_id", user.id).single()

  // Fetch recent conversations
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(5)

  // Fetch user badges
  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("*, badges(*)")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false })

  // Fetch recent quiz attempts
  const { data: recentQuizzes } = await supabase
    .from("quiz_attempts")
    .select("*, quizzes(title, subject)")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(5)

  return (
    <DashboardContent
      profile={profile}
      stats={stats}
      conversations={conversations || []}
      badges={userBadges || []}
      recentQuizzes={recentQuizzes || []}
    />
  )
}
