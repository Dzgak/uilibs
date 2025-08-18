"use client"

import Script from "next/script"

export function Scripts() {
  return (
    <>
      {/* Google Analytics with CMP */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          // Default consent state (denied until user consents)
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'functionality_storage': 'denied',
            'personalization_storage': 'denied',
            'security_storage': 'granted'
          });
          
          gtag('config', 'G-XXXXXXXXXX', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
      
      {/* AdSense Script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5314941457054624"
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onError={() => {
          // Silently handle ad blocker - don't show errors in console
          console.log("AdSense script blocked by ad blocker")
        }}
      />
    </>
  )
} 