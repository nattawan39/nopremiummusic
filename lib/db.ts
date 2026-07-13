import Database from 'better-sqlite3'
import { getDbPath } from './paths'

export interface Track {
  id: number
  title: string
  artist: string
  genre: string
  year: number
  audio_filename: string
  cover_filename: string
  duration: number
  created_at: string
}

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(getDbPath())
    db.exec(`
      CREATE TABLE IF NOT EXISTS tracks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        genre TEXT DEFAULT '',
        year INTEGER DEFAULT 0,
        audio_filename TEXT NOT NULL,
        cover_filename TEXT DEFAULT '',
        duration INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `)
  }
  return db
}
