const RANK_CLASS = { 1: 'rank-1', 2: 'rank-2', 3: 'rank-3' };
const BADGE_CLASS = { 1: 'r1', 2: 'r2', 3: 'r3' };

export default function CandidateCard({ candidate, rank, isPodium }) {
  const jabatanShort =
    candidate.jabatan.length > 38
      ? candidate.jabatan.slice(0, 38) + '…'
      : candidate.jabatan;

  return (
    <div className={`cand-card ${isPodium ? RANK_CLASS[rank] || '' : 'rec-card'}`}>
      {/* Rank badge */}
      <span className={`rank-badge ${isPodium ? BADGE_CLASS[rank] || '' : 'r-other'}`}>
        Peringkat #{rank}
      </span>

      {/* Identity */}
      <div className="card-name">{candidate.name}</div>
      <div className="card-nip">NIP: {candidate.nip}</div>
      <div className="card-jabatan-tag">{jabatanShort}</div>
      <div className="card-unit">{candidate.unitKerja}</div>

      {/* Stats — 5 metrics */}
      <div className="stat-grid-5">
        <div className="stat-chip">
          <div className="stat-lbl">Penalti</div>
          <div className="stat-val val-red">
            {candidate.totalPenalty.toFixed(0)}
          </div>
        </div>
        <div className="stat-chip">
          <div className="stat-lbl">Evidence</div>
          <div className="stat-val val-blue">{candidate.evidence}</div>
        </div>
        <div className="stat-chip">
          <div className="stat-lbl">DL/Ijin/Cuti</div>
          <div className="stat-val val-gold">
            {candidate.dlIjinCuti.toFixed(0)}
          </div>
        </div>
        <div className="stat-chip">
          <div className="stat-lbl">SKP</div>
          <div className="stat-val val-green">{candidate.skp}</div>
        </div>
        <div className="stat-chip">
          <div className="stat-lbl">Kehadiran</div>
          <div className="stat-val val-blue">
            {candidate.kehadiran.toFixed(0)}
            <span className="stat-unit"> hari</span>
          </div>
        </div>
      </div>
    </div>
  );
}
