from fastapi import APIRouter, File, UploadFile, HTTPException
from ..utils.extractors import extract_pdf_text, extract_document_text


router = APIRouter()

@router.post("/upload")

async def upload(file:UploadFile = File(...)):
    filename = file.filename.lower()
    
    if not (filename.endswith(".pdf") or filename.endswith(".docx") or filename.endswith(".doc")):
        raise HTTPException(status_code=400, detail="only .pdf, .docx, .doc files are allowed")
    
    
    contents = await file.read()
    
    print(f"File size: {len(contents)} bytes")
    
    if filename.endswith(".pdf"):
        text = extract_pdf_text(contents)
    else:
        text = extract_document_text(contents)
        
        
    return {"extracted_text": text}