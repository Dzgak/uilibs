"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/dropzone"
import { X, Move } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageManagerProps {
  existingImages: {
    preview: string | null
    gallery: string[]
  }
  uploadProps: any
  onRemoveExisting: (path: string) => void
  className?: string
}

export function ImageManager({ existingImages, uploadProps, onRemoveExisting, className }: ImageManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Function to get the full URL for Supabase storage images
  const getImageUrl = (path: string | null) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http")) return path
    return `https://pamgxjfckwyvefsnbtfp.supabase.co/storage/v1/object/public/libraries/${path}`
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Preview Image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Preview Image</label>
        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
          {existingImages.preview && (
            <div className="relative w-full h-full group">
              <Image
                src={getImageUrl(existingImages.preview)}
                alt="Preview"
                fill
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoveExisting(existingImages.preview!)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Images */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Gallery Images</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {existingImages.gallery.map((image, index) => (
            <div
              key={image}
              className="relative aspect-video rounded-lg overflow-hidden border bg-muted group"
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragEnd={() => setDraggedIndex(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (draggedIndex === null) return
                const newGallery = [...existingImages.gallery]
                const [movedItem] = newGallery.splice(draggedIndex, 1)
                newGallery.splice(index, 0, movedItem)
                // Update gallery order through parent component
                onRemoveExisting(movedItem) // Temporarily remove
                setTimeout(() => onRemoveExisting(movedItem), 0) // Add back in new position
              }}
            >
              <Image
                src={getImageUrl(image)}
                alt={`Gallery ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onRemoveExisting(image)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="cursor-move"
                >
                  <Move className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload New Images */}
      <div>
        <label className="block text-sm font-medium mb-2">Upload Images</label>
        <Dropzone {...uploadProps}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    </div>
  )
} 