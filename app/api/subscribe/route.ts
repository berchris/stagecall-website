import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const apiKey = process.env.LOOPS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email,
      source: 'early-access-form',
      userGroup: 'Early Access',
      mailingLists: {
        cmn52x5ak1cqv0i120b58d8aq: true,
      },
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    // 409 = contact already exists — treat as success
    if (res.status === 409) {
      return NextResponse.json({ ok: true })
    }
    console.error('Loops error', res.status, body)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
