import math
import os
import sys

# Adjust path to allow importing label_mapper without installing package
CURRENT_DIR = os.path.dirname(__file__)
BACKEND_APP_PATH = os.path.abspath(os.path.join(CURRENT_DIR, "..", "app"))
if BACKEND_APP_PATH not in sys.path:
    sys.path.append(BACKEND_APP_PATH)

from services.label_mapper import map_finbert_logits_to_labels


MARKET_DIRECTION_LABELS = {"bullish", "bearish", "neutral"}
EVENT_TYPE_LABELS = {
    "macro_policy",
    "industry_trend",
    "company_action",
    "financial_report",
    "market_volatility",
    "risk_warning",
}
IMPACT_STRENGTH_LABELS = {"high", "medium", "low"}
RISK_SIGNAL_LABELS = {"default_risk", "regulatory_risk", "liquidity_risk", "operational_risk", "none"}


def test_output_contains_required_fields():
    logits = [2.0, -1.0, 0.5]
    result = map_finbert_logits_to_labels(logits, top_k=5, temperature=1.2)
    assert "classification" in result
    assert "top_k" in result
    cls = result["classification"]
    for k in ["market_direction", "event_type", "impact_strength", "risk_signal"]:
        assert k in cls
    assert isinstance(result["top_k"], list)


def test_top_k_sorted_descending():
    logits = [1.0, 0.2, -0.5]
    result = map_finbert_logits_to_labels(logits, top_k=6, temperature=1.2)
    scores = [item["score"] for item in result["top_k"]]
    assert scores == sorted(scores, reverse=True)


def test_temperature_scaling_changes_distribution():
    logits = [1.5, -0.3, 0.1]
    r_low_temp = map_finbert_logits_to_labels(logits, top_k=6, temperature=0.7)
    r_high_temp = map_finbert_logits_to_labels(logits, top_k=6, temperature=2.0)
    # Compare entropy of event probs to ensure difference
    probs_low = [item["score"] for item in r_low_temp["top_k"]]
    probs_high = [item["score"] for item in r_high_temp["top_k"]]

    def entropy(p):
        return -sum(x * math.log(x + 1e-12) for x in p)

    e_low = entropy(probs_low)
    e_high = entropy(probs_high)
    # Higher temperature should flatten distribution => higher entropy
    assert e_high > e_low


def test_all_four_categories_valid_labels():
    logits = [0.3, 0.1, 0.0]
    result = map_finbert_logits_to_labels(logits, top_k=3, temperature=1.2)
    cls = result["classification"]
    assert cls["market_direction"] in MARKET_DIRECTION_LABELS
    assert cls["event_type"] in EVENT_TYPE_LABELS
    assert cls["impact_strength"] in IMPACT_STRENGTH_LABELS
    assert cls["risk_signal"] in RISK_SIGNAL_LABELS


def test_negative_logits_handled():
    logits = [-2.0, -0.5, -1.0]
    result = map_finbert_logits_to_labels(logits, top_k=4, temperature=1.2)
    assert len(result["top_k"]) == 4
    # Scores should form a valid probability subset (each >0)
    for item in result["top_k"]:
        assert item["score"] > 0


def test_zero_logits_uniform_distribution():
    logits = [0.0, 0.0, 0.0]
    result = map_finbert_logits_to_labels(logits, top_k=6, temperature=1.2)
    scores = [item["score"] for item in result["top_k"]]
    # All equal (allow small rounding differences)
    assert max(scores) - min(scores) < 1e-9
    # Sum of event type probabilities should be ~1
    assert abs(sum(scores) - 1.0) < 5e-6
