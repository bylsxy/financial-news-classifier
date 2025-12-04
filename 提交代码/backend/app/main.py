"""
FastAPI 主应用入口
财经新闻分类系统后端服务
"""
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from app.api import classify, records, datasets, crawler
from app.services.bert_service import bert_service

# 创建 FastAPI 应用实例
app = FastAPI(
    title="财经新闻分类系统",
    description="标准化财经新闻分类 API：提供市场方向、事件类型、影响强度与风险信号四大结构化输出，并附 Top-k 事件类型置信度。",
    version="2.0.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加中间件以确保所有响应都包含 UTF-8 字符集
@app.middleware("http")
async def add_charset_utf8(request, call_next):
    response: Response = await call_next(request)
    if "charset" not in response.headers.get("content-type", ""):
        response.headers["content-type"] += "; charset=utf-8"
    return response

# 注册路由
app.include_router(classify.router, prefix="/api", tags=["classify"])
app.include_router(records.router, prefix="/api", tags=["records"])
app.include_router(datasets.router, prefix="/api", tags=["datasets"])
app.include_router(crawler.router, prefix="/api", tags=["crawler"])



@app.get("/")
async def root():
    """根路由"""
    return {"message": "财经新闻分类系统 API"}


@app.get("/ping")
async def ping():
    """健康检查路由"""
    return {"status": "ok", "message": "pong"}


@app.on_event("startup")
async def startup_event():
    """应用启动时的初始化操作"""
    print("🚀 FastAPI 服务启动中...")
    # 加载 FinBERT 模型
    try:
        bert_service.load_model()
    except Exception as e:
        print(f"⚠️ 模型加载失败 (可能是首次运行或网络问题): {e}")
    print("✅ 服务启动成功")


@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭时的清理操作"""
    print("👋 FastAPI 服务关闭")


