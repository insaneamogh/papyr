import os
import sys
import argparse
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from openai import OpenAI
import json
import re

# Add backend to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session
from models.database import engine, create_db_and_tables
from models.schemas import Paper, Task

# We define the strict system prompt for OpenAI
SYSTEM_PROMPT = """
You are a distinguished CS Professor specializing in Machine Learning. 
I will provide you with the Title and Abstract of an ML research paper.
Your job is to break down the paper into 3 implementation "Micro-Tasks" that a student can code in Python to understand the paper.

Return ONLY a raw JSON array of objects with the following schema:
[
  {
    "id": "t1",
    "title": "Short Task Title",
    "description": "Markdown formatted description of the mathematical concept to implement.",
    "difficulty": "Easy" | "Medium" | "Hard",
    "type": "Micro",
    "boilerplate_code": "def function_name(x):\n    # TODO: implement\n    pass",
    "test_code": "def test_function_name():\n    assert function_name(2) == 4",
    "solution_code": "def function_name(x):\n    return x * 2",
    "time_limit": 5
  }
]

Make sure the pytest `test_code` uses the functions defined in the `boilerplate_code` and assumes they are imported from `submission` (e.g., `submission.function_name`). DO NOT wrap the json in markdown blocks like ```json. Return precisely the JSON array and nothing else.
"""

def fetch_arxiv_papers(query: str, max_results: int = 1):
    """Fetch papers from ArXiv API. Supports both search queries and ArXiv URLs/IDs."""
    
    # Check if the query is an ArXiv URL or ID
    arxiv_id = None
    # Match URLs like https://arxiv.org/abs/1706.03762 or arxiv.org/abs/1706.03762v3
    url_match = re.search(r'arxiv\.org/(?:abs|pdf)/([\d.]+(?:v\d+)?)', query)
    if url_match:
        arxiv_id = url_match.group(1)
    # Match bare ArXiv IDs like 1706.03762 or 2005.14165
    elif re.match(r'^\d{4}\.\d{4,5}(v\d+)?$', query.strip()):
        arxiv_id = query.strip()
    
    if arxiv_id:
        url = f"http://export.arxiv.org/api/query?id_list={arxiv_id}"
    else:
        url = f"http://export.arxiv.org/api/query?search_query=all:{urllib.parse.quote(query)}&start=0&max_results={max_results}"
    
    print(f"Fetching from ArXiv: {url}")
    
    with urllib.request.urlopen(url) as response:
        data = response.read().decode('utf-8')
        root = ET.fromstring(data)
        
    papers = []
    for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
        title = entry.find('{http://www.w3.org/2005/Atom}title').text.replace('\n', ' ')
        summary = entry.find('{http://www.w3.org/2005/Atom}summary').text.replace('\n', ' ')
        authors = [a.find('{http://www.w3.org/2005/Atom}name').text for a in entry.findall('{http://www.w3.org/2005/Atom}author')]
        paper_id = entry.find('{http://www.w3.org/2005/Atom}id').text
        url = entry.find('{http://www.w3.org/2005/Atom}link[@type="text/html"]').attrib.get('href', paper_id) if entry.find('{http://www.w3.org/2005/Atom}link[@type="text/html"]') else paper_id
        
        # Extract a slug from the id (e.g. http://arxiv.org/abs/1706.03762 -> 1706.03762)
        slug = paper_id.split('/')[-1]
        
        papers.append({
            "slug": slug,
            "title": title.strip(),
            "authors": ", ".join(authors),
            "summary": summary.strip(),
            "url": url
        })
    return papers

def generate_tasks_with_llm(client: OpenAI, title: str, summary: str):
    """Use OpenAI to generate Micro-Tasks."""
    prompt = f"Paper Title: {title}\nAbstract: {summary}"
    
    print(f"Generating tasks using OpenAI for: {title}...")
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )
    
    raw_content = response.choices[0].message.content.strip()
    # Strip markdown if LLM accidentally includes it
    if raw_content.startswith("```json"):
        raw_content = raw_content[7:-3]
    elif raw_content.startswith("```"):
        raw_content = raw_content[3:-3]
        
    try:
        tasks = json.loads(raw_content, strict=False)
        return tasks
    except json.JSONDecodeError as e:
        print(f"Failed to parse LLM response. Raw output:\n{raw_content}")
        raise e

def main():
    parser = argparse.ArgumentParser(description="Ingest ArXiv papers and generate micro-tasks.")
    parser.add_argument("query", type=str, help="ArXiv search query (e.g. 'attention is all you need')")
    parser.add_argument("--tags", type=str, default="AI, ML", help="Comma separated tags for the paper")
    args = parser.parse_args()

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable is missing.")
        print("Please export it or add it to backend/.env")
        sys.exit(1)

    client = OpenAI(api_key=api_key)
    
    # Ensure DB exists
    create_db_and_tables()

    # 1. Fetch
    import urllib.parse as _up  # already imported at top level for script
    papers = fetch_arxiv_papers(args.query, max_results=1)
    if not papers:
        print("No papers found on ArXiv for this query.")
        return
        
    paper_data = papers[0]
    
    with Session(engine) as session:
        # Check if already in DB
        existing = session.query(Paper).filter(Paper.slug == paper_data["slug"]).first()
        if existing:
            print(f"Paper '{paper_data['title']}' already exists in DB. Skipping.")
            return

        # 2. Generate Tasks
        tasks_data = generate_tasks_with_llm(client, paper_data["title"], paper_data["summary"])
        
        # 3. Save to DB
        paper = Paper(
            slug=paper_data["slug"],
            title=paper_data["title"][:200], # truncate if too long
            year=2024, # ArXiv atom feed doesn't easily expose pub year without extensive parsing, stubbing for now
            authors=paper_data["authors"][:200],
            tags=args.tags,
            description=paper_data["summary"],
            original_url=paper_data["url"]
        )
        
        for t_data in tasks_data:
            task = Task(
                task_identifier=t_data.get("id", "t1"),
                title=t_data.get("title", "Task"),
                description=t_data.get("description", ""),
                difficulty=t_data.get("difficulty", "Medium"),
                type=t_data.get("type", "Micro"),
                boilerplate_code=t_data.get("boilerplate_code", ""),
                test_code=t_data.get("test_code", ""),
                solution_code=t_data.get("solution_code", ""),
                time_limit=t_data.get("time_limit", 5)
            )
            paper.tasks.append(task)
            
        session.add(paper)
        session.commit()
        print(f"✅ Successfully ingested '{paper.title}' with {len(tasks_data)} tasks into SQLite!")

if __name__ == "__main__":
    main()
