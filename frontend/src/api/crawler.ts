const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface NewsItem {
  text: string;
  source: string;
  crawled_at: string;
  label: string;
}

export async function crawlNews(source: string = 'yahoo'): Promise<NewsItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/crawl`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ source }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function saveCrawledData(headlines: NewsItem[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/crawl/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ headlines }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}
