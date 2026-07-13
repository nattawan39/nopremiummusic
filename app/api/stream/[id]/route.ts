export const runtime = 'nodejs'

import { getDb } from '@/lib/db'
import type { Track } from '@/lib/db'
import { getAudioDir } from '@/lib/paths'
import fs from 'fs'
import path from 'path'

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.flac': 'audio/flac',
    '.aac': 'audio/aac',
    '.m4a': 'audio/mp4',
  }
  return mimeTypes[ext] ?? 'audio/mpeg'
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb()
  const track = db.prepare('SELECT * FROM tracks WHERE id = ?').get(id) as Track | undefined

  if (!track) {
    return new Response('Track not found', { status: 404 })
  }

  const filePath = path.join(getAudioDir(), track.audio_filename)

  if (!fs.existsSync(filePath)) {
    return new Response('Audio file not found', { status: 404 })
  }

  const stat = fs.statSync(filePath)
  const fileSize = stat.size
  const contentType = getMimeType(track.audio_filename)
  const rangeHeader = request.headers.get('range')

  if (rangeHeader) {
    const match = rangeHeader.match(/bytes=(\d*)-(\d*)/)
    if (!match) {
      return new Response('Invalid range', { status: 416 })
    }
    const start = match[1] ? parseInt(match[1], 10) : 0
    const end = match[2] ? parseInt(match[2], 10) : fileSize - 1
    const chunkSize = end - start + 1

    const stream = fs.createReadStream(filePath, { start, end })
    // Convert Node.js stream to Web ReadableStream
    const readable = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk))
        stream.on('end', () => controller.close())
        stream.on('error', (err) => controller.error(err))
      },
      cancel() {
        stream.destroy()
      },
    })

    return new Response(readable, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type': contentType,
      },
    })
  }

  const stream = fs.createReadStream(filePath)
  const readable = new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => controller.enqueue(chunk))
      stream.on('end', () => controller.close())
      stream.on('error', (err) => controller.error(err))
    },
    cancel() {
      stream.destroy()
    },
  })

  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Length': String(fileSize),
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
    },
  })
}
