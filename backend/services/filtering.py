import os
import json
import datetime
import pandas as pd
from sqlmodel import Session
from models import EnterpriseInquiry
from database import get_session

class FilteringService:
    def __init__(self):
        # Use relative path for cross-platform compatibility
        self.excel_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "leads.xlsx")

    async def score_lead(self, inquiry: EnterpriseInquiry):
        """
        Uses Grok (Intel Scout) to score the lead based on the inquiry data.
        """
        prompt = f"""
        Role: Solar Sales Intel Scout
        Task: Score this enterprise lead for Septivolt.
        
        Lead Data:
        - Name: {inquiry.name}
        - Email: {inquiry.email}
        - Company: {inquiry.company}
        - Team Size: {inquiry.team_size}
        - Use Case: {inquiry.use_case}
        
        Scoring Criteria:
        - Team Size > 100: +40 points
        - Team Size 50-100: +20 points
        - "Solar" mentioned in Use Case: +20 points
        - Professional email (not gmail/outlook): +20 points
        
        Return JSON format: 
        {{
            "score": int (0-100),
            "priority": "high" | "medium" | "low",
            "reasoning": "string"
        }}
        """
        # Note: Since I am the agent, I can call the Grok tool directly in the router or here 
        # but as a "Service" it's cleaner to have the logic defined.
        return prompt # We will use this in the router to call the MCP tool

    def log_to_excel(self, inquiry: EnterpriseInquiry):
        """
        Appends the lead data to the leads.xlsx file.
        """
        data = {
            "ID": [inquiry.id],
            "Name": [inquiry.name],
            "Email": [inquiry.email],
            "Company": [inquiry.company],
            "Team Size": [inquiry.team_size],
            "Score": [inquiry.score],
            "Priority": [inquiry.priority],
            "Status": [inquiry.status],
            "Created At": [inquiry.created_at.strftime("%Y-%m-%d %H:%M:%S")]
        }
        df_new = pd.DataFrame(data)
        
        if os.path.exists(self.excel_path):
            df_existing = pd.read_excel(self.excel_path)
            df_final = pd.concat([df_existing, df_new], ignore_index=True)
        else:
            df_final = df_new
            
        df_final.to_excel(self.excel_path, index=False)
        print(f"Lead logged to {self.excel_path}")

    def generate_ics_content(self, lead_name, company):
        """
        Generates the content for a .ics calendar invitation.
        """
        now = datetime.datetime.utcnow()
        start_time = now + datetime.timedelta(days=2, hours=10) # Default to 2 days later at 10 AM
        end_time = start_time + datetime.timedelta(minutes=30)
        
        stamp = now.strftime("%Y%m%dT%H%M%SZ")
        start = start_time.strftime("%Y%m%dT%H%M%SZ")
        end = end_time.strftime("%Y%m%dT%H%M%SZ")
        
        ics = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Septivolt//Enterprise Scheduler//EN
BEGIN:VEVENT
UID:enterprise_{stamp}
DTSTAMP:{stamp}
DTSTART:{start}
DTEND:{end}
SUMMARY:Septivolt Demo: {lead_name} ({company})
DESCRIPTION:Enterprise Demo and Discovery Call for Septivolt OS.
LOCATION:Google Meet (Link to be provided)
END:VEVENT
END:VCALENDAR"""
        return ics

    def format_email_body(self, inquiry: EnterpriseInquiry):
        """
        Formats the email notification body.
        """
        return f"""
NEW ENTERPRISE LEAD DETECTED

Name: {inquiry.name}
Email: {inquiry.email}
Company: {inquiry.company}
Team Size: {inquiry.team_size}
Priority: {inquiry.priority.upper()}
AI Score: {inquiry.score}/100

Use Case:
{inquiry.use_case}

---
AUTOMATED RESEARCH (Manus AI):
{inquiry.research_notes}

A calendar invite has been attached to this email and synced to your system.
"""
