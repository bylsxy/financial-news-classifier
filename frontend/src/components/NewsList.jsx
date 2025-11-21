import React from 'react';
import NewsItem from './NewsItem';

const NewsList = ({ records, onDelete, onRetry }) => {
  if (!records || records.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
        <div className="text-slate-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <p className="text-slate-500 font-medium">暂无历史记录</p>
        <p className="text-slate-400 text-sm mt-1">您的分析记录将显示在这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          历史记录
        </h3>
        <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
          共 {records.length} 条
        </span>
      </div>
      <div className="grid gap-4">
        {records.map((record) => (
          <NewsItem 
            key={record.id} 
            record={record} 
            onDelete={onDelete}
            onRetry={onRetry}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsList;
