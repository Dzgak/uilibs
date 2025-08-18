"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Settings, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useConsent } from "@/hooks/use-consent"

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const { preferences, updateConsent, acceptAll, rejectAll, hasConsent, isLoaded } = useConsent()

  useEffect(() => {
    // Check if consent was already given
    if (isLoaded && !hasConsent()) {
      setShowBanner(true)
    }
  }, [isLoaded, hasConsent])

  const handleAcceptAll = () => {
    acceptAll()
    setShowBanner(false)
  }

  const handleCustomize = () => {
    setShowSettings(true)
  }

  const handleSavePreferences = () => {
    updateConsent(preferences)
    setShowSettings(false)
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    rejectAll()
    setShowSettings(false)
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 p-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-medium mb-2">We use cookies</h3>
            <p className="text-sm text-muted-foreground">
              We use cookies to improve site performance, analyze traffic, and personalize content. 
              You can accept all cookies or customize your preferences.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" onClick={handleCustomize} size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Customize
            </Button>
            <Button onClick={handleAcceptAll} size="sm">
              <Check className="w-4 h-4 mr-2" />
              Accept all
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cookie settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Necessary cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    These cookies are required for the website to function and cannot be disabled.
                  </p>
                </div>
                <Switch checked={preferences.necessary} disabled />
              </div>
            </div>

            <Separator />

            {/* Analytics Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Analytics cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors use the site.
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => 
                    updateConsent({ ...preferences, analytics: checked })
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Marketing Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Marketing cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Used to display relevant advertising.
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => 
                    updateConsent({ ...preferences, marketing: checked })
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Personalized Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Personalization</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow us to personalize content and functionality.
                  </p>
                </div>
                <Switch
                  checked={preferences.personalized}
                  onCheckedChange={(checked) => 
                    updateConsent({ ...preferences, personalized: checked })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleRejectAll}>
              Reject all
            </Button>
            <Button onClick={handleSavePreferences}>
              Save preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 