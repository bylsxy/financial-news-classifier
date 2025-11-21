import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsInput } from './components/NewsInput.tsx';
import { PredictionCard } from './components/PredictionCard';
import type { PredictionsResp } from './types/api';
import './App.css';

function App() {
  const [prediction, setPrediction] = useState<PredictionsResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResult = (result: PredictionsResp) => {
    setPrediction(result);
    setError(null);
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* 头部标题 */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Financial News Classifier
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            基于 FinBERT 的财经新闻智能分类系统
          </p>
          <p className="text-gray-500 text-sm mt-2">
            标准化分类体系 · 多维度风险分析 · 可视化置信度分布
          </p>
        </motion.header>

        {/* 主内容区 */}
        <div className="space-y-8">
          {/* 输入组件 */}
          <NewsInput onResult={handleResult} onError={handleError} />

          {/* 错误提示 */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 预测结果卡片 */}
          <AnimatePresence>
            {prediction && <PredictionCard data={prediction} />}
          </AnimatePresence>
        </div>

        {/* 页脚 */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-16 text-gray-500 text-sm"
        >
          <p>v2.0.0 · Powered by FinBERT & Next-Gen Classification System</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
