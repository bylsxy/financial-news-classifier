# Financial News Classifier - Frontend

现代化财经新闻分类系统前端 - 基于 React + TypeScript + Vite

## ✨ 特性

- 🎨 **现代化 UI**：Tailwind CSS + 渐变背景 + 圆角设计
- 🎭 **流畅动画**：Framer Motion 驱动的页面过渡和组件动画
- 📊 **数据可视化**：Recharts 实现的 Top-K 事件类型置信度柱状图
- 📱 **完全响应式**：支持 Desktop / Tablet / Mobile 全设备
- 🔧 **可配置参数**：温度缩放 (Temperature) 和 Top-K 数量实时调节

## 🛠️ 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion
- **图表**: Recharts
- **图标**: Radix UI Icons

## 📦 安装依赖

```bash
npm install
```

## 🚀 开发运行

```bash
npm run dev
```

访问 <http://localhost:5173>

## 🏗️ 生产构建

```bash
npm run build
npm run preview
```

## 🧪 运行测试

```bash
# 运行所有测试
npm run test

# 交互式 UI 模式
npm run test:ui

# 安装浏览器（首次运行）
npx playwright install
```

## 📡 API 对接

后端地址通过 Vite 代理：`/api` → `http://localhost:8000`

### 请求示例

```typescript
POST /api/classify?temperature=1.2&top_k=5
{
  "text": "Apple Inc. reported strong quarterly earnings..."
}
```

### 响应格式

```json
{
  "input": "...",
  "result": {
    "market_direction": "bullish",
    "event_type": "financial_report",
    "impact_strength": "high",
    "risk_signal": "none"
  },
  "top_k": [
    { "label": "financial_report", "score": 0.45 }
  ]
}
```

## 📂 项目结构

```text
src/
├── api/              # API 调用
├── components/       # React 组件
├── lib/              # 工具函数
├── types/            # TypeScript 类型
└── App.tsx           # 主应用
```

## 🎨 核心组件

### NewsInput

文本输入 + Temperature/Top-K 滑块控制

### PredictionCard

渐变卡片展示分类结果 + Badge 标签

### TopKChart

Recharts 水平柱状图 + 动画效果

## 📸 测试截图

运行测试后查看 `tests/screenshots/`

---

**v2.0.0** · Powered by React + TypeScript + Vite
