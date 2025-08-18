import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Library Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <Search className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              We couldn't find the library you're looking for. It might have been moved or doesn't exist.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/" className="w-full">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Libraries
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search Libraries
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
