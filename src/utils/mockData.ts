
import { ResearchItem, Source } from './types';

// Helper function to generate dates within the last n days
const getRandomDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Fallback mock data in case the API requests fail
const fallbackMockData: ResearchItem[] = [
  {
    id: 'arxiv-2407.00001',
    title: 'Fallback: Recent Advances in AI Agent Architecture',
    description: 'This is fallback mock data. The real API data could not be loaded. In a real application, you would see actual recent papers from arXiv here.',
    authors: ['Mock Author 1', 'Mock Author 2'],
    date: getRandomDate(3),
    source: 'arxiv',
    url: 'https://arxiv.org',
    relevanceScore: 9,
    isStarred: false,
    isInterested: true,
    isRead: false,
    tags: ['fallback', 'mock data', 'api error'],
  },
  {
    id: 'github-12345',
    title: 'Fallback: LLM-Agent-Framework',
    description: 'This is fallback mock data. The real API data could not be loaded. In a real application, you would see actual recent GitHub repositories here.',
    authors: ['GitHub: mock/repository'],
    date: getRandomDate(2),
    source: 'github',
    url: 'https://github.com',
    relevanceScore: 8,
    isStarred: false,
    isInterested: true,
    isRead: false,
    tags: ['fallback', 'mock data', 'api error'],
  },
];

export const generateMockData = (): ResearchItem[] => {
  return fallbackMockData;
};

// We'll replace this with real data in useResearchData hook
export const mockResearchItems = generateMockData();
