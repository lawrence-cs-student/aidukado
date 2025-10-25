import google.generativeai as genai
from fastapi.responses import JSONResponse
from .parse_questions import parse_questions

genai.configure(api_key = "AIzaSyDKQ6uASlEbzeilq8z6TanbL-PKKSxh4yM")

model = genai.GenerativeModel("gemini-2.0-flash")

def generate_pretest(lesson_content, num_items, question_type):
    prompt = f"""
        Based on the content below, generate a {num_items}-question {question_type} quiz. 

        Content:
        \"\"\"{lesson_content}\"\"\"

        Format your response like this (for multiple choice):

        1. Question ...

            A. Option
            B. Option
            C. Option
            D. Option

        Answer: B

        If the question type is True/False, format like this:

        1. Question ...

            A. True
            B. False

        Answer: True

        Begin:
        """
    
    response = model.generate_content(prompt)
    raw_questions =  response.text
    parsed_questions = parse_questions(raw_questions)
    
    return parsed_questions
    