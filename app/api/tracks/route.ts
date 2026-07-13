import { getDb } from '@/lib/db'

export function GET() {
  const db = getDb()
  const tracks = db.prepare('SELECT * FROM tracks ORDER BY created_at DESC').all()
  return Response.json(tracks)
}
