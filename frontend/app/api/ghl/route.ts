import { NextResponse } from 'next/server';

// Very basic in-memory cache to prevent accidental double-clicks within a 60 second window
// Note: This only works per-isolate in serverless, but helps with immediate double-clicks.
const submissionCache = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const webhookUrl = process.env.GHL_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("[GHL API] GHL_WEBHOOK_URL is not defined in the environment.");
      // In staging/development, we still return 200 so the frontend can proceed
      return NextResponse.json({ success: true, warning: "GHL_WEBHOOK_URL not configured" });
    }

    // 1. Duplicate Prevention
    const cacheKey = `${data.email}-${data.lead_source}`;
    const now = Date.now();
    const lastSubmission = submissionCache.get(cacheKey);
    
    // Prevent submissions from the same email for the same funnel within 60 seconds
    if (lastSubmission && (now - lastSubmission < 60000)) {
      console.log(`[GHL API] Duplicate submission prevented for: ${cacheKey}`);
      return NextResponse.json({ success: true, message: "Duplicate submission ignored" });
    }
    
    submissionCache.set(cacheKey, now);

    // Clean up old cache entries periodically to prevent memory leaks in long-running functions
    if (submissionCache.size > 1000) {
      const oneMinuteAgo = now - 60000;
      const entries = Array.from(submissionCache.entries());
      for (const [key, timestamp] of entries) {
        if (timestamp < oneMinuteAgo) {
          submissionCache.delete(key);
        }
      }
    }

    // 2. Payload Normalization
    // Enforce the required fields mapped exactly as requested
    const normalizedPayload = {
      lead_source: data.lead_source || "unknown",
      assessment_variant: data.assessment_variant || "unknown",
      funnel_type: data.funnel_type || "unknown",
      
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      email: data.email || "",
      phone: data.phone || "",
      company_name: data.company_name || "",
      role: data.role || "",
      team_size: data.team_size || 0,
      language_preference: data.language_preference || "en",
      
      score: data.score || 0,
      maturity_class: data.maturity_class || "",
      recommended_path: data.recommended_path || "",
      
      enterprise_interest: Boolean(data.enterprise_interest),
      requested_demo: Boolean(data.requested_demo),
      high_intent: Boolean(data.high_intent),
      bilingual_interest: Boolean(data.bilingual_interest),
      
      tags: Array.isArray(data.tags) ? data.tags : [],
      summary: data.summary || "",
      
      // Meta
      submitted_at: new Date().toISOString()
    };

    // 3. Forward to GHL
    const ghlResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(normalizedPayload),
    });

    if (!ghlResponse.ok) {
      const errText = await ghlResponse.text();
      console.error("[GHL API] GHL Webhook failed:", errText);
      throw new Error(`GHL Webhook returned ${ghlResponse.status}`);
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error("[GHL API] Error processing submission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process submission" }, 
      { status: 500 }
    );
  }
}
