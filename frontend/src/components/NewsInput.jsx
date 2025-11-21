import React, { useState, useRef, useEffect } from 'react';

const NewsInput = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider" 
            htmlFor="news-text"
          >
            输入新闻文本
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              className="w-full min-h-[160px] p-4 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 ease-in-out resize-none placeholder:text-slate-400 text-base leading-relaxed shadow-inner"
              id="news-text"
              placeholder="在此粘贴财经新闻内容...&#10;例如: Apple reported record quarterly revenue of $123.9 billion, up 11 percent year over year..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => setText('')}
            disabled={isLoading || !text}
            className="text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            清空输入
          </button>
          
          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className={`
              w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 
              transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0
              ${isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                分析中...
              </span>
            ) : '开始分析'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsInput;
