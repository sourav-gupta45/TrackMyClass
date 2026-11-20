import React, { useState } from 'react';
import { 
  Clock, 
  User, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Slash, 
  BookOpen, 
  CheckSquare, 
  Square, 
  AlertCircle,
  PlusCircle,
  Download,
  Calendar,
  Sparkles,
  Palmtree
} from 'lucide-react';
import { calculatePercentage, getClassesNeededFor75 } from '../utils/attendanceCalculations';

export default function DailyPeriodLog({ 
  selectedDate, 
  setSelectedDate,
  subjects, 
  timetable, 
  offDays, 
  attendanceRecords, 
  onUpdateRecord,
  onMarkDayAsOff,
  onOpenSimulator,
  onExportReport
}) {
  const [filterType, setFilterType] = useState('all'); // all, present, absent, low

  // Parse date
  const [y, m, d] = selectedDate.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDayStr = `${dayNames[dayOfWeek]}, ${d} ${monthNames[m - 1]} ${y}`;

  // Check if off-day
  const offDayInfo = offDays[selectedDate];
  const scheduledPeriods = timetable[dayOfWeek] || [];

  // Calculate subject-wise attendance stats up to now
  const subjectStats = {};
  subjects.forEach(sub => {
    let attended = 0;
    let total = 0;
    Object.entries(attendanceRecords).forEach(([key, rec]) => {
      // Find period for key
      const [recDate, recPeriodId] = key.split('_');
      const recDateObj = new Date(recDate);
      const recDayOfWeek = recDateObj.getDay();
      const periodsForDay = timetable[recDayOfWeek] || [];
      const periodObj = periodsForDay.find(p => p.id === recPeriodId);
      if (periodObj && periodObj.subjectId === sub.id) {
        if (rec.status === 'present') {
          attended++;
          total++;
        } else if (rec.status === 'absent') {
          total++;
        }
      }
    });
    const percentage = calculatePercentage(attended, total);
    const classesNeeded = getClassesNeededFor75(attended, total);
    subjectStats[sub.id] = { attended, total, percentage, classesNeeded, isLow: percentage < 75 };
  });

  return (
    <div className="history-section">
      {/* Header and Toolbar */}
      <div className="history-toolbar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} style={{ color: '#2563eb' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              {formattedDayStr}
            </h2>
            {selectedDate === '2026-11-20' && (
              <span style={{ background: '#dbeafe', color: '#1e40af', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>
                TODAY
              </span>
            )}
          </div>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '3px' }}>
            {offDayInfo 
              ? `Designated ${offDayInfo.type === 'holiday' ? 'Holiday' : 'Off Day'}: ${offDayInfo.reason}` 
              : `${scheduledPeriods.length} classes scheduled for today. Update attendance, topics taught & homework below.`}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Quick Date Switcher */}
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              fontSize: '12.5px',
              fontFamily: 'inherit',
              color: '#0f172a',
              background: '#f8fafc',
              cursor: 'pointer'
            }}
          />

          {/* Filter Pills */}
          <div className="toolbar-tabs">
            <button 
              className={`tab-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Periods
            </button>
            <button 
              className={`tab-btn ${filterType === 'low' ? 'active' : ''}`}
              onClick={() => setFilterType('low')}
            >
              At Risk (&lt;75%)
            </button>
          </div>

          <button 
            className="header-btn-secondary"
            onClick={onExportReport}
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Off Day Banner if applicable */}
      {offDayInfo ? (
        <div style={{
          background: offDayInfo.type === 'holiday' ? '#f5f3ff' : '#f8fafc',
          border: `1.5px dashed ${offDayInfo.type === 'holiday' ? '#c4b5fd' : '#cbd5e1'}`,
          borderRadius: '16px',
          padding: '36px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: offDayInfo.type === 'holiday' ? '#ede9fe' : '#e2e8f0',
            color: offDayInfo.type === 'holiday' ? '#7c3aed' : '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {offDayInfo.type === 'holiday' ? <Sparkles size={28} /> : <Palmtree size={28} />}
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              {offDayInfo.type === 'holiday' ? 'Official Holiday' : 'Scheduled Off Day'}
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
              Reason: <strong>{offDayInfo.reason}</strong>
            </p>
          </div>
          <button 
            className="header-btn-secondary"
            style={{ marginTop: '8px' }}
            onClick={() => onMarkDayAsOff(selectedDate, null)}
          >
            Remove Off-Day (Mark as Regular College Day)
          </button>
        </div>
      ) : scheduledPeriods.length === 0 ? (
        <div style={{
          background: '#f8fafc',
          border: '1.5px dashed #cbd5e1',
          borderRadius: '16px',
          padding: '36px 24px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#475569' }}>
            No classes scheduled for {dayNames[dayOfWeek]}s
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            You can configure classes for this day in the "Class Timetable" tab.
          </p>
        </div>
      ) : (
        /* List of Scheduled Periods */
        <div className="period-list">
          {scheduledPeriods.map((period) => {
            const subject = subjects.find(s => s.id === period.subjectId) || {
              name: 'General Subject',
              code: 'GEN',
              faculty: 'TBA',
              color: '#3b82f6',
              bgLight: '#eff6ff'
            };

            const recordKey = `${selectedDate}_${period.id}`;
            const record = attendanceRecords[recordKey] || {
              status: 'present',
              topic: '',
              homework: '',
              homeworkDone: false
            };

            const subStats = subjectStats[subject.id] || { percentage: 100, isLow: false, classesNeeded: 0 };

            if (filterType === 'low' && !subStats.isLow) {
              return null;
            }

            return (
              <div 
                key={period.id} 
                className={`period-row-card ${record.status === 'present' ? 'present-row' : record.status === 'absent' ? 'absent-row' : ''}`}
              >
                {/* Main Row Info */}
                <div className="period-main-info">
                  <div className="period-date-time">
                    <span className="period-tag">Period {period.period}</span>
                    <span className="period-time-text">
                      <Clock size={14} />
                      {period.time}
                    </span>
                  </div>

                  {/* Subject Details */}
                  <div className="period-subject-group">
                    <span 
                      className="subject-badge-pill"
                      style={{ 
                        backgroundColor: subject.bgLight, 
                        color: subject.color,
                        border: `1px solid ${subject.color}20`
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: subject.color }} />
                      {subject.name} ({subject.code})
                    </span>

                    <span className="faculty-name-sub">
                      <User size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '3px' }} />
                      {subject.faculty}
                    </span>

                    {/* Mini Attendance Badge for this subject */}
                    <span 
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        background: subStats.isLow ? '#fee2e2' : '#ecfdf5',
                        color: subStats.isLow ? '#dc2626' : '#059669',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onClick={() => onOpenSimulator(subject.id)}
                      title={`Current attendance: ${subStats.percentage}%. Click to test absent impact.`}
                    >
                      {subStats.isLow && <AlertCircle size={12} />}
                      {subStats.percentage}% {subStats.isLow ? '⚠️ Danger' : '✓ Safe'}
                    </span>
                  </div>

                  {/* Attendance Status Buttons */}
                  <div className="status-toggle-group">
                    <button 
                      className={`status-toggle-btn ${record.status === 'present' ? 'active-present' : ''}`}
                      onClick={() => onUpdateRecord(recordKey, { ...record, status: 'present' })}
                    >
                      <CheckCircle2 size={14} />
                      <span>Present</span>
                    </button>

                    <button 
                      className={`status-toggle-btn ${record.status === 'absent' ? 'active-absent' : ''}`}
                      onClick={() => onUpdateRecord(recordKey, { ...record, status: 'absent' })}
                    >
                      <XCircle size={14} />
                      <span>Absent</span>
                    </button>

                    <button 
                      className={`status-toggle-btn ${record.status === 'cancelled' ? 'active-cancelled' : ''}`}
                      onClick={() => onUpdateRecord(recordKey, { ...record, status: 'cancelled' })}
                      title="Class was cancelled or teacher was on leave"
                    >
                      <Slash size={13} />
                      <span>Cancelled</span>
                    </button>
                  </div>
                </div>

                {/* Topic Taught & Homework Space */}
                <div className="period-details-panel">
                  {/* Topic Taught Field */}
                  <div className="input-group-field">
                    <label className="input-label-mini">
                      <BookOpen size={13} style={{ color: '#2563eb' }} />
                      <span>Topic Covered Today</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Graph algorithms, AVL Tree rotations, Page Tables..."
                      value={record.topic || ''}
                      onChange={(e) => onUpdateRecord(recordKey, { ...record, topic: e.target.value })}
                      className="topic-input-text"
                    />
                  </div>

                  {/* Homework / Task Field */}
                  <div className="input-group-field">
                    <label className="input-label-mini">
                      <CheckSquare size={13} style={{ color: '#10b981' }} />
                      <span>Homework / Assignments Given</span>
                    </label>
                    <div className="homework-input-wrap">
                      <input 
                        type="checkbox"
                        checked={record.homeworkDone || false}
                        onChange={(e) => onUpdateRecord(recordKey, { ...record, homeworkDone: e.target.checked })}
                        className="homework-check"
                        title="Mark homework completed"
                      />
                      <input 
                        type="text"
                        placeholder="e.g. Solve exercise 4.2 problems 1-5 by Monday..."
                        value={record.homework || ''}
                        onChange={(e) => onUpdateRecord(recordKey, { ...record, homework: e.target.value })}
                        className="topic-input-text"
                        style={{ textDecoration: record.homeworkDone && record.homework ? 'line-through' : 'none' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
