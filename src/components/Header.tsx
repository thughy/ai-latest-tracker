
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, RefreshCw } from 'lucide-react';
import { useResearchData } from '@/hooks/useResearchData';

export function Header() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const { refreshData, crawlFreshData } = useResearchData();
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 1000); // Visual feedback
  };
  
  const handleCrawlFresh = async () => {
    setIsCrawling(true);
    await crawlFreshData();
    setTimeout(() => setIsCrawling(false), 1000); // Visual feedback
  };
  
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-10 w-full">
      <div className="container flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-foreground grid place-items-center">
            <span className="text-lg font-semibold text-white">AI</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">AI Research Feed</h1>
            <p className="text-xs text-muted-foreground">Track the latest in AI research</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleCrawlFresh}
            disabled={isCrawling}
            className="gap-1"
          >
            <RotateCcw className={`h-4 w-4 ${isCrawling ? 'animate-spin' : ''}`} />
            <span>{isCrawling ? 'Crawling...' : 'Crawl Fresh Data'}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
