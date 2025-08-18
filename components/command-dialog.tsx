"use client"

import {
  CommandDialog as CommandDialogPrimitive,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink } from "lucide-react"

interface Library {
  id: string
  name: string
  description: string
  about: string
  author: string
  author_bio: string
  website: string | null
  github: string | null
  preview: string | null
  gallery: string[]
  created_at: string
  updated_at: string
}

interface CommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  libraries: Library[]
  onSelect: (library: Library) => void
}

export function CommandDialog({ open, onOpenChange, libraries, onSelect }: CommandDialogProps) {
  return (
    <CommandDialogPrimitive open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
      </DialogHeader>
      <CommandInput placeholder="Search by name, description, or author..." />
      <CommandList>
        <CommandEmpty>No libraries found.</CommandEmpty>
        <CommandGroup>
          {libraries.map((library) => (
            <CommandItem
              key={library.id}
              value={`${library.name} ${library.description} ${library.author}`}
              onSelect={() => onSelect(library)}
              className="flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{library.name}</div>
                <div className="text-sm text-muted-foreground">by {library.author}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialogPrimitive>
  )
}
