# 财经新闻分类系统

## 项目结构

```markdown
financial-news-classifier/
├── backend/          # Python + FastAPI 后端
├── dataset/          # 数据处理脚本
├── frontend/         # React + Vite 前端
└── docs/            # 文档
```

## 技术栈

- 后端: Python 3.12, FastAPI 0.104, FinBERT (ProsusAI/finbert), PyTorch 2.4
- 前端: React 19, TypeScript 5, Vite 7, Tailwind CSS 4, Framer Motion, Recharts
- 模型: FinBERT (标准化财经分类)

## 标准化财经分类体系 (v2)

后端现已升级为结构化财经新闻分类输出，包含四大固定维度：

1. 市场方向 (market_direction): `bullish` | `bearish` | `neutral`
2. 事件类型 (event_type): `macro_policy` | `industry_trend` | `company_action` | `financial_report` | `market_volatility` | `risk_warning`
3. 影响强度 (impact_strength): `high` | `medium` | `low`
4. 风险信号 (risk_signal): `default_risk` | `regulatory_risk` | `liquidity_risk` | `operational_risk` | `none`

分类结果同时返回 Top-k 事件类型置信度排名，便于前端图表展示。

## /api/classify 接口

POST `/api/classify`

请求 JSON:

```json
{"text": "Apple Inc. reported strong quarterly earnings..."}
```

可选 Query 参数:

- `temperature` (默认 1.2): 模型 logits 温度缩放，用于校准概率分布。
- `top_k` (默认 5): 返回前 k 个事件类型及其置信度。

返回 JSON 结构（固定不可变）：

```json
{
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
```

## 温度缩放 (Temperature Scaling)

实现方式：`softmax(logits / temperature)`，提高或降低分布平滑度：

- 较低温度 (<1.0) 使分布更尖锐
- 较高温度 (>1.0) 使分布更平滑

## Top-k 用途

`top_k` 提供事件类型候选置信度，适合前端绘制条形图 / 雷达图 / 趋势面板。

## 示例 curl 请求

```bash
curl -X POST "http://localhost:8000/api/classify?temperature=1.2&top_k=5" \
	-H "Content-Type: application/json" \
	-d '{"text": "Apple Inc. reported strong quarterly earnings..."}'
```

## 迁移说明

详见 `docs/migration_v2.md`，包含从情感分类到结构化财经分类的动机与不兼容变更。

## 快速启动

### 后端 (Python)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

访问 <http://localhost:8000/docs> 查看 API 文档

### 前端 (Node.js)

```bash
cd frontend
npm install
npm run dev
```

访问 <http://localhost:5173> 使用 Web 界面

详细说明见 `QUICKSTART.md`

## 核心功能

### 🎯 标准化分类输出

- **市场方向**: 利好/利空/中性
- **事件类型**: 6 大固定类别 (宏观政策、行业趋势、企业行动等)
- **影响强度**: 高/中/低
- **风险信号**: 违约、监管、流动性、运营风险或无风险

### 📊 可视化界面

- 现代化 UI 设计 (渐变背景、圆角卡片、流畅动画)
- Top-K 事件类型置信度柱状图
- 响应式布局 (Desktop/Tablet/Mobile)
- Temperature 与 Top-K 参数实时调节

### 🧪 测试覆盖

- 后端单元测试 (pytest)
- 前端 E2E 测试 (Playwright)
- 自动化截图对比

## 版本信息

**v2.0.0** - 标准化财经分类体系

- ✅ 从情感分类迁移到结构化多维分类
- ✅ 温度缩放校准概率分布
- ✅ Top-K 置信度输出
- ✅ 前端现代化重构
- ✅ 完整 E2E 测试覆盖

---
