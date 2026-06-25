import React from 'react';
import { Award, Briefcase, MapPin, Target, CheckCircle2, AlertTriangle, FileCheck, Star } from 'lucide-react';

export const CandidateCard = ({ candidate, rank }) => {
  const isFirst = rank === 1;

  return (
    <div className={`candidate-card ${isFirst ? 'candidate-card-first' : ''}`}>
      <div className="card-header">
        <div className="rank-badge">
          {isFirst ? <Award size={20} className="icon-gold" /> : `#${rank}`}
        </div>
        <div className="candidate-info">
          <h3 className="candidate-name">{candidate.name}</h3>
          <p className="candidate-nip">NIP: {candidate.nip}</p>
        </div>
      </div>
      
      <div className="card-body">
        <div className="info-row">
          <Briefcase size={16} className="info-icon" />
          <span className="info-text" title={candidate.jabatan}>{candidate.jabatan}</span>
        </div>
        <div className="info-row">
          <MapPin size={16} className="info-icon" />
          <span className="info-text" title={candidate.unitKerja}>{candidate.unitKerja}</span>
        </div>
        
        <div className="stats-grid">
          <div className="stat-box stat-positive">
            <div className="stat-icon-wrapper"><CheckCircle2 size={14}/></div>
            <div className="stat-content">
              <span className="stat-label">Kehadiran</span>
              <span className="stat-value">{candidate.kehadiran} <span className="stat-unit">hari</span></span>
            </div>
          </div>
          
          <div className="stat-box stat-negative">
            <div className="stat-icon-wrapper"><AlertTriangle size={14}/></div>
            <div className="stat-content">
              <span className="stat-label">Penalti</span>
              <span className="stat-value">{candidate.totalPenalty} <span className="stat-unit">poin</span></span>
            </div>
          </div>
          
          <div className="stat-box stat-neutral">
            <div className="stat-icon-wrapper"><FileCheck size={14}/></div>
            <div className="stat-content">
              <span className="stat-label">Evidence</span>
              <span className="stat-value">{candidate.evidence}</span>
            </div>
          </div>

          <div className="stat-box stat-primary">
            <div className="stat-icon-wrapper"><Star size={14}/></div>
            <div className="stat-content">
              <span className="stat-label">SKP</span>
              <span className="stat-value">{candidate.skp}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
