import { getSql, ensureTable } from '@/lib/db'
import type { Track } from '@/lib/db'
import { del } from '@vercel/blob'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await ensureTable()
  const sql = getSql()
  const rows = await sql`SELECT * FROM tracks WHERE id = ${id}`
  const track = rows[0] as Track | undefined
  if (!track) return Response.json({ error: 'Track not found' }, { status: 404 })
  return Response.json(track)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await ensureTable()
  const sql = getSql()
  const rows = await sql`SELECT * FROM tracks WHERE id = ${id}`
  const track = rows[0] as Track | undefined
  if (!track) return Response.json({ error: 'Track not found' }, { status: 404 })

  await del(track.audio_url)
  if (track.cover_url) await del(track.cover_url)

  await sql`DELETE FROM tracks WHERE id = ${id}`
  return Response.json({ success: true })
}
