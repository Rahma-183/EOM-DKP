import { useState } from 'react';
import TopNav from './components/TopNav';
import InputDashboard from './components/InputDashboard';
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

  const handleReset = () => {
    setResults(null);
    setFile(null);
  };

  return (
    <div className="app-layout-modern">
      <TopNav />

      <main className="main-content-modern">
        <div className="content-area">
          {error && <div className="error-alert">❌ {error}</div>}

          {!results ? (
            <InputDashboard 
              file={file}
              onFileChange={setFile}
              blacklistInput={blacklistInput}
              onBlacklistChange={setBlacklist}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          ) : (
            <ResultsView
              results={results}
              onExport={() => exportToExcel(results)}
              onReset={handleReset}
            />
          )}
        </div>
      </main>
    </div>
  );
}
