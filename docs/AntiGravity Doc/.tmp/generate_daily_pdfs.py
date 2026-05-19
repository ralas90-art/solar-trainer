
import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER

def create_pdf(filename, title, subtitle, module_files, base_dir):
    """Generates a single PDF workbook from a list of markdown/image files."""
    
    output_path = f"c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/solar-trainer/frontend/public/downloads/{filename}"
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=72, leftMargin=72,
        topMargin=72, bottomMargin=50
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='CenterTitle', parent=styles['Title'], alignment=TA_CENTER, spaceAfter=20, fontSize=24, textColor="#0F172A"))
    styles.add(ParagraphStyle(name='ModuleHeader', parent=styles['Heading1'], spaceBefore=20, spaceAfter=10, textColor="#E11D48", fontSize=18)) # Rose-600
    styles.add(ParagraphStyle(name='SubHeader', parent=styles['Heading2'], spaceBefore=10, spaceAfter=5, textColor="#334155")) # Slate-700
    styles.add(ParagraphStyle(name='NormalText', parent=styles['Normal'], fontSize=11, leading=14, spaceAfter=6))
    styles.add(ParagraphStyle(name='CustomBullet', parent=styles['Normal'], fontSize=11, leading=14, leftIndent=20))

    story = []

    # --- Title Page ---
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph(title, styles['CenterTitle']))
    story.append(Paragraph(subtitle, styles['Normal']))
    story.append(Spacer(1, 3*inch))
    story.append(Paragraph("Antigravity Solar Sales Training", styles['Normal']))
    story.append(PageBreak())

    # --- Content ---
    for item in module_files:
        md_file = item['md']
        img_file = item.get('img')
        
        md_path = os.path.join(base_dir, md_file)
        
        if os.path.exists(md_path):
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Basic Markdown Parser
            lines = content.split('\n')
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                if line.startswith('# '):
                    story.append(PageBreak())
                    story.append(Paragraph(line[2:], styles['ModuleHeader']))
                    # Insert Image after header if exists for this module
                    if img_file:
                        img_path = os.path.join(base_dir, img_file)
                        if os.path.exists(img_path):
                            story.append(Spacer(1, 10))
                            try:
                                im = Image(img_path, width=5.5*inch, height=3*inch, kind='proportional')
                                story.append(im)
                                story.append(Spacer(1, 10))
                            except:
                                pass
                elif line.startswith('## '):
                    story.append(Paragraph(line[3:], styles['SubHeader']))
                elif line.startswith('### '):
                    story.append(Paragraph(line[4:], styles['Heading3']))
                elif line.startswith('* ') or line.startswith('- '):
                    story.append(Paragraph(f"• {line[2:]}", styles['CustomBullet']))
                elif line.startswith('1. '):
                    story.append(Paragraph(f"{line}", styles['CustomBullet']))
                elif line.startswith('> '):
                     story.append(Paragraph(f"<i>{line[2:]}</i>", styles['NormalText']))
                elif line.startswith('!['):
                    pass # Skip inline image syntax, we handle main images separately or need complex parsing
                else:
                    story.append(Paragraph(line, styles['NormalText']))
                
                story.append(Spacer(1, 4))
        else:
             print(f"Warning: File not found {md_path}")

    doc.build(story)
    print(f"Generated: {filename}")

def main():
    base_dir = "c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/training_materials"

    # --- Day 1: Foundation ---
    create_pdf(
        "Day_1_Foundation.pdf",
        "Day 1: The Foundation",
        "Mindset, Solar Basics, and Project Lifecycle",
        [
            {'md': "Module_1_Solar_Mindset.md", 'img': "module_1_mindset_infographic.png"},
            {'md': "Module_6_Technical_Mastery.md", 'img': "module_6_how_solar_works.png"},
            {'md': "Qualifying_Homes.md", 'img': "qualifying_roofs.png"},
            {'md': "Project_Lifecycle.md", 'img': "project_lifecycle_timeline.png"}
        ],
        base_dir
    )

    # --- Day 2: Prospecting ---
    create_pdf(
        "Day_2_Prospecting.pdf",
        "Day 2: Hunting & Prospecting",
        "Territory Management & Opening the Deal",
        [
            {'md': "Module_9_Territory_Management.md", 'img': "module_9_perfect_day.png"},
            {'md': "Module_2_Art_of_Connection.md", 'img': "module_2_trust_bridge.png"}
        ],
        base_dir
    )

    # --- Day 3: Connection ---
    create_pdf(
        "Day_3_Discovery.pdf",
        "Day 3: Connection & Discovery",
        "In-Home Mastery & Psychology",
        [
            {'md': "Module_10_In_Home_Presentation.md", 'img': "module_10_power_seat.png"},
            {'md': "Personality_Types.md", 'img': "personality_types_bolt.png"},
            {'md': "Vocabulary_Guide.md"}
        ],
        base_dir
    )

    # --- Day 4: Presentation ---
    create_pdf(
        "Day_4_Presentation.pdf",
        "Day 4: The Presentation",
        "Building Value & Explaining the Math",
        [
            {'md': "Module_3_Perfect_Presentation.md", 'img': "module_3_old_vs_new.png"},
            {'md': "Module_7_Mastering_Math.md", 'img': "module_7_money_roadmap.png"}
        ],
        base_dir
    )

    # --- Day 5: Objections ---
    create_pdf(
        "Day_5_Objections.pdf",
        "Day 5: Objections & Closing",
        "Turning No into Yes",
        [
            {'md': "Module_4_Mastering_Objections.md", 'img': "module_4_objection_judo.png"},
            {'md': "Module_5_Closing_Confidence.md", 'img': "module_5_decision_matrix.png"}
        ],
        base_dir
    )

    # --- Day 6: Mastery ---
    create_pdf(
        "Day_6_Mastery.pdf",
        "Day 6: Mastery & Expansion",
        "Referrals, Virtual Sales, and Glossary",
        [
            {'md': "Module_8_Referral_Engine.md", 'img': "module_8_referral_tree.png"},
            {'md': "Module_11_Virtual_Presentation.md", 'img': "module_11_zoom_setup.png"},
            {'md': "Glossary.md"}
        ],
        base_dir
    )

if __name__ == "__main__":
    main()
