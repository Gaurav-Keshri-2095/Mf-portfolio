# MF portfolio

## Run

Backend:

```bash
uvicorn main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

If the API is hosted somewhere else, set `VITE_API_URL` in `frontend/.env` before running the frontend.