import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReloadIcon, UploadIcon, PlayIcon, TrashIcon, EyeOpenIcon, Cross2Icon, FileTextIcon, ExternalLinkIcon } from '@radix-ui/react-icons';

interface Dataset {
  filename: string;
  size: number;
}

interface TrainingStatus {
  is_training: boolean;
  progress: number;
  epoch: number;
  total_epochs: number;
  loss: number;
  message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const TrainingPage: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [status, setStatus] = useState<TrainingStatus | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fetchDatasets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/datasets`);
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        console.log("Fetched datasets:", data); // Debug log
        setDatasets(data);
      } else {
        console.error("Failed to fetch datasets:", res.status, res.statusText);
        if (contentType && !contentType.includes("application/json")) {
             console.error("Expected JSON but got:", contentType);
             const text = await res.text();
             console.error("Response body preview:", text.substring(0, 100));
        }
      }
    } catch (e) {
      console.error("Failed to fetch datasets", e);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/train/status`);
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.error("Failed to fetch status", e);
    }
  };

  useEffect(() => {
    fetchDatasets();
    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload_dataset`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchDatasets();
      }
    } finally {
      setUploading(false);
    }
  };

  const handleTrain = async () => {
    if (!selectedDataset) return;
    try {
      await fetch(`${API_BASE_URL}/api/train?dataset_name=${selectedDataset}`, {
        method: 'POST'
      });
      fetchStatus();
    } catch (e) {
      alert("Failed to start training");
    }
  };

  const handleDelete = async (e: React.MouseEvent, filename: string) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/datasets/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        if (selectedDataset === filename) setSelectedDataset(null);
        fetchDatasets();
      } else {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        alert(`Delete failed: ${err.detail || res.statusText}`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete dataset (Network Error)");
    }
  };

  const handlePreview = async (e: React.MouseEvent, filename: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE_URL}/api/datasets/${encodeURIComponent(filename)}/preview`);
      if (res.ok) {
        const data = await res.json();
        setPreviewData(data);
        setShowPreview(true);
      } else {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        alert(`Preview failed: ${err.detail || res.statusText}`);
      }
    } catch (e) {
      console.error(e);
      alert(`Failed to preview dataset (Network Error): ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleOpenFolder = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/datasets/open_folder`, { method: 'POST' });
    } catch (e) {
      console.error("Failed to open folder", e);
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
          <h1 className="text-4xl font-black text-slate-800 mb-4">Model Fine-tuning</h1>
          <p className="text-slate-500 text-lg">
            使用自定义数据集微调 FinBERT 模型，提升特定领域的分类准确率。
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dataset Management */}
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                <FileTextIcon className="w-5 h-5" />
                Datasets
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleOpenFolder}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Open Folder"
                >
                  <ExternalLinkIcon />
                </button>
                <button 
                  onClick={fetchDatasets}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Refresh List"
                >
                  <ReloadIcon />
                </button>
                <label className="cursor-pointer px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2">
                  {uploading ? <ReloadIcon className="animate-spin" /> : <UploadIcon />}
                  Upload CSV
                  <input type="file" accept=".csv" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {datasets.map((ds) => (
                <div 
                  key={ds.filename}
                  onClick={() => setSelectedDataset(ds.filename)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all group ${
                    selectedDataset === ds.filename 
                      ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100' 
                      : 'bg-white/50 border-slate-100 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-700 break-words leading-snug mb-1">
                        {ds.filename}
                      </div>
                      <div className="text-xs text-slate-400">{(ds.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handlePreview(e, ds.filename)}
                        className="p-2 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <EyeOpenIcon />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, ds.filename)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {datasets.length === 0 && (
                <div className="text-center py-12 text-slate-400 italic">No datasets available</div>
              )}
            </div>
          </div>

          {/* Training Control */}
          <div className="glass-panel p-8 rounded-3xl space-y-6 relative overflow-hidden">
            <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
              <ReloadIcon className="w-5 h-5" />
              Training Status
            </h2>

            {status?.is_training ? (
              <div className="space-y-8 py-8">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-fuchsia-600 bg-fuchsia-200">
                        {status.message}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-fuchsia-600">
                        {status.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-fuchsia-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${status.progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-fuchsia-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl text-center">
                    <div className="text-xs text-slate-400 uppercase font-bold">Epoch</div>
                    <div className="text-2xl font-black text-slate-700">{status.epoch}/{status.total_epochs}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl text-center">
                    <div className="text-xs text-slate-400 uppercase font-bold">Loss</div>
                    <div className="text-2xl font-black text-slate-700">{status.loss.toFixed(4)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                  <PlayIcon className="w-10 h-10 text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="text-slate-500 mb-4">Select a dataset to start fine-tuning</p>
                  <button
                    onClick={handleTrain}
                    disabled={!selectedDataset}
                    className="px-8 py-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Start Training
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && previewData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800">Dataset Preview (First 5 rows)</h3>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <Cross2Icon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 overflow-auto">
                <table className="w-full text-sm text-left text-slate-600">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                      {Object.keys(previewData[0] || {}).map((key) => (
                        <th key={key} className="px-6 py-3 font-bold">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="bg-white border-b hover:bg-slate-50">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="px-6 py-4 max-w-xs truncate" title={String(val)}>
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
