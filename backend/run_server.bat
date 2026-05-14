@echo off
echo Starting Solar Sales Trainer Backend...
pip install -r requirements.txt
python -m uvicorn main:app --reload
pause
