"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface FlashcardStudyProps {
  deck: any
  flashcards: any[]
  userId: string
}

export function FlashcardStudy({ deck, flashcards, userId }: FlashcardStudyProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set())
  const router = useRouter()
  const { toast } = useToast()

  const progress = (studiedCards.size / flashcards.length) * 100
  const currentCard = flashcards[currentIndex]

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      setStudiedCards(new Set(studiedCards).add(currentIndex))
    }
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleComplete = async () => {
    try {
      await fetch("/api/flashcards/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deckId: deck.id,
          cardsStudied: studiedCards.size,
        }),
      })

      toast({
        title: "Study session complete!",
        description: `You studied ${studiedCards.size} cards`,
      })
      router.push("/flashcards")
    } catch (error) {
      console.error("[v0] Error completing study session:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-blue-50">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/flashcards">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{deck.title}</h1>
            <p className="text-sm text-muted-foreground">{deck.subject}</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <span>{Math.round(progress)}% studied</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <Card
            className="w-full max-w-2xl h-96 cursor-pointer border-2 hover:shadow-xl transition-all"
            onClick={handleFlip}
          >
            <CardContent className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">{isFlipped ? "Back" : "Front"}</p>
                <p className="text-2xl font-medium">{isFlipped ? currentCard.back : currentCard.front}</p>
                {!isFlipped && <p className="text-sm text-muted-foreground mt-8">Click to reveal answer</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="lg" onClick={handlePrevious} disabled={currentIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="lg" onClick={handleFlip}>
            <RotateCw className="mr-2 h-4 w-4" />
            Flip Card
          </Button>
          <Button size="lg" onClick={handleNext}>
            {currentIndex === flashcards.length - 1 ? "Complete" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
