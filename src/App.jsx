import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import ResultsView from './components/ResultsView';
import { parseExcel, exportToExcel } from './utils/excelParser';

export default function App() {
  const [file, setFile]                   = useState(null);
  const [blacklistInput, setBlacklist]    = useState('');
  const [results, setResults]             = useState(null);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState('');

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setError('');
    setResults(null);
    try {
      const res = await parseExcel(file, null, blacklistInput);
      setResults(res);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memproses file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        file={file}
        onFileChange={setFile}
        blacklistInput={blacklistInput}
        onBlacklistChange={setBlacklist}
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
      />

      <main className="main-content">
        {/* Top bar */}
        <div className="topbar">
          <span className="topbar-title">
            Dashboard Seleksi Employee of the Month
          </span>
          <span className="topbar-badge">DKP Jawa Timur</span>
        </div>

        {/* Content */}
        <div className="content-area">
          {error && <div className="error-alert">❌ {error}</div>}

          {!results ? (
            <Hero />
          ) : (
            <ResultsView
              results={results}
              onExport={() => exportToExcel(results)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
