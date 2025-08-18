"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { ArrowLeft, Trash2, X } from "lucide-react"
import Link from "next/link"
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
} from "@/components/ui/alert-dialog"
import { v4 as uuidv4 } from 'uuid'
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { ImageManager } from "@/components/ui/image-manager"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditLibraryPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [libraryOwnerId, setLibraryOwnerId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    about: "",
    author: "",
    author_bio: "",
    website: "",
    github: "",
    is_paid: false,
    is_mobile_friendly: false,
    tags: [] as string[],
  })
  const [existingImages, setExistingImages] = useState<{ preview: string | null; gallery: string[] }>({
    preview: null,
    gallery: [],
  })
  const [newTag, setNewTag] = useState("")

  // Generate a unique folder name for this library
  const folderName = formData.name 
    ? `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${uuidv4().slice(0, 8)}`
    : ''

  const uploadProps = useSupabaseUpload({
    bucketName: "libraries",
    maxFiles: 5,
    allowedMimeTypes: ["image/*"],
    path: folderName ? `libs/${folderName}` : undefined,
    upsert: true,
    onError: (error) => {
      console.error("Upload error:", error)
    }
  })

  useEffect(() => {
    const fetchLibraryAndCheckPermissions = async () => {
      // Get current user and check admin status
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }

      setCurrentUserId(user.id)

      // Check if user has admin role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      const userIsAdmin = profile?.role === "admin"
      setIsAdmin(userIsAdmin)

      // Fetch library
      const { data, error } = await supabase
        .from("libraries")
        .select("*")
        .eq("id", resolvedParams.id)
        .single()

      if (error) {
        console.error("Error fetching library:", error)
        router.push("/admin")
        return
      }

      // Check if user can edit this library
      if (!userIsAdmin && data.user_id !== user.id) {
        router.push("/admin")
        return
      }

      setLibraryOwnerId(data.user_id)

      setFormData({
        name: data.name,
        description: data.description,
        about: data.about,
        author: data.author,
        author_bio: data.author_bio,
        website: data.website,
        github: data.github,
        is_paid: data.is_paid || false,
        is_mobile_friendly: data.is_mobile_friendly || false,
        tags: data.tags || [],
      })

      setExistingImages({
        preview: data.preview,
        gallery: data.gallery || [],
      })

      setLoading(false)
    }

    fetchLibraryAndCheckPermissions()
  }, [resolvedParams.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // First upload new images
      if (uploadProps.files.length > 0) {
        await uploadProps.onUpload()
        // Check if there are any errors after upload
        if (uploadProps.errors.length > 0) {
          throw new Error("Failed to upload images: " + uploadProps.errors.map(e => e.message).join(", "))
        }
      }

      // Then update library entry
      const { error } = await supabase
        .from("libraries")
        .update({
          ...formData,
          preview: uploadProps.files[0] ? `libs/${folderName}/${uploadProps.files[0].name}` : existingImages.preview,
          gallery: [
            ...(uploadProps.files.slice(1).map(f => `libs/${folderName}/${f.name}`) || []),
            ...existingImages.gallery,
          ],
        })
        .eq("id", resolvedParams.id)

      if (error) {
        console.error("Database error:", error)
        throw error
      }

      router.push("/admin")
    } catch (error) {
      console.error("Error updating library:", error)
      // You might want to show an error message to the user here
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("libraries")
        .delete()
        .eq("id", resolvedParams.id)

      if (error) throw error

      router.push("/admin")
    } catch (error) {
      console.error("Error deleting library:", error)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(newTag.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag.trim()]
        })
      }
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleRemoveImage = (path: string) => {
    if (path === existingImages.preview) {
      setExistingImages(prev => ({ ...prev, preview: null }))
    } else {
      setExistingImages(prev => ({
        ...prev,
        gallery: prev.gallery.filter(img => img !== path)
      }))
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Library
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the library
                  and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Edit Library</h1>
          {isAdmin && libraryOwnerId !== currentUserId && (
            <p className="text-sm text-muted-foreground">
              Editing library uploaded by another user
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Input
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">About</label>
            <MarkdownEditor
              value={formData.about}
              onChange={(value) => setFormData({ ...formData, about: value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <Input
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Author Bio</label>
            <Textarea
              value={formData.author_bio}
              onChange={(e) => setFormData({ ...formData, author_bio: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">GitHub</label>
            <Input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Paid Library</label>
              <Switch
                checked={formData.is_paid}
                onCheckedChange={(checked) => setFormData({ ...formData, is_paid: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Mobile Friendly</label>
              <Switch
                checked={formData.is_mobile_friendly}
                onCheckedChange={(checked) => setFormData({ ...formData, is_mobile_friendly: checked })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="space-y-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag and press Enter"
              />
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <ImageManager
              existingImages={existingImages}
              uploadProps={uploadProps}
              onRemoveExisting={handleRemoveImage}
            />
          </div>

          <Button type="submit" disabled={saving || uploadProps.loading || !formData.name}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  )
} 