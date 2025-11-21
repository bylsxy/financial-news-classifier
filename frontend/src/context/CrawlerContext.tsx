import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NewsItem } from '../api/crawler';

interface CrawlerContextType {
  headlines: NewsItem[];
  setHeadlines: (headlines: NewsItem[]) => void;
}

const CrawlerContext = createContext<CrawlerContextType | undefined>(undefined);

export const CrawlerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [headlines, setHeadlines] = useState<NewsItem[]>([]);

  return (
    <CrawlerContext.Provider value={{ headlines, setHeadlines }}>
      {children}
    </CrawlerContext.Provider>
  );
};

export const useCrawler = () => {
  const context = useContext(CrawlerContext);
  if (context === undefined) {
    throw new Error('useCrawler must be used within a CrawlerProvider');
  }
  return context;
};
