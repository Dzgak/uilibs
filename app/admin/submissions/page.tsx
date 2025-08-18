"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, Check, X, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PendingSubmission {
  id: string
  name: string
  description: string
  about: string
  author: string
  author_bio: string
  website: string | null
  github: string | null
  preview: string | null
  gallery: string[]
  tags: string[]
  is_paid: boolean
  is_mobile_friendly: boolean
  user_id: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export default function SubmissionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<PendingSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<PendingSubmission | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }

      // Fetch user's pending submissions
      const { data: submissionsData } = await supabase
        .from("pending_submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (submissionsData) {
        setSubmissions(submissionsData)
      }

      setLoading(false)
    }

    fetchSubmissions()
  }, [router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending Review</Badge>
      case 'approved':
        return <Badge variant="default" className="flex items-center gap-1"><Check className="w-3 h-3" /> Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><X className="w-3 h-3" /> Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Submissions</h1>
            <p className="text-muted-foreground mt-2">
              Track the status of your library submissions
            </p>
          </div>
          <Link href="/admin/new">
            <Button>
              Submit New Library
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submissions List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">All Submissions</h2>
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">You haven't submitted any libraries yet.</p>
                      <Link href="/admin/new">
                        <Button>
                          Submit Your First Library
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                submissions.map((submission) => (
                  <Card key={submission.id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedSubmission(submission)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{submission.name}</CardTitle>
                          <CardDescription className="mt-1">{submission.description}</CardDescription>
                        </div>
                        {getStatusBadge(submission.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Submitted {new Date(submission.created_at).toLocaleDateString()}</span>
                        {submission.reviewed_at && (
                          <>
                            <span>•</span>
                            <span>Reviewed {new Date(submission.reviewed_at).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                      {submission.preview && (
                        <div className="mt-3 relative w-20 h-20 bg-muted rounded overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/libraries/${submission.preview}`}
                            alt={submission.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Submission Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Submission Details</h2>
            {selectedSubmission ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedSubmission.name}</CardTitle>
                      <CardDescription className="mt-1">{selectedSubmission.description}</CardDescription>
                    </div>
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-muted-foreground">{selectedSubmission.about}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Author</h4>
                    <p className="text-sm">{selectedSubmission.author}</p>
                    {selectedSubmission.author_bio && (
                      <p className="text-sm text-muted-foreground mt-1">{selectedSubmission.author_bio}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {selectedSubmission.website && (
                      <div>
                        <h4 className="font-medium mb-1">Website</h4>
                        <a href={selectedSubmission.website} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-blue-600 hover:underline">
                          {selectedSubmission.website}
                        </a>
                      </div>
                    )}
                    {selectedSubmission.github && (
                      <div>
                        <h4 className="font-medium mb-1">GitHub</h4>
                        <a href={selectedSubmission.github} target="_blank" rel="noopener noreferrer"
                           className="text-sm text-blue-600 hover:underline">
                          {selectedSubmission.github}
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedSubmission.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant={selectedSubmission.is_paid ? "default" : "secondary"}>
                      {selectedSubmission.is_paid ? "Paid" : "Free"}
                    </Badge>
                    {selectedSubmission.is_mobile_friendly && (
                      <Badge variant="secondary">Mobile Friendly</Badge>
                    )}
                  </div>

                  {selectedSubmission.gallery.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Gallery</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedSubmission.gallery.map((image, index) => (
                          <div key={index} className="relative w-full h-20 bg-muted rounded overflow-hidden">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/libraries/${image}`}
                              alt={`Gallery ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSubmission.status !== 'pending' && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Review Status</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Reviewed on {new Date(selectedSubmission.reviewed_at!).toLocaleDateString()}
                      </p>
                      {selectedSubmission.admin_notes && (
                        <div>
                          <p className="font-medium text-sm">Admin Notes:</p>
                          <p className="text-sm text-muted-foreground">{selectedSubmission.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedSubmission.status === 'pending' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Under Review</h4>
                      <p className="text-sm text-blue-700">
                        Your submission is currently being reviewed by our admin team. 
                        This typically takes 1-3 business days. You'll be notified once a decision is made.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a submission to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
