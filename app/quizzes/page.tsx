import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { QuizzesContent } from "@/components/quizzes/quizzes-content"

export default async function QuizzesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("*, quizzes(title)")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(10)

  return <QuizzesContent userId={user.id} quizzes={quizzes || []} attempts={attempts || []} />
}
