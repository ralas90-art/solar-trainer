import pdfplumber

try:
    with pdfplumber.open(r'c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\El Salvador Digital Services Portfolio Sales SOP.pdf') as pdf:
        text = ""
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n\n"
                
    with open(r'c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\pdf_text.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Extraction successful. Characters:", len(text))
except Exception as e:
    import traceback
    traceback.print_exc()
