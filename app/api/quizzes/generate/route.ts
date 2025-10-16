import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { subject, topic, difficulty, questionCount } = await request.json()
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Generate a ${difficulty} difficulty quiz about ${topic} in ${subject} with ${questionCount} multiple choice questions.

Format the response as a JSON object with this structure:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The correct option text"
    }
  ]
}

Make sure questions are educational, clear, and appropriate for the difficulty level.`,
    })

    const quizData = JSON.parse(text)

    const { data: quiz, error } = await supabase
      .from("quizzes")
      .insert({
        user_id: user.id,
        title: `${topic} Quiz`,
        subject,
        difficulty,
        questions: quizData.questions,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(quiz)
  } catch (error) {
    console.error("[v0] Quiz generation error:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
