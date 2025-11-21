# Migration to v2: 从情感分类到结构化财经分类

## 背景与动机

原系统仅提供三类情感 (Positive / Negative / Neutral) 输出，无法支撑更细粒度的财经资讯分析与前端可视化需求。为提升实用性与扩展性，本次迁移引入“标准化财经新闻分类体系”，输出四大维度并附 Top-k 事件类型置信度，便于投资决策、监测风险与趋势解读。

## 新 Schema 定义

| 维度 | 字段名 | 固定取值 | 说明 |
|------|--------|-----------|------|
| 市场方向 | `market_direction` | `bullish` / `bearish` / `neutral` | 基于情绪分布主导方向 |
| 事件类型 | `event_type` | `macro_policy` / `industry_trend` / `company_action` / `financial_report` / `market_volatility` / `risk_warning` | 通过加权扩展映射得到最可能事件类型 |
| 影响强度 | `impact_strength` | `high` / `medium` / `low` | 最高情绪概率与分布集中度推断 |
| 风险信号 | `risk_signal` | `default_risk` / `regulatory_risk` / `liquidity_risk` / `operational_risk` / `none` | 负向与中性权重组合的启发式风险提示 |

附加：`top_k` 列表返回前 k 个事件类型及其概率，用于可视化。

## 温度缩放 (Temperature Scaling)

采用 `softmax(logits / temperature)` 方式，默认 `temperature=1.2`。较高温度使分布更平滑，提高不确定性表达；可用于前端调节风险敏感度。

## 对前端的影响

1. 旧的情绪三分类图表需替换为：
   - 市场方向单值展示（指示灯 / 箭头）
   - 事件类型 Top-k 条形图或环形图
   - 影响强度仪表盘或分级标签
   - 风险信号徽章/警示条
2. 新增对 `top_k` 的可视化支持。
3. 请求参数可增加 `temperature` 与 `top_k` 控件。

## 不兼容变更 (Breaking Changes)

| 项目 | v1 | v2 |
|------|----|----|
| API 路径 | `/api/classify` | 同路径 (结构变更) |
| 返回字段 | `{sentiment: ...}` | `{input, result:{...}, top_k:[...]}` |
| 情感标签 | Positive/Negative/Neutral | 不再直接返回，内嵌推断 |
| 版本号 | 1.0.0 | 2.0.0 |
| 概率结构 | 单一 softmax | 多层温度缩放 + 扩展映射 |

需要前端更新解析逻辑与展示组件，旧字段不再可用。

## 升级步骤摘要

1. 引入 `label_mapper.py` 完成分类扩展与映射。
2. 更新 `bert_service.py` 加入显式温度缩放。
3. 替换 `/classify` 响应模型为新结构。
4. 增补单元测试确保稳定性与可复现性。
5. 文档与版本号更新至 2.0.0。

## 回滚策略

若需临时回退，可切换到上一版本提交（v1.0.0 标签）并恢复旧响应解析。注意前端需同时回滚。

---
如需扩展更多财经维度（例如地域、资产类别），可在保持现有四大核心块不变的前提下追加字段，避免再次产生破坏性变更。
