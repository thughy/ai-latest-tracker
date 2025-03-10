
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll event listener to change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-apple px-6 py-4",
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg grid place-items-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60"></div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="h-5 w-5 text-primary-foreground relative z-10"
            >
              <path d="M12 2v1"></path>
              <path d="M12 21v1"></path>
              <path d="M4.93 4.93l.71.71"></path>
              <path d="M18.36 18.36l.71.71"></path>
              <path d="M2 12h1"></path>
              <path d="M21 12h1"></path>
              <path d="M4.93 19.07l.71-.71"></path>
              <path d="M18.36 5.64l.71-.71"></path>
              <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
            </svg>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            AI Frontier <span className="text-primary font-normal">Tracker</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Tracking the latest developments in AI
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
