import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { LogoutButton } from '@/components/logout-button'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  const user = data.user
  const initials = user.email?.slice(0, 2).toUpperCase() || 'U'
  const displayName = user.user_metadata?.full_name || user.email

  // Simple time-based greeting (server time)
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="flex flex-col items-center space-y-4 pb-0">
          <Avatar className="h-24 w-24 shadow">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <CardTitle className="text-3xl font-bold">
              {greeting}, {displayName?.split(' ')[0] || displayName}!
            </CardTitle>
            <CardDescription>
              You&apos;re signed in to <span className="font-medium">UILibs</span>.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <Link href="/" className="block">
            <Button className="w-full" size="lg">
              Browse Libraries
            </Button>
          </Link>

          <div className="flex items-center justify-center gap-3">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
