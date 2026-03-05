#!/bin/bash
cd /Users/amoghpatil/Desktop/papyr/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt pytest
uvicorn main:app --reload --port 8000
