import re

def parse_questions(raw_questions: str):
    questions = []
    current = {}
    
    
    for line in raw_questions.strip().split("\n"):
        if re.match(r"^\d+\.\s", line):
            if current:
                questions.append(current)
            current = {
                "question" : line.strip(),
                "options" : [],
                "answer" : None,
            }
        elif re.match(r"^\s*[A-D]\.\s", line):
            current["options"].append(line.strip())
        elif line.startswith("Answer:"):
            current["answer"] = line.split("Answer: ")[-1].strip()
    
    if current:
        questions.append(current)
    
    print(questions)
    return questions