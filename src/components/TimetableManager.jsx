import React, { useState } from 'react';
import { Plus, Trash2, Clock, Calendar, Check, BookOpen } from 'lucide-react';

export default function TimetableManager({ 
  timetable, 
  setTimetable, 
  subjects 
}) {
  const [activeDay, setActiveDay] = useState(1); // 1 = Monday
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Add new period to active day
  const handleAddPeriod = () => {
    const dayPeriods = timetable[activeDay] || [];
    const newPeriodNum = dayPeriods.length + 1;
    const newPeriod = {
      id: `p_${Date.now()}`,
      period: newPeriodNum,
      time: "09:00 AM - 10:00 AM",
      subjectId: subjects[0]?.id || ''
    };
    setTimetable({
      ...timetable,
      [activeDay]: [...dayPeriods, newPeriod]
    });
  };

  const handleDeletePeriod = (periodId) => {
    const dayPeriods = timetable[activeDay] || [];
    const updated = dayPeriods.filter(p => p.id !== periodId).map((p, idx) => ({
      ...p,
      period: idx + 1
    }));
    setTimetable({
      ...timetable,
      [activeDay]: updated
    });
  };

  const handleUpdatePeriod = (periodId, field, value) => {
    const dayPeriods = timetable[activeDay] || [];
    const updated = dayPeriods.map(p => {
      if (p.id === periodId) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setTimetable({
      ...timetable,
      [activeDay]: updated
    });
  };

  const currentDayPeriods = timetable[activeDay] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            Weekly Class Schedule & Timetable
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
            Define which subject classes happen on each day of the week.
          </p>
        </div>

        <button 
          className="header-btn-primary"
          onClick={handleAddPeriod}
        >
          <Plus size={16} />
          <span>Add Period to {dayNames[activeDay]}</span>
        </button>
      </div>

      {/* Day Selector Pills */}
      <div className="toolbar-tabs" style={{ width: 'fit-content' }}>
        {[1, 2, 3, 4, 5, 6, 0].map(dayIdx => (
          <button
            key={dayIdx}
            className={`tab-btn ${activeDay === dayIdx ? 'active' : ''}`}
            onClick={() => setActiveDay(dayIdx)}
          >
            {dayNames[dayIdx]}
            <span style={{ fontSize: '11px', opacity: 0.7 }}>
              ({(timetable[dayIdx] || []).length})
            </span>
          </button>
        ))}
      </div>

      {/* Periods Table for Active Day */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '18px',
        padding: '24px',
        boxShadow: 'var(--shadow-card)'
      }}>
        {currentDayPeriods.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <Calendar size={36} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155' }}>
              No classes scheduled for {dayNames[activeDay]}
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              Click "Add Period to {dayNames[activeDay]}" above to schedule lectures or lab sessions.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentDayPeriods.map(p => {
              const assignedSubject = subjects.find(s => s.id === p.subjectId);

              return (
                <div 
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    background: '#fafcff',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span className="period-tag">Period {p.period}</span>

                    {/* Time Input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} style={{ color: '#64748b' }} />
                      <input 
                        type="text"
                        value={p.time}
                        onChange={(e) => handleUpdatePeriod(p.id, 'time', e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          fontWeight: 600,
                          width: '180px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
                    <BookOpen size={16} style={{ color: assignedSubject?.color || '#3b82f6' }} />
                    <select
                      value={p.subjectId}
                      onChange={(e) => handleUpdatePeriod(p.id, 'subjectId', e.target.value)}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13.5px',
                        fontFamily: 'inherit',
                        fontWeight: 600,
                        color: '#0f172a',
                        width: '100%',
                        background: '#ffffff'
                      }}
                    >
                      {subjects.map(sub => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name} ({sub.code}) &bull; {sub.faculty}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delete Period Button */}
                  <button
                    onClick={() => handleDeletePeriod(p.id)}
                    style={{
                      background: '#fee2e2',
                      border: 'none',
                      color: '#ef4444',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Remove period"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
