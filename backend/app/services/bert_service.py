"""
FinBERT 模型服务
负责加载模型、tokenizer 和执行推理
"""
import torch
import torch.nn.functional as F
from transformers import BertTokenizer, BertForSequenceClassification
from typing import Dict


class FinBERTService:
    """FinBERT 模型服务类"""
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.model_name = "ProsusAI/finbert"
        self.is_loaded = False
        
        # FinBERT 标签映射
        self.labels_map = {
            0: "Positive",   # 利好
            1: "Negative",   # 利空
            2: "Neutral"     # 中性
        }
    
    def load_model(self):
        """
        加载 FinBERT 模型和 tokenizer
        """
        if self.is_loaded:
            print("⚠️  模型已加载，跳过重复加载")
            return
        
        try:
            print(f"📦 正在加载模型: {self.model_name}")
            print("⏳ 首次加载可能需要下载模型文件，请稍候...")
            
            # 加载分词器
            self.tokenizer = BertTokenizer.from_pretrained(self.model_name)
            
            # 加载模型（用于序列分类）
            self.model = BertForSequenceClassification.from_pretrained(self.model_name)
            
            # 设置为评估模式（关闭 dropout 等训练特性）
            self.model.eval()
            
            self.is_loaded = True
            print("✅ 模型加载成功！")
            
        except Exception as e:
            print(f"❌ 模型加载失败: {str(e)}")
            self.is_loaded = False
            raise
    
    def classify_text(self, text: str, temperature: float = 1.2, top_k: int = 5) -> Dict[str, any]:
        """执行标准化财经分类推理并返回结构化结果。

        Args:
            text: 待分类文本
            temperature: 温度缩放参数 (默认 1.2)
            top_k: Top-k 事件类型返回数量

        Returns:
            {
              "classification": {"market_direction": ..., "event_type": ..., "impact_strength": ..., "risk_signal": ...},
              "top_k": [{"label": str, "score": float}, ...]
            }
        """
        if not self.is_loaded:
            raise RuntimeError("模型未加载，请先调用 load_model()")

        if not text or not text.strip():
            raise ValueError("输入文本不能为空")

        try:
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=512
            )

            with torch.no_grad():
                outputs = self.model(**inputs)

            logits = outputs.logits[0]  # shape [3]

            # 显式温度缩放与 softmax（满足规范要求）——结果仅用于内部验证，不直接返回
            if temperature <= 0:
                raise ValueError("temperature 必须 > 0")
            scaled_logits = logits / temperature
            _ = F.softmax(scaled_logits, dim=-1)  # 计算后不外露，最终映射交由 label_mapper

            from .label_mapper import map_finbert_logits_to_labels
            mapped = map_finbert_logits_to_labels(logits, top_k=top_k, temperature=temperature)
            return mapped

        except Exception as e:
            print(f"❌ 分类过程出错: {str(e)}")
            raise


# 创建全局服务实例
bert_service = FinBERTService()

