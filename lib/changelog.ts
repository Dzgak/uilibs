<<<<<<< HEAD
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface ChangelogEntry {
  version: string
  date: string // ISO
  title: string
  content: string
}

const CHANGELOG_DIR = path.join(process.cwd(), 'changelog')

export function getChangelogEntries(): ChangelogEntry[] {
  if (!fs.existsSync(CHANGELOG_DIR)) return []

  const versions = fs
    .readdirSync(CHANGELOG_DIR)
    .filter((name) => fs.statSync(path.join(CHANGELOG_DIR, name)).isDirectory())

  const entries: ChangelogEntry[] = []

  versions.forEach((version) => {
    const dir = path.join(CHANGELOG_DIR, version)
    const mdFiles = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .sort()

    if (mdFiles.length === 0) return

    const filePath = path.join(dir, mdFiles[0])
    const file = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(file)

    entries.push({
      version,
      date: data.date || mdFiles[0].replace('.md', ''),
      title: data.title || version,
      content,
    })
  })

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
=======
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface ChangelogEntry {
  version: string
  date: string // ISO
  title: string
  content: string
}

const CHANGELOG_DIR = path.join(process.cwd(), 'changelog')

export function getChangelogEntries(): ChangelogEntry[] {
  if (!fs.existsSync(CHANGELOG_DIR)) return []

  const versions = fs
    .readdirSync(CHANGELOG_DIR)
    .filter((name) => fs.statSync(path.join(CHANGELOG_DIR, name)).isDirectory())

  const entries: ChangelogEntry[] = []

  versions.forEach((version) => {
    const dir = path.join(CHANGELOG_DIR, version)
    const mdFiles = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .sort()

    if (mdFiles.length === 0) return

    const filePath = path.join(dir, mdFiles[0])
    const file = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(file)

    entries.push({
      version,
      date: data.date || mdFiles[0].replace('.md', ''),
      title: data.title || version,
      content,
    })
  })

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
>>>>>>> 26f5c4aaa43b5cb09fa17654e30dc706207c1aed
} 