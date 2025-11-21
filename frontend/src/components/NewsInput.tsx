import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { PredictionsResp } from '../types/api';
import { classifyNews } from '../api/classify';

interface NewsInputProps {
  onResult: (result: PredictionsResp) => void;
  onError: (error: string) => void;
}

export const NewsInput: React.FC<NewsInputProps> = ({ onResult, onError }) => {
  const [text, setText] = useState('');
  const [temperature, setTemperature] = useState(1.2);
  const [topK, setTopK] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      onError('请输入新闻文本');
      return;
    }

    setLoading(true);
    try {
      const result = await classifyNews(text, temperature, topK);
      onResult(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : '分类失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 文本输入区 */}
          <div>
            <label htmlFor="news-text" className="block text-sm font-medium text-gray-700 mb-2">
              财经新闻文本
            </label>
            <textarea
              id="news-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入财经新闻内容进行分类分析..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
              disabled={loading}
            />
          </div>

          {/* 参数控制 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {temperature.toFixed(1)}
              </label>
              <input
                id="temperature"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">控制预测分布的平滑度</p>
            </div>

            <div>
              <label htmlFor="topk" className="block text-sm font-medium text-gray-700 mb-2">
                Top-K: {topK}
              </label>
              <input
                id="topk"
                type="range"
                min="3"
                max="6"
                step="1"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">返回事件类型的数量</p>
            </div>
          </div>

          {/* 提交按钮 */}
          <motion.button
            type="submit"
            disabled={loading || !text.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                分析中...
              </span>
            ) : (
              '开始分类'
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
