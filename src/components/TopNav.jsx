export default function TopNav() {
  return (
    <nav className="top-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="nav-logo">
            <img
              src="/logo.png"
              alt="Logo DKP"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '🏆';
              }}
            />
          </div>
          <div className="nav-text">
            <h1>EOM Candidate Selector</h1>
            <p>Dinas Kelautan dan Perikanan Prov. Jawa Timur</p>
          </div>
        </div>
        <div className="nav-badge">
          v2.0 (React)
        </div>
      </div>
    </nav>
  );
}
