"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface FlashcardsContentProps {
  userId: string
  decks: any[]
}

export function FlashcardsContent({ userId, decks }: FlashcardsContentProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [cardCount, setCardCount] = useState("10")
  const router = useRouter()
  const { toast } = useToast()

  const handleGenerateDeck = async () => {
    if (!subject || !topic) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          cardCount: Number.parseInt(cardCount),
        }),
      })

      if (!response.ok) throw new Error("Failed to generate flashcards")

      toast({
        title: "Flashcards generated!",
        description: "Your deck is ready to study",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate flashcards",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
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
          <h1 className="text-2xl font-bold">Flashcards</h1>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Study with Flashcards</h2>
            <p className="text-muted-foreground mt-1">Generate AI-powered flashcards for any topic</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Generate Deck
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Flashcard Deck</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Biology, History, Spanish"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Cell Biology, World War II, Verb Conjugation"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="count">Number of Cards</Label>
                  <Input
                    id="count"
                    type="number"
                    min="5"
                    max="50"
                    value={cardCount}
                    onChange={(e) => setCardCount(e.target.value)}
                  />
                </div>
                <Button onClick={handleGenerateDeck} disabled={isGenerating} className="w-full">
                  {isGenerating ? "Generating..." : "Generate Flashcards"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {decks.length === 0 ? (
            <Card className="col-span-full border-2">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No flashcard decks yet. Generate your first deck!</p>
              </CardContent>
            </Card>
          ) : (
            decks.map((deck) => (
              <Card key={deck.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{deck.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{deck.subject}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{deck.flashcards?.[0]?.count || 0} cards</p>
                  <Button asChild className="w-full">
                    <Link href={`/flashcards/${deck.id}`}>Study Deck</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
