import { Activity, Newspaper, ShieldAlert } from "lucide-react";

interface WatchlistCardProps {
  ticker: string;
  name: string;
  newsCount: number;
  riskIndex: number;
  action: "Monitor" | "Hold" | "Reduce Risk";
  onClick?: () => void;
}

const getRiskColor = (risk: number) => {
  if (risk <= 33) return "bg-bullish";
  if (risk <= 66) return "bg-neutral";
  return "bg-bearish";
};

const getRiskLabel = (risk: number) => {
  if (risk <= 33) return "Low Risk";
  if (risk <= 66) return "Medium Risk";
  return "High Risk";
};

const getActionStyle = (action: string) => {
  switch (action) {
    case "Hold": return "text-bullish bg-bullish/10";
    case "Monitor": return "text-neutral bg-neutral/10";
    case "Reduce Risk": return "text-bearish bg-bearish/10";
    default: return "text-muted-foreground bg-muted";
  }
};

const WatchlistCard = ({ ticker, name, newsCount, riskIndex, action, onClick }: WatchlistCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group rounded-lg border border-border bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer animate-fade-in"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-mono text-lg font-semibold text-foreground">{ticker}</h3>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${getActionStyle(action)}`}>
          {action}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Newspaper className="h-3.5 w-3.5" />
        <span>{newsCount} articles today</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <ShieldAlert className="h-3 w-3" />
            Risk Index
          </span>
          <span className="font-mono font-medium text-foreground">{riskIndex}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getRiskColor(riskIndex)}`}
            style={{ width: `${riskIndex}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{getRiskLabel(riskIndex)}</p>
      </div>
    </div>
  );
};

export default WatchlistCard;
