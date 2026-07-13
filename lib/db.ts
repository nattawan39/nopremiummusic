import { neon } from '@neondatabase/serverless'

export interface Track {
  id: number
  title: string
  artist: string
  genre: string
  year: number
  audio_url: string
  cover_url: string
  duration: number
  created_at: string
}

export function getSql() {
  return neon(process.env.DATABASE_URL!)
}

let tableReady = false

export async function ensureTable() {
  if (tableReady) return
  const sql = getSql()
  await sql`
    CREATE TABLE IF NOT EXISTS tracks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      genre TEXT DEFAULT '',
      year INTEGER DEFAULT 0,
      audio_url TEXT NOT NULL,
      cover_url TEXT DEFAULT '',
      duration INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  tableReady = true
}
