"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          {message.role === "assistant" && (
            <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-500 to-violet-500">
              <AvatarFallback>
                <Bot className="h-4 w-4 text-white" />
              </AvatarFallback>
            </Avatar>
          )}

          <Card
            className={`max-w-[80%] p-4 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}
          >
            <div
              className={`prose prose-sm max-w-none ${
                message.role === "user" ? "prose-invert" : "prose-slate dark:prose-invert"
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </Card>

          {message.role === "user" && (
            <Avatar className="h-8 w-8 bg-secondary">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  )
}
