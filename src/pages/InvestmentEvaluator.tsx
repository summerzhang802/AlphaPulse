import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Allocation {
  name: string;
  value: number;
  color: string;
  reason: string;
}

const baseProfiles: Record<string, Allocation[]> = {
  conservative: [
    { name: "Bonds", value: 50, color: "hsl(217, 80%, 56%)", reason: "Stable income with lower volatility" },
    { name: "Large Cap Stocks", value: 25, color: "hsl(152, 60%, 42%)", reason: "Steady growth from established companies" },
    { name: "Cash / Money Market", value: 15, color: "hsl(38, 80%, 55%)", reason: "Liquidity and capital preservation" },
    { name: "International", value: 10, color: "hsl(270, 50%, 55%)", reason: "Geographic diversification" },
  ],
  balanced: [
    { name: "Large Cap Stocks", value: 35, color: "hsl(152, 60%, 42%)", reason: "Core growth engine" },
    { name: "Bonds", value: 30, color: "hsl(217, 80%, 56%)", reason: "Stability and income" },
    { name: "International", value: 20, color: "hsl(270, 50%, 55%)", reason: "Global diversification" },
    { name: "Small Cap Stocks", value: 15, color: "hsl(38, 80%, 55%)", reason: "Higher growth potential" },
  ],
  aggressive: [
    { name: "Growth Stocks", value: 40, color: "hsl(152, 60%, 42%)", reason: "Maximum capital appreciation" },
    { name: "International", value: 25, color: "hsl(270, 50%, 55%)", reason: "Global diversification and higher upside" },
    { name: "Small Cap Stocks", value: 20, color: "hsl(38, 80%, 55%)", reason: "Higher growth potential with higher risk" },
    { name: "Bonds", value: 15, color: "hsl(217, 80%, 56%)", reason: "Small stability buffer" },
  ],
};

const normalizeTo100 = (items: Allocation[]) => {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return items.map((item, index) => {
    if (index === items.length - 1) {
      const currentTotal = items
        .slice(0, -1)
        .reduce((sum, i) => sum + Math.round((i.value / total) * 100), 0);
      return {
        ...item,
        value: 100 - currentTotal,
      };
    }
    return {
      ...item,
      value: Math.round((item.value / total) * 100),
    };
  });
};

const adjustAllocationByHorizon = (profile: string, horizon: string): Allocation[] => {
  const allocation = baseProfiles[profile].map((item) => ({ ...item }));

  // Short horizon: more conservative
  if (horizon === "1") {
    allocation.forEach((item) => {
      if (item.name.includes("Bonds") || item.name.includes("Cash")) item.value += 5;
      if (item.name.includes("Growth") || item.name.includes("Small Cap")) item.value -= 5;
    });
  }

  // Medium horizon: slight growth tilt
  if (horizon === "5") {
    allocation.forEach((item) => {
      if (item.name.includes("Large Cap") || item.name.includes("Growth")) item.value += 3;
      if (item.name.includes("Cash")) item.value -= 3;
    });
  }

  // Long horizon: more growth-oriented
  if (horizon === "10") {
    allocation.forEach((item) => {
      if (item.name.includes("Growth") || item.name.includes("Small Cap") || item.name.includes("Large Cap")) item.value += 5;
      if (item.name.includes("Bonds") || item.name.includes("Cash")) item.value -= 5;
    });
  }

  return normalizeTo100(allocation);
};

const getPortfolioMessage = (profile: string, horizon: string) => {
  if (profile === "conservative") {
    return "This portfolio prioritizes capital preservation and lower volatility.";
  }
  if (profile === "balanced") {
    return "This portfolio balances growth and stability for beginner investors.";
  }
  if (profile === "aggressive") {
    return "This portfolio targets higher long-term growth with greater short-term risk.";
  }
  return "This portfolio is designed to match your selected preferences.";
};

const InvestmentEvaluator = () => {
  const [amount, setAmount] = useState("1000");
  const [profile, setProfile] = useState("balanced");
  const [horizon, setHorizon] = useState("5");
  const [showResult, setShowResult] = useState(false);

  const investmentAmount = Number(amount) > 0 ? Number(amount) : 1000;

  const allocation = useMemo(() => {
    return adjustAllocationByHorizon(profile, horizon);
  }, [profile, horizon]);

  const handleShowAllocation = () => {
    setShowResult(true);
  };

  return (
    <div className="container py-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          Investment Evaluator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          See how your money could be allocated based on your goals
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Investment Amount ($)</Label>
            <Input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label>Investment Goal</Label>
            <Select value={profile} onValueChange={setProfile}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Time Horizon</Label>
            <Select value={horizon} onValueChange={setHorizon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 year</SelectItem>
                <SelectItem value="3">3 years</SelectItem>
                <SelectItem value="5">5 years</SelectItem>
                <SelectItem value="10">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleShowAllocation} className="w-full sm:w-auto">
          Show Allocation
        </Button>
      </div>

      {showResult && (
        <div className="rounded-lg border border-border bg-card p-6 animate-fade-in space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">
              Suggested Allocation for ${investmentAmount.toLocaleString()} ({profile})
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {getPortfolioMessage(profile, horizon)}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                  >
                    {allocation.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Allocation"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-3 w-full">
              {allocation.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ background: item.color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">
                        {item.name}
                      </span>
                      <span className="text-sm font-mono text-foreground">
                        ${((investmentAmount * item.value) / 100).toFixed(0)} ({item.value}%)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-muted/50 p-4">
            <p className="text-sm text-foreground font-medium mb-1">
              Beginner Guidance
            </p>
            <p className="text-sm text-muted-foreground">
              This is an educational allocation example, not financial advice. A diversified
              portfolio can reduce concentration risk, especially for beginner investors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentEvaluator;