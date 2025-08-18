"use client"

import { useState } from "react"
import { ChangelogEntry } from "@/lib/changelog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Markdown } from "@/components/ui/markdown"
import { format } from "date-fns"

export default function ChangelogClient({ entries }: { entries: ChangelogEntry[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  if (!entries.length) {
    return <p className="text-center w-full py-20 text-muted-foreground">No changelog entries found.</p>
  }
  const active = entries[activeIdx]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex gap-12">
      {/* Sidebar */}
      <aside className="hidden md:block w-68 flex-shrink-0">
        <div className="text-lg font-semibold mb-2">Changelog</div>
        <Separator className="mb-4" />
        <ScrollArea className="h-[70vh] pr-3">
          <div className="space-y-1">
            {entries.map((rel, i) => (
              <button
                key={rel.version}
                onClick={() => setActiveIdx(i)}
                className={`w-full max-w-full text-left rounded px-3 py-2 text-sm hover:bg-muted transition-colors overflow-hidden ${
                  i === activeIdx ? "bg-muted" : ""
                }`}
              >
                <span className="block font-medium truncate">{rel.title}</span>
                <span className="block text-xs text-muted-foreground truncate">
                  v{rel.version} • {format(new Date(rel.date), "d MMM yyyy")}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 space-y-6">
        <div className="flex items-center gap-2">
          <Badge className="inline-block mr-2 rounded-sm">v{active.version}</Badge>
          <span className="text-sm text-muted-foreground">
            {format(new Date(active.date), "d MMMM yyyy")}
          </span>
        </div>
        <h1 className="text-2xl font-semibold">{active.title}</h1>
        <Markdown>{active.content}</Markdown>
      </main>
    </div>
  )
} 