import CandidateCard from './CandidateCard';

const CAT_ICONS = ['🎯','🌊','🐟','⚓','🧭','🌿','🦈','🏅','🔱','🌺'];

export default function CategoryBlock({ categoryName, candidates, index }) {
  const icon = CAT_ICONS[index % CAT_ICONS.length];

  return (
    <div className="category-block">
      <div className="category-header">
        <div className="category-icon">{icon}</div>
        <div className="category-name">{categoryName}</div>
        <div className="category-pill">{candidates.length} Kandidat</div>
      </div>
      <div className="cards-grid">
        {candidates.map((candidate, i) => (
          <CandidateCard
            key={candidate.nip + candidate.name}
            candidate={candidate}
            rank={i + 1}
          />
        ))}
      </div>
    </div>
  );
}
