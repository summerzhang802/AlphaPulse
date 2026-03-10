import { useState } from "react";
import WatchlistCard from "@/components/WatchlistCard";
import NewsCard from "@/components/NewsCard";
import DailyBrief from "@/components/DailyBrief";
import NewsSimplifier from "@/components/NewsSimplifier";
import { watchlistData, newsData, dailyBriefData } from "@/data/mockData";

const Dashboard = () => {
  const [selectedNews, setSelectedNews] = useState<typeof newsData[0] | null>(null);

  return (
    <div className="container py-6 space-y-8">
      {/* Daily Brief */}
      <DailyBrief items={dailyBriefData} />

      {/* Watchlist */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Watchlist</h2>
          <span className="text-sm text-muted-foreground">{watchlistData.length} stocks</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlistData.map((stock) => (
            <WatchlistCard key={stock.ticker} {...stock} />
          ))}
        </div>
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
