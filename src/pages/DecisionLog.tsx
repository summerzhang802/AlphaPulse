import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import { decisionLogData } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getActionBadge = (action: string) => {
  switch (action) {
    case "Buy": return "bg-bullish/10 text-bullish";
    case "Sell": return "bg-bearish/10 text-bearish";
    case "Hold": return "bg-primary/10 text-primary";
    case "Set Alert": return "bg-neutral/10 text-neutral";
    default: return "bg-muted text-muted-foreground";
  }
};

const DecisionLog = () => {
  const [entries, setEntries] = useState(decisionLogData);
  const [showForm, setShowForm] = useState(false);
  const [newTicker, setNewTicker] = useState("");
  const [newAction, setNewAction] = useState("Buy");
  const [newReason, setNewReason] = useState("");

  const addEntry = () => {
    if (!newTicker || !newReason) return;
    setEntries([
      {
        id: entries.length + 1,
        ticker: newTicker.toUpperCase(),
        action: newAction as any,
        reason: newReason,
        date: new Date().toISOString().slice(0, 10),
      },
      ...entries,
    ]);
    setNewTicker("");
    setNewReason("");
    setShowForm(false);
  };

  return (
    <div className="container py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Decision Log</h1>
          <p className="text-sm text-muted-foreground mt-1">Record and review your investment decisions</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Add Entry
        </Button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-border bg-card p-5 mb-6 animate-fade-in space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Ticker</label>
              <Input value={newTicker} onChange={(e) => setNewTicker(e.target.value)} placeholder="AAPL" className="font-mono" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Action</label>
              <Select value={newAction} onValueChange={setNewAction}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buy">Buy</SelectItem>
                  <SelectItem value="Sell">Sell</SelectItem>
                  <SelectItem value="Hold">Hold</SelectItem>
                  <SelectItem value="Set Alert">Set Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Reason</label>
            <Input value={newReason} onChange={(e) => setNewReason(e.target.value)} placeholder="Why are you making this decision?" />
          </div>
          <Button onClick={addEntry} size="sm">Save Entry</Button>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 animate-fade-in">
            <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">{entry.date}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-semibold text-foreground">{entry.ticker}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${getActionBadge(entry.action)}`}>
                  {entry.action}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{entry.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecisionLog;
