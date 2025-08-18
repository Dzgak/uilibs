<<<<<<< HEAD
import { getChangelogEntries } from "@/lib/changelog"
import ChangelogClient from "@/components/app/changelogClient"

export const metadata = {
  title: "Changelog",
}

export default function ChangelogPage() {
  const entries = getChangelogEntries()

  return <ChangelogClient entries={entries} />
=======
import { getChangelogEntries } from "@/lib/changelog"
import ChangelogClient from "@/components/app/changelogClient"

export const metadata = {
  title: "Changelog",
}

export default function ChangelogPage() {
  const entries = getChangelogEntries()

  return <ChangelogClient entries={entries} />
>>>>>>> 26f5c4aaa43b5cb09fa17654e30dc706207c1aed
} 