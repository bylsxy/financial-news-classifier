import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import type { TopKItem } from '../types/api';

interface TopKChartProps {
  data: TopKItem[];
}

// 事件类型中文映射
const EVENT_TYPE_LABELS: Record<string, string> = {
  macro_policy: '宏观政策',
  industry_trend: '行业趋势',
  company_action: '企业行动',
  financial_report: '财报相关',
  market_volatility: '市场波动',
  risk_warning: '风险提示',
};

// 柔和渐变色系
const COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
];

export const TopKChart: React.FC<TopKChartProps> = ({ data }) => {
  const [animatedData, setAnimatedData] = useState(data.map(item => ({ ...item, score: 0 })));

  useEffect(() => {
    // 动画效果：从 0 到实际值
    const timer = setTimeout(() => {
      setAnimatedData(data);
    }, 100);
    return () => clearTimeout(timer);
  }, [data]);

  const formattedData = animatedData.map((item) => ({
    ...item,
    displayLabel: EVENT_TYPE_LABELS[item.label] || item.label,
    percentage: (item.score * 100).toFixed(1),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].payload.displayLabel}</p>
          <p className="text-sm text-indigo-600">
            置信度: {payload[0].payload.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            stroke="#6b7280"
          />
          <YAxis
            type="category"
            dataKey="displayLabel"
            stroke="#6b7280"
            width={90}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
          <Bar
            dataKey="score"
            radius={[0, 8, 8, 0]}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {formattedData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
