:: Start Backend (activates venv first)
start "LLM Council Backend" /D "backend" pwsh -ExecutionPolicy Bypass -NoExit -Command ". .venv\Scripts\Activate.ps1; uv run python -m main"

:: Start Frontend
start "LLM Council Frontend" /D "frontend" pwsh -NoExit -Command "npm run dev"

:: Open Browser
start http://localhost:5173

