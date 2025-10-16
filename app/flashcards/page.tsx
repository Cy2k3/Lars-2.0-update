import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FlashcardsContent } from "@/components/flashcards/flashcards-content"

export default async function FlashcardsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: decks } = await supabase
    .from("flashcard_decks")
    .select("*, flashcards(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return <FlashcardsContent userId={user.id} decks={decks || []} />
}
