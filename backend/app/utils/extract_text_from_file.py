from .extractors import extract_pdf_text, extract_document_text

def extract_text_from_file(file: bytes, filename: str):
    
    filename = filename.lower()

    if filename.endswith(".pdf"):
        return extract_pdf_text(file)
    elif filename.endswith(".docx"):
        return extract_document_text(file)
    else:
        raise ValueError("Unsupported file type. Only PDF and DOCX are allowed.")
