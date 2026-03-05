"""Code execution router."""
import subprocess
import sys
import time
import tempfile
import os
from fastapi import APIRouter, HTTPException
from models.schemas import CodeRunRequest, CodeRunResponse, CodeSubmitRequest, TestResult
from data.seed_papers import PAPERS

router = APIRouter(prefix="/api/code", tags=["code"])


@router.post("/run", response_model=CodeRunResponse)
async def run_code(request: CodeRunRequest):
    """Execute Python code and return output."""
    with tempfile.TemporaryDirectory() as tmpdir:
        code_file = os.path.join(tmpdir, "user_code.py")
        with open(code_file, "w") as f:
            f.write(request.code)

        start = time.time()
        try:
            result = subprocess.run(
                [sys.executable, code_file],
                capture_output=True,
                text=True,
                timeout=request.timeout,
                cwd=tmpdir,
            )
            elapsed = time.time() - start
            return CodeRunResponse(
                stdout=result.stdout[:5000],
                stderr=result.stderr[:5000],
                success=result.returncode == 0,
                execution_time=round(elapsed, 3),
            )
        except subprocess.TimeoutExpired:
            return CodeRunResponse(
                stdout="",
                stderr=f"Execution timed out after {request.timeout}s",
                success=False,
                execution_time=float(request.timeout),
            )
        except Exception as e:
            return CodeRunResponse(
                stdout="",
                stderr=str(e),
                success=False,
                execution_time=time.time() - start,
            )


@router.post("/submit", response_model=TestResult)
async def submit_code(request: CodeSubmitRequest):
    """Run code against unit tests and return results."""
    # Find the paper and task
    paper = next((p for p in PAPERS if p["slug"] == request.paper_slug), None)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    task = next((t for t in paper.get("tasks", []) if t["id"] == request.task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    with tempfile.TemporaryDirectory() as tmpdir:
        # Write user code as submission module
        sub_file = os.path.join(tmpdir, "submission.py")
        with open(sub_file, "w") as f:
            f.write(request.code)

        # Write test file
        test_file = os.path.join(tmpdir, "test_submission.py")
        test_code = f"import submission\n\n{task['test_code']}"
        with open(test_file, "w") as f:
            f.write(test_code)

        try:
            result = subprocess.run(
                [sys.executable, "-m", "pytest", test_file, "-v", "--tb=short"],
                capture_output=True,
                text=True,
                timeout=request.timeout,
                cwd=tmpdir,
            )
            output = result.stdout + result.stderr

            # Parse results
            passed = output.count(" PASSED")
            failed = output.count(" FAILED")
            errors = output.count(" ERROR")
            total = passed + failed + errors
            if total == 0:
                total = 1
                failed = 1

            return TestResult(
                passed=passed,
                failed=failed + errors,
                total=total,
                percentage=round((passed / total) * 100, 1) if total > 0 else 0,
                output=output[:8000],
                success=failed == 0 and errors == 0,
            )
        except subprocess.TimeoutExpired:
            return TestResult(
                passed=0, failed=1, total=1, percentage=0,
                output=f"Tests timed out after {request.timeout}s",
                success=False,
            )
        except Exception as e:
            return TestResult(
                passed=0, failed=1, total=1, percentage=0,
                output=str(e),
                success=False,
            )
