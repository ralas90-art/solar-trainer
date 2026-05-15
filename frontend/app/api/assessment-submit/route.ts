import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // GHL_WEBHOOK_URL must never be exposed to the client.
    // Set it in .env.local for local dev, and in Vercel env vars for production.
    const webhookUrl = process.env.GHL_WEBHOOK_URL

    if (!webhookUrl || webhookUrl.startsWith('REPLACE_WITH')) {
      // No webhook configured — log the lead server-side and return success
      // so the user experience is not broken during development.
      console.warn('[assessment-submit] GHL_WEBHOOK_URL is not configured. Lead data (redacted):',
        JSON.stringify({ email: body.email, track: body.customFields?.septivolt_recommended_track })
      )
      return NextResponse.json(
        { success: true, note: 'webhook_not_configured_lead_logged_server_side' },
        { status: 200 }
      )
    }

    const ghlResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SeptiVolt-AssessmentFunnel/1.0',
      },
      body: JSON.stringify(body),
    })

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text()
      console.error('[assessment-submit] GHL webhook error:', ghlResponse.status, errorText)
      return NextResponse.json(
        { success: false, error: 'CRM submission failed. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error'
    console.error('[assessment-submit] Unexpected error:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
