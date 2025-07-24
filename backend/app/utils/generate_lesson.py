import google.generativeai as genai
import json

genai.configure(api_key = "")

model = genai.GenerativeModel("gemini-2.0-flash")

def generate_lesson(data: str):
    prompt = f"""
        You are an Intelligent AI Teacher
        Below is a list of questions that a student got wrong in a quiz. Each question includes the student's answer, the correct answer, and the topic
        Generate a lesson or explanation for each question to help the student understand the topic better.

        {json.dumps(data, indent= 2)}

        Keep explanations concise, beginner-friendly, and relevant.
    
    
    

        """
    
    response = model.generate_content(prompt)
    
    return response.text