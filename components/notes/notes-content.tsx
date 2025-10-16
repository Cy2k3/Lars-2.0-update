"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, Plus, ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface NotesContentProps {
  userId: string
  notes: any[]
}

export function NotesContent({ userId, notes: initialNotes }: NotesContentProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [subject, setSubject] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateNote = async () => {
    if (!title || !content) {
      toast({
        title: "Missing information",
        description: "Please fill in title and content",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, subject }),
      })

      if (!response.ok) throw new Error("Failed to create note")

      const newNote = await response.json()
      setNotes([newNote, ...notes])
      setTitle("")
      setContent("")
      setSubject("")
      toast({
        title: "Note created!",
        description: "Your note has been saved",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateNote = async () => {
    if (!editingNote || !title || !content) return

    try {
      const response = await fetch(`/api/notes/${editingNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, subject }),
      })

      if (!response.ok) throw new Error("Failed to update note")

      const updatedNote = await response.json()
      setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)))
      setEditingNote(null)
      setTitle("")
      setContent("")
      setSubject("")
      toast({
        title: "Note updated!",
        description: "Your changes have been saved",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete note")

      setNotes(notes.filter((n) => n.id !== noteId))
      toast({
        title: "Note deleted",
        description: "Your note has been removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      })
    }
  }

  const startEdit = (note: any) => {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
    setSubject(note.subject || "")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-blue-50">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Notes</h1>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Your Learning Notes</h2>
            <p className="text-muted-foreground mt-1">Organize your thoughts and key concepts</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Note title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject (optional)</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, Physics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your notes here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                  />
                </div>
                <Button
                  onClick={editingNote ? handleUpdateNote : handleCreateNote}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? "Saving..." : editingNote ? "Update Note" : "Create Note"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.length === 0 ? (
            <Card className="col-span-full border-2">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No notes yet. Create your first note!</p>
              </CardContent>
            </Card>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                      {note.subject && <p className="text-sm text-muted-foreground mt-1">{note.subject}</p>}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(note)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{note.content}</p>
                  <p className="text-xs text-muted-foreground">
                    Updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
