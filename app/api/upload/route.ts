import { getSql, ensureTable } from '@/lib/db'
import type { Track } from '@/lib/db'

export async function POST(request: Request) {
  const { title, artist, genre, year, audio_url, cover_url } = await request.json()

  if (!title || !artist || !audio_url) {
    return Response.json({ error: 'title, artist, and audio are required' }, { status: 400 })
  }

  await ensureTable()
  const sql = getSql()
  const rows = await sql`
    INSERT INTO tracks (title, artist, genre, year, audio_url, cover_url, duration)
    VALUES (${title}, ${artist}, ${genre ?? ''}, ${year ?? 0}, ${audio_url}, ${cover_url ?? ''}, 0)
    RETURNING *
  `
  return Response.json(rows[0] as Track, { status: 201 })
}
