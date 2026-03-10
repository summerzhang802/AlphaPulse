import { X, TrendingUp, TrendingDown, Minus, Shield, BarChart3, Target } from "lucide-react";

interface NewsDetail {
  headline: string;
  ticker: string;
  summary: string;
  whyItMatters: string;
  impact: "Bullish" | "Bearish" | "Neutral";
  impactLevel: "Low" | "Medium" | "High";
  confidence: "Low" | "Medium" | "High";
  suggestedAction: string;
}

interface NewsSimplifierProps {
  news: NewsDetail;
  onClose: () => void;
}

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case "Bullish": return <TrendingUp className="h-4 w-4 text-bullish" />;
    case "Bearish": return <TrendingDown className="h-4 w-4 text-bearish" />;
    default: return <Minus className="h-4 w-4 text-neutral" />;
  }
};

const getImpactBadge = (impact: string) => {
  switch (impact) {
    case "Bullish": return "bg-bullish/10 text-bullish";
    case "Bearish": return "bg-bearish/10 text-bearish";
    default: return "bg-neutral/10 text-neutral";
  }
};

const getLevelBadge = (level: string) => {
  switch (level) {
    case "High": return "bg-bearish/10 text-bearish";
    case "Medium": return "bg-neutral/10 text-neutral";
    default: return "bg-muted text-muted-foreground";
  }
};

const NewsSimplifier = ({ news, onClose }: NewsSimplifierProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div>
            <span className="text-xs font-mono text-primary font-medium">{news.ticker}</span>
            <h2 className="text-base font-semibold text-foreground mt-1 leading-snug">{news.headline}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">What Happened</h4>
            <p className="text-sm text-foreground leading-relaxed">{news.summary}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Why It Matters</h4>
            <p className="text-sm text-foreground leading-relaxed">{news.whyItMatters}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <div className="flex justify-center mb-1">{getImpactIcon(news.impact)}</div>
              <p className="text-xs text-muted-foreground mb-0.5">Impact</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getImpactBadge(news.impact)}`}>
                {news.impact}
              </span>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <div className="flex justify-center mb-1"><BarChart3 className="h-4 w-4 text-muted-foreground" /></div>
              <p className="text-xs text-muted-foreground mb-0.5">Level</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getLevelBadge(news.impactLevel)}`}>
                {news.impactLevel}
              </span>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <div className="flex justify-center mb-1"><Shield className="h-4 w-4 text-muted-foreground" /></div>
              <p className="text-xs text-muted-foreground mb-0.5">Confidence</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getLevelBadge(news.confidence)}`}>
                {news.confidence}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center gap-3">
            <Target className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Suggested Next Step</p>
              <p className="text-sm font-medium text-foreground">{news.suggestedAction}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSimplifier;
