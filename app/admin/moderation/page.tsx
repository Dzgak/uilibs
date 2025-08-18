"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Check, X, Eye, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
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

export default function ModerationPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<PendingSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<PendingSubmission | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [processing, setProcessing] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkUserAndFetchSubmissions = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if user has admin role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      const userIsAdmin = profile?.role === "admin"
      setIsAdmin(userIsAdmin)

      if (!userIsAdmin) {
        router.push("/admin")
        return
      }

      // Fetch all pending submissions
      const { data: submissionsData } = await supabase
        .from("pending_submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (submissionsData) {
        setSubmissions(submissionsData)
      }

      setLoading(false)
    }

    checkUserAndFetchSubmissions()
  }, [router])

  const handleApprove = async (submission: PendingSubmission) => {
    setProcessing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // First, move the submission to the libraries table
      const { error: insertError } = await supabase.from("libraries").insert({
        name: submission.name,
        description: submission.description,
        about: submission.about,
        author: submission.author,
        author_bio: submission.author_bio,
        website: submission.website,
        github: submission.github,
        preview: submission.preview,
        gallery: submission.gallery,
        tags: submission.tags,
        is_paid: submission.is_paid,
        is_mobile_friendly: submission.is_mobile_friendly,
        user_id: submission.user_id,
      })

      if (insertError) throw insertError

      // Then update the submission status
      const { error: updateError } = await supabase
        .from("pending_submissions")
        .update({
          status: 'approved',
          admin_notes: adminNotes || null,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submission.id)

      if (updateError) throw updateError

      // Update local state
      setSubmissions(submissions.map(sub => 
        sub.id === submission.id 
          ? { 
              ...sub, 
              status: 'approved', 
              admin_notes: adminNotes, 
              reviewed_by: user?.id ?? null, // Ensure reviewed_by is string|null
              reviewed_at: new Date().toISOString() 
            }
          : sub
      ))
      setSelectedSubmission(null)
      setAdminNotes("")
    } catch (error) {
      console.error("Error approving submission:", error)
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (submission: PendingSubmission) => {
    setProcessing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase
        .from("pending_submissions")
        .update({
          status: 'rejected',
          admin_notes: adminNotes || null,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submission.id)

      if (error) throw error

      // Update local state
      setSubmissions(submissions.map(sub => 
        sub.id === submission.id 
          ? { ...sub, status: 'rejected', admin_notes: adminNotes, reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString() }
          : sub
      ))
      setSelectedSubmission(null)
      setAdminNotes("")
    } catch (error) {
      console.error("Error rejecting submission:", error)
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</Badge>
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

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Access denied</div>
  }

  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending')
  const reviewedSubmissions = submissions.filter(sub => sub.status !== 'pending')

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
            <h1 className="text-3xl font-bold">Moderation Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Review and manage library submissions from users
            </p>
          </div>
          <div className="flex gap-4">
            <Badge variant="secondary">{pendingSubmissions.length} Pending</Badge>
            <Badge variant="outline">{reviewedSubmissions.length} Reviewed</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Submissions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Review</h2>
            <div className="space-y-4">
              {pendingSubmissions.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No pending submissions</p>
                  </CardContent>
                </Card>
              ) : (
                pendingSubmissions.map((submission) => (
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
                        <span>By {submission.author}</span>
                        <span>•</span>
                        <span>{new Date(submission.created_at).toLocaleDateString()}</span>
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

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Admin Notes</h4>
                    <Textarea
                      placeholder="Add notes about this submission (optional)"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {selectedSubmission.status === 'pending' && (
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="default" className="flex-1" disabled={processing}>
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Approve Submission</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to approve "{selectedSubmission.name}"? 
                              This will make it visible on the main website.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleApprove(selectedSubmission)}>
                              Approve
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="flex-1" disabled={processing}>
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Submission</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject "{selectedSubmission.name}"? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleReject(selectedSubmission)}>
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                  {selectedSubmission.status !== 'pending' && (
                    <div className="text-sm text-muted-foreground">
                      <p>Reviewed on {new Date(selectedSubmission.reviewed_at!).toLocaleDateString()}</p>
                      {selectedSubmission.admin_notes && (
                        <div className="mt-2">
                          <p className="font-medium">Admin Notes:</p>
                          <p>{selectedSubmission.admin_notes}</p>
                        </div>
                      )}
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
