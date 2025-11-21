import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { PredictionsResp } from '../types/api';
import { classifyNews } from '../api/classify';

interface NewsInputProps {
  onResult: (result: PredictionsResp) => void;
  onError: (error: string) => void;
  value: string;
  onChange: (text: string) => void;
}

export const NewsInput: React.FC<NewsInputProps> = ({ onResult, onError, value, onChange }) => {
  const [temperature, setTemperature] = useState(1.2);
  const [topK, setTopK] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value.trim()) {
      onError('请输入新闻文本');
      return;
    }

    setLoading(true);
    try {
      const result = await classifyNews(value, temperature, topK);
      onResult(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : '分类失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400" />
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 文本输入区 */}
          <div className="relative">
            <label htmlFor="news-text" className="block text-lg font-semibold text-slate-700 mb-3">
              财经新闻文本
            </label>
            <textarea
              id="news-text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="在此输入财经新闻内容，AI 将为您进行深度分析..."
              rows={6}
              className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 resize-none text-slate-700 placeholder:text-slate-400 text-lg shadow-inner"
              disabled={loading}
            />
          </div>

          {/* 参数控制 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label htmlFor="temperature" className="text-sm font-semibold text-slate-600">
                  Temperature (平滑度)
                </label>
                <span className="text-sm font-mono text-purple-600 bg-purple-100 px-2 py-1 rounded-md">{temperature.toFixed(1)}</span>
              </div>
              <input
                id="temperature"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-600 transition-colors"
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label htmlFor="topk" className="text-sm font-semibold text-slate-600">
                  Top-K (展示数量)
                </label>
                <span className="text-sm font-mono text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md">{topK}</span>
              </div>
              <input
                id="topk"
                type="range"
                min="3"
                max="6"
                step="1"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          {/* 提交按钮 */}
          <motion.button
            type="submit"
            disabled={loading || !value.trim()}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg tracking-wide"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                正在深度分析...
              </span>
            ) : (
              '开始智能分析'
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
