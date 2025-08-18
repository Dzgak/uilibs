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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row gap-6 lg:gap-12">
      {/* Sidebar */}
      <aside className="lg:w-68 lg:flex-shrink-0 w-full max-w-[360px]">
        <div className="text-lg font-semibold mb-2">Changelog</div>
        <Separator className="mb-4" />
        <ScrollArea className="h-[40vh] lg:h-[70vh] pr-3">
          <div className="space-y-1">
            {entries.map((rel, i) => (
              <button
                key={rel.version}
                onClick={() => setActiveIdx(i)}
                className={`w-full max-w-[360px] text-left rounded px-3 py-2 text-sm hover:bg-muted transition-colors overflow-hidden ${
                  i === activeIdx ? "bg-muted" : ""
                }`}
                style={{ maxWidth: '360px' }}
              >
                <div className="flex flex-col min-w-0">
                  <span className="block font-medium truncate text-ellipsis" style={{ maxWidth: '560px' }}>
                    {rel.title}
                  </span>
                  <span className="block text-xs text-muted-foreground truncate text-ellipsis" style={{ maxWidth: '560px' }}>
                    v{rel.version} • {format(new Date(rel.date), "d MMM yyyy")}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 space-y-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="inline-block mr-2 rounded-sm">v{active.version}</Badge>
          <span className="text-sm text-muted-foreground">
            {format(new Date(active.date), "d MMMM yyyy")}
          </span>
        </div>
        <h1 className="text-xl lg:text-2xl font-semibold break-words">{active.title}</h1>
        <div className="prose prose-sm lg:prose-base max-w-none">
          <Markdown>{active.content}</Markdown>
        </div>
      </main>
    </div>
  )
} 