from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewsRequest(BaseModel):
    ticker: str | None = None
    news: str

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.post("/analyze_news")
def analyze_news(request: NewsRequest):
    return {
        "ticker": request.ticker,
        "summary": "This is a beginner-friendly summary of the news.",
        "why_it_matters": "This news may affect investor sentiment and short-term expectations.",
        "impact": "Neutral",
        "impact_level": "Medium",
        "confidence": "Medium",
        "suggested_next_step": "Monitor"
    }