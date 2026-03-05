from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship

# --- DATABASE MODELS ---

class TaskBase(SQLModel):
    title: str
    description: str
    difficulty: str  # "Easy", "Medium", "Hard"
    type: str  # "Micro", "Model"
    boilerplate_code: str
    test_code: str
    solution_code: str
    time_limit: int = 5  # seconds
    
class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    task_identifier: str = Field(index=True) # e.g. "01", "02"
    paper_id: Optional[int] = Field(default=None, foreign_key="paper.id")
    paper: Optional["Paper"] = Relationship(back_populates="tasks")

class PaperBase(SQLModel):
    slug: str = Field(index=True, unique=True)
    title: str
    year: int
    authors: str
    tags: str # comma separated string
    description: str
    original_url: Optional[str] = None

class Paper(PaperBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tasks: List[Task] = Relationship(back_populates="paper")

# --- API SCHEMAS ---

class TaskRead(TaskBase):
    id: int
    task_identifier: str
    
class PaperRead(PaperBase):
    id: int
    tags_list: List[str] # parsed tags
    
class PaperReadWithTasks(PaperRead):
    tasks: List[TaskRead] = []

class CodeRunRequest(SQLModel):
    code: str
    timeout: int = 5

class CodeRunResponse(SQLModel):
    stdout: str
    stderr: str
    success: bool
    execution_time: float

class TestResult(SQLModel):
    passed: int
    failed: int
    total: int
    percentage: float
    output: str
    success: bool

class CodeSubmitRequest(SQLModel):
    code: str
    paper_slug: str
    task_id: str
    timeout: int = 10
