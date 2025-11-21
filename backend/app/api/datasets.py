"""
数据集管理 API
负责数据集上传、列表查看和触发训练
"""
import os
import shutil
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

router = APIRouter()

DATASET_DIR = "app/data/datasets"
os.makedirs(DATASET_DIR, exist_ok=True)

class DatasetInfo(BaseModel):
    filename: str
    size: int

@router.post("/upload_dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """上传 CSV 数据集"""
    if not file.filename or not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    file_path = os.path.join(DATASET_DIR, file.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")
        
    return {"filename": file.filename, "message": "Upload successful"}

@router.get("/datasets", response_model=List[DatasetInfo])
async def list_datasets():
    """获取已上传的数据集列表"""
    datasets = []
    if not os.path.exists(DATASET_DIR):
        return []
        
    for filename in os.listdir(DATASET_DIR):
        if filename.endswith('.csv'):
            file_path = os.path.join(DATASET_DIR, filename)
            size = os.path.getsize(file_path)
            datasets.append(DatasetInfo(filename=filename, size=size))
    return datasets

@router.post("/train")
async def train_model(dataset_name: str):
    """触发模型训练 (占位符)"""
    file_path = os.path.join(DATASET_DIR, dataset_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # TODO: 实际训练逻辑
    # 1. 读取 CSV
    # 2. Fine-tune FinBERT
    # 3. 保存新模型
    
    return {"status": "started", "message": f"Training started with {dataset_name} (Simulation)"}
