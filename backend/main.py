from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import init_db, get_connection
from datetime import datetime

from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()


class NewsRequest(BaseModel):
    ticker: str | None = None
    news: str

class DecisionLogRequest(BaseModel):
    ticker: str
    action: str
    reason: str

class NewsAIRequest(BaseModel):
    ticker: str
    headline: str
    
# @app.get("/")
# def root():
#     return {"message": "Backend is running"}




@app.get("/watchlist")
def get_watchlist():
    return [
        {"ticker": "AAPL", "name": "Apple Inc.", "newsCount": 5, "riskIndex": 28, "action": "Monitor"},
        {"ticker": "TSLA", "name": "Tesla Inc.", "newsCount": 8, "riskIndex": 72, "action": "Reduce Risk"},
        {"ticker": "MSFT", "name": "Microsoft Corp.", "newsCount": 3, "riskIndex": 15, "action": "Hold"},
        {"ticker": "AMZN", "name": "Amazon.com Inc.", "newsCount": 4, "riskIndex": 45, "action": "Monitor"},
        {"ticker": "GOOGL", "name": "Alphabet Inc.", "newsCount": 2, "riskIndex": 22, "action": "Hold"},
        {"ticker": "NVDA", "name": "NVIDIA Corp.", "newsCount": 6, "riskIndex": 58, "action": "Monitor"},
    ]


# @app.post("/analyze_news")
# def analyze_news(request: NewsRequest):
#     return {
#         "ticker": request.ticker,
#         "summary": "This is a beginner-friendly summary of the news.",
#         "why_it_matters": "This news may affect investor sentiment and short-term expectations.",
#         "impact": "Neutral",
#         "impact_level": "Medium",
#         "confidence": "Medium",
#         "suggested_next_step": "Monitor"
#     }






@app.get("/decisions")
def get_decision_logs():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM decision_logs ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


@app.post("/decisions")
def create_decision_log(entry: DecisionLogRequest):
    conn = get_connection()
    cursor = conn.cursor()

    date_str = datetime.now().strftime("%Y-%m-%d")

    cursor.execute(
        """
        INSERT INTO decision_logs (ticker, action, reason, date)
        VALUES (?, ?, ?, ?)
        """,
        (entry.ticker.upper(), entry.action, entry.reason, date_str)
    )

    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return {
        "id": new_id,
        "ticker": entry.ticker.upper(),
        "action": entry.action,
        "reason": entry.reason,
        "date": date_str
    }


@app.delete("/decisions/{entry_id}")
def delete_decision_log(entry_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM decision_logs WHERE id = ?", (entry_id,))
    deleted_count = cursor.rowcount

    conn.commit()
    conn.close()

    if deleted_count == 0:
        return {"message": "Entry not found"}

    return {"message": "Entry deleted successfully", "id": entry_id}


@app.post("/ai_news")
def ai_news(req: NewsAIRequest):
    prompt = f"""
You are helping a beginner investor understand stock news.

Analyze this stock news headline and return ONLY valid JSON.

Ticker: {req.ticker}
Headline: {req.headline}

Return this exact JSON format:
{{
  "summary": "one simple sentence for a beginner",
  "impact": "Bullish"
}}

Rules:
- impact must be exactly one of: Bullish, Bearish, Neutral
- summary must be short and easy to understand
- do not include markdown
- do not include extra text
"""

    chat = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    content = chat.choices[0].message.content

    try:
        parsed = json.loads(content)
        return {
            "summary": parsed.get("summary", "No summary available."),
            "impact": parsed.get("impact", "Neutral")
        }
    except Exception:
        return {
            "summary": content,
            "impact": "Neutral"
        }