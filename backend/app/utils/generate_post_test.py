import google.generativeai as genai
from fastapi.responses import JSONResponse
from .parse_questions import parse_questions

genai.configure(api_key = "AIzaSyDKQ6uASlEbzeilq8z6TanbL-PKKSxh4yM")

model = genai.GenerativeModel("gemini-2.0-flash")

def generate_post_test(origFile: str, generatedLesson: str):
    prompt = f""" 
        Given to you a the original file we extracted earlier fo you to generate a pretest and now we will generate a post test i gave you also the one that we gave as a reviewer for their wrong answers, generate a 10 post test question multiple choice with 4 options each and indicate the right answer
        
        Content:
        \"\"\"{origFile, generatedLesson }\"\"\"
        
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
    