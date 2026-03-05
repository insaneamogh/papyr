# Papyr Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (required for some python packages)
RUN apt-get update && apt-get install -y gcc sqlite3 libsqlite3-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt pytest sqlmodel python-dotenv openai requests

COPY . .

# Initialize the SQLite database by running the migration script (only needed first run, safe to rerun)
RUN python scripts/migrate_seed_to_db.py || true

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
