import WatchlistCard from "@/components/WatchlistCard";
import { watchlistData } from "@/data/mockData";
import { useEffect, useState } from "react";

// const Watchlist = () => {
//   return (
//     <div className="container py-6">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-foreground">Watchlist</h1>
//         <p className="text-sm text-muted-foreground mt-1">Track your favorite stocks and their risk levels</p>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {watchlistData.map((stock) => (
//           <WatchlistCard key={stock.ticker} {...stock} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Watchlist;

interface WatchlistItem {
  ticker: string;
  name: string;
  newsCount: number;
  riskIndex: number;
  action: "Monitor" | "Hold" | "Reduce Risk";
}

const Watchlist = () => {
  const [watchlistData, setWatchlistData] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch(`${API_BASE}/watchlist`);
        const data = await response.json();
        setWatchlistData(data);
      } catch (error) {
        console.error("Failed to fetch watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Watchlist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your favorite stocks and their risk levels
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading watchlist...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlistData.map((stock) => (
            <WatchlistCard key={stock.ticker} {...stock} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;