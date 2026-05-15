import { NextResponse } from 'next/server';

/**
 * API Route: /api/manus-trigger
 * 
 * This endpoint acts as a bridge between GHL (LeadConnector) and Manus AI.
 * When a lead completes the SeptiVolt assessment, GHL triggers this webhook,
 * which in turn initiates an AI task in Manus to analyze the lead.
 */

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Extract lead data from the GHL webhook payload
    const { 
      firstName, 
      lastName, 
      email, 
      phone,
      company,
      septivolt_recommended_track, 
      septivolt_score,
      septivolt_experience_level,
      septivolt_team_size,
      septivolt_training_gap
    } = data;

    const manusApiKey = process.env.MANUS_API_KEY;
    
    if (!manusApiKey) {
      console.error('MANUS_API_KEY is not defined in environment variables.');
      return NextResponse.json({ error: 'Manus configuration missing' }, { status: 500 });
    }

    // Define the prompt for the Manus AI Task
    const prompt = `
[SEPTIVOLT SALES TRAINER AGENT]

A new lead has just completed the Solar Sales Training Readiness Assessment. 

LEAD DETAILS:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Phone: ${phone || 'Not provided'}
- Company: ${company || 'Not provided'}
- Recommended Track: ${septivolt_recommended_track}
- Readiness Score: ${septivolt_score}%
- Experience: ${septivolt_experience_level || 'Not provided'}
- Team Size: ${septivolt_team_size || 'Not provided'}
- Primary Gap: ${septivolt_training_gap || 'Not provided'}

GOAL:
Analyze this lead and generate a personalized "SeptiVolt Success Roadmap". 

INSTRUCTIONS:
1. Identify the top 3 modules from the ${septivolt_recommended_track} track that will have the most immediate impact based on their training gap (${septivolt_training_gap}).
2. Draft a professional, high-energy email intro from "The SeptiVolt Team" that mentions their specific score (${septivolt_score}%) and how we can help them bridge their gap.
3. Suggest a 30-day onboarding schedule.

FORMAT:
Provide the output in a clean, structured format that can be pasted directly into a CRM note or sent as a follow-up PDF.
    `.trim();

    // Trigger the Manus AI Task via API (using v2 schema)
    const response = await fetch('https://api.manus.ai/v2/task.create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-manus-api-key': manusApiKey
      },
      body: JSON.stringify({
        message: {
          content: [
            {
              type: 'text',
              text: prompt
            }
          ]
        },
        agent_profile: 'manus-1.6', // Standard high-quality profile
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Manus API Error:', errorData);
      return NextResponse.json({ error: 'Manus AI failed to start task', details: errorData }, { status: response.status });
    }

    const result = await response.json();

    console.log(`Manus Task Created: ${result.task_id} for lead ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Manus task triggered successfully',
      manus_task_id: result.task_id,
      manus_task_url: result.task_url
    });

  } catch (error) {
    console.error('Manus Trigger Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
