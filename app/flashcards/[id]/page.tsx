import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FlashcardStudy } from "@/components/flashcards/flashcard-study"

export default async function FlashcardStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: deck } = await supabase.from("flashcard_decks").select("*").eq("id", id).single()

  const { data: flashcards } = await supabase.from("flashcards").select("*").eq("deck_id", id)

  if (!deck || !flashcards) {
    redirect("/flashcards")
  }

  return <FlashcardStudy deck={deck} flashcards={flashcards} userId={user.id} />
}
