import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER

def create_agreement_pdf(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom Title Style
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Title'],
        alignment=TA_CENTER,
        fontSize=18,
        spaceAfter=20
    )
    
    story = []
    
    story.append(Paragraph("MASTER SERVICES AGREEMENT", title_style))
    story.append(Spacer(1, 12))
    
    content = [
        "This Master Services Agreement (\"Agreement\") is entered into by and between [Company Name] (\"Provider\") and the customer identified in the applicable Order Form (\"Customer\").",
        "<b>1. Services Provided</b>",
        "Provider agrees to deliver the Enterprise Plan of the AI-powered solar sales training platform as detailed in an executed Order Form. This includes access to white-label options, custom AI scenarios, advanced reporting, and onboarding/integration support.",
        "<b>2. Responsibilities of Both Parties</b>",
        "• <b>Provider:</b> Shall maintain platform uptime, deliver standard support during business hours, and continuously secure the platform infrastructure.",
        "• <b>Customer:</b> Shall provide necessary cooperation for onboarding, ensure their users comply with the Acceptable Use Policy, and remit payment accurately and on time.",
        "<b>3. Support Commitments</b>",
        "Provider will supply dedicated integration support and priority technical issue resolution as specified in the agreed-upon Service Level Agreement (SLA) (if applicable).",
        "<b>4. Data Protection</b>",
        "Both parties agree to comply with applicable data protection laws. Provider will only process Customer Data (including user metrics and AI training logs) necessary to provide the Services, in accordance with the Privacy Policy and any attached Data Processing Addendum.",
        "<b>5. Confidentiality</b>",
        "Neither party shall disclose the other’s Confidential Information to any third party without prior written consent, except as required by law. This includes custom sales scenarios provided by Customer to Provider.",
        "<b>6. Intellectual Property</b>",
        "• Provider retains all rights to the Platform, base curriculum, core AI infrastructure, and underlying technology.",
        "• Customer retains all rights to their pre-existing proprietary materials, brand assets, and custom data provided for white-labeling and specific custom scenarios.",
        "<b>7. Limitation of Liability</b>",
        "Except for breaches of confidentiality or indemnification obligations, neither party's cumulative liability shall exceed the total fees paid by Customer during the twelve (12) months immediately preceding the event giving rise to the claim.",
        "<b>8. Termination Conditions</b>",
        "Either party may terminate this Agreement upon a material breach if the breaching party fails to cure the breach within thirty (30) days of written notice. Upon termination, Customer must cease all use of the Platform, and Provider will securely delete or return Customer Data upon request."
    ]
    
    for text in content:
        story.append(Paragraph(text, styles['Normal']))
        story.append(Spacer(1, 10))
        
    doc.build(story)

def create_order_form_pdf(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Title'],
        alignment=TA_CENTER,
        fontSize=18,
        spaceAfter=20
    )
    
    story = []
    
    story.append(Paragraph("ENTERPRISE ORDER FORM", title_style))
    story.append(Spacer(1, 12))
    
    sections = [
        "<b>Order Form Date:</b> _______________",
        "<b>Order Form Number:</b> _______________",
        "<br/><b>1. Customer Information</b>",
        "• <b>Company Name:</b> ___________________________",
        "• <b>Primary Contact Name:</b> ___________________________",
        "• <b>Billing Email address:</b> ___________________________",
        "• <b>Address:</b> ___________________________",
        "<br/><b>2. Subscription Plan & Pricing</b>",
        "• <b>Subscription Tier:</b> Enterprise Plan",
        "• <b>Contract Duration:</b> [ ] 6 Months [ ] 12 Months",
        "• <b>Billing Frequency:</b> [ ] Monthly [ ] Annually",
        "• <b>Number of Active Rep Seats Included:</b> _______________",
        "<br/><b>Pricing Details:</b>",
        "• <b>Platform Fee:</b> $_______________ per [month/year]",
        "• <b>Cost Per Seat:</b> $_______________ per [month/year]",
        "• <b>Total Subscription Amount:</b> $_______________",
        "<br/><b>3. Implementation & Customization Services</b>",
        "• <b>Scope of Services:</b> [e.g., White-label dashboard setup, 5 custom voice scenarios, dedicated CRM integration support]",
        "• <b>One-time Implementation Fee:</b> $_______________",
        "• <b>Target Launch / Start Date:</b> _______________",
        "<br/><b>4. Acknowledgment</b>",
        "This Order Form is governed by the terms of the Master Services Agreement located at [URL] or attached hereto. By signing below, the parties agree to be bound by this Order Form and the underlying MSA.",
        "<br/><br/><b>Customer Signature</b>",
        "Signature: __________________________",
        "Name: _______________________________",
        "Title: ________________________________",
        "Date: ________________________________",
        "<br/><br/><b>[Company Name] Signature</b>",
        "Signature: __________________________",
        "Name: _______________________________",
        "Title: ________________________________",
        "Date: ________________________________"
    ]
    
    for text in sections:
        story.append(Paragraph(text, styles['Normal']))
        story.append(Spacer(1, 8))
        
    doc.build(story)

if __name__ == "__main__":
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "solar-trainer", "frontend", "public", "downloads"))
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    create_agreement_pdf(os.path.join(output_dir, "Enterprise_SaaS_Agreement.pdf"))
    create_order_form_pdf(os.path.join(output_dir, "Enterprise_Order_Form.pdf"))
    print("PDFs generated successfully in:", output_dir)
