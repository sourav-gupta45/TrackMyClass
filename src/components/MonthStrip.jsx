import React, { useRef } from 'react';
import { 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Palmtree, 
  Sparkles,
  Minus
} from 'lucide-react';
import { formatDateKey } from '../utils/attendanceCalculations';

export default function MonthStrip({ 
  currentDate, 
  selectedDate, 
  setSelectedDate, 
  offDays, 
  attendanceRecords,
  timetable
}) {
  const scrollRef = useRef(null);

  // Generate days for November 2026 (or selected month)
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateObj = new Date(year, month, dayNum);
    const dateKey = formatDateKey(dateObj);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Sat

    // Check if day off / holiday
    const offDayInfo = offDays[dateKey];
    const isScheduledOff = dayOfWeek === 0 || dayOfWeek === 6 || !!offDayInfo;

    // Check periods scheduled on this day
    const scheduledPeriods = timetable[dayOfWeek] || [];

    // Check attendance records for this day
    let attended = 0;
    let absent = 0;
    let totalLogged = 0;

    scheduledPeriods.forEach(p => {
      const rec = attendanceRecords[`${dateKey}_${p.id}`];
      if (rec) {
        if (rec.status === 'present') attended++;
        if (rec.status === 'absent') absent++;
        if (rec.status !== 'cancelled') totalLogged++;
      }
    });

    let status = 'future';
    if (dateObj > new Date(2026, 10, 20)) { // after Nov 20, 2026
      status = offDayInfo ? (offDayInfo.type === 'holiday' ? 'holiday' : 'dayoff') : 'future';
    } else if (offDayInfo) {
      status = offDayInfo.type === 'holiday' ? 'holiday' : 'dayoff';
    } else if (scheduledPeriods.length === 0) {
      status = 'dayoff';
    } else if (totalLogged > 0) {
      if (absent === 0 && attended > 0) status = 'present';
      else if (attended === 0 && absent > 0) status = 'absent';
      else if (attended > 0 && absent > 0) status = 'halfday';
      else status = 'dayoff';
    } else {
      status = 'dayoff';
    }

    return {
      dateObj,
      dateKey,
      dayNum: String(dayNum).padStart(2, '0'),
      dayOfWeek,
      status,
      offDayInfo,
      isToday: dateKey === '2026-11-20'
    };
  });

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -250 : 250,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="month-strip-container">
      <div className="strip-header">
        <div className="strip-title">
          <span>Attendance Timeline &bull; November 2026</span>
        </div>

        {/* Legend matching reference screenshot */}
        <div className="strip-legend">
          <div className="legend-item">
            <span className="legend-dot present" />
            <span>Present</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot absent" />
            <span>Absent</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot halfday" />
            <span>Partial / Mixed</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dayoff" />
            <span>Day Off</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot holiday" />
            <span>Holiday</span>
          </div>
        </div>
      </div>

      <div className="days-scroll-wrapper">
        <button 
          onClick={() => scroll('left')}
          style={{
            position: 'absolute',
            left: '-14px',
            zIndex: 2,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
          }}
          title="Scroll Left"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="days-scroll-strip" ref={scrollRef}>
          {daysArray.map((day) => {
            const isSelected = selectedDate === day.dateKey;

            return (
              <button
                key={day.dateKey}
                className={`day-cell-btn ${isSelected ? 'selected' : ''} ${day.isToday ? 'today' : ''}`}
                onClick={() => setSelectedDate(day.dateKey)}
                title={`${day.dateKey} ${day.offDayInfo ? `(${day.offDayInfo.reason})` : ''}`}
              >
                <span className="day-number-label">{day.dayNum}</span>

                {/* Status Circle */}
                <div className={`day-status-circle circle-${day.status}`}>
                  {day.status === 'present' && <Check size={16} strokeWidth={3} />}
                  {day.status === 'absent' && <X size={16} strokeWidth={3} />}
                  {day.status === 'halfday' && <Minus size={15} strokeWidth={3} />}
                  {day.status === 'holiday' && <Sparkles size={14} />}
                  {day.status === 'dayoff' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8' }} />}
                  {day.status === 'future' && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#cbd5e1' }} />}
                </div>
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => scroll('right')}
          style={{
            position: 'absolute',
            right: '-14px',
            zIndex: 2,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
          }}
          title="Scroll Right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
