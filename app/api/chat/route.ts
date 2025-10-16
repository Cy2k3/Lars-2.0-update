import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    // Build conversation context
    const conversationHistory = history
      .map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      }))
      .slice(-10) // Keep last 10 messages for context

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are LARS (Learning Assistant & Resource System), a friendly and knowledgeable AI tutor. Your role is to:
- Help students understand concepts across various subjects (math, science, programming, etc.)
- Provide clear, step-by-step explanations
- Encourage critical thinking and learning
- Be patient, supportive, and encouraging
- Use examples and analogies to make complex topics easier to understand
- Ask clarifying questions when needed
- Celebrate progress and achievements

Keep responses concise but thorough. Use markdown formatting for better readability.`,
        },
        ...conversationHistory,
        {
          role: "user",
          content: message,
        },
      ],
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
