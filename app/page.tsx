import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-violet-50 to-blue-50 p-6">
      <div className="max-w-4xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-balance bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            LARS
          </h1>
          <p className="text-2xl font-semibold text-foreground">Learning Assistant & Resource System</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Your personal AI tutor that adapts to your learning style. Get instant help, track progress, and master any
            subject with interactive quizzes, flashcards, and personalized guidance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 rounded-lg bg-background/50 backdrop-blur border-2">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold text-lg mb-2">AI Chat Tutor</h3>
            <p className="text-sm text-muted-foreground">
              Get instant answers and explanations tailored to your learning needs
            </p>
          </div>
          <div className="p-6 rounded-lg bg-background/50 backdrop-blur border-2">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your learning journey with detailed stats and achievements
            </p>
          </div>
          <div className="p-6 rounded-lg bg-background/50 backdrop-blur border-2">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold text-lg mb-2">Interactive Tools</h3>
            <p className="text-sm text-muted-foreground">
              Master concepts with quizzes, flashcards, and personalized notes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
