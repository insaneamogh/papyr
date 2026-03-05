# Papyr 📝

A premium, minimalist implementation platform for cutting-edge ML research papers. Designed with a clean, typography-first aesthetic inspired by Acctual.com.

Papyr bridges the gap between reading a research paper and actually implementing it. By breaking down complex machine learning architectures into actionable, unit-testable micro-tasks, Papyr provides a hands-on, interactive learning environment.

## ✨ Features

- **Interactive Split-Pane Workspace**: A bespoke Monaco editor environment configured for seamless Python development.
- **Automated ArXiv Ingestion**: Fetches the latest ML papers via the ArXiv API and utilizes OpenAI's LLMs to dynamically synthesize coding tasks and PyTest cases.
- **Real-time PyTest Validation**: Secure, sandboxed subprocess evaluation of user code against hidden unit tests.
- **Resume-Ready UI/UX**: A highly-polished, pure-white glassmorphic design system heavily utilizing modern typography and Framer Motion micro-interactions.
- **Robust SQL backend**: Fast API powered by a lightweight, persistent SQLite database using SQLModel and SQLAlchemy.

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
- *Attention Is All You Need* (Transformers)
- *LoRA: Low-Rank Adaptation of Large Language Models*
- *ImageNet Classification with Deep Convolutional Neural Networks* (AlexNet)
- *Efficient Estimation of Word Representations in Vector Space* (word2vec)
...and supports dynamic ingestion of any active ArXiv preprint.