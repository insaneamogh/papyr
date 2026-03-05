"""Papers API router."""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from models.schemas import Paper
from data.seed_papers import PAPERS

router = APIRouter(prefix="/api/papers", tags=["papers"])


def _match_paper(paper_data: dict) -> Paper:
    return Paper(**paper_data)


@router.get("", response_model=list[dict])
async def list_papers(
    search: Optional[str] = Query(None, description="Search query"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
):
    """List all papers with optional search and tag filtering."""
    results = PAPERS

    if search:
        q = search.lower()
        results = [
            p for p in results
            if q in p["title"].lower()
            or q in p["description"].lower()
            or q in p["authors"].lower()
            or any(q in t.lower() for t in p["tags"])
        ]

    if tag:
        t = tag.lower()
        results = [
            p for p in results
            if any(t == tg.lower() for tg in p["tags"])
        ]

    # Return papers without full task details for listing
    return [
        {
            "slug": p["slug"],
            "title": p["title"],
            "year": p["year"],
            "authors": p["authors"],
            "tags": p["tags"],
            "description": p["description"],
            "task_count": len(p.get("tasks", [])),
        }
        for p in results
    ]


@router.get("/{slug}")
async def get_paper(slug: str):
    """Get paper detail with task summaries."""
    paper = next((p for p in PAPERS if p["slug"] == slug), None)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    return {
        "slug": paper["slug"],
        "title": paper["title"],
        "year": paper["year"],
        "authors": paper["authors"],
        "tags": paper["tags"],
        "description": paper["description"],
        "original_url": paper.get("original_url", ""),
        "tasks": [
            {
                "id": t["id"],
                "title": t["title"],
                "description": t["description"][:100] + "..." if len(t["description"]) > 100 else t["description"],
                "difficulty": t["difficulty"],
                "type": t["type"],
            }
            for t in paper.get("tasks", [])
        ],
    }


@router.get("/{slug}/tasks/{task_id}")
async def get_task(slug: str, task_id: str):
    """Get full task detail including boilerplate code."""
    paper = next((p for p in PAPERS if p["slug"] == slug), None)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    task = next((t for t in paper.get("tasks", []) if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return {
        "id": task["id"],
        "title": task["title"],
        "description": task["description"],
        "difficulty": task["difficulty"],
        "type": task["type"],
        "boilerplate_code": task["boilerplate_code"],
        "time_limit": task["time_limit"],
        "paper_title": paper["title"],
        "paper_slug": paper["slug"],
    }
