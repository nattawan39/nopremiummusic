import path from 'path'

export function getAudioDir(): string {
  if (process.env.DATA_DIR) return path.join(process.env.DATA_DIR, 'audio')
  return path.join(process.cwd(), 'public', 'uploads', 'audio')
}

export function getCoverDir(): string {
  if (process.env.DATA_DIR) return path.join(process.env.DATA_DIR, 'covers')
  return path.join(process.cwd(), 'public', 'uploads', 'covers')
}

export function getDbPath(): string {
  if (process.env.DATA_DIR) return path.join(process.env.DATA_DIR, 'musik.db')
  return path.join(process.cwd(), 'musik.db')
}
