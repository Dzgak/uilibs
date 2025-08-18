"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Clock, Check, X, Eye } from "lucide-react"
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

interface Library {
  id: string
  name: string
  description: string
  author: string
  preview: string
  user_id: string
}

export default function AdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [libraries, setLibraries] = useState<Library[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkUserAndFetchLibraries = async () => {
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

      // Fetch libraries based on user role
      let query = supabase
        .from("libraries")
        .select("*")
        .order("created_at", { ascending: false })

      // If not admin, only fetch user's own libraries
      if (!userIsAdmin) {
        query = query.eq("user_id", user.id)
      }

      const { data: librariesData } = await query

      if (librariesData) {
        setLibraries(librariesData)
      }

      setLoading(false)
    }

    checkUserAndFetchLibraries()

    // Check if user just submitted a library
    if (searchParams.get('submitted') === 'true') {
      setShowSuccess(true)
      // Remove the query parameter
      router.replace('/admin')
    }
  }, [router, searchParams])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("libraries")
        .delete()
        .eq("id", id)

      if (error) throw error

      setLibraries(libraries.filter(lib => lib.id !== id))
    } catch (error) {
      console.error("Error deleting library:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Library Submitted Successfully!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Your library has been submitted for review. You'll be notified once it's approved.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuccess(false)}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {isAdmin ? "Admin Dashboard" : "My Libraries"}
            </h1>
            {!isAdmin && (
              <p className="text-muted-foreground mt-2">
                Manage your uploaded libraries
              </p>
            )}
          </div>
          <div className="flex gap-4">
            {isAdmin && (
              <Link href="/admin/moderation">
                <Button variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Moderation
                </Button>
              </Link>
            )}
            <Link href="/admin/submissions">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                My Submissions
              </Button>
            </Link>
            <Link href="/admin/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Library
              </Button>
            </Link>
          </div>
        </div>

        {libraries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {isAdmin ? "No libraries found." : "You haven't uploaded any libraries yet."}
            </p>
            <Link href="/admin/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Upload Your First Library
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {libraries.map((library) => (
              <div
                key={library.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{library.name}</h3>
                  <p className="text-sm text-muted-foreground">{library.description}</p>
                  <p className="text-sm text-muted-foreground">by {library.author}</p>
                  {isAdmin && library.user_id !== currentUserId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploaded by another user
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/${library.id}`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
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
                        <AlertDialogAction onClick={() => handleDelete(library.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 