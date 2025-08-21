from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from ..utils.extractors import extract_pdf_text, extract_document_text
from ..utils.generate_pretest import generate_pretest
from ..utils.role_required import role_required
from ..utils.supabase_client import supabase


teacher_router = APIRouter (
    prefix="/teacher",
    tags=["teacher"],
    dependencies=[Depends(role_required(["teacher"]))]
)

@teacher_router.post("/upload")
async def upload(file:UploadFile = File(...)):
    filename = file.filename.lower()
    
    if not (filename.endswith(".pdf") or filename.endswith(".docx") or filename.endswith(".doc")):
        raise HTTPException(status_code=400, detail="only .pdf, .docx, .doc files are allowed")
    
    
    contents = await file.read()
    
    
    if filename.endswith(".pdf"):
        text = extract_pdf_text(contents)
    else:
        text = extract_document_text(contents)
    
    questions = generate_pretest(text)    
    return {"pretest": questions, "extractedText": text}


# @teacher_router.post("/upload")
# async def upload(file:UploadFile = File(...)):
#     filename = file.filename.lower()
    
#     if not (filename.endswith(".pdf") or filename.endswith(".docx") or filename.endswith(".doc")):
#         raise HTTPException(status_code=400, detail="only .pdf, .docx, .doc files are allowed")
    
    
#     contents = await file.read()
    
    
#     if filename.endswith(".pdf"):
#         text = extract_pdf_text(contents)
#     else:
#         text = extract_document_text(contents)
    
#     questions = generate_pretest(text)    
#     return {"pretest": questions, "extractedText": text}