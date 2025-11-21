from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.crawler_service import crawler_service

router = APIRouter()

class NewsItem(BaseModel):
    text: str
    source: str
    crawled_at: str
    label: str = ""

class SaveRequest(BaseModel):
    headlines: List[NewsItem]
    filename: str = None

class CrawlRequest(BaseModel):
    source: str = "yahoo"

@router.post("/crawl", response_model=List[NewsItem])
async def start_crawl(request: CrawlRequest = CrawlRequest()):
    """启动爬虫获取新闻"""
    try:
        headlines = crawler_service.crawl(source=request.source)
        return headlines
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/crawl/save")
async def save_crawled_data(request: SaveRequest):
    """保存爬取结果为数据集"""
    try:
        # Convert Pydantic models to dicts
        headlines_dicts = [item.dict() for item in request.headlines]
        filename = crawler_service.save_to_dataset(headlines_dicts, request.filename)
        return {"message": "Dataset saved successfully", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
