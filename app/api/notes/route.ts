import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { title, content, subject } = await request.json()
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: note, error } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        title,
        content,
        subject,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(note)
  } catch (error) {
    console.error("[v0] Note creation error:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}
