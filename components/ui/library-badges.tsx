import { Badge } from "@/components/ui/badge"
import { DollarSign, Smartphone, Tag } from "lucide-react"
import Link from "next/link"

interface LibraryBadgesProps {
  tags: string[]
  isPaid: boolean
  isMobileFriendly: boolean
  clickableTags?: boolean
}

export function LibraryBadges({ 
  tags, 
  isPaid, 
  isMobileFriendly, 
  clickableTags = false 
}: LibraryBadgesProps) {
  const TagBadge = ({ tag }: { tag: string }) => {
    const badge = (
      <Badge 
        variant="outline" 
        className={`flex items-center gap-1 bg-primary/50 ${clickableTags ? 'hover:bg-secondary transition-colors' : ''}`}
      >
        <Tag className="w-3 h-3" />
        {tag}
      </Badge>
    )

    if (clickableTags) {
      return (
        <Link href={`/?tags=${tag}`}>
          {badge}
        </Link>
      )
    }

    return badge
  }

  return (
    <div className="flex flex-wrap gap-2">
      {isPaid ? (
        <Badge variant="secondary" className="flex items-center gap-1 bg-secondary/50">
          <DollarSign className="w-3 h-3" />
          Paid
        </Badge>
      ) : (
        <Badge variant="outline" className="flex items-center gap-1 bg-primary/50">
          <DollarSign className="w-3 h-3" />
          Free
        </Badge>
      )}
      
      {isMobileFriendly && (
        <Badge variant="secondary" className="flex items-center gap-1 bg-secondary/50">
          <Smartphone className="w-3 h-3" />
          Mobile
        </Badge>
      )}
      
      {tags.map((tag) => (
        <TagBadge key={tag} tag={tag} />
      ))}
    </div>
  )
} 