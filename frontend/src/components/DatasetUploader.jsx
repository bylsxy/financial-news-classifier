import React, { useState } from 'react';

const DatasetUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await fetch('http://localhost:8000/api/upload_dataset', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      setMessage({ type: 'success', text: '上传成功！' });
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      setMessage({ type: 'error', text: '上传失败: ' + error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h3 className="text-lg font-bold mb-4">上传数据集 (CSV)</h3>
      <div className="flex items-center space-x-4">
        <input 
          type="file" 
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${(!file || uploading) ? 'opacity-50' : 'hover:bg-blue-700'}`}
        >
          {uploading ? '上传中...' : '上传'}
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default DatasetUploader;
