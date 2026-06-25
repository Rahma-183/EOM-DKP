import React, { useState } from 'react';
import { parseExcel, exportToExcel } from './utils/excelParser';
import { CandidateCard } from './components/CandidateCard';
import { UploadCloud, Users, Trophy, AlertCircle, Loader2, Download } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [ePresensiFile, setEPresensiFile] = useState(null);
  const [excludedNames, setExcludedNames] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e, setter) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setter(selectedFile);
        setError('');
      } else {
        setter(null);
        setError('Harap unggah file Excel (.xlsx atau .xls)');
      }
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setError('Pilih file Rekap Usulan Excel terlebih dahulu.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const parsedResults = await parseExcel(file, ePresensiFile, excludedNames);
      setResults(parsedResults);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat memproses file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <Trophy className="logo-icon" size={32} />
            <h1>EOM Candidate Selector</h1>
          </div>
          <p className="subtitle">Automated Employee of the Month Selection</p>
        </div>
      </header>

      <main className="main-content">
        <section className="input-section glass-panel">
          <div className="upload-container">
            <label className="upload-label">
              <UploadCloud size={48} className="upload-icon" />
              <span className="upload-text">
                {file ? file.name : '1. Pilih File Rekap Usulan (.xlsx)'}
              </span>
              <span className="upload-hint">Data utama kandidat EOM</span>
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                className="hidden-input" 
                onChange={(e) => handleFileChange(e, setFile)} 
              />
            </label>
          </div>

          <div className="upload-container" style={{ marginTop: '-1rem' }}>
            <label className="upload-label" style={{ padding: '2rem' }}>
              <UploadCloud size={32} className="upload-icon" />
              <span className="upload-text">
                {ePresensiFile ? ePresensiFile.name : '2. (Opsional) Pilih File E-Presensi (.xlsx)'}
              </span>
              <span className="upload-hint">Untuk otomatis blacklist: Cuti Penuh, Alpha, Indisipliner</span>
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                className="hidden-input" 
                onChange={(e) => handleFileChange(e, setEPresensiFile)} 
              />
            </label>
          </div>

          <div className="textarea-container">
            <label className="input-label">
              <Users size={18} />
              <span>Tambahan Blacklist Manual (Pisahkan dengan koma/baris baru)</span>
            </label>
            <textarea 
              className="text-input"
              rows={3}
              placeholder="Contoh: Budi Santoso, Siti Aminah"
              value={excludedNames}
              onChange={(e) => setExcludedNames(e.target.value)}
            />
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button 
            className="process-btn" 
            onClick={handleProcess}
            disabled={!file || isProcessing}
          >
            {isProcessing ? (
              <><Loader2 className="spinner" size={20} /> Memproses...</>
            ) : (
              'Analisis Kandidat'
            )}
          </button>
        </section>

        {results && Object.keys(results).length > 0 && (
          <section className="results-section">
            <div className="results-header-wrapper">
              <h2 className="results-title">Hasil Seleksi Kandidat Terbaik</h2>
              <button 
                className="export-btn" 
                onClick={() => exportToExcel(results)}
              >
                <Download size={18} /> Ekspor ke Excel
              </button>
            </div>
            
            {Object.keys(results).map((category, idx) => (
              <div key={idx} className="category-group glass-panel">
                <div className="category-header">
                  <h3>{category}</h3>
                </div>
                <div className="candidates-grid">
                  {results[category].length > 0 ? (
                    results[category].map((candidate, rank) => (
                      <CandidateCard 
                        key={rank} 
                        candidate={candidate} 
                        rank={rank + 1} 
                      />
                    ))
                  ) : (
                    <p className="no-candidates">Tidak ada kandidat valid di kategori ini.</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
