"""Papers API router."""
from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List
from sqlmodel import Session, select
from models.database import get_session
from models.schemas import Paper, Task, PaperRead, PaperReadWithTasks, ImportRequest, ImportResponse
import openai
import os
from scripts.fetch_arxiv import fetch_arxiv_papers, generate_tasks_with_llm

router = APIRouter(prefix="/api/papers", tags=["papers"])


@router.get("", response_model=List[dict])
async def list_papers(
    search: Optional[str] = Query(None, description="Search query"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    session: Session = Depends(get_session)
):
    """List all papers with optional search and tag filtering from Database."""
    query = select(Paper)
    
    # We fetch all first to do complex text filtering (since sqlite lacks array fields)
    papers = session.exec(query).all()
    
    results = papers

    if search:
        q = search.lower()
        results = [
            p for p in results
            if q in p.title.lower()
            or q in p.description.lower()
            or q in p.authors.lower()
            or any(q in t.lower() for t in p.tags.split(","))
        ]

    if tag:
        t = tag.lower()
        results = [
            p for p in results
            if any(t == tg.lower() for tg in p.tags.split(","))
        ]

    # Return papers without full task details for listing
    return [
        {
            "slug": p.slug,
            "title": p.title,
            "year": p.year,
            "authors": p.authors,
            "tags": p.tags.split(","),
            "description": p.description,
            "task_count": len(p.tasks),
        }
        for p in results
    ]


@router.get("/{slug}")
async def get_paper(slug: str, session: Session = Depends(get_session)):
    """Get paper detail with task summaries from Database."""
    query = select(Paper).where(Paper.slug == slug)
    paper = session.exec(query).first()
    
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    return {
        "slug": paper.slug,
        "title": paper.title,
        "year": paper.year,
        "authors": paper.authors,
        "tags": paper.tags.split(","),
        "description": paper.description,
        "original_url": paper.original_url or "",
        "tasks": [
            {
                "id": t.task_identifier,
                "title": t.title,
                "description": t.description[:100] + "..." if len(t.description) > 100 else t.description,
                "difficulty": t.difficulty,
                "type": t.type,
            }
            for t in paper.tasks
        ],
    }


@router.get("/{slug}/tasks/{task_id}")
async def get_task(slug: str, task_id: str, session: Session = Depends(get_session)):
    """Get full task detail including boilerplate code from Database."""
    query = select(Paper).where(Paper.slug == slug)
    paper = session.exec(query).first()
    
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    task = next((t for t in paper.tasks if t.task_identifier == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return {
        "id": task.task_identifier,
        "title": task.title,
        "description": task.description,
        "difficulty": task.difficulty,
        "type": task.type,
        "boilerplate_code": task.boilerplate_code,
        "time_limit": task.time_limit,
        "paper_title": paper.title,
        "paper_slug": paper.slug,
    }

@router.post("/import", response_model=ImportResponse)
async def import_arxiv_paper(request: ImportRequest, session: Session = Depends(get_session)):
    """Fetch an ArXiv paper, generate tasks, and save to DB."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured on server.")

    # Fetch paper metadata
    papers = fetch_arxiv_papers(request.query, max_results=1)
    if not papers:
        raise HTTPException(status_code=404, detail="No papers found on ArXiv for this query/URL.")
        
    paper_data = papers[0]
    
    # Check if already present
    existing = session.exec(select(Paper).where(Paper.slug == paper_data["slug"])).first()
    if existing:
        return ImportResponse(
            success=True, 
            slug=existing.slug, 
            paper_title=existing.title, 
            task_count=len(existing.tasks),
            message="Paper already exists."
        )

    # Generate Tasks
    client = openai.OpenAI(api_key=api_key)
    try:
        tasks_data = generate_tasks_with_llm(client, paper_data["title"], paper_data["summary"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate tasks using AI: {str(e)}")
        
    # Save to SQLite
    paper = Paper(
        slug=paper_data["slug"],
        title=paper_data["title"][:200],
        year=2024,
        authors=paper_data["authors"][:200],
        tags=request.tags,
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
    
    return ImportResponse(
        success=True,
        slug=paper.slug,
        paper_title=paper.title,
        task_count=len(tasks_data),
        message="Successfully ingested paper and generated tasks!"
    )
