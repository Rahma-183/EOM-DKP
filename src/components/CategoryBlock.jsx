import { useState } from 'react';
import CandidateCard from './CandidateCard';

export default function CategoryBlock({ categoryName, candidates, index }) {
  const [showRecs, setShowRecs] = useState(false);

  // Top 3 for Podium
  const rank1 = candidates[0];
  const rank2 = candidates[1];
  const rank3 = candidates[2];

  // Candidates 4-6 for recommendations
  const recommendations = candidates.slice(3, 6);

  return (
    <div className="category-block" id={`category-${index}`}>
      <div className="category-header">
        <div className="category-name">{categoryName}</div>
        <div className="category-pill">{candidates.length} Kandidat Diproses</div>
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

      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <button 
            className="btn-toggle-recs" 
            onClick={() => setShowRecs(!showRecs)}
          >
            {showRecs ? 'Sembunyikan Rekomendasi' : 'Tampilkan Rekomendasi Kandidat (Peringkat 4-6)'}
          </button>

          {showRecs && (
            <div className="recs-grid">
              {recommendations.map((candidate, i) => (
                <CandidateCard 
                  key={candidate.nip + candidate.name} 
                  candidate={candidate} 
                  rank={i + 4} 
                  isPodium={false} 
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
