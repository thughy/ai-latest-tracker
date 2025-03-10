
import { ResearchItem, Source } from './types';

// Fetch arXiv papers related to AI and agents
export const fetchArxivPapers = async (): Promise<ResearchItem[]> => {
  try {
    // ArXiv API query for papers related to AI agents, LLMs, etc.
    const query = encodeURIComponent('cat:cs.AI OR cat:cs.CL AND (agent OR "large language model" OR LLM OR "foundation model")');
    const sortBy = 'submittedDate';
    const sortOrder = 'descending';
    const maxResults = 10;
    
    const url = `https://export.arxiv.org/api/query?search_query=${query}&sortBy=${sortBy}&sortOrder=${sortOrder}&max_results=${maxResults}`;
    
    const response = await fetch(url);
    const data = await response.text();
    
    // Parse XML response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    const entries = xmlDoc.getElementsByTagName("entry");
    
    const items: ResearchItem[] = [];
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      
      // Get paper ID from the id tag
      const idTag = entry.getElementsByTagName("id")[0];
      const idUrl = idTag.textContent || "";
      const id = `arxiv-${idUrl.split('/').pop()}`;
      
      // Get paper details
      const title = entry.getElementsByTagName("title")[0].textContent || "";
      const summary = entry.getElementsByTagName("summary")[0].textContent || "";
      
      // Get authors
      const authorTags = entry.getElementsByTagName("author");
      const authors: string[] = [];
      for (let j = 0; j < authorTags.length; j++) {
        const name = authorTags[j].getElementsByTagName("name")[0].textContent;
        if (name) authors.push(name);
      }
      
      // Get publication date
      const published = entry.getElementsByTagName("published")[0].textContent || "";
      const date = new Date(published).toISOString();
      
      // Get paper link
      const links = entry.getElementsByTagName("link");
      let url = "";
      for (let j = 0; j < links.length; j++) {
        if (links[j].getAttribute("title") === "pdf") {
          url = links[j].getAttribute("href") || "";
          // Convert PDF link to abstract page link
          url = url.replace(/\.pdf$/, "").replace("pdf", "abs");
          break;
        }
      }
      
      // Generate tags based on categories
      const categories = entry.getElementsByTagName("category");
      const tags: string[] = [];
      for (let j = 0; j < categories.length; j++) {
        const term = categories[j].getAttribute("term");
        if (term) {
          // Convert category terms to more readable tags
          const categoryTag = term.replace("cs.", "")
            .split('.')
            .map(part => part.toLowerCase())
            .join(' ');
          tags.push(categoryTag);
        }
      }
      
      // Add AI-related tags based on title and summary
      const aiKeywords = ["agent", "llm", "language model", "foundation model", "neural", "transformer"];
      aiKeywords.forEach(keyword => {
        if (
          (title.toLowerCase().includes(keyword) || 
          summary.toLowerCase().includes(keyword)) && 
          !tags.includes(keyword)
        ) {
          tags.push(keyword);
        }
      });
      
      // Add relevance score based on keyword matching
      const aiTerms = ["agent", "autonomous", "llm", "language model", "foundation model", "chat", "gpt"];
      let relevanceScore = 6; // Base score
      
      // Increase score for each match
      aiTerms.forEach(term => {
        if (title.toLowerCase().includes(term)) relevanceScore += 1;
        if (summary.toLowerCase().includes(term)) relevanceScore += 0.5;
      });
      
      // Cap at 10
      relevanceScore = Math.min(Math.round(relevanceScore), 10);
      
      items.push({
        id,
        title: title.trim(),
        description: summary.trim(),
        authors,
        date,
        source: 'arxiv' as Source,
        url,
        relevanceScore,
        isStarred: false,
        isInterested: false,
        isRead: false,
        tags: [...new Set(tags)].slice(0, 5), // Remove duplicates and limit to 5 tags
      });
    }
    
    return items;
  } catch (error) {
    console.error('Error fetching arXiv papers:', error);
    return [];
  }
};

// Fetch GitHub repositories related to AI and agents
export const fetchGithubRepos = async (): Promise<ResearchItem[]> => {
  try {
    // GitHub search API for AI agent repos
    const query = encodeURIComponent('agent OR llm OR "language model" in:name,description,readme');
    const sort = 'updated';
    const order = 'desc';
    const perPage = 10;
    
    const url = `https://api.github.com/search/repositories?q=${query}&sort=${sort}&order=${order}&per_page=${perPage}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.items) {
      console.error('Unexpected GitHub API response:', data);
      return [];
    }
    
    const items: ResearchItem[] = [];
    
    for (const repo of data.items) {
      // Add relevance score based on stars and keyword matching
      let relevanceScore = 5; // Base score
      
      // Increase score based on stars (up to +3)
      const starMultiplier = Math.min(repo.stargazers_count / 1000, 3);
      relevanceScore += starMultiplier;
      
      // Increase score for keyword matches
      const aiTerms = ["agent", "autonomous", "llm", "language model", "ai", "gpt", "foundation model"];
      
      aiTerms.forEach(term => {
        if (repo.name.toLowerCase().includes(term)) relevanceScore += 0.7;
        if (repo.description && repo.description.toLowerCase().includes(term)) relevanceScore += 0.5;
      });
      
      // Cap at 10
      relevanceScore = Math.min(Math.round(relevanceScore), 10);
      
      // Generate tags based on topics and description
      const tags: string[] = repo.topics || [];
      
      // Add AI-related tags based on name and description
      const aiKeywords = ["agent", "llm", "language model", "ai", "ml", "neural", "transformer"];
      aiKeywords.forEach(keyword => {
        if (
          (repo.name.toLowerCase().includes(keyword) || 
          (repo.description && repo.description.toLowerCase().includes(keyword))) && 
          !tags.includes(keyword)
        ) {
          tags.push(keyword);
        }
      });
      
      items.push({
        id: `github-${repo.id}`,
        title: repo.name,
        description: repo.description || 'No description available',
        authors: [`GitHub: ${repo.full_name}`],
        date: new Date(repo.updated_at).toISOString(),
        source: 'github' as Source,
        url: repo.html_url,
        relevanceScore,
        isStarred: false,
        isInterested: false,
        isRead: false,
        tags: [...new Set(tags)].slice(0, 5), // Remove duplicates and limit to 5 tags
      });
    }
    
    return items;
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
};

// Fetch all research items (combine arXiv and GitHub)
export const fetchResearchItems = async (): Promise<ResearchItem[]> => {
  try {
    const [arxivItems, githubItems] = await Promise.all([
      fetchArxivPapers(),
      fetchGithubRepos()
    ]);
    
    // Combine and sort by date (newest first)
    const allItems = [...arxivItems, ...githubItems];
    allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return allItems;
  } catch (error) {
    console.error('Error fetching research items:', error);
    return [];
  }
};
