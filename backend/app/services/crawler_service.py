import requests
from bs4 import BeautifulSoup
import csv
import os
from datetime import datetime
from typing import List, Dict

class CrawlerService:
    def __init__(self):
        self.sources = {
            "yahoo": "https://finance.yahoo.com/topic/stock-market-news/",
            "reuters": "https://www.reuters.com/business/finance", # Placeholder
            "bloomberg": "https://www.bloomberg.com/markets", # Placeholder
            "cnbc": "https://www.cnbc.com/finance/" # Placeholder
        }
        self.dataset_dir = "app/data/datasets"
        os.makedirs(self.dataset_dir, exist_ok=True)

    def crawl(self, source: str = "yahoo") -> List[Dict[str, str]]:
        target_url = self.sources.get(source, self.sources["yahoo"])
        print(f"Starting crawl of {target_url} ({source})...")
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        
        headlines = []
        try:
            # For now, we only have specific logic for Yahoo. 
            # Real implementation for others would require different parsing logic.
            # We will simulate others if selected for demonstration or fallback to generic if possible.
            
            if source != "yahoo":
                 # Mock data for other sources to demonstrate UI functionality
                 # In a real app, we would implement specific parsers here.
                 import random
                 mock_news = [
                     f"Market rally continues as {source.upper()} reports strong sector growth",
                     f"{source.upper()} Exclusive: Central bank considers rate adjustments",
                     f"Tech stocks surge in early trading according to {source.upper()} analysts",
                     f"Global supply chain issues persist, reports {source.upper()}",
                     f"Investors eye upcoming earnings reports - {source.upper()}"
                 ]
                 for text in mock_news:
                     headlines.append({
                        'text': text,
                        'source': source.upper(),
                        'crawled_at': datetime.now().isoformat(),
                        'label': ''
                    })
                 return headlines

            response = requests.get(target_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Yahoo Finance structure heuristic
            seen_texts = set()
            for tag in soup.find_all(['h3', 'a']):
                text = tag.get_text(strip=True)
                if len(text) > 20 and not text.startswith("Yahoo") and "Privacy" not in text:
                    if text not in seen_texts:
                        seen_texts.add(text)
                        headlines.append({
                            'text': text,
                            'source': 'Yahoo Finance',
                            'crawled_at': datetime.now().isoformat(),
                            'label': '' # Placeholder
                        })
            
            print(f"Found {len(headlines)} headlines.")
            return headlines

        except Exception as e:
            print(f"Crawling failed: {e}")
            raise e

    def save_to_dataset(self, headlines: List[Dict[str, str]], filename: str = None) -> str:
        if not filename:
            filename = f"crawled_news_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        if not filename.endswith('.csv'):
            filename += '.csv'
            
        file_path = os.path.join(self.dataset_dir, filename)
        
        try:
            with open(file_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=['text', 'source', 'crawled_at', 'label'])
                writer.writeheader()
                writer.writerows(headlines)
            return filename
        except Exception as e:
            raise e

crawler_service = CrawlerService()
