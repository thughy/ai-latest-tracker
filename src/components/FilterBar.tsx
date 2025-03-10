
import { useCallback } from 'react';
import { FilterOptions, Source } from '@/utils/types';
import { cn } from '@/lib/utils';
import { Search, X, SlidersHorizontal, CalendarDays, Star, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

interface FilterBarProps {
  filters: FilterOptions;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
}

export function FilterBar({ filters, updateFilters, resetFilters }: FilterBarProps) {
  // Source filter
  const sources: { value: Source | 'all'; label: string }[] = [
    { value: 'all', label: 'All Sources' },
    { value: 'arxiv', label: 'arXiv' },
    { value: 'github', label: 'GitHub' },
  ];
  
  // Date range options
  const dateRanges = [
    { value: 1, label: '24 hours' },
    { value: 3, label: '3 days' },
    { value: 7, label: '7 days' },
    { value: 14, label: '14 days' },
    { value: 30, label: '30 days' },
  ];
  
  // Status filters
  const readStatusOptions = [
    { value: 'all', label: 'All' },
    { value: 'read', label: 'Read' },
    { value: 'unread', label: 'Unread' },
  ];
  
  const starStatusOptions = [
    { value: 'all', label: 'All' },
    { value: 'starred', label: 'Starred' },
    { value: 'unstarred', label: 'Unstarred' },
  ];
  
  const interestStatusOptions = [
    { value: 'all', label: 'All' },
    { value: 'interested', label: 'Interested' },
    { value: 'not-interested', label: 'Not Interested' },
  ];
  
  // Handle search input
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchQuery: e.target.value });
  }, [updateFilters]);
  
  // Clear search
  const clearSearch = useCallback(() => {
    updateFilters({ searchQuery: '' });
  }, [updateFilters]);
  
  // Check if filters are active (not at default values)
  const hasActiveFilters = useCallback(() => {
    return (
      filters.source !== 'all' ||
      filters.minRelevance > 0 ||
      filters.dateRange !== 7 ||
      filters.readStatus !== 'all' ||
      filters.starStatus !== 'all' ||
      filters.interestStatus !== 'all' ||
      filters.searchQuery !== ''
    );
  }, [filters]);

  return (
    <div className="w-full bg-background/50 backdrop-blur-sm py-4 sticky top-16 z-30 border-b animate-fade-in">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          {/* Search bar */}
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for papers, repos, authors, or tags..."
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-10 h-10 bg-secondary border-none hover:bg-secondary/80 transition-colors duration-200"
              />
              {filters.searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn(
                    "h-10 w-10 shrink-0 transition-all duration-200",
                    hasActiveFilters() && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[340px] p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Filters</h3>
                    <Button 
                      variant="ghost" 
                      className="h-8 px-2 text-xs text-muted-foreground"
                      onClick={resetFilters}
                    >
                      Reset All
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  {/* Sources */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sources</label>
                    <div className="flex flex-wrap gap-2">
                      {sources.map((source) => (
                        <button
                          key={source.value}
                          onClick={() => updateFilters({ source: source.value })}
                          className={cn(
                            "filter-chip",
                            filters.source === source.value && "active"
                          )}
                        >
                          {source.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Relevance slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Minimum Relevance</label>
                      <span className="text-sm text-muted-foreground">{filters.minRelevance}/10</span>
                    </div>
                    <Slider
                      value={[filters.minRelevance]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => updateFilters({ minRelevance: value[0] })}
                      className="py-2"
                    />
                  </div>
                  
                  {/* Date range */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Time Period</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {dateRanges.map((range) => (
                        <button
                          key={range.value}
                          onClick={() => updateFilters({ dateRange: range.value })}
                          className={cn(
                            "filter-chip",
                            filters.dateRange === range.value && "active"
                          )}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Status filters */}
                  <div className="space-y-4">
                    {/* Read status */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <label className="text-sm font-medium">Read Status</label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {readStatusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateFilters({ readStatus: option.value as 'all' | 'read' | 'unread' })}
                            className={cn(
                              "filter-chip",
                              filters.readStatus === option.value && "active"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Star status */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <label className="text-sm font-medium">Star Status</label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {starStatusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateFilters({ starStatus: option.value as 'all' | 'starred' | 'unstarred' })}
                            className={cn(
                              "filter-chip",
                              filters.starStatus === option.value && "active"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Interest status */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <label className="text-sm font-medium">Interest Status</label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {interestStatusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateFilters({ interestStatus: option.value as 'all' | 'interested' | 'not-interested' })}
                            className={cn(
                              "filter-chip",
                              filters.interestStatus === option.value && "active"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Active filters preview */}
          <div className="flex items-center gap-2 flex-wrap">
            {filters.source !== 'all' && (
              <div className="filter-chip active flex items-center gap-1.5">
                <span>Source: {filters.source}</span>
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilters({ source: 'all' })}
                />
              </div>
            )}
            
            {filters.minRelevance > 0 && (
              <div className="filter-chip active flex items-center gap-1.5">
                <span>Relevance: ≥{filters.minRelevance}</span>
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilters({ minRelevance: 0 })}
                />
              </div>
            )}
            
            {filters.dateRange !== 7 && (
              <div className="filter-chip active flex items-center gap-1.5">
                <span>
                  {dateRanges.find(d => d.value === filters.dateRange)?.label || `${filters.dateRange} days`}
                </span>
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilters({ dateRange: 7 })}
                />
              </div>
            )}
            
            {filters.readStatus !== 'all' && (
              <div className="filter-chip active flex items-center gap-1.5">
                <span>{filters.readStatus}</span>
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilters({ readStatus: 'all' })}
                />
              </div>
            )}
            
            {filters.starStatus !== 'all' && (
              <div className="filter-chip active flex items-center gap-1.5">
                <span>{filters.starStatus}</span>
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilters({ starStatus: 'all' })}
                />
              </div>
            )}
            
            {filters.interestStatus !== 'all' && (
              <div className="filter-chip active flex items-center gap-1.5">
                <span>{filters.interestStatus === 'interested' ? 'Interested' : 'Not Interested'}</span>
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilters({ interestStatus: 'all' })}
                />
              </div>
            )}
            
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={resetFilters}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
