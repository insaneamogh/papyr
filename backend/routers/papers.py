"""Papers API router."""
from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List
from sqlmodel import Session, select
from models.database import get_session
from models.schemas import Paper, Task, PaperRead, PaperReadWithTasks

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
