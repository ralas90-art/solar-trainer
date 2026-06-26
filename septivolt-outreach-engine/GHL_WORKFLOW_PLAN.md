# SeptiVolt: GoHighLevel (GHL) Outreach Workflow Plan

## 1. Pipeline Architecture
**Pipeline Name:** SeptiVolt Pilot Outreach
**Stages:**
1. Lead Identified (Cold)
2. Contacted (Email/SMS Sent)
3. Engaged (Replied/Clicked Link)
4. Demo Booked
5. Demo Completed (Pending Close)
6. Demo No-Show
7. Pilot Won (Active User)
8. Lost / Not Ready

## 2. Custom Fields Needed
- `Solar Org Type` (EPC, Dealer, Virtual, Recruiter)
- `Current Rep Count` (Number)
- `Primary Pain Point` (Dropdown: Ramp time, Turnover, Manager Burnout, Leads)
- `Pilot Offer Expiration Date` (Date)

## 3. Automation Workflows (Triggers & Actions)

### Workflow 1: The Cold Outreach Sequence (Opt-In / List Upload)
- **Trigger:** Tag added `sv-cold-outreach`
- **Action:** Send Email 1 (The Problem + Loom Video Link)
- **Wait:** 2 days
- **Condition:** Did they click the Loom link?
  - *Yes ->* Move to 'Engaged', Send SMS: "Saw you checked out the video, open to a quick chat?"
  - *No ->* Send Email 2 (Follow up / Manager ROI angle)
- **Wait:** 3 days
- **Action:** Send Email 3 (The Pilot Offer / Scarcity)

### Workflow 2: Demo Booked Confirmation & Show-Up Sequence
- **Trigger:** Appointment Booked (Calendar: SeptiVolt Demo)
- **Action:** Move Pipeline Stage to 'Demo Booked'
- **Action:** Add Tag `sv-demo-booked`
- **Immediate:** Send Confirmation Email & SMS with Zoom link.
- **Wait:** 24 hours before meeting
- **Action:** Send Reminder Email: "Looking forward to showing you the AI roleplay engine tomorrow."
- **Wait:** 1 hour before meeting
- **Action:** Send SMS: "Hey [Name], jumping on Zoom in an hour. See you there."

### Workflow 3: Post-Demo Follow-Up (Pilot Close)
- **Trigger:** Pipeline stage changed to 'Demo Completed'
- **Immediate:** Send Email (Recap + Link to Pilot Checkout/Agreement)
- **Wait:** 2 days
- **Action:** Send SMS: "Hey [Name], following up on the Pilot. Only have a couple onboarding slots left for next week, let me know if we're moving forward!"

### Workflow 4: No-Show Recovery
- **Trigger:** Appointment Status updated to 'No Show'
- **Action:** Move to 'Demo No-Show' stage
- **Immediate:** Send SMS: "Hey [Name], missed you on Zoom. Everything okay? Here is my link to reschedule: [Link]"
- **Wait:** 2 days
- **Action:** Send Email (Loom recap of what they missed to build FOMO).

## 4. Tags to Create
- `sv-cold-outreach`
- `sv-engaged`
- `sv-demo-booked`
- `sv-pilot-won`
