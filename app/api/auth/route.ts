export async function POST(request: Request) {
  const { password } = await request.json()
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'wrong password' }, { status: 401 })
  }
  const res = Response.json({ ok: true })
  res.headers.set('Set-Cookie', 'admin_auth=authenticated; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400')
  return res
}

export async function DELETE() {
  const res = Response.json({ ok: true })
  res.headers.set('Set-Cookie', 'admin_auth=; Path=/; HttpOnly; Max-Age=0')
  return res
}
