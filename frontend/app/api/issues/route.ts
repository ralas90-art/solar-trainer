import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Select the best available webhook
    const issuesWebhook = process.env.ISSUES_WEBHOOK_URL;
    const ghlWebhook = process.env.GHL_WEBHOOK_URL;
    const targetWebhook = issuesWebhook || ghlWebhook;

    // Enforce issue-specific structure requested by the user
    const normalizedPayload = {
      source: "septivolt_issue_reporter",
      tag: "[Issue Report]",
      issue_type: data.issueType || "Other",
      severity: data.severity || "Low",
      description: data.description || "",
      page_url: data.currentRoute || "",
      user_role: data.userRole || "trainee",
      username: data.username || "unknown",
      demo_mode: Boolean(data.demoModeState),
      language: data.languageMode || "en",
      user_agent: data.userAgent || "",
      viewport: `${data.viewportWidth || 0}x${data.viewportHeight || 0}`,
      timestamp: data.timestamp || new Date().toISOString(),
      screenshot: data.screenshot || null // base64 payload
    };

    console.log(`[Issues API] Processing new issue: ${normalizedPayload.issue_type} [${normalizedPayload.severity}] on ${normalizedPayload.page_url}`);

    if (!targetWebhook) {
      console.warn("[Issues API] Neither ISSUES_WEBHOOK_URL nor GHL_WEBHOOK_URL is defined. Logging locally only.");
      return NextResponse.json({ 
        success: true, 
        warning: "No webhook configured. Logged to console successfully.",
        payload: normalizedPayload 
      });
    }

    // Forward to the configured webhook
    const response = await fetch(targetWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(normalizedPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Issues API] Webhook forwarding failed with status ${response.status}:`, errText);
      throw new Error(`Webhook returned status ${response.status}`);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("[Issues API] Error processing issue submission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process issue submission" }, 
      { status: 500 }
    );
  }
}
