/**
 * FinBERT API 调用模块
 * 负责与后端 FastAPI 服务通信
 */

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * 通用 Fetch 封装
 */
const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * 调用新闻分类接口
 * @param {string} text - 待分类的新闻文本
 * @returns {Promise<{label: string, confidence: number}>}
 */
export const classifyNews = async (text) => {
  return request('/classify', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
};

/**
 * 获取所有历史记录
 * @returns {Promise<Array>}
 */
export const getRecords = async () => {
  return request('/records');
};

/**
 * 添加一条历史记录
 * @param {Object} record - { text, label, confidence }
 * @returns {Promise<Object>}
 */
export const addRecord = async (record) => {
  return request('/records', {
    method: 'POST',
    body: JSON.stringify(record),
  });
};

/**
 * 删除一条历史记录
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const deleteRecord = async (id) => {
  return request(`/records/${id}`, {
    method: 'DELETE',
  });
};

/**
 * 健康检查
 */
export const pingServer = async () => {
  try {
    const res = await fetch('http://localhost:8000/ping');
    return await res.json();
  } catch (e) {
    return { status: 'error', message: e.message };
  }
};
