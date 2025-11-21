# 财经新闻分类系统 - 快速启动指南

## 系统架构

```text
financial-news-classifier/
├── backend/          # FastAPI + FinBERT 后端 (Python)
├── frontend/         # React + TypeScript 前端 (Node.js)
└── docs/            # 文档与迁移说明
```

## 启动步骤

### 1. 启动后端 (端口 8000)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

后端将在 <http://localhost:8000> 运行

API 文档: <http://localhost:8000/docs>

### 2. 启动前端 (端口 5173)

```bash
cd frontend
npm install
npm run dev
```

前端将在 <http://localhost:5173> 运行

### 3. 访问应用

打开浏览器访问: <http://localhost:5173>

## 功能演示

1. 在输入框粘贴财经新闻文本
2. 调节 Temperature (0.5 ~ 2.0) 控制预测平滑度
3. 调节 Top-K (3 ~ 6) 控制返回事件类型数量
4. 点击"开始分类"按钮
5. 查看结果：
   - 市场方向 (利好/利空/中性)
   - 事件类型 Badge
   - 影响强度 Badge
   - 风险信号 Badge
   - Top-K 置信度图表

## 测试用例示例

### 利好新闻

```text
Apple Inc. reported strong quarterly earnings exceeding market expectations, with revenue growth of 15% year-over-year driven by robust iPhone sales.
```

### 利空新闻

```text
The company announced massive layoffs affecting 20% of its workforce amid declining market share and regulatory investigations.
```

### 中性新闻

```text
The central bank maintained interest rates unchanged at 3.5% in its monthly policy meeting, in line with market forecasts.
```

## API 测试

使用 curl 测试后端 API:

```bash
curl -X POST "http://localhost:8000/api/classify?temperature=1.2&top_k=5" \
  -H "Content-Type: application/json" \
  -d '{"text": "Apple Inc. reported strong quarterly earnings..."}'
```

## 运行 E2E 测试

```bash
cd frontend
npx playwright install  # 首次运行
npm run test
```

测试截图保存在 `frontend/tests/screenshots/`

## 技术栈版本

### 后端

- Python 3.12+
- FastAPI 0.104.1
- Transformers 4.35.0
- PyTorch 2.4.0

### 前端

- Node.js 18+
- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 4

## 端口占用问题

如果端口已被占用：

### 后端

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### 前端

修改 `frontend/vite.config.ts`:

```typescript
server: {
  port: 5174,
}
```

## 常见问题

### 1. 后端模型下载慢

首次启动会下载 FinBERT 模型 (~500MB)，请耐心等待。可配置 HuggingFace 镜像加速。

### 2. 前端连接后端失败

检查：

- 后端是否在 <http://localhost:8000> 运行
- Vite 代理配置是否正确
- CORS 是否已启用

### 3. TypeScript 编译错误

```bash
cd frontend
npm install
```

## 文档

- 后端 API 文档: `docs/migration_v2.md`
- 前端组件文档: `frontend/README.md`
- 根目录 README: `README.md`

## 版本信息

- **系统版本**: v2.0.0
- **后端版本**: 2.0.0 (标准化分类体系)
- **前端版本**: 2.0.0 (现代化 UI)

---

快速上手 · 标准化财经新闻分类系统
