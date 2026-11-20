import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Calculator, 
  BookOpen, 
  Calendar, 
  Palmtree, 
  BookMarked,
  Settings, 
  HelpCircle, 
  RotateCcw,
  Plus,
  ChevronLeft,
  UserPlus
} from 'lucide-react';
import ChecklistLogo from './ChecklistLogo';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  subjects, 
  lowAttendanceCount,
  onOpenAddSubject,
  onResetData,
  selectedSubjectFilter,
  setSelectedSubjectFilter
}) {
  return (
    <aside className="app-sidebar">
      <div>
        {/* Brand Header with Light-Themed 3-Item Checklist Logo */}
        <div className="brand-section">
          <div className="brand-logo-wrap">
            <ChecklistLogo size={38} />
            <div>
              <div className="brand-name">TrackMyClass</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Attendance System</div>
            </div>
          </div>
          <button className="sidebar-collapse-btn" title="Toggle Sidebar">
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* General Navigation */}
        <div className="sidebar-group-label">GENERAL</div>
        <ul className="sidebar-nav-list">
          <li>
            <button 
              className={`sidebar-nav-item ${currentTab === 'daily' && !selectedSubjectFilter ? 'active' : ''}`}
              onClick={() => {
                setCurrentTab('daily');
                setSelectedSubjectFilter(null);
              }}
            >
              <CalendarCheck size={18} className="nav-icon" />
              <span>Daily Attendance</span>
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-nav-item ${currentTab === 'simulator' ? 'active' : ''}`}
              onClick={() => {
                setCurrentTab('simulator');
                setSelectedSubjectFilter(null);
              }}
            >
              <Calculator size={18} className="nav-icon" />
              <span>Bunk Calculator</span>
              <span className="nav-badge-count" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                Simulator
              </span>
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-nav-item ${currentTab === 'subjects' ? 'active' : ''}`}
              onClick={() => {
                setCurrentTab('subjects');
                setSelectedSubjectFilter(null);
              }}
            >
              <BookOpen size={18} className="nav-icon" />
              <span>Subject Analytics</span>
              {lowAttendanceCount > 0 && (
                <span className="nav-badge-count danger">
                  {lowAttendanceCount} &lt;75%
                </span>
              )}
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-nav-item ${currentTab === 'timetable' ? 'active' : ''}`}
              onClick={() => {
                setCurrentTab('timetable');
                setSelectedSubjectFilter(null);
              }}
            >
              <Calendar size={18} className="nav-icon" />
              <span>Class Timetable</span>
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-nav-item ${currentTab === 'offdays' ? 'active' : ''}`}
              onClick={() => {
                setCurrentTab('offdays');
                setSelectedSubjectFilter(null);
              }}
            >
              <Palmtree size={18} className="nav-icon" />
              <span>Off-Days & Holidays</span>
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-nav-item ${currentTab === 'homework' ? 'active' : ''}`}
              onClick={() => {
                setCurrentTab('homework');
                setSelectedSubjectFilter(null);
              }}
            >
              <BookMarked size={18} className="nav-icon" />
              <span>Topics & Homework</span>
            </button>
          </li>
        </ul>

        {/* Subjects Section */}
        <div className="sidebar-group-label" style={{ marginTop: '20px' }}>
          <span>MY SUBJECTS</span>
          <button 
            onClick={onOpenAddSubject}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569'
            }}
            title="Add Subject"
          >
            <Plus size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '160px', overflowY: 'auto' }}>
          {subjects.map(sub => {
            const isSelected = selectedSubjectFilter === sub.id;
            return (
              <div 
                key={sub.id} 
                className="sidebar-subject-item"
                style={{
                  background: isSelected ? sub.bgLight : 'transparent',
                  color: isSelected ? sub.color : 'inherit',
                  fontWeight: isSelected ? 700 : 500
                }}
                onClick={() => {
                  setSelectedSubjectFilter(isSelected ? null : sub.id);
                  setCurrentTab('subjects');
                }}
              >
                <span className="subject-color-dot" style={{ backgroundColor: sub.color }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sub.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Settings, Help Center, Reset Data, PLUS Share & Invite */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button 
          className="sidebar-nav-item"
          onClick={() => alert("Settings: Attendance threshold is set to 75%. All data is saved automatically in your browser's localStorage.")}
        >
          <Settings size={17} />
          <span>Settings</span>
        </button>
        <button 
          className="sidebar-nav-item"
          onClick={() => alert("Help Center:\n- Track daily attendance with topic and homework notes.\n- Use 'Bunk Calculator' to simulate absent days.\n- Customize timetable and holidays anytime.")}
        >
          <HelpCircle size={17} />
          <span>Help Center</span>
        </button>
        <button 
          className="sidebar-nav-item"
          style={{ color: '#ef4444' }}
          onClick={onResetData}
        >
          <RotateCcw size={17} />
          <span>Reset Demo Data</span>
        </button>

        {/* Share & Invite Section at the bottom of sidebar (As requested from Reference Image 2) */}
        <div style={{
          marginTop: '10px',
          padding: '12px',
          background: '#f8fafc',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="avatars-cluster">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" 
                alt="Member 1" 
                className="avatar-mini"
              />
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" 
                alt="Member 2" 
                className="avatar-mini"
              />
              <img 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" 
                alt="Member 3" 
                className="avatar-mini"
              />
            </div>
            <button 
              className="topbar-share-btn"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              style={{ fontSize: '12px', padding: '4px 6px' }}
            >
              Share
            </button>
          </div>

          <button 
            className="topbar-invite-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '7px 12px' }}
            onClick={() => alert("Invite classmates to share notes and timetable!")}
          >
            <UserPlus size={14} />
            <span>+ Invite</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
