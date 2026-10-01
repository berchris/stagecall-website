import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, lang } = await req.json()
  const language = lang === 'nl' || lang === 'en' ? lang : undefined

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const apiKey = process.env.LOOPS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const createContact = (extra: Record<string, string>) =>
    fetch('https://app.loops.so/api/v1/contacts/create', {
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
        ...extra,
      }),
    })

  // `language` is a custom contact property (the site language the visitor signed up in).
  // If Loops rejects it, never lose the sign-up over it: retry without the property.
  let res = await createContact(language ? { language } : {})
  if (language && !res.ok && res.status !== 409) {
    console.error('Loops rejected sign-up with language property, retrying without it', res.status)
    res = await createContact({})
  }

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
