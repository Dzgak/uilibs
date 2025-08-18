import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface MarkdownExampleProps {
  content: string;
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button
      className="absolute top-2 right-2 z-10 pointer-events-auto w-auto h-auto p-1.5"
      size="icon"
      variant="secondary"
      onClick={handleCopy}
    >
      {copied ? <Check size={8} /> : <Copy size={8} />}
    </Button>
  );
}

export function MarkdownExample({ content }: MarkdownExampleProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-4xl font-bold mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-3xl font-semibold mb-3 mt-6">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-2xl font-semibold mb-2 mt-5">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-xl font-semibold mb-2 mt-4">{children}</h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-lg font-semibold mb-2 mt-3">{children}</h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-base font-semibold mb-2 mt-3">{children}</h6>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const code = String(children).trim();

          if (inline) {
            return (
              <code className="bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            );
          }

          return (
            <div className="relative rounded-md border border-border bg-transparent">
              <CopyButton code={code} />
              <ScrollArea className="h-auto max-w-full overflow-auto">
                <SyntaxHighlighter
                  style={oneDark}
                  language={match?.[1] || "text"}
                  PreTag="div"
                  className="!bg-transparent !m-0 !p-4 text-sm text-foreground [&>code]:!bg-transparent"
                  customStyle={{
                    background: "#fff",
                    margin: 0,
                    padding: "1rem",
                    boxShadow: "none",
                  }}
                >
                  {code}
                </SyntaxHighlighter>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          );
        },
        p({ children }) {
          return <p className="my-2">{children}</p>;
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-4">
              <table className="border-collapse border border-border w-full">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="border border-border px-4 py-2 bg-muted">
              {children}
            </th>
          );
        },
        td({ children }) {
          return <td className="border border-border px-4 py-2">{children}</td>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground my-4">
              {children}
            </blockquote>
          );
        },
        hr: () => <hr className="border-border my-4" />,
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt}
            className="rounded-lg max-w-full h-auto my-4"
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
