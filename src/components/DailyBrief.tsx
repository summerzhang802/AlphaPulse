import { Zap } from "lucide-react";

interface BriefItem {
  summary: string;
  stock: string;
  signal: "Bullish" | "Bearish" | "Neutral";
}

interface DailyBriefProps {
  items: BriefItem[];
}

const getSignalStyle = (signal: string) => {
  switch (signal) {
    case "Bullish": return "text-bullish bg-bullish/10";
    case "Bearish": return "text-bearish bg-bearish/10";
    default: return "text-neutral bg-neutral/10";
  }
};

const DailyBrief = ({ items }: DailyBriefProps) => {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Daily Brief</h3>
        <span className="text-xs text-muted-foreground">3 things to know today</span>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-sm text-foreground leading-relaxed">{item.summary}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-muted-foreground">{item.stock}</span>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getSignalStyle(item.signal)}`}>
                  {item.signal}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyBrief;
