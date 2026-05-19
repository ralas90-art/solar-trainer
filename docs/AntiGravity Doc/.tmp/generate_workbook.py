import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER

def generate_workbook():
    doc = SimpleDocTemplate(
        "c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/training_materials/The_Antigravity_Solar_Bible.pdf",
        pagesize=letter,
        rightMargin=72, leftMargin=72,
        topMargin=72, bottomMargin=18
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='CenterTitle', parent=styles['Title'], alignment=TA_CENTER, spaceAfter=20))
    styles.add(ParagraphStyle(name='ModuleHeader', parent=styles['Heading1'], spaceBefore=20, spaceAfter=10, textColor="#E67E22"))
    styles.add(ParagraphStyle(name='SubHeader', parent=styles['Heading2'], spaceBefore=10, spaceAfter=5, textColor="#34495E"))

    story = []

    # Title Page
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("THE ANTIGRAVITY SOLAR BIBLE", styles['CenterTitle']))
    story.append(Paragraph("The Ultimate Guide to Closing Solar Sales", styles['Normal']))
    story.append(Spacer(1, 3*inch))
    story.append(Paragraph("Prepared for: Antigravity Solar", styles['Normal']))
    story.append(PageBreak())

    # Content Modules
    base_dir = "c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/training_materials"
    
    # Map of module numbers to filenames (ordered)
    modules = [
        ("Module_1_Solar_Mindset.md", "module_1_mindset_infographic.png"),
        ("Module_2_Art_of_Connection.md", "module_2_trust_bridge.png"),
        ("Module_3_Perfect_Presentation.md", "module_3_old_vs_new.png"),
        ("Module_4_Mastering_Objections.md", "module_4_objection_judo.png"),
        ("Module_5_Closing_Confidence.md", "module_5_decision_matrix.png"),
        ("Module_6_Technical_Mastery.md", "module_6_how_solar_works.png"),
        ("Module_7_Mastering_Math.md", "module_7_money_roadmap.png"),
        ("Module_8_Referral_Engine.md", "module_8_referral_tree.png"),
        ("Module_9_Territory_Management.md", "module_9_perfect_day.png"),
        ("Module_10_In_Home_Presentation.md", "module_10_power_seat.png"),
        ("Module_11_Virtual_Presentation.md", "module_11_zoom_setup.png")
    ]

    for md_file, img_file in modules:
        md_path = os.path.join(base_dir, md_file)
        img_path = os.path.join(base_dir, img_file)

        if os.path.exists(md_path):
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Simple Markdown Parsing
            lines = content.split('\n')
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                if line.startswith('# '):
                    # Module Title
                    story.append(PageBreak()) # New page for each module
                    story.append(Paragraph(line[2:], styles['ModuleHeader']))
                    # Check for Image
                    if os.path.exists(img_path):
                        story.append(Spacer(1, 10))
                        try:
                            im = Image(img_path, width=6*inch, height=3.5*inch)
                            story.append(im)
                            story.append(Spacer(1, 10))
                        except Exception as e:
                            print(f"Error loading image {img_file}: {e}")
                
                elif line.startswith('## '):
                    story.append(Paragraph(line[3:], styles['SubHeader']))
                elif line.startswith('### '):
                    story.append(Paragraph(line[4:], styles['Heading3']))
                elif line.startswith('* ') or line.startswith('- '):
                    story.append(Paragraph(f"• {line[2:]}", styles['BodyText']))
                elif line.startswith('1. '):
                    story.append(Paragraph(f"{line}", styles['BodyText']))
                else:
                    story.append(Paragraph(line, styles['BodyText']))
                
                story.append(Spacer(1, 5))

    doc.build(story)
    print("Workbook generated successfully!")

if __name__ == "__main__":
    generate_workbook()
