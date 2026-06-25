import { useState } from 'react';
import GuideModal from './GuideModal';

export default function TopNav() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <>
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="nav-logo">
              <img
                src="/logo.png"
                alt="Logo DKP"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="nav-text">
              <h1>EOM Candidate Selector</h1>
              <p>Dinas Kelautan dan Perikanan Prov. Jawa Timur</p>
            </div>
          </div>
          <div className="nav-actions">
            <button className="btn-guide" onClick={() => setIsGuideOpen(true)}>
              ℹ️ Panduan
            </button>
            <div className="nav-badge">
              v2.0 (React)
            </div>
          </div>
        </div>
      </nav>

      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  );
}
