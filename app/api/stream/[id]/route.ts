import { getSql, ensureTable } from '@/lib/db'
import type { Track } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await ensureTable()
  const sql = getSql()
  const rows = await sql`SELECT * FROM tracks WHERE id = ${id}`
  const track = rows[0] as Track | undefined
  if (!track) return new Response('Track not found', { status: 404 })
  return Response.redirect(track.audio_url, 302)
}
