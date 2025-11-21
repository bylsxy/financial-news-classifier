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

// 鲜花色系 - 更鲜艳、更有生机
const COLORS = [
  '#ec4899', // pink-500
  '#8b5cf6', // violet-500
  '#6366f1', // indigo-500
  '#06b6d4', // cyan-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
];

export const TopKChart: React.FC<TopKChartProps> = ({ data }) => {
  const [animatedData, setAnimatedData] = useState(data.map(item => ({ ...item, score: 0 })));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(data);
    }, 100);
    return () => clearTimeout(timer);
  }, [data]);

  const formattedData = animatedData.map((item) => ({
    name: EVENT_TYPE_LABELS[item.label] || item.label,
    score: item.score * 100,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-white/50">
          <p className="font-bold text-slate-800 text-sm mb-1">{label}</p>
          <p className="text-fuchsia-600 font-mono font-bold">
            {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
          barSize={32}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            dy={10}
            interval={0} // 强制显示所有标签
          />
          <YAxis 
            hide // 隐藏Y轴，保持界面简洁
            domain={[0, 100]}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(255,255,255,0.2)' }}
          />
          <Bar
            dataKey="score"
            radius={[12, 12, 4, 4]} // 柔和的圆角
            animationDuration={1500}
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
