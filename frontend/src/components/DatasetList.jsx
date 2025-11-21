import React from 'react';

const DatasetList = ({ datasets, onTrain }) => {
  if (!datasets || datasets.length === 0) {
    return <div className="text-gray-500">暂无数据集</div>;
  }

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文件名</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">大小 (Bytes)</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datasets.map((ds) => (
            <tr key={ds.filename}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ds.filename}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ds.size}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => onTrain(ds.filename)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  开始训练
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DatasetList;
