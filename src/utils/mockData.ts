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
    id: 'arxiv-1',
    title: 'AstroLLaMA: Towards Specialized Foundation Models in Astronomy',
    description: 'We introduce AstroLLaMA, a large language model specifically fine-tuned for astronomy research that can assist with data analysis, answer domain-specific questions, and generate astronomical code.',
    authors: ['Sarah Jeffreson', 'Francisco Villaescusa-Navarro', 'Daniela Huppenkothen'],
    date: getRandomDate(3),
    source: 'arxiv',
    url: 'https://arxiv.org/abs/2404.16324',
    relevanceScore: 9,
    isStarred: false,
    isInterested: true,
    isRead: false,
    tags: ['astronomy', 'foundation models', 'LLM'],
  },
  {
    id: 'arxiv-2',
    title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
    description: 'This paper introduces ReAct, a framework that synergizes reasoning and acting in language models to solve diverse tasks requiring language reasoning and interaction with external environments.',
    authors: ['Shunyu Yao', 'Jeffrey Zhao', 'Dian Yu'],
    date: getRandomDate(4),
    source: 'arxiv',
    url: 'https://arxiv.org/abs/2210.03629',
    relevanceScore: 8,
    isStarred: false,
    isInterested: false,
    isRead: false,
    tags: ['reasoning', 'LLM', 'agents'],
  },
  {
    id: 'arxiv-3',
    title: 'AgentTuning: Enabling Generalized Agent Abilities for LLMs',
    description: 'We present AgentTuning, a method for training language models to follow user instructions as an agent, enabling them to better handle complex multi-step tasks and tool use.',
    authors: ['Xiang Deng', 'Yu Gu', 'Chengqi Lyu'],
    date: getRandomDate(6),
    source: 'arxiv',
    url: 'https://arxiv.org/abs/2310.12823',
    relevanceScore: 7,
    isStarred: true,
    isInterested: true,
    isRead: true,
    userScore: 4,
    tags: ['agent tuning', 'LLM', 'tools'],
  },
  {
    id: 'arxiv-4',
    title: 'Swarms of LLM Agents: A Collective Intelligence Approach',
    description: 'This paper explores how multiple specialized LLM agents can work together in swarm-like configurations to solve complex reasoning tasks beyond the capabilities of individual agents.',
    authors: ['Michael Zhang', 'Amanda Torres'],
    date: getRandomDate(5),
    source: 'arxiv',
    url: 'https://arxiv.org/abs/2404.01339',
    relevanceScore: 6,
    isStarred: false,
    isInterested: true,
    isRead: false,
    tags: ['swarm intelligence', 'multi-agent', 'LLM'],
  },
  {
    id: 'github-1',
    title: 'LlamaIndex - Data Framework for LLM Applications',
    description: 'A data framework for building LLM applications, featuring advanced RAG capabilities and structured data integration.',
    authors: ['GitHub: run-llama/llama_index'],
    date: getRandomDate(2),
    source: 'github',
    url: 'https://github.com/run-llama/llama_index',
    relevanceScore: 10,
    isStarred: true,
    isInterested: true,
    isRead: false,
    tags: ['RAG', 'data framework', 'LLM applications'],
  },
  {
    id: 'github-2',
    title: 'Langchain - Building Applications with LLMs',
    description: 'A framework for developing applications powered by language models with composable components for agents, document loaders, and more.',
    authors: ['GitHub: langchain-ai/langchain'],
    date: getRandomDate(1),
    source: 'github',
    url: 'https://github.com/langchain-ai/langchain',
    relevanceScore: 9,
    isStarred: false,
    isInterested: true,
    isRead: false,
    tags: ['framework', 'agents', 'LLM'],
  },
  {
    id: 'github-3',
    title: 'Haystack - Neural Search Framework',
    description: 'An end-to-end framework for building search systems that work intelligently over large document collections with LLMs.',
    authors: ['GitHub: deepset-ai/haystack'],
    date: getRandomDate(3),
    source: 'github',
    url: 'https://github.com/deepset-ai/haystack',
    relevanceScore: 8,
    isStarred: false,
    isInterested: false,
    isRead: true,
    userScore: 3,
    tags: ['search', 'retrieval', 'LLM integration'],
  },
  {
    id: 'github-4',
    title: 'CrewAI - Orchestrate Role-Playing AI Agents',
    description: 'A framework for orchestrating role-playing autonomous AI agents, designed to help them work together to accomplish complex tasks.',
    authors: ['GitHub: joaomdmoura/crewAI'],
    date: getRandomDate(5),
    source: 'github',
    url: 'https://github.com/joaomdmoura/crewAI',
    relevanceScore: 7,
    isStarred: true,
    isInterested: true,
    isRead: true,
    userScore: 5,
    tags: ['autonomous', 'role-playing', 'agents'],
  },
];

export const generateMockData = (): ResearchItem[] => {
  return fallbackMockData;
};

// We'll replace this with real data in useResearchData hook
export const mockResearchItems = generateMockData();
