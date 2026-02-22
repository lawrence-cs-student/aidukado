from .extractors import extract_pdf_text, extract_document_text, extract_pptx_text

def extract_text_from_file(file: bytes, filename: str):
    
    filename = filename.lower()

    if filename.endswith(".pdf"):
        return extract_pdf_text(file)
    elif filename.endswith(".docx"):
        return extract_document_text(file)
    elif filename.endswith((".pptx", ".ppt")):
        return extract_pptx_text(file)
    else:                        
        raise ValueError("Unsupported file type. Only PDF, DOCX, and PPTX are allowed.")
