import { Clock, ExternalLink } from "lucide-react";

interface NewsCardProps {
  headline: string;
  ticker: string;
  source: string;
  time: string;
  impact: "Bullish" | "Bearish" | "Neutral";
  onClick?: () => void;
}

const getImpactDot = (impact: string) => {
  switch (impact) {
    case "Bullish": return "bg-bullish";
    case "Bearish": return "bg-bearish";
    default: return "bg-neutral";
  }
};

const NewsCard = ({ headline, ticker, source, time, impact, onClick }: NewsCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer animate-fade-in"
    >
      <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${getImpactDot(impact)}`} />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors">
          {headline}
        </h4>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-mono font-medium text-foreground/70">{ticker}</span>
          <span>{source}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {time}
          </span>
        </div>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
    </div>
  );
};

export default NewsCard;
