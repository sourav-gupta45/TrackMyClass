import React from 'react';
import { 
  BookOpen, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  Calculator, 
  Plus, 
  ShieldCheck, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { calculatePercentage, getClassesNeededFor75, getSafeBunks } from '../utils/attendanceCalculations';

export default function SubjectAnalytics({ 
  subjects, 
  timetable, 
  attendanceRecords, 
  onOpenSimulator, 
  onOpenAddSubject 
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            Subject Attendance & Safe Bunk Breakdown
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
            Track attendance individual percentages against the 75% regulatory requirement.
          </p>
        </div>

        <button 
          className="header-btn-primary"
          onClick={onOpenAddSubject}
        >
          <Plus size={16} />
          <span>Add New Subject</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
        {subjects.map(subject => {
          let attended = 0;
          let total = 0;

          Object.entries(attendanceRecords).forEach(([key, rec]) => {
            const [recDate, recPeriodId] = key.split('_');
            const recDateObj = new Date(recDate);
            const recDayOfWeek = recDateObj.getDay();
            const periodsForDay = timetable[recDayOfWeek] || [];
            const periodObj = periodsForDay.find(p => p.id === recPeriodId);
            if (periodObj && periodObj.subjectId === subject.id) {
              if (rec.status === 'present') {
                attended++;
                total++;
              } else if (rec.status === 'absent') {
                total++;
              }
            }
          });

          const pct = calculatePercentage(attended, total);
          const isSafe = pct >= 75;
          const classesNeeded = getClassesNeededFor75(attended, total);
          const safeBunks = getSafeBunks(attended, total);

          return (
            <div 
              key={subject.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                borderTop: `4px solid ${subject.color}`
              }}
            >
              {/* Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span 
                    style={{
                      background: subject.bgLight,
                      color: subject.color,
                      fontWeight: 700,
                      fontSize: '11px',
                      padding: '3px 9px',
                      borderRadius: '999px'
                    }}
                  >
                    {subject.code}
                  </span>

                  <span 
                    style={{
                      background: isSafe ? '#ecfdf5' : '#fee2e2',
                      color: isSafe ? '#059669' : '#dc2626',
                      fontWeight: 800,
                      fontSize: '11.5px',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isSafe ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
                    {isSafe ? 'Safe (>= 75%)' : 'Action Required (< 75%)'}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  {subject.name}
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={13} />
                  <span>{subject.faculty} &bull; {subject.room || 'Room TBA'}</span>
                </div>
              </div>

              {/* Progress and Numbers */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '26px', fontWeight: 800, color: isSafe ? '#10b981' : '#ef4444' }}>
                      {pct}%
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      ({attended} / {total} classes)
                    </span>
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600 }}>Min 75% req.</span>
                </div>

                {/* Progress Bar with 75% indicator line */}
                <div style={{ position: 'relative', height: '10px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div 
                    style={{
                      width: `${Math.min(100, pct)}%`,
                      height: '100%',
                      background: isSafe ? '#10b981' : '#ef4444',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
                {/* 75% threshold guide line */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                  <span>0%</span>
                  <span style={{ color: '#2563eb' }}>&bull; 75% Target &bull;</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Bunk / Recovery Advice Box */}
              <div style={{
                background: isSafe ? '#f0fdf4' : '#fff1f2',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '12.5px',
                border: `1px solid ${isSafe ? '#bbf7d0' : '#fecdd3'}`
              }}>
                {isSafe ? (
                  <div style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} style={{ flexShrink: 0 }} />
                    <span>
                      You can safely bunk <strong>{safeBunks} class{safeBunks === 1 ? '' : 'es'}</strong> without dropping below 75%.
                    </span>
                  </div>
                ) : (
                  <div style={{ color: '#991b1b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                    <span>
                      Must attend next <strong>{classesNeeded} consecutive class{classesNeeded === 1 ? '' : 'es'}</strong> to recover!
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button 
                className="header-btn-secondary"
                style={{ justifyContent: 'center', width: '100%' }}
                onClick={() => onOpenSimulator(subject.id)}
              >
                <Calculator size={14} />
                <span>Simulate Absent Impact</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
