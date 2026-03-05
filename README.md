# Papyr - Research Paper Implementation Platform

> Don't just read the paper. Compile it.

Papyr is a platform inspired by PaperCode.in that bridges the gap between machine learning theory and practical reality. It allows users to read research papers, breaks them down into actionable micro-tasks, and provides an in-browser code editor with unit testing to implement state-of-the-art models from scratch.

## Project Structure

This project consists of two main parts:

1. **Frontend (`/frontend`)**: A modern Next.js 14 web application using the App Router, styled with Tailwind CSS, and containing an interactive Monaco-based code editor.
2. **Backend (`/backend`)**: A FastAPI Python server handling the paper catalog, micro-tasks, and a sandboxed environment to execute and test user code against PyTest unit tests.

## Tech Stack

- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion, Monaco Editor (`@monaco-editor/react`)
- **Backend**: FastAPI, Pydantic, Uvicorn, subprocess code execution, Pytest, NumPy

## Getting Started

To run this project locally, you will need to start both the frontend and backend development servers.

### 1. Start the Backend (FastAPI)

Requires Python 3.9+ or higher (tested with 3.14).

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt pytest
uvicorn main:app --reload --port 8000
```
*(Alternatively, you can just run `bash start.sh` inside the `backend/` folder)*

The API will be available at `http://localhost:8000/api/papers`.

### 2. Start the Frontend (Next.js)

Requires Node.js 18+ and `npm`.

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Features

- **Micro-Tasks**: Complex papers are broken down into small, digestible steps (e.g., Implementing Positional Encoding for the Transformer paper).
- **In-Browser Editor**: Write Python and NumPy code directly in the browser via a rich, dark-themed Monaco editor.
- **Unit Tests**: Code is verified rigorously against hidden test cases using pytest on the backend to guarantee correctness.
- **Dynamic Tagging & Search**: Easily filter papers by topic (NLP, CV, Transformer, GAN, etc.).

## Seed Data

The backend currently ships with 10 legendary ML papers, heavily populated with boilerplate codes and PyTest suites including:
- Attention Is All You Need (Transformer)
- LoRA: Low-Rank Adaptation of Large Language Models
- ImageNet Classification (AlexNet)
- Auto-Encoding Variational Bayes (VAE)
- Generative Adversarial Networks (GAN)
- Word2Vec
- BERT
- ResNet
- Batch Normalization
- Recurrent Neural Networks

Enjoy compiling the research!