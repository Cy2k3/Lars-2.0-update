import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { subject, topic, cardCount } = await request.json()
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Generate ${cardCount} flashcards about ${topic} in ${subject}.

Format the response as a JSON object with this structure:
{
  "cards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}

Make the flashcards educational and focused on key concepts.`,
    })

    const flashcardsData = JSON.parse(text)

    // Create deck
    const { data: deck, error: deckError } = await supabase
      .from("flashcard_decks")
      .insert({
        user_id: user.id,
        title: `${topic} Flashcards`,
        subject,
      })
      .select()
      .single()

    if (deckError) throw deckError

    // Create flashcards
    const flashcards = flashcardsData.cards.map((card: any) => ({
      deck_id: deck.id,
      front: card.front,
      back: card.back,
    }))

    const { error: cardsError } = await supabase.from("flashcards").insert(flashcards)

    if (cardsError) throw cardsError

    return NextResponse.json(deck)
  } catch (error) {
    console.error("[v0] Flashcard generation error:", error)
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 })
  }
}
