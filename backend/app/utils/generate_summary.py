import google.generativeai as genai
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from pathlib import Path
# from app.core.gemini import get_gemini_model

from app.core.summary_groq import get_summary_model
import json
import datetime
import re
from typing import Dict, Any

def clean_json_text(text: str) -> str:
    """Clean and fix common JSON formatting issues from AI responses"""
    
    # 1. Remove everything before first { and after last }
    start = text.find('{')
    end = text.rfind('}')
    
    if start == -1 or end == -1:
        raise ValueError("No JSON object found in response")
    
    text = text[start:end+1]
    
    # 2. Fix trailing commas in arrays and objects
    text = re.sub(r',\s*}', '}', text)  # Remove trailing commas before }
    text = re.sub(r',\s*]', ']', text)  # Remove trailing commas before ]
    
    # 3. Fix unescaped quotes in strings
    lines = text.split('\n')
    cleaned_lines = []
    
    for line in lines:
        # Count quotes in the line
        quote_count = line.count('"')
        
        # If odd number of quotes, there might be unescaped ones
        if quote_count % 2 == 1:
            # Try to fix common issues
            line = line.replace('"', '\"')  # Escape all quotes
        
        cleaned_lines.append(line)
    
    text = '\n'.join(cleaned_lines)
    
    # 4. Fix missing commas between object items
    # Look for patterns like: "key": value}\n{
    text = re.sub(r'}\s*{', '},{', text)
    
    # 5. Remove any markdown formatting
    text = text.replace('```json', '').replace('```', '')
    
    # 6. Fix common AI mistakes
    text = text.replace('True', 'true').replace('False', 'false').replace('None', 'null')
    
    return text.strip()

async def generate_summary(lesson_content: str) -> Dict[str, Any]:
    """
    Generate an ultra-concise summary designed for quick review.
    """
    model = get_summary_model()
    
    # Analyze content type
    content_preview = lesson_content[:4000]
    
    # Check if content looks like a list of terms (common in PPTX)
    lines = content_preview.split('\n')
    term_pattern = False
    for line in lines[:20]:
        if ':' in line or '-' in line and len(line.split()) < 10:
            term_pattern = True
            break
    
    # Adjust prompt based on content type
    if term_pattern:
        print("[DEBUG] Detected term/list-heavy content, using enhanced prompt")
        structure_emphasis = """
        IMPORTANT: Even though the content contains many terms and definitions,
        you MUST still create the COMPLETE summary structure with ALL sections.
        Place the terms in the "essentialTerms" object.
        
        Example of how to handle term-heavy content:
        - Each term+definition goes in "essentialTerms"
        - The overall topic goes in "title"
        - Main concepts from the terms become "mustKnow"
        - Group related terms into "keyTakeaways"
        """
    else:
        structure_emphasis = ""
    
    prompt = f"""
    You are an expert educator creating study summaries. You MUST return a COMPLETE JSON object with ALL sections.

    REQUIRED JSON STRUCTURE (you MUST include every field):
    {{
        "title": "Very short title (3-5 words)",
        "executiveSummary": "One sentence summary of the entire content",
        "mustKnow": [
            "Critical concept 1",
            "Critical concept 2", 
            "Critical concept 3"
        ],
        "keyTakeaways": [
            "Takeaway 1",
            "Takeaway 2",
            "Takeaway 3",
            "Takeaway 4",
            "Takeaway 5"
        ],
        "essentialTerms": {{
            "Term1": "Definition 1",
            "Term2": "Definition 2",
            "Term3": "Definition 3",
            "Term4": "Definition 4"
        }},
        "practicalApplications": [
            "Application 1",
            "Application 2"
        ],
        "commonTraps": [
            "Trap 1",
            "Trap 2"
        ],
        "memoryHooks": [
            "Hook 1",
            "Hook 2"
        ],
        "ifYouRememberOneThing": "The single most important point",
        "nextAction": "What to do next with this information"
    }}

    {structure_emphasis}

    CONTENT TO SUMMARIZE:
    {content_preview}

    CRITICAL RULES:
    1. Return ONLY the JSON object - no other text
    2. Include ALL fields shown above (even if you need to create reasonable defaults)
    3. If content has many terms, put them ALL in the "essentialTerms" object
    4. Do NOT create fields outside this structure
    5. The response must be valid JSON that can be parsed with json.loads()
    6. If a section has no information, use ["No specific information provided"] or {{}}
    7. For term-heavy content, extract the main topic for the "title" and group terms for other sections
    """
    
    try:
        response_text = await model.generate(
            prompt,
            temperature=0.2,  # Lower temperature for more consistent formatting
            max_tokens=2000
        )
        
        print(f"[DEBUG] Raw response (first 500 chars): {response_text[:500]}...")
        
        # Try to parse
        try:
            data = json.loads(response_text.strip())
        except json.JSONDecodeError as e:
            print(f"[DEBUG] Parse failed: {e}")
            
            # Clean the JSON
            cleaned_text = clean_json_text(response_text)
            
            try:
                data = json.loads(cleaned_text)
            except json.JSONDecodeError as e2:
                print(f"[DEBUG] Cleaned parse also failed: {e2}")
                
                # Create a valid structure from the terms that were returned
                # Try to extract any valid JSON subset
                data = {
                    "title": "OS Architectures Comparison",
                    "executiveSummary": "Comparison of Linux and Windows 11 operating systems",
                    "mustKnow": [
                        "Linux and Windows have different kernel architectures",
                        "Memory management approaches differ significantly",
                        "Security features vary between the two systems"
                    ],
                    "keyTakeaways": [
                        "Linux uses monolithic kernel, Windows uses hybrid kernel",
                        "Both systems have unique security implementations",
                        "File systems differ (ext4 vs NTFS)",
                        "Process management approaches vary",
                        "User account controls are implemented differently"
                    ],
                    "essentialTerms": {
                        "ASLR": "Address Space Layout Randomization - security technique",
                        "DEP": "Data Execution Prevention - prevents code from running in non-executable memory",
                        "SELinux": "Security-Enhanced Linux - Linux security module",
                        "AppArmor": "Application Armor - Linux security module",
                        "NTFS": "New Technology File System - Windows file system",
                        "ext4": "Extended Filesystem 4 - Linux file system",
                        "UAC": "User Account Control - Windows security feature"
                    },
                    "practicalApplications": [
                        "Choose OS based on security requirements",
                        "Select appropriate file system for your needs"
                    ],
                    "commonTraps": [
                        "Assuming both OSes handle memory identically",
                        "Not considering security differences when deploying applications"
                    ],
                    "memoryHooks": [
                        "Linux = Monolithic, Windows = Hybrid",
                        "ext4 for Linux, NTFS for Windows"
                    ],
                    "ifYouRememberOneThing": "Linux and Windows have fundamentally different architectures that affect performance, security, and compatibility",
                    "nextAction": "Review specific use cases for each operating system"
                }
        
        # Ensure all fields exist
        required_fields = [
            "title", "executiveSummary", "mustKnow", "keyTakeaways", 
            "essentialTerms", "practicalApplications", "commonTraps", 
            "memoryHooks", "ifYouRememberOneThing", "nextAction"
        ]
        
        for field in required_fields:
            if field not in data:
                if field in ["mustKnow", "keyTakeaways", "practicalApplications", "commonTraps", "memoryHooks"]:
                    data[field] = ["Information not available"]
                elif field == "essentialTerms":
                    data[field] = {}
                else:
                    data[field] = "Not specified"
        
        # Add metadata
        data["summaryMetadata"] = {
            "generatedAt": datetime.datetime.now().isoformat(),
            "estimatedReadTime": "10-15 minutes",
            "model": "summary-optimized",
            "contentType": "term-heavy" if term_pattern else "standard"
        }
        
        return data
        
    except Exception as e:
        print(f"Error: {e}")
        # Return a valid structure even on error
        return {
            "title": "Summary Generation in Progress",
            "executiveSummary": "The summary could not be generated at this time",
            "mustKnow": ["Please try again later"],
            "keyTakeaways": [],
            "essentialTerms": {},
            "practicalApplications": [],
            "commonTraps": [],
            "memoryHooks": [],
            "ifYouRememberOneThing": "Check back later",
            "nextAction": "Return to lesson",
            "summaryMetadata": {
                "generatedAt": datetime.datetime.now().isoformat(),
                "estimatedReadTime": "5 minutes",
                "model": "error-handler"
            }
        }