import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { deckId, cardsStudied } = await request.json()
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update user stats
    await supabase.rpc("increment_flashcards_studied", {
      user_id: user.id,
      cards_count: cardsStudied,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Flashcard completion error:", error)
    return NextResponse.json({ error: "Failed to complete study session" }, { status: 500 })
  }
}
