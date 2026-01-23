from io import BytesIO
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib import colors
from datetime import datetime

def generate_certificate_pdf(user_name: str) -> BytesIO:
    buffer = BytesIO()
    
    # Create PDF in Landscape
    c = canvas.Canvas(buffer, pagesize=landscape(letter))
    width, height = landscape(letter)
    
    # --- Design ---
    
    # 1. Border
    c.setStrokeColor(colors.gold)
    c.setLineWidth(5)
    c.rect(0.5*inch, 0.5*inch, width-1*inch, height-1*inch)
    
    c.setStrokeColor(colors.black)
    c.setLineWidth(1)
    c.rect(0.6*inch, 0.6*inch, width-1.2*inch, height-1.2*inch)
    
    # 2. Header
    c.setFont("Helvetica-Bold", 40)
    c.drawCentredString(width/2, height - 2*inch, "CERTIFICATE OF ACHIEVEMENT")
    
    # 3. Subtext
    c.setFont("Helvetica", 18)
    c.drawCentredString(width/2, height - 3*inch, "This certifies that")
    
    # 4. User Name
    c.setFont("Times-BoldItalic", 48)
    c.setFillColor(colors.darkblue)
    c.drawCentredString(width/2, height - 4.5*inch, user_name)
    c.setFillColor(colors.black)
    
    # 5. Details
    c.setFont("Helvetica", 18)
    c.drawCentredString(width/2, height - 5.5*inch, "Has successfully passed the")
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width/2, height - 6*inch, "Solar Sales Certification Exam")
    
    # 6. Footer (Date and Signature)
    date_str = datetime.now().strftime("%B %d, %Y")
    
    c.setFont("Helvetica", 12)
    c.drawString(2*inch, 1.5*inch, f"Date: {date_str}")
    c.line(2*inch, 1.4*inch, 4*inch, 1.4*inch)
    
    c.drawString(width - 4*inch, 1.5*inch, "Master Coach")
    c.line(width - 4*inch, 1.4*inch, width - 2*inch, 1.4*inch)
    c.drawString(width - 4*inch, 1.25*inch, "Antigravity Agent")
    
    c.save()
    buffer.seek(0)
    return buffer
