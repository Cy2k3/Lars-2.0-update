import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NotesContent } from "@/components/notes/notes-content"

export default async function NotesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  return <NotesContent userId={user.id} notes={notes || []} />
}
