export const runtime = 'nodejs'

import { getDb } from '@/lib/db'
import type { Track } from '@/lib/db'
import { getAudioDir, getCoverDir } from '@/lib/paths'
import fs from 'fs'
import path from 'path'

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function POST(request: Request) {
  const formData = await request.formData()

  const title = formData.get('title') as string
  const artist = formData.get('artist') as string
  const genre = (formData.get('genre') as string) || ''
  const year = parseInt((formData.get('year') as string) || '0', 10)
  const audioFile = formData.get('audio') as File | null
  const coverFile = formData.get('cover') as File | null

  if (!title || !artist || !audioFile) {
    return Response.json({ error: 'title, artist, and audio are required' }, { status: 400 })
  }

  const audioDir = getAudioDir()
  const coverDir = getCoverDir()
  fs.mkdirSync(audioDir, { recursive: true })
  fs.mkdirSync(coverDir, { recursive: true })

  const audioFilename = `${Date.now()}-${sanitizeName(audioFile.name)}`
  const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
  fs.writeFileSync(path.join(audioDir, audioFilename), audioBuffer)

  let coverFilename = ''
  if (coverFile && coverFile.size > 0) {
    coverFilename = `${Date.now()}-${sanitizeName(coverFile.name)}`
    const coverBuffer = Buffer.from(await coverFile.arrayBuffer())
    fs.writeFileSync(path.join(coverDir, coverFilename), coverBuffer)
  }

  const db = getDb()
  const result = db.prepare(`
    INSERT INTO tracks (title, artist, genre, year, audio_filename, cover_filename, duration)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, artist, genre, year, audioFilename, coverFilename, 0)

  const track = db.prepare('SELECT * FROM tracks WHERE id = ?').get(result.lastInsertRowid) as Track
  return Response.json(track, { status: 201 })
}
