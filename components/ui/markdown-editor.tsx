"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Quote,
  Image as ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Markdown } from "@/components/ui/markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function MarkdownEditor({ value, onChange, className }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState("edit")

  const insertMarkdown = (type: string) => {
    const textarea = document.querySelector("textarea")
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    let insertion = ""
    let cursorOffset = 0

    switch (type) {
      case "bold":
        insertion = `**${text.slice(start, end) || "bold text"}**`
        cursorOffset = 2
        break
      case "italic":
        insertion = `_${text.slice(start, end) || "italic text"}_`
        cursorOffset = 1
        break
      case "list":
        insertion = `\n- ${text.slice(start, end) || "list item"}`
        cursorOffset = 2
        break
      case "ordered-list":
        insertion = `\n1. ${text.slice(start, end) || "list item"}`
        cursorOffset = 3
        break
      case "link":
        insertion = `[${text.slice(start, end) || "link text"}](url)`
        cursorOffset = 1
        break
      case "code":
        insertion = `\`${text.slice(start, end) || "code"}\``
        cursorOffset = 1
        break
      case "quote":
        insertion = `\n> ${text.slice(start, end) || "quote"}`
        cursorOffset = 2
        break
      case "image":
        insertion = `![${text.slice(start, end) || "alt text"}](image-url)`
        cursorOffset = 2
        break
    }

    const newValue = text.slice(0, start) + insertion + text.slice(end)
    onChange(newValue)

    // Set cursor position
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + insertion.length - cursorOffset
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 overflow-x-auto py-1 [&::-webkit-scrollbar]:hidden -mx-1 px-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("list")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("ordered-list")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("link")}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("code")}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("quote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("image")}
          title="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="edit" className="flex-1">Edit</TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="mt-4">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[300px] font-mono"
            placeholder="Write your content in markdown..."
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-4">
          <div className="border rounded-md p-4 min-h-[300px] overflow-auto bg-background">
            <Markdown>{value || "_Nothing to preview yet._"}</Markdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 