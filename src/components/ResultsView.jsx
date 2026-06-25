import CategoryBlock from './CategoryBlock';

export default function ResultsView({ results, onExport }) {
  const categories = Object.keys(results);
  const totalCandidates = categories.reduce(
    (sum, cat) => sum + results[cat].length,
    0
  );

  return (
    <div>
      {/* Results Header */}
      <div className="results-header">
        <div className="results-header-text">
          <h2>🌟 Hasil Seleksi Kandidat EOM</h2>
          <p>
            {categories.length} Kategori &nbsp;·&nbsp; {totalCandidates} Kandidat
            terpilih
          </p>
        </div>
        <button className="btn-export" onClick={onExport}>
          📥 Ekspor Excel
        </button>
      </div>

      {/* Category Blocks */}
      {categories.map((cat, i) => (
        <CategoryBlock
          key={cat}
          categoryName={cat}
          candidates={results[cat]}
          index={i}
        />
      ))}
    </div>
  );
}
