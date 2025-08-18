"use client"

import { useEffect, useState } from "react"

// Declare AdSense types
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface AdSenseProps {
  adSlot: string
  adFormat?: "auto" | "fluid"
  style?: React.CSSProperties
  className?: string
}

export function AdSense({ adSlot, adFormat = "auto", style, className }: AdSenseProps) {
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(false)
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false)

  useEffect(() => {
    const loadAd = () => {
      try {
        // Check if AdSense script is loaded
        if (typeof window !== 'undefined') {
          // Check if adsbygoogle exists
          if (window.adsbygoogle) {
            window.adsbygoogle.push({})
            setAdLoaded(true)
          } else {
            // Check if script failed to load (ad blocker)
            const scriptElement = document.querySelector('script[src*="adsbygoogle"]')
            if (!scriptElement) {
              setIsAdBlockerDetected(true)
              setAdError(true)
              return
            }
            
            // Retry after a short delay
            setTimeout(() => {
              if (window.adsbygoogle) {
                window.adsbygoogle.push({})
                setAdLoaded(true)
              } else {
                setIsAdBlockerDetected(true)
                setAdError(true)
              }
            }, 2000)
          }
        }
      } catch (error) {
        console.error("AdSense error:", error)
        setIsAdBlockerDetected(true)
        setAdError(true)
      }
    }

    // Load ad after component mounts
    const timer = setTimeout(loadAd, 100)
    return () => clearTimeout(timer)
  }, [])

  // Don't render anything if ad blocker is detected
  if (adError || isAdBlockerDetected) {
    return null
  }

  return (
    <div className={`ad-container ${className || ""}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5314941457054624"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
      {!adLoaded && (
        <div 
          className="flex items-center justify-center bg-muted rounded animate-pulse"
          style={{ minHeight: "90px" }}
        >
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      )}
    </div>
  )
} 