import React, { useState, useEffect } from 'react';
import NewsInput from '../components/NewsInput';
import ResultDisplay from '../components/ResultDisplay';
import NewsList from '../components/NewsList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { classifyNews, getRecords, addRecord, deleteRecord } from '../api/bert';

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const [records, setRecords] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // 加载历史记录
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await getRecords();
      setRecords(data);
    } catch (err) {
      console.error("Failed to load records", err);
    }
  };

  const handleClassify = async (text) => {
    setLoading(true);
    setError(null);
    setCurrentText(text);
    setCurrentResult(null);

    try {
      const result = await classifyNews(text);
      setCurrentResult(result);
    } catch (err) {
      setError(err.message || "分类请求失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentResult || !currentText) return;
    
    setIsSaving(true);
    try {
      const newRecord = await addRecord({
        text: currentText,
        label: currentResult.label,
        confidence: currentResult.confidence
      });
      setRecords([newRecord, ...records]);
      setCurrentResult(null); // 保存后清空结果，或者保留看需求
      setCurrentText('');
    } catch (err) {
      setError("保存记录失败: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("确定要删除这条记录吗？")) return;
    try {
      await deleteRecord(id);
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      setError("删除失败: " + err.message);
    }
  };

  const handleRetry = (text) => {
    // 自动填入并滚动到顶部 (这里简化为设置状态，Input组件需要支持外部控制或重置)
    // 由于 NewsInput 是非受控组件(内部state)，这里需要重构 NewsInput 或通过 key 强制刷新
    // 简单起见，我们让 NewsInput 变为受控组件会更好，但为了不改动太多，
    // 我们可以在 NewsInput 里加一个 useEffect 监听 prop 变化，或者直接在这里调用 handleClassify
    handleClassify(text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            财经新闻情感分类系统
          </h1>
          <p className="text-lg text-slate-600">
            基于深度学习的实时金融舆情分析工具
          </p>
        </header>

        <main className="space-y-8">
          <ErrorMessage message={error} onClose={() => setError(null)} />

          <section className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
             <NewsInput onSubmit={handleClassify} isLoading={loading} />
          </section>

          {loading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          )}

          <ResultDisplay 
            result={currentResult} 
            onSave={handleSave}
            isSaving={isSaving}
          />

          <NewsList 
            records={records} 
            onDelete={handleDelete} 
            onRetry={handleRetry}
          />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
