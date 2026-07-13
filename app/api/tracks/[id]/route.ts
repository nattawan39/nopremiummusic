import { getDb } from '@/lib/db'
import type { Track } from '@/lib/db'
import { getAudioDir, getCoverDir } from '@/lib/paths'
import fs from 'fs'
import path from 'path'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb()
  const track = db.prepare('SELECT * FROM tracks WHERE id = ?').get(id) as Track | undefined
  if (!track) {
    return Response.json({ error: 'Track not found' }, { status: 404 })
  }
  return Response.json(track)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb()
  const track = db.prepare('SELECT * FROM tracks WHERE id = ?').get(id) as Track | undefined
  if (!track) {
    return Response.json({ error: 'Track not found' }, { status: 404 })
  }

  const audioPath = path.join(getAudioDir(), track.audio_filename)
  if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath)

  if (track.cover_filename) {
    const coverPath = path.join(getCoverDir(), track.cover_filename)
    if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath)
  }

  db.prepare('DELETE FROM tracks WHERE id = ?').run(id)
  return Response.json({ success: true })
}
