import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

export async function POST(request: Request) {
  const body = await request.json() as HandleUploadBody
  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ['audio/*', 'image/*', 'audio/wav', 'audio/mpeg', 'audio/flac'],
      maximumSizeInBytes: 500 * 1024 * 1024, // 500MB
    }),
    onUploadCompleted: async () => {},
  })
  return Response.json(jsonResponse)
}
