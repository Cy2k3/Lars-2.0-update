"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Conversation {
  id: string
  title: string
  subject: string | null
  updated_at: string
}

interface ConversationListProps {
  conversations: Conversation[]
  currentConversationId?: string
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function ConversationList({ conversations, currentConversationId, onSelect, onDelete }: ConversationListProps) {
  if (conversations.length === 0) {
    return <div className="py-8 text-center text-sm text-muted-foreground">No conversations yet</div>
  }

  return (
    <div className="space-y-2 pb-4">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`group relative rounded-lg border p-3 transition-colors hover:bg-accent ${
            currentConversationId === conversation.id ? "bg-accent border-primary" : ""
          }`}
        >
          <button onClick={() => onSelect(conversation.id)} className="w-full text-left">
            <h4 className="font-medium text-sm line-clamp-1">{conversation.title}</h4>
            {conversation.subject && (
              <p className="text-xs text-muted-foreground line-clamp-1">{conversation.subject}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(conversation.updated_at), {
                addSuffix: true,
              })}
            </p>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDelete(conversation.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  )
}
