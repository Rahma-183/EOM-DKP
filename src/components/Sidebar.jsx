import { useRef } from 'react';

const CATEGORY_ICONS = ['🎯','🌊','🐟','⚓','🧭','🌿','🦈','🏅','🔱','🌺'];

export default function Sidebar({
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
    <aside className="sidebar">
      {/* ── Header dengan logo ── */}
      <div className="sidebar-header">
        <div className="sidebar-logo-ring">
          <img
            src="/logo.png"
            alt="Logo DKP"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<span class="logo-fallback">🏆</span>';
            }}
          />
        </div>
        <div className="sidebar-title">EOM Candidate Selector</div>
        <div className="sidebar-subtitle">
          Dinas Kelautan dan Perikanan<br />Provinsi Jawa Timur
        </div>
      </div>

      {/* ── Body ── */}
      <div className="sidebar-body">

        {/* Upload File */}
        <div>
          <div className="s-label">📁 File Rekap Usulan</div>
          <div className="s-hint">
            Unggah file Excel (.xlsx) yang berisi data usulan kandidat EOM bulan ini.
          </div>
          <label
            className={`file-drop ${file ? 'has-file' : ''}`}
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
            <span className="file-drop-icon">{file ? '✅' : '📂'}</span>
            <span className="file-drop-text">
              {file ? 'File siap diproses' : 'Klik atau drag & drop file'}
            </span>
            {file && <div className="file-name">{file.name}</div>}
          </label>
        </div>

        {/* Blacklist */}
        <div>
          <div className="s-label">🚫 Daftar Blacklist</div>
          <div className="s-hint">
            Nama yang dikecualikan bulan ini. Pisah dengan koma / enter.
            Huruf besar/kecil tidak masalah.
          </div>
          <textarea
            className="s-textarea"
            placeholder={'Contoh:\nBudi Santoso\nSITI AMINAH, Rudi'}
            value={blacklistInput}
            onChange={(e) => onBlacklistChange(e.target.value)}
          />
        </div>

        {/* Tombol Analisis */}
        <button
          className="btn-analyze"
          onClick={onAnalyze}
          disabled={!file || isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              Menganalisis...
            </>
          ) : (
            <>🚀 Mulai Analisis Kandidat</>
          )}
        </button>

        {/* Criteria List */}
        <div className="criteria-box">
          <div className="criteria-box-title">📊 Kriteria Seleksi</div>
          {[
            'Evidence score tertinggi',
            'Total penalti terendah',
            'Kehadiran terbanyak',
            'Nilai SKP tertinggi',
          ].map((text, i) => (
            <div key={i} className="criteria-item">
              <div className="criteria-num">{i + 1}</div>
              {text}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export { CATEGORY_ICONS };
