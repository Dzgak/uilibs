"use client";
import Image from "next/image";
import Link from "next/link";

import { use } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github, Trash2, Tag, Heart } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { ImageViewer } from "@/components/image-viewer";
import { MarkdownExample } from "@/components/markdown-example";
import { Skeleton } from "@/components/ui/skeleton";
import { LibraryBadges } from "@/components/ui/library-badges";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { createClient } from "@/lib/client";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";
import { AdSense } from "@/components/ui/adsense";

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
}

interface PageProps {
  id: string;
}

export default function LibraryPageClient({ id }: PageProps) {
  const router = useRouter();
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [library, setLibrary] = useState<Library | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = library ? isFavorite(library.id) : false;

  const getImageUrl = (path: string | null) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    return `https://pamgxjfckwyvefsnbtfp.supabase.co/storage/v1/object/public/libraries/${path}`;
  };

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const supabase = createClient();
        
        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          setIsAdmin(profile?.role === "admin");
        }

        const { data, error } = await supabase
          .from("libraries")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setLibrary(data);
      } catch (error) {
        console.error("Error fetching library:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [id]);

  const handleDelete = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("libraries")
        .delete()
        .eq("id", id);

      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Error deleting library:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Header Skeleton */}
        <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-40">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-20" /> {/* Back button */}
                <div>
                  <Skeleton className="h-6 w-48 mb-2" /> {/* Title */}
                  <Skeleton className="h-4 w-32" /> {/* Author */}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" /> {/* Website button */}
                <Skeleton className="h-9 w-24" /> {/* GitHub button */}
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-8">
          {/* Hero Image Skeleton */}
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-lg" />

            {/* Description Skeleton */}
            <div>
              <Skeleton className="h-7 w-20 mb-3" /> {/* About heading */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Gallery Skeleton */}
            <div>
              <Skeleton className="h-7 w-20 mb-4" /> {/* Gallery heading */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!library) {
    notFound();
  }

  const allImages = [library.preview, ...library.gallery].filter(Boolean);

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" className="flex-shrink-0">
                <Button variant="ghost" size="sm" className="h-8 sm:h-9">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold truncate">{library.name}</h1>
                <p className="text-sm text-muted-foreground truncate">
                  by {library.author}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  "h-8 sm:h-9",
                  favorite && "text-red-500 hover:text-red-600"
                )}
                onClick={() => toggleFavorite(library.id)}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 sm:mr-2",
                    favorite ? "fill-current" : "fill-none"
                  )}
                />
                <span className="hidden sm:inline">
                  {favorite ? "Remove from Favorites" : "Add to Favorites"}
                </span>
              </Button>
              {library.website && (
                <Link
                  href={library.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="h-8 sm:h-9">
                    <ExternalLink className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Website</span>
                  </Button>
                </Link>
              )}
              {library.github && (
                <Link
                  href={library.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="h-8 sm:h-9">
                    <Github className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">GitHub</span>
                  </Button>
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link href={`/admin/${library.id}`}>
                    <Button size="sm" variant="outline" className="h-8 sm:h-9">
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="h-8 sm:h-9">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-[425px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Library</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this library? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Main Content */}
        <div className="space-y-6 sm:space-y-8">
          {/* Hero Image with Badges */}
          {library.preview && (
            <div
              className="relative aspect-[16/9] bg-muted rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openImageViewer(0)}
            >
              <img
                src={getImageUrl(library.preview)}
                alt={`${library.name} preview`}
                // fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                // priority
              />
              {/* Badges Overlay */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                <LibraryBadges
                  tags={[]}
                  isPaid={library.is_paid}
                  isMobileFriendly={library.is_mobile_friendly}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded text-sm">
                  Click to view
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-lg sm:text-xl font-semibold">About</h2>
            <div className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              <MarkdownExample content={library.about} />
            </div>
          </div>

          {/* Gallery */}
          {library.gallery.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold">Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {library.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video bg-muted rounded overflow-hidden cursor-pointer group"
                    onClick={() => openImageViewer(index + 1)}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${library.name} example ${index + 1}`}
                      // fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags Section */}
          {library.tags && library.tags.length > 0 && (
            <>
              <Separator className="my-6 sm:my-8" />
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="w-4 h-4" />
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">Tags</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {library.tags.map((tag) => (
                    <Link 
                      key={tag} 
                      href={`/?tags=${tag}`}
                      className="transition-colors"
                    >
                      <Badge 
                        variant="secondary" 
                        className="px-3 py-1 hover:bg-secondary/80"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Click on a tag to discover more libraries with the same tag
                </p>
              </div>
            </>
          )}

          {/* AdSense Ad - Bottom of Content */}
          <div className="mt-8 flex justify-center">
            <AdSense 
              adSlot="1119370854" 
              className="w-full max-w-4xl"
              style={{ minHeight: "90px" }}
            />
          </div>
        </div>
      </main>

      {/* Image Viewer */}
      {allImages.length > 0 && (
        <ImageViewer
          images={allImages.map(img => getImageUrl(img))}
          initialIndex={selectedImageIndex}
          isOpen={imageViewerOpen}
          onClose={() => setImageViewerOpen(false)}
        />
      )}
    </div>
  );
}