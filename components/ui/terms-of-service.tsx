"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface TermsOfServiceProps {
  open: boolean
  onAccept: () => void
  onDecline: () => void
}

export function TermsOfService({ open, onAccept, onDecline }: TermsOfServiceProps) {
  const [accepted, setAccepted] = useState(false)

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Terms of Service & Submission Rules</DialogTitle>
          <DialogDescription>
            Please read and accept our terms before submitting your library
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-lg mb-3">📋 Submission Guidelines</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>All libraries must be original work or properly licensed</li>
                <li>Provide accurate and complete information about your library</li>
                <li>Include high-quality images that represent your library</li>
                <li>Use appropriate tags to help users find your library</li>
                <li>Ensure your library is functional and well-documented</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">🚫 Prohibited Content</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Malware, viruses, or harmful code</li>
                <li>Copyrighted material without permission</li>
                <li>Spam, misleading, or fraudulent content</li>
                <li>Content that violates laws or regulations</li>
                <li>Libraries that don't work or are incomplete</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">⚖️ Moderation Process</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>All submissions are reviewed by our admin team</li>
                <li>Review process typically takes 1-3 business days</li>
                <li>You'll be notified of approval or rejection via email</li>
                <li>Rejected submissions can be resubmitted after addressing feedback</li>
                <li>We reserve the right to remove content that violates our terms</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">🔒 Privacy & Data</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Your personal information is protected and never shared</li>
                <li>Library submissions become public once approved</li>
                <li>You retain ownership of your library code and content</li>
                <li>We may use your library for promotional purposes</li>
                <li>You can request removal of your content at any time</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">📞 Support & Contact</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>For questions about submissions, contact our support team</li>
                <li>Report violations or issues through our feedback system</li>
                <li>We're committed to maintaining a quality library ecosystem</li>
                <li>Your feedback helps us improve our platform</li>
              </ul>
            </section>
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2 pt-4 border-t">
          <Checkbox
            id="accept-terms"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
          />
          <Label htmlFor="accept-terms" className="text-sm">
            I have read and agree to the Terms of Service and Submission Rules
          </Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onDecline}>
            Decline
          </Button>
          <Button onClick={onAccept} disabled={!accepted}>
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
