import type { PredictionsResp, ClassifyRequest } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function classifyNews(
  text: string,
  temperature: number = 1.2,
  topK: number = 5
): Promise<PredictionsResp> {
  const response = await fetch(
    `${API_BASE_URL}/api/classify?temperature=${temperature}&top_k=${topK}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text } as ClassifyRequest),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
