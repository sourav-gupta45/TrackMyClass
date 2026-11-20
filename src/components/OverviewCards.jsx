import React from 'react';
import { 
  Edit3, 
  Download, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export default function OverviewCards({ 
  student, 
  stats, 
  onEditStudent,
  onExportReport,
  onOpenSimulator
}) {
  const isOverallSafe = stats.overallPercentage >= 75;

  return (
    <div className="student-stats-grid">
      {/* Student Details Card (Exact layout matching the reference) */}
      <div className="student-card">
        <div className="student-card-top">
          <div className="student-card-title">
            <span className="title-blue-dot" />
            <span>Student Details</span>
          </div>
          <div className="student-card-actions">
            <button 
              className="card-pill-btn" 
              onClick={onEditStudent}
              title="Edit Student Info"
            >
              <Edit3 size={13} />
            </button>
            <div className="card-pill-btn">
              <Calendar size={13} />
              <span>{student.semester || 'Sem 5'}</span>
            </div>
            <button 
              className="download-info-btn"
              onClick={onExportReport}
              title="Export Full Attendance Summary"
            >
              <Download size={13} />
              <span>Download Info</span>
            </button>
          </div>
        </div>

        <div className="student-profile-row">
          <div className="profile-avatar-container">
            <img 
              src={student.avatar} 
              alt={student.name} 
              className="profile-avatar-img"
            />
            <span className="profile-badge-tag">Enrolled</span>
          </div>

          <div className="profile-meta-grid">
            <div>
              <div className="meta-field-label">Student Name</div>
              <div className="meta-field-value">{student.name}</div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                {student.rollNo}
              </div>
            </div>

            <div>
              <div className="meta-field-label">Email Address</div>
              <div className="meta-field-value">{student.email}</div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                {student.role}
              </div>
            </div>

            <div>
              <div className="meta-field-label">Phone Number</div>
              <div className="meta-field-value">{student.phone}</div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                Year: {student.academicYear}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards (2x2 Grid) */}
      <div className="metrics-quad">
        {/* Metric 1: Total Attendance */}
        <div className="metric-box">
          <div className="metric-label">Total Classes Attended</div>
          <div className="metric-number-row">
            <span className="metric-huge-val">{stats.totalAttended}</span>
            <span className="metric-sub-unit">/ {stats.totalConducted} classes</span>
          </div>
          <div className="metric-footer-badge good">
            <CheckCircle size={13} />
            <span>{stats.totalConducted > 0 ? ((stats.totalAttended / stats.totalConducted) * 100).toFixed(0) : 100}% attendance rate</span>
          </div>
        </div>

        {/* Metric 2: Overall Percentage */}
        <div className="metric-box">
          <div className="metric-label">Overall Percentage</div>
          <div className="metric-number-row">
            <span 
              className="metric-huge-val" 
              style={{ color: isOverallSafe ? '#10b981' : '#ef4444' }}
            >
              {stats.overallPercentage}%
            </span>
            <span className="metric-sub-unit">min 75% req.</span>
          </div>
          <div className={`metric-footer-badge ${isOverallSafe ? 'good' : 'danger'}`}>
            {isOverallSafe ? (
              <>
                <ShieldCheck size={13} />
                <span>Safe (+{(stats.overallPercentage - 75).toFixed(1)}% buffer)</span>
              </>
            ) : (
              <>
                <ShieldAlert size={13} />
                <span>Action Required ({(75 - stats.overallPercentage).toFixed(1)}% below)</span>
              </>
            )}
          </div>
        </div>

        {/* Metric 3: Low Attendance Warning Count */}
        <div className="metric-box" style={{ cursor: 'pointer' }} onClick={() => onOpenSimulator()}>
          <div className="metric-label">Subject Health & Risk</div>
          <div className="metric-number-row">
            <span 
              className="metric-huge-val"
              style={{ color: stats.lowCount > 0 ? '#ef4444' : '#10b981' }}
            >
              {stats.lowCount}
            </span>
            <span className="metric-sub-unit">subjects &lt; 75%</span>
          </div>
          <div className={`metric-footer-badge ${stats.lowCount > 0 ? 'danger' : 'good'}`}>
            {stats.lowCount > 0 ? (
              <>
                <AlertCircle size={13} />
                <span>Click to view recovery plan</span>
              </>
            ) : (
              <>
                <CheckCircle size={13} />
                <span>All subjects healthy</span>
              </>
            )}
          </div>
        </div>

        {/* Metric 4: Safe Bunks Available */}
        <div className="metric-box" style={{ cursor: 'pointer' }} onClick={() => onOpenSimulator()}>
          <div className="metric-label">Available Safe Bunks</div>
          <div className="metric-number-row">
            <span className="metric-huge-val" style={{ color: stats.safeBunksCount > 0 ? '#2563eb' : '#f59e0b' }}>
              {stats.safeBunksCount}
            </span>
            <span className="metric-sub-unit">periods can be skipped</span>
          </div>
          <div className="metric-footer-badge good" style={{ color: '#2563eb' }}>
            <TrendingUp size={13} />
            <span>Simulate absent impact &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
