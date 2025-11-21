"""
历史记录 API 路由
负责管理新闻分类的历史记录 (CRUD)
"""
import json
import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

DATA_FILE = "app/data/records.json"

class NewsRecord(BaseModel):
    id: Optional[str] = None
    text: str
    label: str
    confidence: float
    timestamp: Optional[str] = None

def _load_records() -> List[dict]:
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def _save_records(records: List[dict]):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

@router.get("/records", response_model=List[NewsRecord])
async def get_records():
    """获取所有历史记录"""
    return _load_records()

@router.post("/records", response_model=NewsRecord)
async def add_record(record: NewsRecord):
    """添加一条新记录"""
    records = _load_records()
    
    new_record = record.model_dump()
    new_record["id"] = str(uuid.uuid4())
    new_record["timestamp"] = datetime.now().isoformat()
    
    records.insert(0, new_record) # 最新在最前
    _save_records(records)
    
    return new_record

@router.delete("/records/{record_id}")
async def delete_record(record_id: str):
    """删除指定记录"""
    records = _load_records()
    initial_len = len(records)
    records = [r for r in records if r["id"] != record_id]
    
    if len(records) == initial_len:
        raise HTTPException(status_code=404, detail="Record not found")
        
    _save_records(records)
    return {"status": "success", "message": "Record deleted"}
