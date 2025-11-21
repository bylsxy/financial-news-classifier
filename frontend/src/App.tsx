import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { TrainingPage } from './pages/TrainingPage';
import { CrawlerPage } from './pages/CrawlerPage';
import { CrawlerProvider } from './context/CrawlerContext';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState<Array<{ text: string; label: string; date: string }>>([]);

  const handlePredictionSuccess = (text: string, label: string) => {
    const newRecord = {
      text,
      label,
      date: new Date().toLocaleDateString()
    };
    setHistory(prev => [newRecord, ...prev].slice(0, 10)); // Keep last 10
  };

  return (
    <CrawlerProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Sidebar 
            onSelectExample={setInputText} 
            history={history}
          />
          
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  inputText={inputText} 
                  setInputText={setInputText}
                  onPredictionSuccess={handlePredictionSuccess}
                />
              } 
            />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/crawler" element={<CrawlerPage />} />
          </Routes>
        </div>
      </Router>
    </CrawlerProvider>
  );
}

export default App;
