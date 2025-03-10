
import { useState, useEffect } from 'react';
import { useResearchData } from '@/hooks/useResearchData';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import ResearchCard from '@/components/ResearchCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, ChevronUp, RefreshCw } from 'lucide-react';

const Index = () => {
  const { 
    items, 
    filters, 
    isLoading, 
    error,
    updateFilters, 
    resetFilters,
    refreshData,
    toggleStar, 
    toggleInterest, 
    toggleRead, 
    setUserScore 
  } = useResearchData();
  
  const { toast } = useToast();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Show welcome toast on first render
  useEffect(() => {
    const hasShownWelcome = localStorage.getItem('ai_tracker_welcome_shown');
    
    if (!hasShownWelcome) {
      setTimeout(() => {
        toast({
          title: "Welcome to AI Frontier Tracker",
          description: "Stay updated with the latest AI developments from arXiv and GitHub.",
          duration: 5000,
        });
        localStorage.setItem('ai_tracker_welcome_shown', 'true');
      }, 1000);
    }
  }, [toast]);
  
  // Show scroll to top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-accent/30">
      <Header />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 animate-fade-in">
          {/* Page heading */}
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight animate-slide-up">
              AI Frontier Tracker
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up opacity-90">
              Track the latest advancements in AI from top research papers and GitHub repositories.
              Star, save, and organize the most relevant developments in one place.
            </p>
            
            {/* Refresh button */}
            <div className="mt-4">
              <Button 
                onClick={refreshData}
                disabled={isLoading}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <FilterBar 
            filters={filters} 
            updateFilters={updateFilters} 
            resetFilters={resetFilters} 
          />
          
          {/* Research items */}
          <div className="mt-6 space-y-2">
            {isLoading ? (
              // Loading skeletons
              <div className="grid grid-cols-1 gap-4 animate-fade-in">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-[200px] rounded-lg loading-shimmer" />
                ))}
              </div>
            ) : error ? (
              // Error state
              <div className="py-20 text-center animate-fade-in">
                <div className="inline-flex rounded-full bg-red-100 p-6 mb-4">
                  <BookOpen className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Error Loading Data</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  There was an error fetching the latest research data. 
                  Using fallback data instead.
                </p>
                <Button onClick={refreshData}>Try Again</Button>
              </div>
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 animate-scale-in">
                {items.map((item) => (
                  <ResearchCard
                    key={item.id}
                    item={item}
                    toggleStar={toggleStar}
                    toggleInterest={toggleInterest}
                    toggleRead={toggleRead}
                    setUserScore={setUserScore}
                  />
                ))}
              </div>
            ) : (
              // Empty state
              <div className="py-20 text-center animate-fade-in">
                <div className="inline-flex rounded-full bg-muted p-6 mb-4">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any research that matches your current filters. Try adjusting your filters or search query.
                </p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 h-10 w-10 bg-primary text-primary-foreground rounded-full shadow-md grid place-items-center transition-all duration-300 ease-apple ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Index;
