"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Conversation {
  id: string
  title: string
  subject: string | null
  created_at: string
  updated_at: string
}

interface Message {
  id: string
  conversation_id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

export function useChat(userId: string, initialConversations: Conversation[]) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      })
      return
    }

    setMessages(data || [])
  }

  const selectConversation = async (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId)
    if (conversation) {
      setCurrentConversation(conversation)
      await loadMessages(conversationId)
    }
  }

  const createNewConversation = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        title: "New Conversation",
        subject: null,
      })
      .select()
      .single()

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      })
      return
    }

    setConversations([data, ...conversations])
    setCurrentConversation(data)
    setMessages([])
  }

  const deleteConversation = async (conversationId: string) => {
    const { error } = await supabase.from("conversations").delete().eq("id", conversationId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      })
      return
    }

    setConversations(conversations.filter((c) => c.id !== conversationId))
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null)
      setMessages([])
    }

    toast({
      title: "Success",
      description: "Conversation deleted",
    })
  }

  const sendMessage = async () => {
    if (!currentConversation) {
      await createNewConversation()
      return
    }

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    try {
      // Save user message
      const { data: userMsg, error: userError } = await supabase
        .from("messages")
        .insert({
          conversation_id: currentConversation.id,
          role: "user",
          content: userMessage,
        })
        .select()
        .single()

      if (userError) throw userError

      setMessages((prev) => [...prev, userMsg])

      // Update conversation title if it's the first message
      if (messages.length === 0) {
        const title = userMessage.slice(0, 50) + (userMessage.length > 50 ? "..." : "")
        await supabase.from("conversations").update({ title }).eq("id", currentConversation.id)

        setCurrentConversation({ ...currentConversation, title })
        setConversations(conversations.map((c) => (c.id === currentConversation.id ? { ...c, title } : c)))
      }

      // Call AI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationId: currentConversation.id,
          history: messages.slice(-10), // Last 10 messages for context
        }),
      })

      if (!response.ok) throw new Error("Failed to get AI response")

      const { message: aiMessage } = await response.json()

      // Save AI response
      const { data: aiMsg, error: aiError } = await supabase
        .from("messages")
        .insert({
          conversation_id: currentConversation.id,
          role: "assistant",
          content: aiMessage,
        })
        .select()
        .single()

      if (aiError) throw aiError

      setMessages((prev) => [...prev, aiMsg])

      // Update user stats
      await supabase.rpc("increment_user_messages", { user_id: userId })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
      console.error("[v0] Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
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
  }
}
