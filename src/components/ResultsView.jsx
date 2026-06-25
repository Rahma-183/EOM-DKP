import CategoryBlock from './CategoryBlock';

export default function ResultsView({ results, onExport, onReset }) {
  const categories = Object.keys(results);
  const totalCandidates = categories.reduce(
    (sum, cat) => sum + results[cat].length,
    0
  );

  const scrollToCategory = (index) => {
    const el = document.getElementById(`category-${index}`);
    if (el) {
      // Offset for sticky nav
      const yOffset = -100; 
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="results-view">
      {/* Results Header / Dashboard */}
      <div className="results-dashboard">
        <div className="res-dash-main">
          <h2>🌟 Hasil Seleksi Kandidat EOM</h2>
          <div className="res-stats">
            <div className="stat">
              <span className="val">{categories.length}</span>
              <span className="lbl">Kategori</span>
            </div>
            <div className="divider"></div>
            <div className="stat">
              <span className="val">{totalCandidates}</span>
              <span className="lbl">Kandidat</span>
            </div>
          </div>
        </div>
        <div className="res-dash-actions">
          <button className="btn-secondary" onClick={onReset}>
            🔄 Mulai Ulang
          </button>
          <button className="btn-primary" onClick={onExport}>
            📥 Ekspor ke Excel
          </button>
        </div>
      </div>

      {/* Category Navigation (Pills) */}
      <div className="category-nav">
        {categories.map((cat, i) => (
          <button
            key={`nav-${i}`}
            className="cat-nav-pill"
            onClick={() => scrollToCategory(i)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Category Blocks */}
      <div className="results-list">
        {categories.map((cat, i) => (
          <CategoryBlock
            key={cat}
            categoryName={cat}
            candidates={results[cat]}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
