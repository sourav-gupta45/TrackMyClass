import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingDown, 
  Calendar, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { 
  calculatePercentage, 
  getClassesNeededFor75, 
  getSafeBunks, 
  formatDateKey 
} from '../utils/attendanceCalculations';

export default function AbsentSimulator({ 
  subjects, 
  timetable, 
  offDays, 
  attendanceRecords, 
  defaultSubjectId = null,
  onApplyAbsence
}) {
  const [selectedTargetDay, setSelectedTargetDay] = useState('tomorrow'); // 'today', 'tomorrow', 'custom'
  const [customDate, setCustomDate] = useState('2026-11-23'); // next Monday
  const [selectedPeriodIds, setSelectedPeriodIds] = useState([]); // which periods to miss
  const [manualSubjectId, setManualSubjectId] = useState(defaultSubjectId || subjects[0]?.id || '');
  const [manualMissCount, setManualMissCount] = useState(1);
  const [mode, setMode] = useState('day'); // 'day' (simulate day) or 'subject' (simulate N classes)

  // Determine actual target date
  let targetDateKey = '2026-11-20'; // Today is Nov 20, 2026
  if (selectedTargetDay === 'today') {
    targetDateKey = '2026-11-20';
  } else if (selectedTargetDay === 'tomorrow') {
    targetDateKey = '2026-11-21';
  } else {
    targetDateKey = customDate;
  }

  const [y, m, d] = targetDateKey.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedTargetStr = `${dayNames[dayOfWeek]}, ${d} ${monthNames[m - 1]} ${y}`;

  // Check if target day is an off-day
  const offDayInfo = offDays[targetDateKey];
  const scheduledPeriods = timetable[dayOfWeek] || [];

  // Calculate base attendance for each subject
  const currentStats = {};
  let overallAttended = 0;
  let overallTotal = 0;

  subjects.forEach(sub => {
    let attended = 0;
    let total = 0;
    Object.entries(attendanceRecords).forEach(([key, rec]) => {
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

    overallAttended += attended;
    overallTotal += total;

    const pct = calculatePercentage(attended, total);
    currentStats[sub.id] = {
      attended,
      total,
      percentage: pct,
      safeBunks: getSafeBunks(attended, total),
      classesNeeded: getClassesNeededFor75(attended, total)
    };
  });

  const currentOverallPct = calculatePercentage(overallAttended, overallTotal);

  // Initialize selectedPeriodIds to all periods of target day if not set or if day changed
  const handleSelectDayPreset = (preset) => {
    setSelectedTargetDay(preset);
    let newDate = '2026-11-20';
    if (preset === 'tomorrow') newDate = '2026-11-21';
    else if (preset === 'custom') newDate = customDate;
    
    const [ny, nm, nd] = newDate.split('-').map(Number);
    const nDayOfWeek = new Date(ny, nm - 1, nd).getDay();
    const periods = timetable[nDayOfWeek] || [];
    setSelectedPeriodIds(periods.map(p => p.id));
  };

  const togglePeriodSelection = (periodId) => {
    if (selectedPeriodIds.includes(periodId)) {
      setSelectedPeriodIds(selectedPeriodIds.filter(id => id !== periodId));
    } else {
      setSelectedPeriodIds([...selectedPeriodIds, periodId]);
    }
  };

  // Perform Simulation
  // Case A: Day simulation
  let projectedOverallAttended = overallAttended;
  let projectedOverallTotal = overallTotal;
  const projectedSubjectStats = {};

  subjects.forEach(sub => {
    projectedSubjectStats[sub.id] = {
      attended: currentStats[sub.id].attended,
      total: currentStats[sub.id].total,
      classesToMiss: 0
    };
  });

  if (mode === 'day') {
    scheduledPeriods.forEach(period => {
      if (selectedPeriodIds.includes(period.id)) {
        projectedOverallTotal += 1; // missed class adds to total but not attended
        if (projectedSubjectStats[period.subjectId]) {
          projectedSubjectStats[period.subjectId].total += 1;
          projectedSubjectStats[period.subjectId].classesToMiss += 1;
        }
      }
    });
  } else {
    // Mode: Subject simulation
    if (projectedSubjectStats[manualSubjectId]) {
      projectedOverallTotal += manualMissCount;
      projectedSubjectStats[manualSubjectId].total += manualMissCount;
      projectedSubjectStats[manualSubjectId].classesToMiss += manualMissCount;
    }
  }

  const projectedOverallPct = calculatePercentage(projectedOverallAttended, projectedOverallTotal);
  const overallDrop = Number((currentOverallPct - projectedOverallPct).toFixed(1));
  const isOverallSafe = projectedOverallPct >= 75;

  // Compute results for each affected subject
  const affectedSubjects = subjects.map(sub => {
    const cur = currentStats[sub.id];
    const proj = projectedSubjectStats[sub.id];
    const newPct = calculatePercentage(proj.attended, proj.total);
    const drop = Number((cur.percentage - newPct).toFixed(1));
    const isSafe = newPct >= 75;
    const recoveryNeeded = isSafe ? 0 : getClassesNeededFor75(proj.attended, proj.total);
    const remainingBunks = isSafe ? getSafeBunks(proj.attended, proj.total) : 0;

    return {
      ...sub,
      currentAttended: cur.attended,
      currentTotal: cur.total,
      currentPct: cur.percentage,
      projectedAttended: proj.attended,
      projectedTotal: proj.total,
      projectedPct: newPct,
      drop,
      classesToMiss: proj.classesToMiss,
      isSafe,
      recoveryNeeded,
      remainingBunks
    };
  }).filter(s => s.classesToMiss > 0 || mode === 'subject' && s.id === manualSubjectId);

  const hasAnyCriticalSubject = affectedSubjects.some(s => !s.isSafe);
  const verdictSafe = isOverallSafe && !hasAnyCriticalSubject;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner with Explanation */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '20px',
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontSize: '13px', fontWeight: 700 }}>
            <Calculator size={18} />
            <span>SMART ABSENT & BUNK CALCULATOR</span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginTop: '6px', letterSpacing: '-0.4px' }}>
            Can I Safely Bunk Today or Tomorrow?
          </h2>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', marginTop: '6px', lineHeight: 1.5 }}>
            Simulate missing any day or class. We recalculate your exact attendance percentage, verify if it stays above the mandatory 75% rule, and calculate recovery classes if it drops!
          </p>
        </div>

        {/* Mode Toggle */}
        <div style={{ background: '#334155', padding: '4px', borderRadius: '999px', display: 'flex' }}>
          <button 
            style={{
              padding: '7px 16px',
              borderRadius: '999px',
              border: 'none',
              background: mode === 'day' ? '#2563eb' : 'transparent',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => setMode('day')}
          >
            Simulate by Day
          </button>
          <button 
            style={{
              padding: '7px 16px',
              borderRadius: '999px',
              border: 'none',
              background: mode === 'subject' ? '#2563eb' : 'transparent',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => setMode('subject')}
          >
            Simulate by Subject
          </button>
        </div>
      </div>

      {/* Selector Controls */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '18px',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {mode === 'day' ? (
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
              STEP 1: CHOOSE THE DAY YOU WANT TO BE ABSENT
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                className={`tab-btn ${selectedTargetDay === 'today' ? 'active' : ''}`}
                style={{ padding: '8px 18px', border: '1px solid #cbd5e1' }}
                onClick={() => handleSelectDayPreset('today')}
              >
                Today (Friday, 20 Nov)
              </button>
              <button 
                className={`tab-btn ${selectedTargetDay === 'tomorrow' ? 'active' : ''}`}
                style={{ padding: '8px 18px', border: '1px solid #cbd5e1' }}
                onClick={() => handleSelectDayPreset('tomorrow')}
              >
                Tomorrow (Saturday, 21 Nov)
              </button>
              <button 
                className={`tab-btn ${selectedTargetDay === 'custom' ? 'active' : ''}`}
                style={{ padding: '8px 18px', border: '1px solid #cbd5e1' }}
                onClick={() => handleSelectDayPreset('custom')}
              >
                Custom Date
              </button>

              {selectedTargetDay === 'custom' && (
                <input 
                  type="date" 
                  value={customDate}
                  onChange={(e) => {
                    setCustomDate(e.target.value);
                    const [cy, cm, cd] = e.target.value.split('-').map(Number);
                    const cDayOfWeek = new Date(cy, cm - 1, cd).getDay();
                    const periods = timetable[cDayOfWeek] || [];
                    setSelectedPeriodIds(periods.map(p => p.id));
                  }}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontFamily: 'inherit'
                  }}
                />
              )}
            </div>

            {/* Target Day Class List */}
            <div style={{ marginTop: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                  STEP 2: SELECT WHICH PERIODS / CLASSES YOU WILL SKIP ON {formattedTargetStr.toUpperCase()}
                </span>
                {scheduledPeriods.length > 0 && (
                  <button 
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#2563eb',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      if (selectedPeriodIds.length === scheduledPeriods.length) {
                        setSelectedPeriodIds([]);
                      } else {
                        setSelectedPeriodIds(scheduledPeriods.map(p => p.id));
                      }
                    }}
                  >
                    {selectedPeriodIds.length === scheduledPeriods.length ? 'Deselect All' : 'Select All Periods (Full Day Bunk)'}
                  </button>
                )}
              </div>

              {offDayInfo ? (
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', color: '#64748b', fontSize: '13px' }}>
                  🎉 {formattedTargetStr} is already marked as a <strong>{offDayInfo.type === 'holiday' ? 'Holiday' : 'Scheduled Off Day'}</strong> ({offDayInfo.reason}). No classes will happen, so your attendance will NOT be affected at all!
                </div>
              ) : scheduledPeriods.length === 0 ? (
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', color: '#64748b', fontSize: '13px' }}>
                  No classes are scheduled on this day in your timetable. You have a free day!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                  {scheduledPeriods.map(period => {
                    const sub = subjects.find(s => s.id === period.subjectId);
                    const isChecked = selectedPeriodIds.includes(period.id);

                    return (
                      <div 
                        key={period.id}
                        onClick={() => togglePeriodSelection(period.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: isChecked ? '2px solid #ef4444' : '1px solid #e2e8f0',
                          background: isChecked ? '#fef2f2' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          border: isChecked ? 'none' : '2px solid #cbd5e1',
                          background: isChecked ? '#ef4444' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff'
                        }}>
                          {isChecked && <Check size={14} strokeWidth={3} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                            Period {period.period} &bull; {period.time}
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                            {sub?.name || 'Class'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Mode: Subject Simulator */
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                SELECT SUBJECT TO TEST
              </label>
              <select 
                value={manualSubjectId}
                onChange={(e) => setManualSubjectId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontFamily: 'inherit',
                  fontSize: '13.5px'
                }}
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) - Current: {currentStats[s.id]?.percentage}%
                  </option>
                ))}
              </select>
            </div>

            <div style={{ width: '200px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                CLASSES YOU PLAN TO MISS
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="number"
                  min="1"
                  max="20"
                  value={manualMissCount}
                  onChange={(e) => setManualMissCount(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 700
                  }}
                />
                <span style={{ fontSize: '13px', color: '#64748b' }}>class(es)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SIMULATION VERDICT & DETAILED IMPACT */}
      <div style={{
        background: verdictSafe ? '#ecfdf5' : '#fef2f2',
        border: `2px solid ${verdictSafe ? '#10b981' : '#ef4444'}`,
        borderRadius: '20px',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Main Verdict Card */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: verdictSafe ? '#10b981' : '#ef4444',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: verdictSafe ? '0 8px 16px rgba(16, 185, 129, 0.3)' : '0 8px 16px rgba(239, 68, 68, 0.3)'
            }}>
              {verdictSafe ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
            </div>

            <div>
              <div style={{
                display: 'inline-block',
                background: verdictSafe ? '#d1fae5' : '#fee2e2',
                color: verdictSafe ? '#065f46' : '#991b1b',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '999px',
                letterSpacing: '0.6px',
                textTransform: 'uppercase'
              }}>
                {verdictSafe ? '✓ SAFE TO BUNK' : '⚠️ HIGH RISK / NOT RECOMMENDED'}
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: verdictSafe ? '#065f46' : '#991b1b', marginTop: '6px' }}>
                {verdictSafe 
                  ? 'Yes! You can safely take leave without falling below 75%.'
                  : 'Danger! Being absent will drop your attendance below the 75% threshold!'}
              </h3>

              <p style={{ fontSize: '13.5px', color: verdictSafe ? '#047857' : '#b91c1c', marginTop: '4px', maxWidth: '650px', lineHeight: 1.5 }}>
                {verdictSafe 
                  ? `Overall attendance will adjust from ${currentOverallPct}% to ${projectedOverallPct}% (-${overallDrop}%). All affected subjects will remain safely above 75%.`
                  : `Being absent will cause your attendance to fall below 75% in one or more subjects. You risk getting debarred or receiving warning notices from university administration.`}
              </p>
            </div>
          </div>

          {/* Overall Percentage Comparison Block */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>CURRENT OVERALL</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{currentOverallPct}%</div>
            </div>
            <ArrowRight size={20} style={{ color: '#94a3b8' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>PROJECTED OVERALL</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: isOverallSafe ? '#10b981' : '#ef4444' }}>
                {projectedOverallPct}%
              </div>
            </div>
          </div>
        </div>

        {/* Subject-Wise Impact Table */}
        {affectedSubjects.length > 0 && (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '13px', fontWeight: 700, color: '#475569' }}>
              INDIVIDUAL SUBJECT IMPACT ANALYSIS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {affectedSubjects.map(sub => {
                return (
                  <div 
                    key={sub.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderBottom: '1px solid #f8fafc',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: sub.color }} />
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{sub.name}</span>
                        <span style={{ fontSize: '11.5px', color: '#64748b' }}>({sub.code})</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                        Missing <strong>{sub.classesToMiss} class(es)</strong> &bull; Faculty: {sub.faculty}
                      </div>
                    </div>

                    {/* Before -> After */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Current</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155' }}>{sub.currentPct}%</div>
                        <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>({sub.currentAttended}/{sub.currentTotal})</div>
                      </div>

                      <ArrowRight size={16} style={{ color: '#cbd5e1' }} />

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>After Bunk</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: sub.isSafe ? '#10b981' : '#ef4444' }}>
                          {sub.projectedPct}%
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>({sub.projectedAttended}/{sub.projectedTotal})</div>
                      </div>
                    </div>

                    {/* Verdict & Recovery Action */}
                    <div style={{ minWidth: '240px', textAlign: 'right' }}>
                      {sub.isSafe ? (
                        <div>
                          <span style={{
                            background: '#ecfdf5',
                            color: '#059669',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <CheckCircle2 size={13} />
                            Safe (&ge; 75%)
                          </span>
                          <div style={{ fontSize: '11.5px', color: '#059669', marginTop: '4px' }}>
                            You still have <strong>{sub.remainingBunks} safe bunks</strong> left.
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <AlertTriangle size={13} />
                            Critical (&lt; 75%)
                          </span>
                          <div style={{ fontSize: '11.5px', color: '#dc2626', fontWeight: 600, marginTop: '4px' }}>
                            Must attend <strong>{sub.recoveryNeeded} consecutive classes</strong> to recover!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
