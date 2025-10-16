import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { quizId, score, totalQuestions, answers } = await request.json()
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: attempt, error } = await supabase
      .from("quiz_attempts")
      .insert({
        quiz_id: quizId,
        user_id: user.id,
        score,
        total_questions: totalQuestions,
        answers,
      })
      .select()
      .single()

    if (error) throw error

    // Update user stats
    await supabase.rpc("increment_quiz_completion", {
      user_id: user.id,
      xp_earned: score * 10,
    })

    return NextResponse.json(attempt)
  } catch (error) {
    console.error("[v0] Quiz submission error:", error)
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
