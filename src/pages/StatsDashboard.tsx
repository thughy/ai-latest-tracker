
import { useState, useEffect } from 'react';
import { useResearchData } from '@/hooks/useResearchData';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, BookOpen, Github, Star, ThumbsUp, ScrollText, LucideIcon } from 'lucide-react';
import { ResearchItem, Source } from '@/utils/types';

// Stat card component for consistent styling
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  icon: LucideIcon; 
  color: string;
}) => (
  <Card className="p-5 flex flex-col">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </Card>
);

const StatsDashboard = () => {
  const { items, isLoading } = useResearchData();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate stats for the overview tab
  const totalItems = items.length;
  const itemsBySource = {
    arxiv: items.filter(item => item.source === 'arxiv').length,
    github: items.filter(item => item.source === 'github').length
  };
  
  const starredItems = items.filter(item => item.isStarred).length;
  const readItems = items.filter(item => item.isRead).length;
  const interestedItems = items.filter(item => item.isInterested).length;
  
  // For relevance score distribution
  const relevanceDistribution = Array(11).fill(0); // 0-10 scores
  items.forEach(item => {
    relevanceDistribution[item.relevanceScore] += 1;
  });
  
  const relevanceData = relevanceDistribution.map((count, score) => ({
    score: score,
    count: count
  })).filter(item => item.score > 0);
  
  // For source distribution pie chart
  const sourceData = [
    { name: 'arXiv', value: itemsBySource.arxiv, color: '#8884d8' },
    { name: 'GitHub', value: itemsBySource.github, color: '#82ca9d' },
  ];
  
  // For tags distribution
  const tagCounts: Record<string, number> = {};
  items.forEach(item => {
    item.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
  
  // User engagement over time
  // This is a simplified approach - in a real app you might want to aggregate by day/week
  const userScoreData = items
    .filter(item => item.userScore !== undefined)
    .map(item => ({
      title: item.title.substring(0, 20) + '...',
      score: item.userScore
    }));
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-accent/20">
      <Header />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 animate-fade-in">
          {/* Page heading */}
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight animate-slide-up">
              Research Statistics Dashboard
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up opacity-90">
              Analytics and insights about your research library.
            </p>
          </div>
          
          {isLoading ? (
            // Loading skeletons
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[100px] rounded-lg loading-shimmer" />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  title="Total Research Items" 
                  value={totalItems} 
                  icon={ScrollText} 
                  color="text-blue-500" 
                />
                <StatCard 
                  title="Starred Items" 
                  value={starredItems} 
                  icon={Star} 
                  color="text-yellow-500" 
                />
                <StatCard 
                  title="Read Items" 
                  value={readItems} 
                  icon={BookOpen} 
                  color="text-green-500" 
                />
                <StatCard 
                  title="Interested Items" 
                  value={interestedItems} 
                  icon={ThumbsUp} 
                  color="text-purple-500" 
                />
              </div>
              
              {/* Tabs for different analytics views */}
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 h-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="sources">Sources</TabsTrigger>
                  <TabsTrigger value="relevance">Relevance</TabsTrigger>
                  <TabsTrigger value="tags">Tags</TabsTrigger>
                </TabsList>
                
                {/* Overview tab */}
                <TabsContent value="overview" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Research Items by Source</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sourceData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {sourceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Reading Status</h3>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Read', value: readItems, color: '#4ade80' },
                                { name: 'Unread', value: totalItems - readItems, color: '#f87171' }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              <Cell fill="#4ade80" />
                              <Cell fill="#f87171" />
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                    
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Interest Level</h3>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Interested', value: interestedItems, color: '#a78bfa' },
                                { name: 'Not Marked', value: totalItems - interestedItems, color: '#d1d5db' }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              <Cell fill="#a78bfa" />
                              <Cell fill="#d1d5db" />
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Sources tab */}
                <TabsContent value="sources" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">ArXiv vs GitHub Distribution</h3>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'arXiv', value: itemsBySource.arxiv },
                            { name: 'GitHub', value: itemsBySource.github }
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                          <Legend />
                          <Bar dataKey="value" name="Items Count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">ArXiv Items ({itemsBySource.arxiv})</h3>
                      <ul className="space-y-2">
                        {items
                          .filter(item => item.source === 'arxiv')
                          .slice(0, 5)
                          .map(item => (
                            <li key={item.id} className="border-b pb-2">
                              <p className="font-medium truncate">{item.title}</p>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                                <span>Score: {item.relevanceScore}/10</span>
                              </div>
                            </li>
                          ))}
                        {itemsBySource.arxiv > 5 && (
                          <li className="text-center text-sm text-muted-foreground pt-2">
                            + {itemsBySource.arxiv - 5} more items
                          </li>
                        )}
                      </ul>
                    </Card>
                    
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">GitHub Items ({itemsBySource.github})</h3>
                      <ul className="space-y-2">
                        {items
                          .filter(item => item.source === 'github')
                          .slice(0, 5)
                          .map(item => (
                            <li key={item.id} className="border-b pb-2">
                              <p className="font-medium truncate">{item.title}</p>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                                <span>Score: {item.relevanceScore}/10</span>
                              </div>
                            </li>
                          ))}
                        {itemsBySource.github > 5 && (
                          <li className="text-center text-sm text-muted-foreground pt-2">
                            + {itemsBySource.github - 5} more items
                          </li>
                        )}
                      </ul>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Relevance tab */}
                <TabsContent value="relevance" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Relevance Score Distribution</h3>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={relevanceData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="score" label={{ value: 'Relevance Score', position: 'insideBottom', offset: -10 }} />
                          <YAxis label={{ value: 'Number of Items', angle: -90, position: 'insideLeft' }} />
                          <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                          <Legend />
                          <Bar dataKey="count" name="Number of Items" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Rated Items</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items
                        .sort((a, b) => b.relevanceScore - a.relevanceScore)
                        .slice(0, 6)
                        .map(item => (
                          <div key={item.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <p className="font-medium line-clamp-2">{item.title}</p>
                              <Badge variant={item.source === 'arxiv' ? 'default' : 'secondary'}>
                                {item.source === 'arxiv' ? 'arXiv' : 'GitHub'}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-sm">
                              <span className="text-muted-foreground">
                                {new Date(item.date).toLocaleDateString()}
                              </span>
                              <span className="font-bold text-primary">
                                Score: {item.relevanceScore}/10
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>
                </TabsContent>
                
                {/* Tags tab */}
                <TabsContent value="tags" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Most Common Tags</h3>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topTags}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 100, bottom: 40 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis 
                            type="category" 
                            dataKey="tag" 
                            width={80}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                          <Legend />
                          <Bar dataKey="count" name="Occurrences" fill="#ec4899" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(tagCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([tag, count]) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-sm py-1 px-3"
                          style={{ 
                            fontSize: `${Math.max(0.8, Math.min(1.4, 0.8 + count/10))}rem`,
                            opacity: Math.max(0.6, Math.min(1, 0.6 + count/20))
                          }}
                        >
                          {tag} ({count})
                        </Badge>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StatsDashboard;
