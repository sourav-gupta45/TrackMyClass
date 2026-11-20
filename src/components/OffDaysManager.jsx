import React, { useState } from 'react';
import { Palmtree, Plus, Trash2, Calendar, Sparkles } from 'lucide-react';

export default function OffDaysManager({ 
  offDays, 
  setOffDays, 
  onOpenAddOffDay 
}) {
  const handleDeleteOffDay = (dateKey) => {
    const updated = { ...offDays };
    delete updated[dateKey];
    setOffDays(updated);
  };

  const offDaysList = Object.entries(offDays).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            College Off-Days & Holidays
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
            Mark college fests, institutional holidays, or medical leaves. Off days do not count against your attendance.
          </p>
        </div>

        <button 
          className="header-btn-primary"
          onClick={onOpenAddOffDay}
        >
          <Plus size={16} />
          <span>Mark New Off-Day / Holiday</span>
        </button>
      </div>

      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '18px',
        padding: '24px',
        boxShadow: 'var(--shadow-card)'
      }}>
        {offDaysList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <Palmtree size={36} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155' }}>
              No off-days registered
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              Add planned holidays, fests, or days off so they won't count as absences.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {offDaysList.map(([dateKey, info]) => {
              const isHoliday = info.type === 'holiday';

              return (
                <div 
                  key={dateKey}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 18px',
                    borderRadius: '14px',
                    border: `1px solid ${isHoliday ? '#ede9fe' : '#e2e8f0'}`,
                    background: isHoliday ? '#faf5ff' : '#f8fafc',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: isHoliday ? '#ede9fe' : '#e2e8f0',
                      color: isHoliday ? '#7c3aed' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isHoliday ? <Sparkles size={20} /> : <Palmtree size={20} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: isHoliday ? '#7c3aed' : '#64748b', textTransform: 'uppercase' }}>
                        {dateKey} &bull; {info.type}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                        {info.reason}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteOffDay(dateKey)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '6px'
                    }}
                    title="Remove off-day"
                  >
                    <Trash2 size={16} />
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
