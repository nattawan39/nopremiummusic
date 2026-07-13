import { getSql, ensureTable } from '@/lib/db'
import type { Track } from '@/lib/db'

export async function GET() {
  await ensureTable()
  const sql = getSql()
  const rows = await sql`SELECT * FROM tracks ORDER BY created_at DESC`
  return Response.json(rows as Track[])
}
