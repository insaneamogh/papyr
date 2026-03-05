from pydantic import BaseModel
from typing import Optional


class Task(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str  # "Easy", "Medium", "Hard"
    type: str  # "Micro", "Model"
    boilerplate_code: str
    test_code: str
    solution_code: str
    time_limit: int = 5  # seconds


class Paper(BaseModel):
    slug: str
    title: str
    year: int
    authors: str
    tags: list[str]
    description: str
    original_url: Optional[str] = None
    tasks: list[Task] = []


class CodeRunRequest(BaseModel):
    code: str
    timeout: int = 5


class CodeRunResponse(BaseModel):
    stdout: str
    stderr: str
    success: bool
    execution_time: float


class TestResult(BaseModel):
    passed: int
    failed: int
    total: int
    percentage: float
    output: str
    success: bool


class CodeSubmitRequest(BaseModel):
    code: str
    paper_slug: str
    task_id: str
    timeout: int = 10
