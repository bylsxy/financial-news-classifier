"""
分类 API 路由
提供新闻文本分类接口
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.bert_service import bert_service

router = APIRouter()


class ClassifyRequest(BaseModel):
    """分类请求模型"""
    text: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "Apple Inc. reported strong quarterly earnings..."
            }
        }


class ClassificationBlock(BaseModel):
    market_direction: str
    event_type: str
    impact_strength: str
    risk_signal: str

class TopKItem(BaseModel):
    label: str
    score: float

class ClassifyResponse(BaseModel):
    input: str
    result: ClassificationBlock
    top_k: list[TopKItem]

    class Config:
        json_schema_extra = {
            "example": {
                "input": "Apple Inc. reported strong quarterly earnings...",
                "result": {
                    "market_direction": "bullish",
                    "event_type": "financial_report",
                    "impact_strength": "high",
                    "risk_signal": "none"
                },
                "top_k": [
                    {"label": "financial_report", "score": 0.41},
                    {"label": "company_action", "score": 0.28},
                    {"label": "industry_trend", "score": 0.12}
                ]
            }
        }


@router.post("/classify", response_model=ClassifyResponse)
async def classify_news(request: ClassifyRequest, temperature: float = 1.2, top_k: int = 5):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="文本不能为空")
    try:
        mapped = bert_service.classify_text(request.text, temperature=temperature, top_k=top_k)
        return ClassifyResponse(
            input=request.text,
            result=ClassificationBlock(**mapped["classification"]),
            top_k=[TopKItem(**item) for item in mapped["top_k"]]
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"分类失败: {str(e)}")
