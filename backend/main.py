"""Papyr FastAPI Backend."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import papers, code

app = FastAPI(title="Papyr API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(papers.router)
app.include_router(code.router)


@app.get("/")
async def root():
    return {"message": "Papyr API", "version": "1.0.0"}


@app.get("/api/health")
async def health():
    return {"status": "ok"}
