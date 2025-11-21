import React from 'react';
import { motion } from 'framer-motion';
import { TriangleUpIcon, TriangleDownIcon, MinusIcon } from '@radix-ui/react-icons';
import type { PredictionsResp } from '../types/api';
import { TopKChart } from './TopKChart';
import { cn } from '../lib/utils';

interface PredictionCardProps {
  data: PredictionsResp;
}

// 市场方向映射
const MARKET_DIRECTION_CONFIG = {
  bullish: {
    label: '利好',
    color: 'text-green-600 bg-green-100',
    icon: TriangleUpIcon,
  },
  bearish: {
    label: '利空',
    color: 'text-red-600 bg-red-100',
    icon: TriangleDownIcon,
  },
  neutral: {
    label: '中性',
    color: 'text-gray-600 bg-gray-100',
    icon: MinusIcon,
  },
};

// 事件类型映射
const EVENT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  macro_policy: { label: '宏观政策', color: 'bg-blue-100 text-blue-700' },
  industry_trend: { label: '行业趋势', color: 'bg-purple-100 text-purple-700' },
  company_action: { label: '企业行动', color: 'bg-pink-100 text-pink-700' },
  financial_report: { label: '财报相关', color: 'bg-indigo-100 text-indigo-700' },
  market_volatility: { label: '市场波动', color: 'bg-orange-100 text-orange-700' },
  risk_warning: { label: '风险提示', color: 'bg-red-100 text-red-700' },
};

// 影响强度映射
const IMPACT_STRENGTH_CONFIG: Record<string, { label: string; color: string }> = {
  high: { label: '高', color: 'bg-red-100 text-red-700' },
  medium: { label: '中', color: 'bg-yellow-100 text-yellow-700' },
  low: { label: '低', color: 'bg-green-100 text-green-700' },
};

// 风险信号映射
const RISK_SIGNAL_CONFIG: Record<string, { label: string; color: string }> = {
  default_risk: { label: '违约风险', color: 'bg-red-100 text-red-700' },
  regulatory_risk: { label: '监管风险', color: 'bg-orange-100 text-orange-700' },
  liquidity_risk: { label: '流动性风险', color: 'bg-yellow-100 text-yellow-700' },
  operational_risk: { label: '运营风险', color: 'bg-purple-100 text-purple-700' },
  none: { label: '无风险', color: 'bg-green-100 text-green-700' },
};

export const PredictionCard: React.FC<PredictionCardProps> = ({ data }) => {
  const { result, top_k, input } = data;
  const directionConfig = MARKET_DIRECTION_CONFIG[result.market_direction];
  const DirectionIcon = directionConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        {/* 输入文本预览 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">输入文本</h3>
          <p className="text-gray-700 text-sm line-clamp-3">{input}</p>
        </div>

        {/* 市场方向 - 主标题 */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center justify-center gap-3"
        >
          <div className={cn('p-3 rounded-full', directionConfig.color)}>
            <DirectionIcon className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800">{directionConfig.label}</h2>
        </motion.div>

        {/* 分类标签 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {/* 事件类型 */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500 font-medium">事件类型</span>
            <span className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold',
              EVENT_TYPE_CONFIG[result.event_type]?.color || 'bg-gray-100 text-gray-700'
            )}>
              {EVENT_TYPE_CONFIG[result.event_type]?.label || result.event_type}
            </span>
          </div>

          {/* 影响强度 */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500 font-medium">影响强度</span>
            <span className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold',
              IMPACT_STRENGTH_CONFIG[result.impact_strength]?.color || 'bg-gray-100 text-gray-700'
            )}>
              {IMPACT_STRENGTH_CONFIG[result.impact_strength]?.label || result.impact_strength}
            </span>
          </div>

          {/* 风险信号 */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500 font-medium">风险信号</span>
            <span className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold',
              RISK_SIGNAL_CONFIG[result.risk_signal]?.color || 'bg-gray-100 text-gray-700'
            )}>
              {RISK_SIGNAL_CONFIG[result.risk_signal]?.label || result.risk_signal}
            </span>
          </div>
        </motion.div>

        {/* Top-K 事件类型图表 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">事件类型置信度分布</h3>
          <div className="h-64 md:h-80">
            <TopKChart data={top_k} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
