
import { useState, useCallback } from 'react';
import { Star, Heart, CheckCircle, ExternalLink } from 'lucide-react';
import { ResearchItem } from '@/utils/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { format, parseISO } from 'date-fns';

interface ResearchCardProps {
  item: ResearchItem;
  toggleStar: (id: string) => void;
  toggleInterest: (id: string) => void;
  toggleRead: (id: string) => void;
  setUserScore: (id: string, score: number) => void;
}

export function ResearchCard({ 
  item, 
  toggleStar, 
  toggleInterest, 
  toggleRead, 
  setUserScore 
}: ResearchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Toggle expanded state
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);
  
  // Format date with better error handling
  let formattedDate = 'Unknown date';
  try {
    const date = parseISO(item.date);
    // Check if date is valid before formatting
    if (!isNaN(date.getTime())) {
      formattedDate = format(date, 'MMM d, yyyy');
    } else {
      console.warn(`Invalid date format for item: ${item.id}`, item.date);
    }
  } catch (error) {
    console.error(`Error formatting date for item: ${item.id}`, error);
  }
  
  // Handle star click
  const handleStarClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStar(item.id);
  }, [item.id, toggleStar]);
  
  // Handle interest click
  const handleInterestClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleInterest(item.id);
  }, [item.id, toggleInterest]);
  
  // Handle read click
  const handleReadClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleRead(item.id);
  }, [item.id, toggleRead]);
  
  // Handle score click
  const handleScoreClick = useCallback((e: React.MouseEvent, score: number) => {
    e.stopPropagation();
    setUserScore(item.id, score);
  }, [item.id, setUserScore]);
  
  // Source icon and color
  const sourceProps = {
    arxiv: {
      label: 'arXiv',
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    github: {
      label: 'GitHub',
      color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    },
  }[item.source];

  return (
    <div 
      className={cn(
        "glass-card rounded-lg p-5 transition-all duration-400 ease-apple overflow-hidden",
        isExpanded ? "ring-2 ring-ring/30" : "",
        isHovered ? "translate-y-[-2px] shadow-md" : ""
      )}
      onClick={toggleExpanded}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div className="flex justify-between items-start gap-4 mb-3">
        <Badge className={cn("font-normal", sourceProps.color)}>
          {sourceProps.label}
        </Badge>
        
        <div className="flex items-center gap-1.5">
          {/* Relevance score badge */}
          <div className="text-xs font-medium px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
            {item.relevanceScore}/10
          </div>
        </div>
      </div>
      
      {/* Title */}
      <h3 className={cn(
        "font-medium transition-all duration-300 ease-apple line-clamp-2",
        isExpanded ? "text-lg mb-4" : "text-base mb-2",
        item.isRead ? "text-muted-foreground" : ""
      )}>
        {item.title}
      </h3>
      
      {/* Description */}
      <p className={cn(
        "text-muted-foreground transition-all duration-300 ease-apple",
        isExpanded ? "line-clamp-none mb-4" : "line-clamp-2 text-sm mb-3",
      )}>
        {item.description}
      </p>
      
      {/* Tags */}
      {isExpanded && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Authors & Date */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="truncate">
          {item.authors.length > 1 
            ? `${item.authors[0]} + ${item.authors.length - 1} more`
            : item.authors[0]}
        </div>
        <div>{formattedDate}</div>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="animate-slide-up">
          <Separator className="my-4" />
          
          {/* User ratings */}
          <div className="space-y-4">
            {/* User score */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Your Score</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={(e) => handleScoreClick(e, score)}
                    className={cn(
                      "h-8 w-8 rounded-full grid place-items-center transition-colors",
                      item.userScore && item.userScore >= score
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
            
            {/* View button */}
            <div className="flex justify-between items-center">
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Button className="gap-2" variant="outline" size="sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View {item.source === 'arxiv' ? 'Paper' : 'Repository'}</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Card footer with actions */}
      <div className={cn(
        "flex items-center justify-between mt-3 pt-3 border-t border-border/50 transition-opacity",
        isHovered || isExpanded ? "opacity-100" : "opacity-70"
      )}>
        <TooltipProvider>
          <div className="flex items-center gap-1.5">
            {/* Star button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleStarClick}
                  className={cn(
                    "h-8 w-8 rounded-full grid place-items-center transition-colors",
                    item.isStarred 
                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  <Star className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.isStarred ? 'Remove star' : 'Star this'}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Interest button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleInterestClick}
                  className={cn(
                    "h-8 w-8 rounded-full grid place-items-center transition-colors",
                    item.isInterested 
                      ? "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  <Heart className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.isInterested ? 'Mark as not interested' : 'Mark as interested'}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Read button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleReadClick}
                  className={cn(
                    "h-8 w-8 rounded-full grid place-items-center transition-colors",
                    item.isRead 
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.isRead ? 'Mark as unread' : 'Mark as read'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Expand/collapse button */}
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={toggleExpanded}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ResearchCard;
