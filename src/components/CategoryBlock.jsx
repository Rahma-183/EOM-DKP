import CandidateCard from './CandidateCard';

const CAT_ICONS = ['🎯','🌊','🐟','⚓','🧭','🌿','🦈','🏅','🔱','🌺'];

export default function CategoryBlock({ categoryName, candidates, index }) {
  const icon = CAT_ICONS[index % CAT_ICONS.length];

  // Podium order: Rank 2, Rank 1, Rank 3
  const rank1 = candidates[0];
  const rank2 = candidates[1];
  const rank3 = candidates[2];

  return (
    <div className="category-block" id={`category-${index}`}>
      <div className="category-header">
        <div className="category-icon">{icon}</div>
        <div className="category-name">{categoryName}</div>
        <div className="category-pill">{candidates.length} Kandidat</div>
      </div>
      
      <div className="podium-grid">
        {rank2 ? (
          <div className="podium-item podium-rank-2">
            <CandidateCard candidate={rank2} rank={2} isPodium />
          </div>
        ) : <div className="podium-item empty"></div>}

        {rank1 ? (
          <div className="podium-item podium-rank-1">
            <CandidateCard candidate={rank1} rank={1} isPodium />
          </div>
        ) : <div className="podium-item empty"></div>}

        {rank3 ? (
          <div className="podium-item podium-rank-3">
            <CandidateCard candidate={rank3} rank={3} isPodium />
          </div>
        ) : <div className="podium-item empty"></div>}
      </div>
    </div>
  );
}
