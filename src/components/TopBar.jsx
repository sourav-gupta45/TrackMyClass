import React from 'react';
import { Search, Bell, ChevronDown, Sparkles } from 'lucide-react';

export default function TopBar({ 
  searchQuery, 
  setSearchQuery, 
  student, 
  onEditProfile,
  lowAttendanceSubjects,
  onShowAlerts
}) {
  const hasAlerts = lowAttendanceSubjects.length > 0;

  return (
    <header className="app-topbar-custom">
      {/* Top Row: Left Brand/Greeting & Right Profile + Notification Pill */}
      <div className="topbar-upper-row">
        <div className="topbar-welcome-tag">
          <span className="live-status-dot" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
            Academic Session 2026-2027
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>&bull; Live Tracking Active</span>
        </div>

        {/* Right side: Notification Button + Generously Spaced Student Profile Capsule */}
        <div className="topbar-right-cluster">
          {/* Notification Button */}
          <button 
            className="topbar-icon-btn notification-pill-btn" 
            onClick={onShowAlerts}
            title={hasAlerts ? `${lowAttendanceSubjects.length} subject(s) below 75%!` : "All subject attendance healthy!"}
          >
            <Bell size={18} />
            {hasAlerts && <span className="notification-dot" />}
          </button>

          {/* Spacious Student Profile Capsule (Expanded Name & Stream) */}
          <div 
            className="topbar-user-pill-expanded" 
            onClick={onEditProfile} 
            title="Click to Edit Profile"
          >
            <img 
              src={student.avatar} 
              alt={student.name} 
              className="user-pill-avatar-lg"
            />
            <div className="user-pill-info-expanded">
              <div className="user-pill-name-lg">{student.name}</div>
              <div className="user-pill-stream-lg">{student.role || 'B.Tech Computer Science (Sem 5)'}</div>
            </div>
            <div className="user-pill-dropdown-icon">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Dedicated Full-Width Search Bar Below Profile */}
      <div className="topbar-search-row">
        <div className="topbar-search-container-full">
          <Search size={17} className="topbar-search-icon" />
          <input 
            type="text" 
            placeholder="Search subjects, lecture topics, homework tasks, or dates (e.g. Data Structures, 2026-11-20)..." 
            className="topbar-search-input-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
