from PyPDF2 import PdfReader
import io
import re
from docx import Document

def clean_format_text(text: str) -> str:
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s{2,}', ' ', text)
    return text.strip()

def extract_pdf_text(file_bytes: bytes):
    try:
        pdf = PdfReader(io.BytesIO(file_bytes))
        pages = [page.extract_text() or "" for page in pdf.pages]
        raw_text =  "\n".join(pages)
        return clean_format_text(raw_text)
    except Exception as e:
        return f"Error reding PDF: {e}"

def extract_document_text(file_bytes: bytes):
    try:
        doc = Document(io.BytesIO(file_bytes))
        paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
        raw_text = "\n".join(paragraphs)
        return clean_format_text(raw_text)
    except Exception as e:
        return f"Error reading document: {e}"