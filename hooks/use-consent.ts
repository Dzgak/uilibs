<<<<<<< HEAD
import { useState, useEffect } from 'react'

// Declare gtag types
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  personalized: boolean
}

export function useConsent() {
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalized: false,
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem('consent-preferences')
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences(parsed)
      } catch (error) {
        console.error('Error parsing saved consent preferences:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  const updateConsent = (newPreferences: ConsentPreferences) => {
    setPreferences(newPreferences)
    localStorage.setItem('consent-preferences', JSON.stringify(newPreferences))
    localStorage.setItem('consent-given', 'true')

    // Update Google CMP
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: newPreferences.marketing ? 'granted' : 'denied',
        analytics_storage: newPreferences.analytics ? 'granted' : 'denied',
        functionality_storage: newPreferences.necessary ? 'granted' : 'denied',
        personalization_storage: newPreferences.personalized ? 'granted' : 'denied',
        security_storage: 'granted', // Always required
      })
    }
  }

  const acceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalized: true,
    }
    updateConsent(allPreferences)
  }

  const rejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalized: false,
    }
    updateConsent(minimalPreferences)
  }

  const hasConsent = () => {
    return localStorage.getItem('consent-given') === 'true'
  }

  return {
    preferences,
    updateConsent,
    acceptAll,
    rejectAll,
    hasConsent,
    isLoaded,
  }
=======
import { useState, useEffect } from 'react'

// Declare gtag types
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  personalized: boolean
}

export function useConsent() {
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalized: false,
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem('consent-preferences')
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences(parsed)
      } catch (error) {
        console.error('Error parsing saved consent preferences:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  const updateConsent = (newPreferences: ConsentPreferences) => {
    setPreferences(newPreferences)
    localStorage.setItem('consent-preferences', JSON.stringify(newPreferences))
    localStorage.setItem('consent-given', 'true')

    // Update Google CMP
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: newPreferences.marketing ? 'granted' : 'denied',
        analytics_storage: newPreferences.analytics ? 'granted' : 'denied',
        functionality_storage: newPreferences.necessary ? 'granted' : 'denied',
        personalization_storage: newPreferences.personalized ? 'granted' : 'denied',
        security_storage: 'granted', // Always required
      })
    }
  }

  const acceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalized: true,
    }
    updateConsent(allPreferences)
  }

  const rejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalized: false,
    }
    updateConsent(minimalPreferences)
  }

  const hasConsent = () => {
    return localStorage.getItem('consent-given') === 'true'
  }

  return {
    preferences,
    updateConsent,
    acceptAll,
    rejectAll,
    hasConsent,
    isLoaded,
  }
>>>>>>> 26f5c4aaa43b5cb09fa17654e30dc706207c1aed
} 