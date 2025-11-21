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
        
    # Get all CSV files
    files = [f for f in os.listdir(DATASET_DIR) if f.endswith('.csv')]
    
    # Sort by modification time (newest first)
    files.sort(key=lambda x: os.path.getmtime(os.path.join(DATASET_DIR, x)), reverse=True)
    
    for filename in files:
        file_path = os.path.join(DATASET_DIR, filename)
        size = os.path.getsize(file_path)
        datasets.append(DatasetInfo(filename=filename, size=size))
    return datasets

@router.get("/datasets/{filename}/preview")
async def preview_dataset(filename: str):
    """预览数据集前5行"""
    file_path = os.path.join(DATASET_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    try:
        import pandas as pd
        df = pd.read_csv(file_path, nrows=5)
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read dataset: {e}")

@router.delete("/datasets/{filename}")
async def delete_dataset(filename: str):
    """删除数据集"""
    file_path = os.path.join(DATASET_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    try:
        os.remove(file_path)
        return {"message": "Dataset deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete dataset: {e}")

@router.post("/train")
async def train_model(dataset_name: str):
    """触发模型训练"""
    from app.services.bert_service import bert_service
    
    file_path = os.path.join(DATASET_DIR, dataset_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    try:
        result = bert_service.start_training(file_path)
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/train/status")
async def get_training_status():
    """获取训练状态"""
    from app.services.bert_service import bert_service
    return bert_service.get_training_status()
