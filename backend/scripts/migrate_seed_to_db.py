import os
import sys

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session
from models.database import engine, create_db_and_tables
from models.schemas import Paper, Task
import importlib.util

spec = importlib.util.spec_from_file_location("seed_papers", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "seed_papers.py"))
seed_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(seed_module)
seed_papers = seed_module.PAPERS

def migrate():
    print("Creating tables...")
    create_db_and_tables()
    
    with Session(engine) as session:
        # Check if already seeded
        existing = session.query(Paper).first()
        if existing:
            print("Database already contains Data. Skipping migration.")
            return

        print("Migrating dictionary seed data into SQLite Database...")
        for paper_data in seed_papers:
            # Join tags list into comma-separated string for DB
            tags_str = ",".join(paper_data["tags"])
            
            # Create Paper object
            paper = Paper(
                slug=paper_data["slug"],
                title=paper_data["title"],
                year=paper_data["year"],
                authors=paper_data["authors"],
                tags=tags_str,
                description=paper_data["description"],
                original_url=paper_data.get("original_url")
            )
            
            # Create Task objects
            for task_data in paper_data.get("tasks", []):
                task = Task(
                    task_identifier=task_data["id"],
                    title=task_data["title"],
                    description=task_data["description"],
                    difficulty=task_data["difficulty"],
                    type=task_data["type"],
                    boilerplate_code=task_data["boilerplate_code"],
                    test_code=task_data["test_code"],
                    solution_code=task_data["solution_code"],
                    time_limit=task_data.get("time_limit", 5)
                )
                paper.tasks.append(task)
            
            session.add(paper)
        
        session.commit()
        print("Migration complete! You can now delete the hardcoded seed dictionary.")

if __name__ == "__main__":
    migrate()
