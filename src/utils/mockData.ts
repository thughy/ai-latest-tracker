
import { ResearchItem, Source } from './types';

// Helper function to generate dates within the last n days
const getRandomDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Generate mock data
export const generateMockData = (): ResearchItem[] => {
  const arxivItems: ResearchItem[] = [
    {
      id: 'arxiv-1',
      title: 'CodeAgents: Enhanced Code Generation Using Conversational LLM-based Autonomous Agents',
      description: 'We propose a novel framework where multiple LLM agents with specialized roles collaborate to solve programming tasks, inspired by human team software development.',
      authors: ['Sarah Chen', 'Marcus Wei', 'David Kim'],
      date: getRandomDate(3),
      source: 'arxiv',
      url: 'https://arxiv.org/abs/2402.01030',
      relevanceScore: 9,
      isStarred: false,
      isInterested: true,
      isRead: false,
      tags: ['code generation', 'agents', 'LLM'],
    },
    {
      id: 'arxiv-2',
      title: 'Self-Refine: Iterative Refinement with Self-Critique',
      description: 'This paper introduces a novel approach for LLMs to enhance their outputs through iterative self-refinement without human intervention.',
      authors: ['Emily Johnson', 'Robert Chen'],
      date: getRandomDate(4),
      source: 'arxiv',
      url: 'https://arxiv.org/abs/2303.17651',
      relevanceScore: 8,
      isStarred: false,
      isInterested: false,
      isRead: false,
      tags: ['self-refinement', 'LLM', 'critique'],
    },
    {
      id: 'arxiv-3',
      title: 'Autonomous Agents for Complex Creative Tasks',
      description: 'We explore how autonomous AI agents can approach and solve creative tasks with minimal human input.',
      authors: ['Hiroshi Tanaka', 'Lisa Montgomery'],
      date: getRandomDate(6),
      source: 'arxiv',
      url: 'https://arxiv.org/abs/2404.12345',
      relevanceScore: 7,
      isStarred: true,
      isInterested: true,
      isRead: true,
      userScore: 4,
      tags: ['autonomous agents', 'creativity', 'AI'],
    },
    {
      id: 'arxiv-4',
      title: 'Emergent Behavior in Multi-Agent Systems',
      description: 'Analysis of emergent behaviors that develop when multiple AI agents interact in complex environments.',
      authors: ['Michael Zhang', 'Amanda Torres'],
      date: getRandomDate(5),
      source: 'arxiv',
      url: 'https://arxiv.org/abs/2404.54321',
      relevanceScore: 6,
      isStarred: false,
      isInterested: true,
      isRead: false,
      tags: ['multi-agent', 'emergent behavior', 'AI systems'],
    },
  ];

  const githubItems: ResearchItem[] = [
    {
      id: 'github-1',
      title: 'OpenAgents: A Framework for Autonomous AI Agents',
      description: 'An open-source framework for building, deploying, and orchestrating autonomous AI agents that can reason, plan, and execute tasks.',
      authors: ['GitHub: microsoft/openagents'],
      date: getRandomDate(2),
      source: 'github',
      url: 'https://github.com/microsoft/openagents',
      relevanceScore: 10,
      isStarred: true,
      isInterested: true,
      isRead: false,
      tags: ['framework', 'autonomous agents', 'open-source'],
    },
    {
      id: 'github-2',
      title: 'CodeInterpreter: A Python Package for Code Interpretation',
      description: 'A library that provides LLMs with the ability to interpret, execute, and reason about code safely.',
      authors: ['GitHub: openai/codeinterpreter'],
      date: getRandomDate(1),
      source: 'github',
      url: 'https://github.com/openai/codeinterpreter',
      relevanceScore: 9,
      isStarred: false,
      isInterested: true,
      isRead: false,
      tags: ['code interpretation', 'python', 'LLM'],
    },
    {
      id: 'github-3',
      title: 'AgentForge: Toolkit for Building AI Agents',
      description: 'A comprehensive toolkit for constructing, testing, and deploying AI agents for various domains.',
      authors: ['GitHub: agentforge-ai/agentforge'],
      date: getRandomDate(3),
      source: 'github',
      url: 'https://github.com/agentforge-ai/agentforge',
      relevanceScore: 8,
      isStarred: false,
      isInterested: false,
      isRead: true,
      userScore: 3,
      tags: ['toolkit', 'AI agents', 'deployment'],
    },
    {
      id: 'github-4',
      title: 'AutoGPT: Autonomous GPT-4 Experimentation',
      description: 'An experimental open-source application that showcases the capabilities of GPT-4 in an autonomous setting.',
      authors: ['GitHub: Significant-Gravitas/AutoGPT'],
      date: getRandomDate(7),
      source: 'github',
      url: 'https://github.com/Significant-Gravitas/AutoGPT',
      relevanceScore: 7,
      isStarred: true,
      isInterested: true,
      isRead: true,
      userScore: 5,
      tags: ['autonomous', 'GPT-4', 'experimentation'],
    },
  ];

  return [...arxivItems, ...githubItems];
};

export const mockResearchItems = generateMockData();
