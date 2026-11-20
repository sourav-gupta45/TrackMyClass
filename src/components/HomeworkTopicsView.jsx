import React, { useState } from 'react';
import { BookOpen, CheckSquare, Square, Calendar, User, Search, Filter } from 'lucide-react';

export default function HomeworkTopicsView({ 
  attendanceRecords, 
  onUpdateRecord, 
  subjects, 
  timetable 
}) {
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'pending', 'completed'
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all entries that have topic or homework
  const items = [];

  Object.entries(attendanceRecords).forEach(([key, rec]) => {
    if (rec.topic || rec.homework) {
      const [dateKey, periodId] = key.split('_');
      const [y, m, d] = dateKey.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const dayOfWeek = dateObj.getDay();
      const periods = timetable[dayOfWeek] || [];
      const period = periods.find(p => p.id === periodId);
      const subject = period ? subjects.find(s => s.id === period.subjectId) : null;

      items.push({
        recordKey: key,
        dateKey,
        dateObj,
        period,
        subject,
        topic: rec.topic,
        homework: rec.homework,
        homeworkDone: rec.homeworkDone,
        status: rec.status
      });
    }
  });

  // Sort by date descending
  items.sort((a, b) => b.dateKey.localeCompare(a.dateKey));

  const filteredItems = items.filter(item => {
    if (filterMode === 'pending' && (!item.homework || item.homeworkDone)) return false;
    if (filterMode === 'completed' && (!item.homework || !item.homeworkDone)) return false;
    if (selectedSubjectId !== 'all' && item.subject?.id !== selectedSubjectId) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const topicMatch = item.topic?.toLowerCase().includes(term);
      const hwMatch = item.homework?.toLowerCase().includes(term);
      const subMatch = item.subject?.name?.toLowerCase().includes(term);
      if (!topicMatch && !hwMatch && !subMatch) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            Class Topics Taught & Homework Tracker
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
            Review topics covered in previous lectures and manage pending assignments.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select 
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              fontSize: '12.5px',
              fontFamily: 'inherit',
              fontWeight: 600
            }}
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>

          <div className="toolbar-tabs">
            <button 
              className={`tab-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All Logs
            </button>
            <button 
              className={`tab-btn ${filterMode === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterMode('pending')}
            >
              Pending HW
            </button>
            <button 
              className={`tab-btn ${filterMode === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterMode('completed')}
            >
              Completed HW
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Items */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '18px',
        padding: '24px',
        boxShadow: 'var(--shadow-card)'
      }}>
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <BookOpen size={36} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155' }}>
              No topic or homework logs found
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              Add topics and homework notes directly in the "Daily Attendance" tab.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredItems.map(item => {
              const rec = attendanceRecords[item.recordKey];

              return (
                <div 
                  key={item.recordKey}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    background: '#fafcff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: '6px' }}>
                        {item.dateKey}
                      </span>
                      {item.period && (
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                          Period {item.period.period} ({item.period.time})
                        </span>
                      )}
                      {item.subject && (
                        <span 
                          style={{ 
                            fontSize: '12px', 
                            fontWeight: 700, 
                            color: item.subject.color,
                            backgroundColor: item.subject.bgLight,
                            padding: '3px 10px',
                            borderRadius: '999px'
                          }}
                        >
                          {item.subject.name}
                        </span>
                      )}
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: item.status === 'present' ? '#ecfdf5' : item.status === 'absent' ? '#fee2e2' : '#f1f5f9',
                      color: item.status === 'present' ? '#059669' : item.status === 'absent' ? '#dc2626' : '#64748b',
                      textTransform: 'uppercase'
                    }}>
                      {item.status}
                    </span>
                  </div>

                  {/* Topic row */}
                  {item.topic && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13.5px', color: '#1e293b' }}>
                      <BookOpen size={16} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ color: '#475569', fontSize: '11.5px', textTransform: 'uppercase' }}>Topic Covered: </strong>
                        <span>{item.topic}</span>
                      </div>
                    </div>
                  )}

                  {/* Homework row */}
                  {item.homework && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      fontSize: '13.5px', 
                      background: item.homeworkDone ? '#f0fdf4' : '#fffbeb',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${item.homeworkDone ? '#bbf7d0' : '#fde68a'}`
                    }}>
                      <input 
                        type="checkbox"
                        checked={item.homeworkDone || false}
                        onChange={(e) => onUpdateRecord(item.recordKey, { ...rec, homeworkDone: e.target.checked })}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#10b981' }}
                      />
                      <div style={{ flex: 1, textDecoration: item.homeworkDone ? 'line-through' : 'none', color: item.homeworkDone ? '#166534' : '#92400e' }}>
                        <strong style={{ fontSize: '11.5px', textTransform: 'uppercase' }}>Homework: </strong>
                        <span>{item.homework}</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: item.homeworkDone ? '#166534' : '#d97706' }}>
                        {item.homeworkDone ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
