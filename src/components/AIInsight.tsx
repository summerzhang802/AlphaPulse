import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AIResult {
  summary: string;
  impact: "Bullish" | "Bearish" | "Neutral";
}

const getImpactStyle = (impact: string) => {
  switch (impact) {
    case "Bullish":
      return "bg-bullish/10 text-bullish";
    case "Bearish":
      return "bg-bearish/10 text-bearish";
    default:
      return "bg-neutral/10 text-neutral";
  }
};

const AIInsight = () => {
  const [ticker, setTicker] = useState("");
  const [headline, setHeadline] = useState("");
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeNews = async () => {
    if (!ticker || !headline) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/ai_news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ticker,
          headline
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Failed to analyze news:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-lg border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">AI News Insight</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter a ticker and a stock news headline for a quick AI explanation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Ticker</label>
          <Input
            placeholder="AAPL"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="font-mono"
          />
        </div>

        <div className="md:col-span-3 space-y-2">
          <label className="text-sm font-medium text-foreground">News Headline</label>
          <Input
            placeholder="Apple beats earnings expectations due to strong iPhone sales"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={analyzeNews} disabled={loading || !ticker || !headline}>
        {loading ? "Analyzing..." : "Analyze with AI"}
      </Button>

      {result && (
        <div className="rounded-md border border-border bg-muted/30 p-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Summary</p>
            <p className="text-sm text-muted-foreground">{result.summary}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Impact:</span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-md ${getImpactStyle(
                result.impact
              )}`}
            >
              {result.impact}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Educational insight only. Not financial advice.
          </p>
        </div>
      )}
    </section>
  );
};

export default AIInsight;