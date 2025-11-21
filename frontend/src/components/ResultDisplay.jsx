import React from 'react';

const ResultDisplay = ({ result, onSave, isSaving }) => {
  if (!result) return null;

  const { label, confidence } = result;
  
  // Define styles based on sentiment
  const styles = {
    Positive: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: 'text-emerald-500',
      bar: 'bg-emerald-500',
      label: '正面'
    },
    Negative: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-800',
      icon: 'text-rose-500',
      bar: 'bg-rose-500',
      label: '负面'
    },
    Neutral: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: 'text-amber-500',
      bar: 'bg-amber-500',
      label: '中性'
    }
  };

  const currentStyle = styles[label] || styles.Neutral;
  const percentage = (confidence * 100).toFixed(1);

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${currentStyle.border} ${currentStyle.bg} shadow-lg transition-all duration-500 ease-out transform translate-y-0 opacity-100`}>
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">分析结果</h2>
            <div className={`text-3xl sm:text-4xl font-bold ${currentStyle.text} flex items-center gap-3`}>
              {label}
              <span className="text-lg font-medium opacity-75">({currentStyle.label})</span>
            </div>
          </div>
          
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-medium transition-all text-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  保存中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                  保存记录
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-slate-600">
            <span>置信度</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-3 w-full bg-white rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full ${currentStyle.bar} transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
