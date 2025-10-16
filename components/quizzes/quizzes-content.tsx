"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Brain, Plus, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { QuizTaker } from "./quiz-taker"

interface QuizzesContentProps {
  userId: string
  quizzes: any[]
  attempts: any[]
}

export function QuizzesContent({ userId, quizzes, attempts }: QuizzesContentProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null)
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [questionCount, setQuestionCount] = useState("5")
  const router = useRouter()
  const { toast } = useToast()

  const handleGenerateQuiz = async () => {
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
      const response = await fetch("/api/quizzes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          questionCount: Number.parseInt(questionCount),
        }),
      })

      if (!response.ok) throw new Error("Failed to generate quiz")

      const quiz = await response.json()
      toast({
        title: "Quiz generated!",
        description: "Your quiz is ready to take",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (selectedQuiz) {
    return <QuizTaker quiz={selectedQuiz} userId={userId} onComplete={() => setSelectedQuiz(null)} />
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
          <h1 className="text-2xl font-bold">Quizzes</h1>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Test Your Knowledge</h2>
            <p className="text-muted-foreground mt-1">Generate AI-powered quizzes on any topic</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Generate Quiz
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Quiz</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, Physics, Programming"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Algebra, Quantum Mechanics, React Hooks"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="count">Number of Questions</Label>
                  <Select value={questionCount} onValueChange={setQuestionCount}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleGenerateQuiz} disabled={isGenerating} className="w-full">
                  {isGenerating ? "Generating..." : "Generate Quiz"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Your Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quizzes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No quizzes yet. Generate your first quiz!
                </p>
              ) : (
                <div className="space-y-3">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{quiz.title}</h4>
                        <p className="text-sm text-muted-foreground">{quiz.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {quiz.questions.length} questions • {quiz.difficulty}
                        </p>
                      </div>
                      <Button onClick={() => setSelectedQuiz(quiz)}>Take Quiz</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Recent Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {attempts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No quiz attempts yet</p>
              ) : (
                <div className="space-y-3">
                  {attempts.map((attempt) => (
                    <div key={attempt.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{attempt.quizzes?.title}</h4>
                        <span className="text-sm font-bold">
                          {attempt.score}/{attempt.total_questions}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((attempt.score / attempt.total_questions) * 100)}% correct
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
