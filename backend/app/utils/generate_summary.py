import google.generativeai as genai
from fastapi.responses import JSONResponse

genai.configure(api_key = "AIzaSyDKQ6uASlEbzeilq8z6TanbL-PKKSxh4yM")

model = genai.GenerativeModel("gemini-2.0-flash")

def generate_summary(lesson_content):
    """
    Generate a concise and informative summary of the given lesson content.
    """
    prompt = f"""
        Summarize the following lesson clearly and concisely.
        Focus on the key ideas, important terms, and main points of understanding.
        Avoid repetition or unnecessary details.

        Lesson content:
        \"\"\"{lesson_content}\"\"\"

        Format:
        Summary:
        - [Your summary here in bullet form]
    """

    response = model.generate_content(prompt)
    summary = response.text
    return summary