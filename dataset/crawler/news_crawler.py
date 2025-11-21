import requests
from bs4 import BeautifulSoup
import csv
import os
import time
from datetime import datetime

# 配置
TARGET_URL = "https://finance.yahoo.com/topic/stock-market-news/"
OUTPUT_DIR = "../../backend/app/data/datasets"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, f"crawled_news_{datetime.now().strftime('%Y%m%d')}.csv")

def crawl_yahoo_finance():
    print(f"Starting crawl of {TARGET_URL}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(TARGET_URL, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Yahoo Finance structure often changes, looking for common headline tags
        # This is a heuristic approach
        headlines = []
        
        # Try finding h3 tags which are often used for headlines in lists
        for tag in soup.find_all(['h3', 'a']):
            text = tag.get_text(strip=True)
            # Filter out short or irrelevant text
            if len(text) > 20 and not text.startswith("Yahoo") and "Privacy" not in text:
                # Simple deduplication
                if text not in [h['text'] for h in headlines]:
                    headlines.append({
                        'text': text,
                        'source': 'Yahoo Finance',
                        'crawled_at': datetime.now().isoformat()
                    })
        
        print(f"Found {len(headlines)} potential headlines.")
        
        # Ensure output directory exists
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        # Save to CSV
        with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['text', 'source', 'crawled_at', 'label']) # Added label column for future use
            writer.writeheader()
            for h in headlines:
                writer.writerow({**h, 'label': ''}) # Empty label for user to fill
                
        print(f"Successfully saved to {OUTPUT_FILE}")
        return headlines

    except Exception as e:
        print(f"Crawling failed: {e}")
        return []

if __name__ == "__main__":
    crawl_yahoo_finance()
