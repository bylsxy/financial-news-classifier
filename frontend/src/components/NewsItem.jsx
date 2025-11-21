import React from 'react';

const NewsItem = ({ record, onDelete, onRetry }) => {
  const { id, text, label, confidence, timestamp } = record;

  const styles = {
    Positive: { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    Negative: { badge: 'bg-rose-100 text-rose-700 border-rose-200' },
    Neutral: { badge: 'bg-amber-100 text-amber-700 border-amber-200' }
  };

  const currentStyle = styles[label] || styles.Neutral;

  return (
    <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentStyle.badge} uppercase tracking-wide`}>
            {label}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {(confidence * 100).toFixed(1)}% 置信度
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {new Date(timestamp).toLocaleString()}
        </span>
      </div>
      
      <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
        {text}
      </p>
      
      <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          onClick={() => onRetry(text)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          再次分析
        </button>
        <button 
          onClick={() => onDelete(id)}
          className="text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          删除
        </button>
      </div>
    </div>
  );
};

export default NewsItem;
