"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface QuizTakerProps {
  quiz: any
  userId: string
  onComplete: () => void
}

export function QuizTaker({ quiz, userId, onComplete }: QuizTakerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  const questions = quiz.questions
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    let correctCount = 0
    questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    try {
      await fetch("/api/quizzes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          score: correctCount,
          totalQuestions: questions.length,
          answers,
        }),
      })

      toast({
        title: "Quiz completed!",
        description: `You scored ${correctCount}/${questions.length}`,
      })
    } catch (error) {
      console.error("[v0] Error submitting quiz:", error)
    }
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full border-2">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                {Math.round((score / questions.length) * 100)}%
              </div>
              <p className="text-muted-foreground">
                You got {score} out of {questions.length} questions correct
              </p>
            </div>

            <div className="space-y-4">
              {questions.map((q: any, idx: number) => {
                const isCorrect = answers[idx] === q.correctAnswer
                return (
                  <div key={idx} className="p-4 rounded-lg border">
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{q.question}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your answer: {answers[idx] || "Not answered"}
                        </p>
                        {!isCorrect && <p className="text-sm text-green-600 mt-1">Correct answer: {q.correctAnswer}</p>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Button onClick={onComplete} className="w-full">
              Back to Quizzes
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full border-2">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
          <CardTitle className="text-xl mt-4">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={answers[currentQuestion]} onValueChange={handleAnswer}>
            <div className="space-y-3">
              {question.options.map((option: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-accent">
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <Button onClick={handleNext} disabled={!answers[currentQuestion]} className="w-full">
            {currentQuestion < questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Submit Quiz"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
