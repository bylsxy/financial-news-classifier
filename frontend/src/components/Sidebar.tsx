import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, RocketIcon, ReaderIcon, ClockIcon, GlobeIcon, Cross2Icon, CheckIcon } from '@radix-ui/react-icons';
import scauLogo from '../assets/images/华南农业大学校名透明贴图/logo.svg';
import semLogo from '../assets/images/经济管理学院院徽/单色透明logo.png';

interface SidebarProps {
  onSelectExample: (text: string) => void;
  history: Array<{ text: string; label: string; date: string }>;
}

const EXAMPLES = [
  {
    label: "利好 - 业绩超预期",
    text: "NVIDIA reports Q3 revenue of $18.12 billion, up 206% year-over-year, beating analyst expectations significantly due to soaring demand for AI chips."
  },
  {
    label: "利空 - 监管风险",
    text: "The European Commission has opened a formal investigation into the company for potential antitrust violations, which could lead to fines of up to 10% of global turnover."
  },
  {
    label: "中性 - 市场波动",
    text: "Global markets remained mixed on Tuesday as investors awaited the release of the Federal Reserve's meeting minutes for clues on future interest rate paths."
  },
  {
    label: "风险 - 供应链中断",
    text: "Severe flooding in Thailand has forced several major automotive electronics manufacturers to suspend production, potentially impacting global supply chains for months."
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ onSelectExample, history }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedExample, setSelectedExample] = useState<{label: string, text: string, date?: string} | null>(null);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 bg-white/80 backdrop-blur-xl border-r border-slate-200 h-screen fixed left-0 top-0 overflow-hidden z-50 hidden lg:flex flex-col shadow-2xl"
      >
        {/* Logo Area & Developer Info - Fixed at top */}
        <div className="flex-none border-b border-slate-100 bg-white/50">
          <div className="p-6 pb-2">
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-indigo-600">
              FinBERT <span className="font-light text-slate-400">AI</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium tracking-wider">INTELLIGENT CLASSIFIER</p>
          </div>
          
          <div className="px-6 pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img 
                src={semLogo} 
                alt="SEM Logo" 
                className="h-10" 
                style={{ filter: 'brightness(0) saturate(100%) invert(33%) sepia(86%) saturate(1666%) hue-rotate(230deg) brightness(90%) contrast(96%)' }}
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              <p>Developed by group1</p>
              <p className="text-[10px] text-slate-400">South China Agricultural University</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Navigation */}
          <nav className="p-6 space-y-2">
            <Link to="/">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/') ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                <HomeIcon className="w-5 h-5" />
                <span className="font-semibold">智能分析</span>
              </div>
            </Link>
            <Link to="/training">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/training') ? 'bg-fuchsia-50 text-fuchsia-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                <RocketIcon className="w-5 h-5" />
                <span className="font-semibold">模型微调</span>
              </div>
            </Link>
            <Link to="/crawler">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/crawler') ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                <GlobeIcon className="w-5 h-5" />
                <span className="font-semibold">数据采集</span>
              </div>
            </Link>
          </nav>

          {/* Examples Section */}
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-4 text-slate-400 px-2">
              <ReaderIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Representative Cases</span>
            </div>
            <div className="space-y-3">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedExample(ex)}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md border border-slate-100 transition-all duration-200 group"
                >
                  <div className="text-xs font-bold text-indigo-500 mb-1 group-hover:text-indigo-600">{ex.label}</div>
                  <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ex.text}</div>
                </button>
              ))}
            </div>
          </div>

          {/* History Section */}
          <div className="px-6 py-4 pb-8">
            <div className="flex items-center gap-2 mb-4 text-slate-400 px-2">
              <ClockIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Recent History</span>
            </div>
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs italic">暂无历史记录</div>
              ) : (
                history.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedExample(item)}
                    className="w-full text-left p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{item.label}</span>
                    </div>
                    <div className="text-xs text-slate-700 line-clamp-2">{item.text}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Example Detail Modal */}
      <AnimatePresence>
        {selectedExample && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg text-slate-800">{selectedExample.label}</h3>
                  {selectedExample.date && (
                    <span className="text-xs text-slate-400 font-mono mt-1">{selectedExample.date}</span>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedExample(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <Cross2Icon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 leading-relaxed text-sm mb-6 max-h-[60vh] overflow-y-auto">
                  {selectedExample.text}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedExample(null)}
                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      onSelectExample(selectedExample.text);
                      setSelectedExample(null);
                      navigate('/');
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                  >
                    <CheckIcon />
                    Use this Example
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
