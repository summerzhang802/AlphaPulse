import WatchlistCard from "@/components/WatchlistCard";
import { watchlistData } from "@/data/mockData";

const Watchlist = () => {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Watchlist</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your favorite stocks and their risk levels</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlistData.map((stock) => (
          <WatchlistCard key={stock.ticker} {...stock} />
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
