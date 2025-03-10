
export type Source = 'arxiv' | 'github';

export type ResearchItem = {
  id: string;
  title: string;
  description: string;
  authors: string[];
  date: string; // ISO string
  source: Source;
  url: string;
  relevanceScore: number; // 1-10
  isStarred: boolean;
  isInterested: boolean;
  isRead: boolean;
  userScore?: number; // 1-5
  tags: string[];
};

export type FilterOptions = {
  source: Source | 'all';
  minRelevance: number;
  dateRange: number; // days
  readStatus: 'all' | 'read' | 'unread';
  starStatus: 'all' | 'starred' | 'unstarred';
  interestStatus: 'all' | 'interested' | 'not-interested';
  searchQuery: string;
};
