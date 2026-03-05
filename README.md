# Papyr 📝

A premium, minimalist implementation platform for cutting-edge ML research papers. Designed with a clean, typography-first aesthetic inspired by Acctual.com.

Papyr bridges the gap between reading a research paper and actually implementing it. By breaking down complex machine learning architectures into actionable, unit-testable micro-tasks, Papyr provides a hands-on, interactive learning environment.

## ✨ Features

- **Interactive Split-Pane Workspace**: A bespoke Monaco editor environment configured for seamless Python development.
- **Automated ArXiv Ingestion Pipeline**: 
  - Paste any ArXiv link or paper name directly into the frontend UI and click "Ingest Paper".
  - The backend connects to the ArXiv API for metadata, then uses **OpenAI GPT-4o-mini** to synthesize 3-5 tiered implementation micro-tasks.
  - Intrinsically generates PyTest validation functions, saving everything to the SQLite DB.
- **Agentic AI Tutor**: A context-aware coding assistant embedded directly in the workspace. When stuck, click the floating "Ask AI" button — the tutor reads your current code, compares it to the hidden solution, and provides targeted hints without spoiling the answer.
- **Real-time PyTest Validation**: Secure, sandboxed subprocess evaluation of user code against hidden unit tests.
- **Resume-Ready UI/UX**: A highly-polished, pure-white minimalist design system heavily utilizing modern typography and Framer Motion micro-interactions.
- **Robust SQL backend**: FastAPI powered by a lightweight, persistent SQLite database using SQLModel and SQLAlchemy.

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React 18, Tailwind CSS, Monaco Editor, Framer Motion
- **Backend**: Python 3, FastAPI, SQLModel, PyTest, OpenAI API, ArXiv API
- **Infrastructure**: Docker, Docker Compose, SQLite

## 🚀 Quick Start (Docker)

The absolute easiest way to run the entire Papyr stack is via Docker Compose.

```bash
# Clone the repository
git clone https://github.com/yourusername/papyr.git
cd papyr

# Set up your environment variables
cp backend/.env.example backend/.env
# Add your OPENAI_API_KEY to backend/.env

# Build and start the containers
docker compose up -d --build
```

The frontend will be available at `http://localhost:3000` and the backend strictly at `http://localhost:8000`.

## 💻 Local Development

If you prefer to run the applications natively without Docker:

### Backend
```bash
cd backend

# Create and activate a virtual environment (macOS/Linux)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
export DATABASE_URL="sqlite:///./papyr.db"
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the Next.js development server
npm run dev
```

## 🧠 Supported Papers (Seed Data)
The platform comes pre-seeded with legendary architectural papers ready for implementation:
- *LoRA: Low-Rank Adaptation of Large Language Models*
- *ImageNet Classification with Deep Convolutional Neural Networks* (AlexNet)
- *Efficient Estimation of Word Representations in Vector Space* (word2vec)
- *Auto-Encoding Variational Bayes* (VAE)
...and supports dynamic ingestion of any active ArXiv preprint using the Python pipeline.