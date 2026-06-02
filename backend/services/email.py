import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Any

class EmailService:
    @staticmethod
    def get_template(subject_type: str, context: Dict[str, Any]) -> str:
        first_name = context.get("first_name", "Trainee")
        company_name = context.get("company_name", "SeptiVolt")
        magic_link = context.get("magic_link", "#")
        role_label = context.get("role_label", "Sales Representative")
        
        # Color palette: HSL / Volt Cyan (#00F2FF), Hyper Lime (#ADFF00), Circuit Navy (#0B1120)
        base_style = """
        margin: 0; padding: 0; font-family: 'Inter', 'Roboto', sans-serif; background-color: #0B1120; color: #FFFFFF;
        """
        
        header_html = f"""
        <div style="background-color: #0B1120; border-bottom: 2px solid #00F2FF; padding: 30px; text-align: center;">
            <h1 style="color: #00F2FF; font-size: 26px; margin: 0; font-weight: 900; letter-spacing: 2px;">SEPTIVOLT <span style="color: #ADFF00;">OS</span></h1>
        </div>
        """
        
        footer_html = """
        <div style="background-color: #0A0F1D; border-top: 1px solid #1E293B; padding: 20px; text-align: center; font-size: 11px; color: #94A3B8;">
            <p style="margin: 0; letter-spacing: 1px; font-weight: bold; text-transform: uppercase;">Authorized Personnel Only // Global Solar Training Network</p>
            <p style="margin: 5px 0 0 0;">This email was sent to you as part of your organization's SeptiVolt license.</p>
        </div>
        """

        if subject_type == "sales_rep":
            body = f"""
            <h2 style="color: #FFFFFF; font-size: 20px; margin-top: 0;">Hello {first_name},</h2>
            <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
                You've been invited to join the <strong>{company_name}</strong> training command center on SeptiVolt as a <strong>{role_label}</strong>.
            </p>
            <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
                Your training team is waiting. Click the button below to accept your invitation, verify your credentials, and start your curriculum.
            </p>
            """
        elif subject_type == "manager":
            body = f"""
            <h2 style="color: #FFFFFF; font-size: 20px; margin-top: 0;">Hello {first_name},</h2>
            <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
                You've been added to SeptiVolt as a <strong>Team Manager</strong> for <strong>{company_name}</strong>.
            </p>
            <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
                Through your dashboard, you will be able to monitor reps, review simulation recordings, assign curriculums, and manage coaching notes.
            </p>
            """
        else: # company_admin / dealer_admin
            body = f"""
            <h2 style="color: #FFFFFF; font-size: 20px; margin-top: 0;">Hello {first_name},</h2>
            <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
                Your SeptiVolt organization <strong>{company_name}</strong> is ready.
            </p>
            <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
                As the <strong>Company Administrator</strong>, you can invite users, define offices/branches, configure GoHighLevel sync workflows, and review team-wide readiness analytics.
            </p>
            """

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Join SeptiVolt</title>
        </head>
        <body style="{base_style}">
            <div style="max-width: 600px; margin: 40px auto; background-color: #161F30; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 242, 255, 0.1);">
                {header_html}
                <div style="padding: 40px; color: #FFFFFF;">
                    {body}
                    <div style="margin: 35px 0; text-align: center;">
                        <a href="{magic_link}" style="background-color: #00F2FF; color: #0B1120; font-weight: bold; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; display: inline-block; box-shadow: 0 4px 12px rgba(0, 242, 255, 0.3);">
                            Access Command Center
                        </a>
                    </div>
                    <p style="color: #475569; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
                        * This access link will expire in 24 hours. For security, do not forward this email to anyone else.
                    </p>
                </div>
                {footer_html}
            </div>
        </body>
        </html>
        """
        return html_content

    @classmethod
    def send_invitation_email(cls, email: str, first_name: str, role: str, company_name: str, magic_link: str):
        # Determine template content by role
        if role in ["dealer_admin", "admin"]:
            subject_type = "company_admin"
            subject = f"Your SeptiVolt Organization ({company_name}) Is Ready"
            role_label = "Company Administrator"
        elif role in ["branch_manager", "manager"]:
            subject_type = "manager"
            subject = f"You've Been Added as a Team Manager for {company_name}"
            role_label = "Branch Manager"
        else:
            subject_type = "sales_rep"
            subject = f"You're Invited to Join {company_name} on SeptiVolt"
            role_label = "Sales Representative"

        context = {
            "first_name": first_name,
            "company_name": company_name,
            "magic_link": magic_link,
            "role_label": role_label
        }
        
        html_body = cls.get_template(subject_type, context)

        # Check for environment configs
        smtp_host = os.getenv("SMTP_HOST")
        smtp_port = os.getenv("SMTP_PORT")
        smtp_user = os.getenv("SMTP_USERNAME")
        smtp_pass = os.getenv("SMTP_PASSWORD")
        sender = os.getenv("SMTP_SENDER", "onboarding@septivolt.com")

        if not all([smtp_host, smtp_port, smtp_user, smtp_pass]):
            # Mock delivery fallback logger
            print("=" * 60)
            print("[MOCK EMAIL DELIVERY SERVICE]")
            print(f"To: {email}")
            print(f"Subject: {subject}")
            print(f"Role: {role_label}")
            print(f"Magic Link: {magic_link}")
            print("=" * 60)
            return True

        # Send real SMTP email
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"SeptiVolt OS <{sender}>"
            msg["To"] = email
            
            part = MIMEText(html_body, "html")
            msg.attach(part)
            
            with smtplib.SMTP(smtp_host, int(smtp_port)) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(sender, [email], msg.as_string())
            print(f"[EMAIL] Successfully sent invitation email to {email} (SMTP)")
            return True
        except Exception as e:
            print(f"[EMAIL ERROR] Failed sending via SMTP: {e}")
            # Fallback to Mock print so system works in sandbox
            print("[EMAIL FALLBACK] Rendering token link in console:")
            print(f"Magic Link URL: {magic_link}")
            return False
