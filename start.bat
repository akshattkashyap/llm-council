:: Start Backend (activates venv first)
start "LLM Council Backend" /D "backend" cmd /k "call .venv\Scripts\activate && uv run python -m main"

:: Start Frontend
start "LLM Council Frontend" /D "frontend" cmd /c "npm run dev"

:: Open Browser
start http://localhost:5173

