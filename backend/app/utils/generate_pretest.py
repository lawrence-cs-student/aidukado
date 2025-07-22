import google.generativeai as genai
from fastapi.responses import JSONResponse
from .parse_questions import parse_questions

genai.configure(api_key = "AIzaSyDKQ6uASlEbzeilq8z6TanbL-PKKSxh4yM")

model = genai.GenerativeModel("gemini-2.0-flash")

def generate_pretest(content: str):
    prompt = f""" 
        Based on the content below, generate a 5-question multiple choice pretest with 4 options each and indicate the right answer
        
        Content:
        \"\"\"{content}\"\"\"
        
        Format Your Response like these:
        
        1. Question ...
        
            A. Option
            B. Option
            C. Option
            D. Option
            
        Answer: B
        
        Begin: 
        
    """
    
    response = model.generate_content(prompt)
    raw_questions =  response.text
    parsed_questions = parse_questions(raw_questions)
    
    return parsed_questions
    