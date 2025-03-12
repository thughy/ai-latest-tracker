
import { useState, useEffect, useCallback } from 'react';
import { mockResearchItems } from '@/utils/mockData';
import { FilterOptions, ResearchItem } from '@/utils/types';
import { fetchResearchItems } from '@/utils/dataFetcher';
import { updateResearchItem } from '@/utils/supabaseDataFetcher';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

// Default filter options
const defaultFilters: FilterOptions = {
  source: 'all',
  minRelevance: 0,
  dateRange: 7, // Last 7 days
  readStatus: 'all',
  starStatus: 'all',
  interestStatus: 'all',
  searchQuery: '',
};

export function useResearchData() {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [filteredItems, setFilteredItems] = useState<ResearchItem[]>([]);
  const { toast } = useToast();
  
  // Use React Query to fetch real data with caching and error handling
  const { data: items = [], isLoading, error, refetch } = useQuery({
    queryKey: ['researchItems'],
    queryFn: fetchResearchItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
    refetchOnWindowFocus: false,
    meta: {
      onSuccess: (data: ResearchItem[]) => {
        if (data && data.length === 0) {
          toast({
            title: "No data found",
            description: "No research items were found. Using fallback data.",
            variant: "destructive",
          });
        } else if (data && data.length > 0) {
          console.log(`Fetched ${data.length} research items`);
        }
      },
      onError: (error: Error) => {
        console.error('Error fetching research data:', error);
        toast({
          title: "Error fetching data",
          description: "Using fallback data. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });
  
  // Apply filters to items
  const applyFilters = useCallback(() => {
    let result = [...items];
    
    // Filter by source
    if (filters.source !== 'all') {
      result = result.filter(item => item.source === filters.source);
    }
    
    // Filter by relevance score
    if (filters.minRelevance > 0) {
      result = result.filter(item => item.relevanceScore >= filters.minRelevance);
    }
    
    // Filter by date range
    if (filters.dateRange > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - filters.dateRange);
      result = result.filter(item => new Date(item.date) >= cutoffDate);
    }
    
    // Filter by read status
    if (filters.readStatus !== 'all') {
      result = result.filter(item => 
        filters.readStatus === 'read' ? item.isRead : !item.isRead
      );
    }
    
    // Filter by star status
    if (filters.starStatus !== 'all') {
      result = result.filter(item => 
        filters.starStatus === 'starred' ? item.isStarred : !item.isStarred
      );
    }
    
    // Filter by interest status
    if (filters.interestStatus !== 'all') {
      result = result.filter(item => 
        filters.interestStatus === 'interested' ? item.isInterested : !item.isInterested
      );
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.authors.some(author => author.toLowerCase().includes(query))
      );
    }
    
    // Sort by date (newest first) and then by relevance score
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return b.relevanceScore - a.relevanceScore;
    });
    
    return result;
  }, [items, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters to default
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Manual refetch function with toast notification
  const refreshData = useCallback(() => {
    toast({
      title: "Refreshing data",
      description: "Fetching the latest research items...",
    });
    refetch();
  }, [refetch, toast]);

  // Update filtered items when filters or items change
  useEffect(() => {
    setFilteredItems(applyFilters());
  }, [filters, items, applyFilters]);

  // Update a research item
  const updateItem = useCallback(async (id: string, updates: Partial<ResearchItem>) => {
    try {
      // Update in Supabase
      await updateResearchItem(id, updates);
      
      // Refresh the data to get the latest changes
      refetch();
      
      toast({
        title: "Item updated",
        description: "The research item has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Update failed",
        description: "Failed to update the research item. Please try again.",
        variant: "destructive",
      });
    }
  }, [refetch, toast]);

  // Toggle star status
  const toggleStar = useCallback(async (id: string) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    try {
      await updateResearchItem(id, { isStarred: !item.isStarred });
      refetch();
    } catch (error) {
      console.error('Error toggling star status:', error);
    }
  }, [items, refetch]);

  // Toggle interest status
  const toggleInterest = useCallback(async (id: string) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    try {
      await updateResearchItem(id, { isInterested: !item.isInterested });
      refetch();
    } catch (error) {
      console.error('Error toggling interest status:', error);
    }
  }, [items, refetch]);

  // Toggle read status
  const toggleRead = useCallback(async (id: string) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    try {
      await updateResearchItem(id, { isRead: !item.isRead });
      refetch();
    } catch (error) {
      console.error('Error toggling read status:', error);
    }
  }, [items, refetch]);

  // Set user score
  const setUserScore = useCallback(async (id: string, score: number) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    try {
      await updateResearchItem(id, { userScore: score });
      refetch();
    } catch (error) {
      console.error('Error setting user score:', error);
    }
  }, [items, refetch]);

  return {
    items: filteredItems,
    filters,
    isLoading,
    error,
    updateFilters,
    resetFilters,
    refreshData,
    updateItem,
    toggleStar,
    toggleInterest,
    toggleRead,
    setUserScore
  };
}
