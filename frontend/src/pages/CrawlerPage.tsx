import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlobeIcon, DownloadIcon, ReloadIcon, CheckIcon, CaretDownIcon } from '@radix-ui/react-icons';
import { crawlNews, saveCrawledData } from '../api/crawler';
import { useCrawler } from '../context/CrawlerContext';

const SOURCES = [
  { id: 'yahoo', name: 'Yahoo Finance' },
  { id: 'reuters', name: 'Reuters' },
  { id: 'bloomberg', name: 'Bloomberg' },
  { id: 'cnbc', name: 'CNBC' },
];

export const CrawlerPage: React.FC = () => {
  const { headlines, setHeadlines } = useCrawler();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedSource, setSelectedSource] = useState(SOURCES[0].id);

  const handleCrawl = async () => {
    setLoading(true);
    setHeadlines([]);
    setSaveSuccess(false);
    try {
      const data = await crawlNews(selectedSource);
      setHeadlines(data);
    } catch (e) {
      console.error(e);
      alert("Crawling failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (headlines.length === 0) return;
    setSaving(true);
    try {
      await saveCrawledData(headlines);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-8 md:p-12 lg:pl-96">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-800 mb-4">Data Crawler</h1>
          <p className="text-slate-500 text-lg">
            从各大权威源实时抓取财经新闻，构建您的专属数据集。
          </p>
        </header>

        <div className="glass-panel p-8 rounded-3xl space-y-6 min-h-[500px] flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative">
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 text-slate-700 py-3 pl-4 pr-10 rounded-xl font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {SOURCES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <CaretDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <button
                onClick={handleCrawl}
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? <ReloadIcon className="animate-spin" /> : <GlobeIcon />}
                {loading ? 'Crawling...' : 'Start Crawling'}
              </button>
            </div>

            {headlines.length > 0 && (
              <button
                onClick={handleSave}
                disabled={saving || saveSuccess}
                className={`px-6 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                  saveSuccess 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {saving ? <ReloadIcon className="animate-spin" /> : saveSuccess ? <CheckIcon /> : <DownloadIcon />}
                {saveSuccess ? 'Saved!' : 'Save as Dataset'}
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-100/50 flex justify-between items-center">
              <span className="font-bold text-slate-600 text-sm uppercase tracking-wider">Results</span>
              <span className="text-xs font-mono text-slate-400">{headlines.length} items found</span>
            </div>
            
            <div className="overflow-y-auto flex-1 p-2 space-y-2 max-h-[600px]">
              {headlines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <GlobeIcon className="w-12 h-12 opacity-20" />
                  <p>Select a source and click "Start Crawling" to begin.</p>
                </div>
              ) : (
                headlines.map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i}
                    className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex gap-4"
                  >
                    {item.image_url && (
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-medium mb-2 line-clamp-3">{item.text}</p>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span className="bg-slate-100 px-2 py-1 rounded">{item.source}</span>
                        <span className="font-mono">{new Date(item.crawled_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
