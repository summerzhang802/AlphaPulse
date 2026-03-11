import { useEffect, useState } from "react";
import { Plus, Calendar, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DecisionEntry {
  id: number;
  ticker: string;
  action: string;
  reason: string;
  date: string;
}

const getActionBadge = (action: string) => {
  switch (action) {
    case "Buy":
      return "bg-bullish/10 text-bullish";
    case "Sell":
      return "bg-bearish/10 text-bearish";
    case "Hold":
      return "bg-primary/10 text-primary";
    case "Set Alert":
      return "bg-neutral/10 text-neutral";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const DecisionLog = () => {
  const [entries, setEntries] = useState<DecisionEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTicker, setNewTicker] = useState("");
  const [newAction, setNewAction] = useState("Buy");
  const [newReason, setNewReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch("http://localhost:8000/decisions");
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error("Failed to fetch decision logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async () => {
    if (!newTicker || !newReason) return;

    try {
      const response = await fetch("http://localhost:8000/decisions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker: newTicker,
          action: newAction,
          reason: newReason,
        }),
      });

      const savedEntry = await response.json();

      setEntries((prev) => [savedEntry, ...prev]);
      setNewTicker("");
      setNewReason("");
      setNewAction("Buy");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save entry:", error);
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/decisions/${id}`, {
        method: "DELETE",
      });

      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  return (
    <div className="container py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Decision Log</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Record and review your investment decisions
          </p>
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
              <Input
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                placeholder="AAPL"
                className="font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Action</label>
              <Select value={newAction} onValueChange={setNewAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
            <Input
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="Why are you making this decision?"
            />
          </div>

          <Button onClick={addEntry} size="sm">
            Save Entry
          </Button>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading decision log...</p>
      ) : (
        <div className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-muted-foreground">No decision entries yet.</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 animate-fade-in"
              >
                <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-mono">
                    {entry.date}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-semibold text-foreground">
                      {entry.ticker}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-md ${getActionBadge(
                        entry.action
                      )}`}
                    >
                      {entry.action}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.reason}</p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEntry(entry.id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DecisionLog;