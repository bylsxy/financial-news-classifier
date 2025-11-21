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
    color: 'text-emerald-600 bg-emerald-100 border-emerald-200',
    icon: TriangleUpIcon,
    gradient: 'from-emerald-50 to-teal-50',
  },
  bearish: {
    label: '利空',
    color: 'text-rose-600 bg-rose-100 border-rose-200',
    icon: TriangleDownIcon,
    gradient: 'from-rose-50 to-pink-50',
  },
  neutral: {
    label: '中性',
    color: 'text-slate-600 bg-slate-100 border-slate-200',
    icon: MinusIcon,
    gradient: 'from-slate-50 to-gray-50',
  },
};

// 事件类型映射
const EVENT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  macro_policy: { label: '宏观政策', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  industry_trend: { label: '行业趋势', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  company_action: { label: '企业行动', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  financial_report: { label: '财报相关', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  market_volatility: { label: '市场波动', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  risk_warning: { label: '风险提示', color: 'bg-red-100 text-red-700 border-red-200' },
};

// 影响强度映射
const IMPACT_STRENGTH_CONFIG: Record<string, { label: string; color: string }> = {
  high: { label: '高', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  medium: { label: '中', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  low: { label: '低', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

// 风险信号映射
const RISK_SIGNAL_CONFIG: Record<string, { label: string; color: string }> = {
  default_risk: { label: '违约风险', color: 'bg-red-100 text-red-700 border-red-200' },
  regulatory_risk: { label: '监管风险', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  liquidity_risk: { label: '流动性风险', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  operational_risk: { label: '运营风险', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  none: { label: '无风险', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

export const PredictionCard: React.FC<PredictionCardProps> = ({ data }) => {
  const { result, top_k, input } = data;
  const directionConfig = MARKET_DIRECTION_CONFIG[result.market_direction];
  const DirectionIcon = directionConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className={cn(
        "rounded-3xl shadow-2xl p-8 md:p-10 space-y-8 border border-white/40 backdrop-blur-xl relative overflow-hidden",
        `bg-gradient-to-br ${directionConfig.gradient}`
      )}>
        {/* 装饰背景 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        {/* 输入文本预览 */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Input Text</h3>
          <p className="text-slate-700 text-base leading-relaxed line-clamp-3 italic font-serif">"{input}"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* 左侧：核心结论 */}
          <div className="space-y-8">
            {/* 市场方向 - 主标题 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center justify-center p-6 bg-white/50 rounded-3xl border border-white/40 shadow-inner"
            >
              <div className={cn('p-4 rounded-full mb-4 shadow-lg', directionConfig.color)}>
                <DirectionIcon className="w-12 h-12" />
              </div>
              <h2 className="text-5xl font-black text-slate-800 tracking-tight">{directionConfig.label}</h2>
              <span className="text-slate-500 text-sm mt-2 font-medium">市场方向预测</span>
            </motion.div>

            {/* 分类标签 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {/* 事件类型 */}
              <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/30 transition-colors hover:bg-white/50">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Event Type</span>
                <span className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-bold border',
                  EVENT_TYPE_CONFIG[result.event_type]?.color || 'bg-gray-100 text-gray-700'
                )}>
                  {EVENT_TYPE_CONFIG[result.event_type]?.label || result.event_type}
                </span>
              </div>

              {/* 影响强度 */}
              <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/30 transition-colors hover:bg-white/50">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Impact</span>
                <span className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-bold border',
                  IMPACT_STRENGTH_CONFIG[result.impact_strength]?.color || 'bg-gray-100 text-gray-700'
                )}>
                  {IMPACT_STRENGTH_CONFIG[result.impact_strength]?.label || result.impact_strength}
                </span>
              </div>

              {/* 风险信号 */}
              <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/30 transition-colors hover:bg-white/50">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Risk Signal</span>
                <span className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-bold border',
                  RISK_SIGNAL_CONFIG[result.risk_signal]?.color || 'bg-gray-100 text-gray-700'
                )}>
                  {RISK_SIGNAL_CONFIG[result.risk_signal]?.label || result.risk_signal}
                </span>
              </div>
            </motion.div>
          </div>

          {/* 右侧：Top-K 图表 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-lg h-full min-h-[400px] flex flex-col"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500" />
              置信度分布
            </h3>
            <div className="flex-1 w-full min-h-0">
              <TopKChart data={top_k} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
