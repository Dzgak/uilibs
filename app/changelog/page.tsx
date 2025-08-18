import { getChangelogEntries } from "@/lib/changelog"
import ChangelogClient from "@/components/app/changelogClient"

export const metadata = {
  title: "Changelog",
}

export default function ChangelogPage() {
  const entries = getChangelogEntries()

  return <ChangelogClient entries={entries} />
} 