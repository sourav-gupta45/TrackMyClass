import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LowAttendanceBanner({ 
  lowAttendanceSubjects, 
  onOpenSimulator 
}) {
  if (!lowAttendanceSubjects || lowAttendanceSubjects.length === 0) {
    return (
      <div className="alert-banner safe">
        <div className="alert-banner-left">
          <div className="alert-banner-icon">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="alert-title">Attendance Status: Excellent & Safe</div>
            <div className="alert-desc">
              All enrolled subjects are currently above the mandatory 75% threshold. Keep up the consistency!
            </div>
          </div>
        </div>
        <button 
          className="alert-banner-btn"
          style={{ borderColor: '#059669', color: '#065f46' }}
          onClick={() => onOpenSimulator()}
        >
          Test Safe Bunks
        </button>
      </div>
    );
  }

  const firstSubject = lowAttendanceSubjects[0];

  return (
    <div className="alert-banner danger">
      <div className="alert-banner-left">
        <div className="alert-banner-icon">
          <ShieldAlert size={22} />
        </div>
        <div>
          <div className="alert-title">
            ⚠️ Low Attendance Reminder: {lowAttendanceSubjects.length} {lowAttendanceSubjects.length === 1 ? 'Subject is' : 'Subjects are'} Below 75%!
          </div>
          <div className="alert-desc">
            <strong>{firstSubject.name}</strong> is at <strong>{firstSubject.percentage}%</strong> ({firstSubject.attended}/{firstSubject.total} classes). 
            You must attend <strong>{firstSubject.classesNeeded} more consecutive classes</strong> without being absent to recover to &ge; 75%.
            {lowAttendanceSubjects.length > 1 && ` (+${lowAttendanceSubjects.length - 1} other subject needs attention)`}
          </div>
        </div>
      </div>
      <button 
        className="alert-banner-btn"
        style={{ borderColor: '#dc2626', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}
        onClick={() => onOpenSimulator(firstSubject.id)}
      >
        <span>Calculate Recovery</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
