import React, { useState, useEffect } from 'react';
import DatasetUploader from '../components/DatasetUploader';
import DatasetList from '../components/DatasetList';

const DataPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDatasets = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/datasets');
      if (res.ok) {
        const data = await res.json();
        setDatasets(data);
      }
    } catch (e) {
      console.error("Failed to fetch datasets", e);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleTrain = async (filename) => {
    if (!window.confirm(`确定要使用 ${filename} 开始训练吗？`)) return;
    
    try {
      const res = await fetch(`http://localhost:8000/api/train?dataset_name=${filename}`, {
        method: 'POST'
      });
      const data = await res.json();
      alert(data.message);
    } catch (e) {
      alert("训练启动失败");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">数据管理与模型训练</h1>
      
      <DatasetUploader onUploadSuccess={fetchDatasets} />
      
      <h3 className="text-xl font-bold mb-4 mt-8 text-gray-700">可用数据集</h3>
      <DatasetList datasets={datasets} onTrain={handleTrain} />
    </div>
  );
};

export default DataPage;
