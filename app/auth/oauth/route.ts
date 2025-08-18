import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/server'

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (!code) {
      return NextResponse.redirect(`${origin}/auth/error?error=No code provided`)
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth error:', error.message)
      return NextResponse.redirect(`${origin}/auth/error?error=${error.message}`)
    }

    // Handle redirect with proper origin
    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'
    
    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`)
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`)
    }
    
    return NextResponse.redirect(`${origin}${next}`)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.redirect(`${origin}/auth/error?error=An unexpected error occurred`)
  }
}
