import requests
from bs4 import BeautifulSoup
import csv
import os
from datetime import datetime
from typing import List, Dict
from pathlib import Path

class CrawlerService:
    def __init__(self):
        self.sources = {
            "yahoo": "https://finance.yahoo.com/topic/stock-market-news/",
            "reuters": "https://www.reuters.com/business/finance", # Placeholder
            "bloomberg": "https://www.bloomberg.com/markets", # Placeholder
            "cnbc": "https://www.cnbc.com/finance/" # Placeholder
        }
        # Use absolute path relative to this file
        self.base_dir = Path(__file__).resolve().parent.parent # app/
        self.dataset_dir = self.base_dir / "data" / "datasets"
        os.makedirs(self.dataset_dir, exist_ok=True)

    def crawl(self, source: str = "yahoo") -> List[Dict[str, str]]:
        target_url = self.sources.get(source, self.sources["yahoo"])
        print(f"Starting crawl of {target_url} ({source})...")
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        
        headlines = []
        try:
            if source != "yahoo":
                 # Mock data for other sources
                 import random
                 mock_news = [
                     f"Market rally continues as {source.upper()} reports strong sector growth",
                     f"{source.upper()} Exclusive: Central bank considers rate adjustments",
                     f"Tech stocks surge in early trading according to {source.upper()} analysts",
                     f"Global supply chain issues persist, reports {source.upper()}",
                     f"Investors eye upcoming earnings reports - {source.upper()}"
                 ]
                 mock_images = [
                     "https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&q=80",
                     "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
                     "https://images.unsplash.com/photo-1535320903710-d9cf11df87e2?w=800&q=80",
                     "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&q=80",
                     "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=800&q=80"
                 ]
                 for i, text in enumerate(mock_news):
                     headlines.append({
                        'text': text + ". This is a simulated full article content to demonstrate the layout. " * 5,
                        'source': source.upper(),
                        'crawled_at': datetime.now().isoformat(),
                        'label': '',
                        'image_url': mock_images[i % len(mock_images)]
                    })
                 return headlines

            # Yahoo Finance Real Crawling
            response = requests.get(target_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find article links
            article_links = set()
            # Look for links in main news stream
            for a_tag in soup.find_all('a', href=True):
                href = a_tag['href']
                # Filter for likely article links (exclude ads, navigation, etc.)
                if '/news/' in href or '/m/' in href or (href.startswith('/') and len(href) > 30):
                    full_url = "https://finance.yahoo.com" + href if href.startswith('/') else href
                    if "finance.yahoo.com" in full_url:
                        article_links.add(full_url)
            
            print(f"Found {len(article_links)} potential article links. Fetching top 5...")
            
            count = 0
            for link in list(article_links):
                if count >= 5: break
                
                try:
                    print(f"Fetching article: {link}")
                    art_response = requests.get(link, headers=headers, timeout=5)
                    art_soup = BeautifulSoup(art_response.text, 'html.parser')
                    
                    # Extract Title
                    title_tag = art_soup.find('h1')
                    title = title_tag.get_text(strip=True) if title_tag else "No Title"
                    
                    # Extract Content (Yahoo uses caas-body usually)
                    content_div = art_soup.find('div', class_='caas-body')
                    if content_div:
                        paragraphs = content_div.find_all('p')
                        text_content = " ".join([p.get_text(strip=True) for p in paragraphs])
                    else:
                        # Fallback to all paragraphs
                        paragraphs = art_soup.find_all('p')
                        text_content = " ".join([p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 50])
                    
                    # Combine title and content
                    full_text = f"{title}. {text_content}"
                    
                    # Filter short or irrelevant content
                    if len(full_text) < 200:
                        continue
                        
                    # Extract Image
                    image_url = ""
                    meta_image = art_soup.find("meta", property="og:image")
                    if meta_image:
                        image_url = meta_image["content"]
                    
                    headlines.append({
                        'text': full_text[:5000], # Limit length
                        'source': 'Yahoo Finance',
                        'crawled_at': datetime.now().isoformat(),
                        'label': '',
                        'image_url': image_url
                    })
                    count += 1
                    
                except Exception as e:
                    print(f"Error fetching article {link}: {e}")
                    continue
            
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
            # Create a copy of headlines without image_url for saving
            headlines_to_save = []
            for h in headlines:
                h_copy = h.copy()
                if 'image_url' in h_copy:
                    del h_copy['image_url']
                headlines_to_save.append(h_copy)

            with open(file_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=['text', 'source', 'crawled_at', 'label'])
                writer.writeheader()
                writer.writerows(headlines_to_save)
            return filename
        except Exception as e:
            raise e

crawler_service = CrawlerService()
