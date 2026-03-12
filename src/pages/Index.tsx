import { useState, useEffect } from "react";
import WatchlistCard from "@/components/WatchlistCard";
import NewsCard from "@/components/NewsCard";
import DailyBrief from "@/components/DailyBrief";
import NewsSimplifier from "@/components/NewsSimplifier";
import { watchlistData, newsData, dailyBriefData } from "@/data/mockData";
import AIInsight from "@/components/AIInsight";

interface WatchlistItem {
  ticker: string;
  name: string;
  newsCount: number;
  riskIndex: number;
  action: "Monitor" | "Hold" | "Reduce Risk";
}


const Dashboard = () => {
  const [selectedNews, setSelectedNews] = useState<typeof newsData[0] | null>(null);
  const [watchlistData, setWatchlistData] = useState<WatchlistItem[]>([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL;

    useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch(`${API_BASE}/watchlist`);;
        const data = await response.json();
        setWatchlistData(data);
      } catch (error) {
        console.error("Failed to fetch watchlist:", error);
      } finally {
        setLoadingWatchlist(false);
      }
    };

    fetchWatchlist();
  }, []);

  return (
    <div className="container py-6 space-y-8">
      {/* Daily Brief */}
      <DailyBrief items={dailyBriefData} />

      {/* AI News Insight */}
      <AIInsight />
      
      {/* Watchlist */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Watchlist</h2>
          <span className="text-sm text-muted-foreground">
            {loadingWatchlist ? "Loading..." : `${watchlistData.length} stocks`}
          </span>
        </div>

        {loadingWatchlist ? (
          <p className="text-sm text-muted-foreground">Loading watchlist...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlistData.map((stock) => (
              <WatchlistCard key={stock.ticker} {...stock} />
            ))}
          </div>
        )}
      </section>

      {/* Today's Key News */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">Today's Key News</h2>
        <div className="space-y-3">
          {newsData.map((news) => (
            <NewsCard
              key={news.id}
              headline={news.headline}
              ticker={news.ticker}
              source={news.source}
              time={news.time}
              impact={news.impact}
              onClick={() => setSelectedNews(news)}
            />
          ))}
        </div>
      </section>

      {selectedNews && (
        <NewsSimplifier news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </div>
  );
};

export default Dashboard;
