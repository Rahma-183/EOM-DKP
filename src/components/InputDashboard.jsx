import { useRef } from 'react';

export default function InputDashboard({
  file,
  onFileChange,
  blacklistInput,
  onBlacklistChange,
  onAnalyze,
  isLoading,
}) {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) onFileChange(f);
  };

  return (
    <div className="input-dashboard">
      <div className="dashboard-header">
        <h2>Mulai Analisis Kandidat</h2>
        <p>Unggah file rekap dan tentukan pengecualian untuk bulan ini.</p>
      </div>

      <div className="dashboard-grid">
        {/* Upload Section */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="icon">📁</span>
            <h3>File Rekap Usulan</h3>
          </div>
          <p className="hint">Format .xlsx atau .xls</p>
          
          <label
            className={`file-drop-large ${file ? 'has-file' : ''}`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                if (e.target.files[0]) onFileChange(e.target.files[0]);
              }}
            />
            <div className="drop-content">
              <span className="drop-icon">{file ? '✅' : '📥'}</span>
              <h4>{file ? 'File Siap' : 'Klik atau Drag & Drop File'}</h4>
              <p>{file ? file.name : 'Pilih file rekap dari komputer Anda'}</p>
            </div>
          </label>
        </div>

        {/* Blacklist Section */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="icon">🚫</span>
            <h3>Daftar Blacklist</h3>
          </div>
          <p className="hint">Pisahkan nama dengan koma atau baris baru</p>
          
          <textarea
            className="s-textarea large-textarea"
            placeholder={'Contoh:\nBudi Santoso\nSITI AMINAH\nRudi'}
            value={blacklistInput}
            onChange={(e) => onBlacklistChange(e.target.value)}
          />
        </div>
      </div>

      <div className="dashboard-action">
        <button
          className="btn-analyze-large"
          onClick={onAnalyze}
          disabled={!file || isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              <span>Memproses Data...</span>
            </>
          ) : (
            <>🚀 Mulai Analisis Kandidat</>
          )}
        </button>
      </div>
    </div>
  );
}
