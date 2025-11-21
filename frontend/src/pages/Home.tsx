import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsInput } from '../components/NewsInput';
import { PredictionCard } from '../components/PredictionCard';
import type { PredictionsResp } from '../types/api';

interface HomeProps {
  inputText: string;
  setInputText: (text: string) => void;
  onPredictionSuccess: (text: string, label: string) => void;
}

export const Home: React.FC<HomeProps> = ({ inputText, setInputText, onPredictionSuccess }) => {
  const [prediction, setPrediction] = useState<PredictionsResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResult = (result: PredictionsResp) => {
    setPrediction(result);
    setError(null);
    onPredictionSuccess(inputText, result.result.market_direction);
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen p-8 md:p-12 lg:pl-96">
      <div className="max-w-5xl mx-auto">
        {/* 头部标题 */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl -z-10" />
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 mb-6 tracking-tight drop-shadow-sm">
            Financial News Classifier
          </h1>
          <p className="text-slate-600 text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
            基于 FinBERT 的财经新闻智能分类系统
          </p>
          <div className="flex justify-center gap-4 mt-4 text-sm font-medium text-slate-500">
            <span className="px-3 py-1 bg-white/50 rounded-full backdrop-blur-sm border border-white/20">标准化分类</span>
            <span className="px-3 py-1 bg-white/50 rounded-full backdrop-blur-sm border border-white/20">多维度风险</span>
            <span className="px-3 py-1 bg-white/50 rounded-full backdrop-blur-sm border border-white/20">可视化分布</span>
          </div>
        </motion.header>

        {/* 主内容区 */}
        <div className="space-y-8">
          {/* 输入组件 */}
          <NewsInput 
            value={inputText}
            onChange={setInputText}
            onResult={handleResult} 
            onError={handleError} 
          />

          {/* 错误提示 */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-red-50/80 backdrop-blur-md border border-red-200 rounded-2xl p-4 flex items-center gap-4 shadow-lg shadow-red-100/50">
                  <div className="p-2 bg-red-100 rounded-full text-red-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <p className="text-red-800 font-semibold text-lg">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 预测结果卡片 */}
          <AnimatePresence mode="wait">
            {prediction && <PredictionCard data={prediction} />}
          </AnimatePresence>
        </div>

        {/* 页脚 */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-24 text-slate-400 text-sm font-medium"
        >
          <p className="flex items-center justify-center gap-2">
            <span>✨ Powered by FinBERT</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Designed for Financial Insight</span>
          </p>
        </motion.footer>
      </div>
    </div>
  );
};
