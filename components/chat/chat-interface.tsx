"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { ConversationList } from "./conversation-list"
import { MessageList } from "./message-list"
import { useChat } from "@/hooks/use-chat"
import { Loader2, Send, Menu, Plus, Sparkles } from "lucide-react"
import Link from "next/link"

interface Conversation {
  id: string
  title: string
  subject: string | null
  created_at: string
  updated_at: string
}

interface ChatInterfaceProps {
  userId: string
  initialConversations: Conversation[]
}

export function ChatInterface({ userId, initialConversations }: ChatInterfaceProps) {
  const [showSidebar, setShowSidebar] = useState(true)
  const {
    conversations,
    currentConversation,
    messages,
    input,
    isLoading,
    setInput,
    sendMessage,
    selectConversation,
    createNewConversation,
    deleteConversation,
  } = useChat(userId, initialConversations)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    await sendMessage()
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-blue-50">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "w-80" : "w-0"
        } transition-all duration-300 overflow-hidden border-r bg-background/80 backdrop-blur`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <Link href="/dashboard">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                LARS
              </h2>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4">
            <Button onClick={createNewConversation} className="w-full" variant="default">
              <Plus className="mr-2 h-4 w-4" />
              New Conversation
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4">
            <ConversationList
              conversations={conversations}
              currentConversationId={currentConversation?.id}
              onSelect={selectConversation}
              onDelete={deleteConversation}
            />
          </ScrollArea>

          <div className="border-t p-4">
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/quizzes">Quizzes</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/flashcards">Flashcards</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/notes">Notes</Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-background/80 backdrop-blur p-4">
          {!showSidebar && (
            <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold">{currentConversation?.title || "New Conversation"}</h1>
            {currentConversation?.subject && (
              <p className="text-sm text-muted-foreground">{currentConversation.subject}</p>
            )}
          </div>
          <div className="w-10" />
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Card className="max-w-md p-8 text-center border-2">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 p-4">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Start Learning with LARS</h3>
                <p className="text-muted-foreground">
                  Ask me anything! I can help you understand concepts, solve problems, and guide your learning journey.
                </p>
              </Card>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
        </ScrollArea>

        {/* Input */}
        <div className="border-t bg-background/80 backdrop-blur p-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
