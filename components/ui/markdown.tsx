<<<<<<< HEAD
"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

import { cn } from "@/lib/utils"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MarkdownProps {
  children: string
  className?: string
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <article
      className={cn(
        "prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-24 space-y-4",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // @ts-ignore
          code({ node, inline, className: codeClass, children: codeChildren, ...props }) {
            const match = /language-(\w+)/.exec(codeClass || "")
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={oneDark as any}
                language={match[1] as any}
                PreTag="div"
                customStyle={{ margin: 0, borderRadius: 6, fontSize: 14 }}
              >
                {String(codeChildren).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                {...props}
                className={cn(
                  codeClass,
                  "rounded-sm bg-muted px-1.5 py-0.5 border font-mono text-xs dark:bg-muted/40"
                )}
              >
                {codeChildren}
              </code>
            )
          },
          table({ children }) {
            return (
              <div className="overflow-auto">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            )
          },
          thead({ children, ...props }) {
            return (
              <thead {...props} className="bg-muted/50 text-foreground">
                {children}
              </thead>
            )
          },
          th({ children, ...props }) {
            return (
              <th
                {...props}
                className="border-b px-3 py-2 text-left font-medium first:pl-4 last:pr-4"
              >
                {children}
              </th>
            )
          },
          td({ children, ...props }) {
            return (
              <td
                {...props}
                className="border-b px-3 py-2 first:pl-4 last:pr-4 align-top"
              >
                {children}
              </td>
            )
          },
          input({ checked, type, ...props }) {
            if (type !== "checkbox") return <input type={type} {...props} />
            const { Checkbox } = require("@/components/ui/checkbox")
            return (
              <Checkbox checked={checked} disabled className="mr-2" />
            )
          },
          a({ href = "", children, ...props }) {
            const isExternal = href.startsWith("http")
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-primary underline-offset-2 hover:underline"
                {...props}
              >
                {children}
              </a>
            )
          },
          img({ src = "", alt = "", ...props }) {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt} className="rounded-md object-cover overflow-hidden bg-muted/50 border" {...props} />
            )
          },
          hr() {
            const { Separator } = require("@/components/ui/separator")
            return <Separator className="my-8" />
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-zinc-300 dark:border-zinc-600 pl-4 italic text-zinc-600 dark:text-zinc-400">
                {children}
              </blockquote>
            )
          },
          h1({ children, ...props }) {
            return (
              <h1 {...props} className="text-3xl font-semibold mt-6 mb-4">
                {children}
              </h1>
            )
          },
          h2({ children, ...props }) {
            return (
              <h2 {...props} className="text-2xl font-semibold mt-6 mb-4">
                {children}
              </h2>
            )
          },
          h3({ children, ...props }) {
            return (
              <h3 {...props} className="text-xl font-semibold mt-6 mb-3">
                {children}
              </h3>
            )
          },
          ul({ children, ...props }) {
            return (
              <ul {...props} className="list-disc list-inside marker:text-zinc-500 dark:marker:text-zinc-400">
                {children}
              </ul>
            )
          },
          ol({ children, ...props }) {
            return (
              <ol {...props} className="list-decimal list-inside marker:text-zinc-500 dark:marker:text-zinc-400">
                {children}
              </ol>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </article>
  )
=======
"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

import { cn } from "@/lib/utils"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MarkdownProps {
  children: string
  className?: string
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <article
      className={cn(
        "prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-24 space-y-4",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // @ts-ignore
          code({ node, inline, className: codeClass, children: codeChildren, ...props }) {
            const match = /language-(\w+)/.exec(codeClass || "")
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={oneDark as any}
                language={match[1] as any}
                PreTag="div"
                customStyle={{ margin: 0, borderRadius: 6, fontSize: 14 }}
              >
                {String(codeChildren).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                {...props}
                className={cn(
                  codeClass,
                  "rounded-sm bg-muted px-1.5 py-0.5 border font-mono text-xs dark:bg-muted/40"
                )}
              >
                {codeChildren}
              </code>
            )
          },
          table({ children }) {
            return (
              <div className="overflow-auto">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            )
          },
          thead({ children, ...props }) {
            return (
              <thead {...props} className="bg-muted/50 text-foreground">
                {children}
              </thead>
            )
          },
          th({ children, ...props }) {
            return (
              <th
                {...props}
                className="border-b px-3 py-2 text-left font-medium first:pl-4 last:pr-4"
              >
                {children}
              </th>
            )
          },
          td({ children, ...props }) {
            return (
              <td
                {...props}
                className="border-b px-3 py-2 first:pl-4 last:pr-4 align-top"
              >
                {children}
              </td>
            )
          },
          input({ checked, type, ...props }) {
            if (type !== "checkbox") return <input type={type} {...props} />
            const { Checkbox } = require("@/components/ui/checkbox")
            return (
              <Checkbox checked={checked} disabled className="mr-2" />
            )
          },
          a({ href = "", children, ...props }) {
            const isExternal = href.startsWith("http")
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-primary underline-offset-2 hover:underline"
                {...props}
              >
                {children}
              </a>
            )
          },
          img({ src = "", alt = "", ...props }) {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt} className="rounded-md object-cover overflow-hidden bg-muted/50 border" {...props} />
            )
          },
          hr() {
            const { Separator } = require("@/components/ui/separator")
            return <Separator className="my-8" />
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-zinc-300 dark:border-zinc-600 pl-4 italic text-zinc-600 dark:text-zinc-400">
                {children}
              </blockquote>
            )
          },
          h1({ children, ...props }) {
            return (
              <h1 {...props} className="text-3xl font-semibold mt-6 mb-4">
                {children}
              </h1>
            )
          },
          h2({ children, ...props }) {
            return (
              <h2 {...props} className="text-2xl font-semibold mt-6 mb-4">
                {children}
              </h2>
            )
          },
          h3({ children, ...props }) {
            return (
              <h3 {...props} className="text-xl font-semibold mt-6 mb-3">
                {children}
              </h3>
            )
          },
          ul({ children, ...props }) {
            return (
              <ul {...props} className="list-disc list-inside marker:text-zinc-500 dark:marker:text-zinc-400">
                {children}
              </ul>
            )
          },
          ol({ children, ...props }) {
            return (
              <ol {...props} className="list-decimal list-inside marker:text-zinc-500 dark:marker:text-zinc-400">
                {children}
              </ol>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </article>
  )
>>>>>>> 26f5c4aaa43b5cb09fa17654e30dc706207c1aed
} 