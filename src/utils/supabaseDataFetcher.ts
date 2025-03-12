
import { supabase } from "@/integrations/supabase/client";
import { ResearchItem, Source } from './types';
import { mockResearchItems } from './mockData';
import { fetchArxivPapers, fetchGithubRepos } from './dataFetcher';
import { v4 as uuidv4 } from 'uuid';

// Fetch research items from Supabase
export const fetchResearchItemsFromSupabase = async (): Promise<ResearchItem[]> => {
  try {
    console.log('Fetching research items from Supabase...');
    
    const { data, error } = await supabase
      .from('research_items')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No items found in Supabase, attempting to populate from APIs...');
      return await populateSupabaseWithAPIData();
    }
    
    // Transform database records to match our ResearchItem type
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      authors: item.authors,
      date: item.date,
      source: item.source as Source,
      url: item.url,
      relevanceScore: item.relevance_score,
      isStarred: item.is_starred,
      isInterested: item.is_interested,
      isRead: item.is_read,
      userScore: item.user_score || undefined,
      tags: item.tags,
    }));
    
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return [];
  }
};

// Insert a single research item into Supabase
export const insertResearchItem = async (item: ResearchItem): Promise<void> => {
  try {
    // Generate a proper UUID instead of using the original ID
    // which might not conform to Supabase's UUID format
    const properUuid = uuidv4();
    
    // Transform item to match database schema
    const dbItem = {
      id: properUuid,
      title: item.title,
      description: item.description,
      authors: item.authors,
      date: item.date,
      source: item.source,
      url: item.url,
      relevance_score: item.relevanceScore,
      is_starred: item.isStarred,
      is_interested: item.isInterested,
      is_read: item.isRead,
      user_score: item.userScore,
      tags: item.tags,
    };
    
    const { error } = await supabase
      .from('research_items')
      .insert(dbItem);
    
    if (error) {
      console.error('Error inserting item into Supabase:', error);
      throw error;
    }
    
    console.log(`Successfully inserted item: ${item.title}`);
  } catch (error) {
    console.error('Failed to insert item:', error);
  }
};

// Update a research item in Supabase
export const updateResearchItem = async (id: string, updates: Partial<ResearchItem>): Promise<void> => {
  try {
    // Transform updates to match database schema
    const dbUpdates: Record<string, any> = {};
    
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.authors !== undefined) dbUpdates.authors = updates.authors;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.source !== undefined) dbUpdates.source = updates.source;
    if (updates.url !== undefined) dbUpdates.url = updates.url;
    if (updates.relevanceScore !== undefined) dbUpdates.relevance_score = updates.relevanceScore;
    if (updates.isStarred !== undefined) dbUpdates.is_starred = updates.isStarred;
    if (updates.isInterested !== undefined) dbUpdates.is_interested = updates.isInterested;
    if (updates.isRead !== undefined) dbUpdates.is_read = updates.isRead;
    if (updates.userScore !== undefined) dbUpdates.user_score = updates.userScore;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    
    const { error } = await supabase
      .from('research_items')
      .update(dbUpdates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating item in Supabase:', error);
      throw error;
    }
    
    console.log(`Successfully updated item: ${id}`);
  } catch (error) {
    console.error('Failed to update item:', error);
  }
};

// Delete all research items from Supabase
export const deleteAllResearchItems = async (): Promise<void> => {
  try {
    console.log('Deleting all research items from Supabase...');
    
    const { error } = await supabase
      .from('research_items')
      .delete()
      .neq('id', 'no-match'); // This condition will match all rows
    
    if (error) {
      console.error('Error deleting items from Supabase:', error);
      throw error;
    }
    
    console.log('Successfully deleted all research items');
  } catch (error) {
    console.error('Failed to delete items:', error);
  }
};

// Refresh data by deleting all items and fetching new ones from APIs
export const refreshResearchData = async (): Promise<ResearchItem[]> => {
  try {
    console.log('Refreshing research data...');
    
    // Delete all existing data
    await deleteAllResearchItems();
    
    // Populate with fresh data from APIs
    return await populateSupabaseWithAPIData();
  } catch (error) {
    console.error('Error refreshing research data:', error);
    return [];
  }
};

// Populate Supabase with data from APIs
export const populateSupabaseWithAPIData = async (): Promise<ResearchItem[]> => {
  try {
    console.log('Populating Supabase with data from APIs...');
    
    // Fetch data from APIs
    const [arxivItems, githubItems] = await Promise.all([
      fetchArxivPapers(),
      fetchGithubRepos()
    ]);
    
    const allItems = [...arxivItems, ...githubItems];
    
    if (allItems.length === 0) {
      console.warn('No items fetched from APIs, falling back to mock data');
      
      // Insert mock data into Supabase
      for (const item of mockResearchItems) {
        await insertResearchItem(item);
      }
      
      return mockResearchItems;
    }
    
    // Insert API data into Supabase
    for (const item of allItems) {
      await insertResearchItem(item);
    }
    
    console.log(`Successfully populated Supabase with ${allItems.length} items`);
    return allItems;
  } catch (error) {
    console.error('Error populating Supabase:', error);
    return [];
  }
};
