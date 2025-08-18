"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LibraryBadges } from "@/components/ui/library-badges";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface Library {
  id: string;
  name: string;
  description: string;
  about: string;
  author: string;
  author_bio: string;
  website: string | null;
  github: string | null;
  preview: string | null;
  gallery: string[];
  created_at: string;
  updated_at: string;
  tags: string[];
  is_paid: boolean;
  is_mobile_friendly: boolean;
  user_id: string;
}

export function LibraryCard({ library }: { library: Library }) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(library.id);

  // Function to get the full URL for Supabase storage images
  const getImageUrl = (path: string | null) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    return `https://pamgxjfckwyvefsnbtfp.supabase.co/storage/v1/object/public/libraries/${path}`;
  };

  return (
    <Card
      onClick={() => router.push(`/library/${library.id}`)}
      className="group hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
    >
      <div className="relative h-40 bg-muted overflow-hidden flex items-center justify-center">
        <img
          src={getImageUrl(library.preview)}
          alt={`${library.name} preview`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 z-10">
          <LibraryBadges
            tags={[]}
            isPaid={library.is_paid}
            isMobileFriendly={library.is_mobile_friendly}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 z-10 h-7 w-7 bg-background/50 backdrop-blur-sm hover:bg-background/70",
            favorite && "text-red-500 hover:text-red-600 hover:bg-background/70"
          )}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(library.id);
          }}
          title={favorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart
            className={cn(
              "w-3.5 h-3.5",
              favorite ? "fill-current" : "fill-none"
            )}
          />
        </Button>
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-medium truncate">
              {library.name}
            </CardTitle>
            <CardDescription className="mt-1 text-sm line-clamp-2">
              {library.description}
            </CardDescription>
            <p className="text-xs text-muted-foreground mt-2">
              by {library.author}
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
