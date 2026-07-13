import { getSql, ensureTable } from '@/lib/db'
import type { Track } from '@/lib/db'
import { put } from '@vercel/blob'

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

  const audioBlob = await put(audioFile.name, audioFile, { access: 'public' })

  let coverUrl = ''
  if (coverFile && coverFile.size > 0) {
    const coverBlob = await put(coverFile.name, coverFile, { access: 'public' })
    coverUrl = coverBlob.url
  }

  await ensureTable()
  const sql = getSql()
  const rows = await sql`
    INSERT INTO tracks (title, artist, genre, year, audio_url, cover_url, duration)
    VALUES (${title}, ${artist}, ${genre}, ${year}, ${audioBlob.url}, ${coverUrl}, 0)
    RETURNING *
  `
  return Response.json(rows[0] as Track, { status: 201 })
}
