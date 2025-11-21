"""标准化财经标签映射模块

功能:
1. 接收 FinBERT 三分类 logits [Positive, Negative, Neutral]
2. 应用温度缩放 softmax 得到情绪分布
3. 利用固定加权矩阵扩展到 6 类事件类型伪 logits 并再次进行温度缩放 + softmax
4. 推断四大分类块: market_direction / event_type / impact_strength / risk_signal
5. 输出 Top-k 事件类型与置信度，结构:
     {
         "classification": {
             "market_direction": str,
             "event_type": str,
             "impact_strength": str,
             "risk_signal": str
         },
         "top_k": [ {"label": str, "score": float}, ... ]
     }

具备: 高内聚、无外部服务依赖，可单元测试。
"""
from typing import List, Dict, Any
import math

try:  # Optional torch usage if available (already in requirements)
    import torch
    TORCH_AVAILABLE = True
except Exception:
    TORCH_AVAILABLE = False

try:
    import numpy as np
    NUMPY_AVAILABLE = True
except Exception:
    NUMPY_AVAILABLE = False

# Fixed, non-changeable taxonomy definitions
MARKET_DIRECTION_LABELS = ["bullish", "bearish", "neutral"]
EVENT_TYPE_LABELS = [
    "macro_policy",
    "industry_trend",
    "company_action",
    "financial_report",
    "market_volatility",
    "risk_warning",
]
IMPACT_STRENGTH_LABELS = ["high", "medium", "low"]
RISK_SIGNAL_LABELS = ["default_risk", "regulatory_risk", "liquidity_risk", "operational_risk", "none"]

# Weight matrix (3 -> 6) to expand FinBERT sentiment logits to event type pseudo logits.
# Rows correspond to [Positive, Negative, Neutral] sentiment order used by original FinBERT mapping.
# Columns correspond to EVENT_TYPE_LABELS order above.
_EVENT_TYPE_WEIGHTS = [
    # macro_policy, industry_trend, company_action, financial_report, market_volatility, risk_warning
    [1.1, 1.0, 1.3, 1.05, 0.9, 0.8],   # Positive influence
    [0.9, 0.85, 0.7, 0.95, 1.25, 1.4], # Negative influence tends to boost volatility & risk_warning
    [1.0, 1.05, 1.0, 1.0, 1.0, 1.0],   # Neutral balanced
]


def _to_list(logits: Any) -> List[float]:
    """Convert incoming logits (tensor/list/ndarray) to python list of floats."""
    if TORCH_AVAILABLE and isinstance(logits, torch.Tensor):
        return logits.detach().cpu().view(-1).tolist()
    if NUMPY_AVAILABLE and isinstance(logits, np.ndarray):
        return logits.reshape(-1).astype(float).tolist()
    if isinstance(logits, (list, tuple)):
        return [float(x) for x in logits]
    raise TypeError("Unsupported logits type. Must be list/tuple/torch.Tensor/numpy.ndarray")


def _softmax(values: List[float]) -> List[float]:
    """Numerically stable softmax."""
    if not values:
        return []
    m = max(values)
    exps = [math.exp(v - m) for v in values]
    s = sum(exps)
    return [e / s for e in exps]


def _temperature_scale(logits: List[float], temperature: float) -> List[float]:
    if temperature <= 0:
        raise ValueError("temperature must be > 0")
    return [l / temperature for l in logits]


def _infer_market_direction(prob_sent: List[float]) -> str:
    # prob_sent ordered as [Positive, Negative, Neutral]
    idx = max(range(len(prob_sent)), key=lambda i: prob_sent[i])
    return MARKET_DIRECTION_LABELS[idx]


def _infer_impact_strength(prob_sent: List[float]) -> str:
    # Use confidence spread to gauge strength
    top = max(prob_sent)
    if top >= 0.70:
        return "high"
    if top >= 0.40:
        return "medium"
    return "low"


def _infer_risk_signal(prob_sent: List[float], market_direction: str) -> str:
    neg = prob_sent[1]
    pos = prob_sent[0]
    # Heuristic mapping
    if neg >= 0.65 and neg - pos >= 0.20:
        if neg >= 0.80:
            return "default_risk"
        if neg >= 0.75:
            return "regulatory_risk"
        return "liquidity_risk"
    if market_direction == "neutral" and prob_sent[2] >= 0.50 and neg >= 0.40:
        return "operational_risk"
    return "none"


def _expand_event_type_logits(sent_logits: List[float]) -> List[float]:
    # Matrix multiply sent_logits (len 3) by weights (3x6) => length 6 pseudo logits
    expanded = []
    for col in range(len(EVENT_TYPE_LABELS)):
        val = 0.0
        for row in range(3):
            val += sent_logits[row] * _EVENT_TYPE_WEIGHTS[row][col]
        expanded.append(val)
    return expanded


def map_finbert_logits_to_labels(logits: Any, top_k: int = 5, temperature: float = 1.2) -> Dict[str, Any]:
    """Map FinBERT 3-class sentiment logits to the fixed financial taxonomy.

    Args:
        logits: FinBERT raw logits (iterable/torch tensor) with order [Positive, Negative, Neutral].
        top_k: Number of event_type labels to include in ranked output (<= 6).
        temperature: Temperature for scaling BEFORE softmax.

    Returns:
        {
          "classification": {
             "market_direction": str,
             "event_type": str,
             "impact_strength": str,
             "risk_signal": str
          },
          "top_k": [ {"label": str, "score": float}, ... ]
        }
    """
    sent_logits = _to_list(logits)
    if len(sent_logits) != 3:
        raise ValueError("FinBERT logits must have length 3: [Positive, Negative, Neutral]")

    # Temperature scaling & softmax for sentiment
    scaled_sent = _temperature_scale(sent_logits, temperature)
    prob_sent = _softmax(scaled_sent)

    # Expand to event type pseudo logits, then apply temperature scaling + softmax
    expanded = _expand_event_type_logits(sent_logits)
    scaled_event = _temperature_scale(expanded, temperature)
    prob_event = _softmax(scaled_event)

    # Market direction
    market_direction = _infer_market_direction(prob_sent)
    # Impact strength
    impact_strength = _infer_impact_strength(prob_sent)
    # Risk signal
    risk_signal = _infer_risk_signal(prob_sent, market_direction)

    # Event type selection: choose max probability
    event_type_index = max(range(len(prob_event)), key=lambda i: prob_event[i])
    event_type = EVENT_TYPE_LABELS[event_type_index]

    # Top-k ranking
    top_k = max(1, min(top_k, len(EVENT_TYPE_LABELS)))
    ranked_indices = sorted(range(len(prob_event)), key=lambda i: prob_event[i], reverse=True)[:top_k]
    top_k_list = [
        {"label": EVENT_TYPE_LABELS[i], "score": round(prob_event[i], 6)}
        for i in ranked_indices
    ]

    return {
        "classification": {
            "market_direction": market_direction,
            "event_type": event_type,
            "impact_strength": impact_strength,
            "risk_signal": risk_signal,
        },
        "top_k": top_k_list,
    }

__all__ = ["map_finbert_logits_to_labels"]
