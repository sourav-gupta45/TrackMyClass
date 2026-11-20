import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LowAttendanceBanner from './components/LowAttendanceBanner';
import OverviewCards from './components/OverviewCards';
import MonthStrip from './components/MonthStrip';
import DailyPeriodLog from './components/DailyPeriodLog';
import SubjectAnalytics from './components/SubjectAnalytics';
import AbsentSimulator from './components/AbsentSimulator';
import TimetableManager from './components/TimetableManager';
import OffDaysManager from './components/OffDaysManager';
import HomeworkTopicsView from './components/HomeworkTopicsView';
import AddOffDayModal from './components/AddOffDayModal';
import AddSubjectModal from './components/AddSubjectModal';
import EditProfileModal from './components/EditProfileModal';

import {
  initialStudent,
  initialSubjects,
  initialTimetable,
  initialOffDays,
  initialAttendanceRecords
} from './data/initialData';

import {
  calculatePercentage,
  getClassesNeededFor75,
  getSafeBunks
} from './utils/attendanceCalculations';

import { 
  RotateCcw, 
  Palmtree, 
  Calculator, 
  Calendar, 
  Download 
} from 'lucide-react';

export default function App() {
  // LocalStorage state persistence
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('trackmyclass_student');
    return saved ? JSON.parse(saved) : initialStudent;
  });

  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('trackmyclass_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('trackmyclass_timetable');
    return saved ? JSON.parse(saved) : initialTimetable;
  });

  const [offDays, setOffDays] = useState(() => {
    const saved = localStorage.getItem('trackmyclass_offdays');
    return saved ? JSON.parse(saved) : initialOffDays;
  });

  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const saved = localStorage.getItem('trackmyclass_records');
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });

  // Navigation and UI state
  const [currentTab, setCurrentTab] = useState('daily'); // 'daily', 'simulator', 'subjects', 'timetable', 'offdays', 'homework'
  const [selectedDate, setSelectedDate] = useState('2026-11-20');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState(null);
  const [simulatorSubjectId, setSimulatorSubjectId] = useState(null);

  // Modals state
  const [isAddOffDayOpen, setIsAddOffDayOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('trackmyclass_student', JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem('trackmyclass_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('trackmyclass_timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('trackmyclass_offdays', JSON.stringify(offDays));
  }, [offDays]);

  useEffect(() => {
    localStorage.setItem('trackmyclass_records', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  // Overall Attendance and Subject Risk Calculations
  let totalAttended = 0;
  let totalConducted = 0;
  const lowAttendanceSubjects = [];

  subjects.forEach(sub => {
    let subAttended = 0;
    let subTotal = 0;

    Object.entries(attendanceRecords).forEach(([key, rec]) => {
      const [recDate, recPeriodId] = key.split('_');
      const recDateObj = new Date(recDate);
      const recDayOfWeek = recDateObj.getDay();
      const periodsForDay = timetable[recDayOfWeek] || [];
      const periodObj = periodsForDay.find(p => p.id === recPeriodId);

      if (periodObj && periodObj.subjectId === sub.id) {
        if (rec.status === 'present') {
          subAttended++;
          subTotal++;
        } else if (rec.status === 'absent') {
          subTotal++;
        }
      }
    });

    totalAttended += subAttended;
    totalConducted += subTotal;

    const pct = calculatePercentage(subAttended, subTotal);
    const classesNeeded = getClassesNeededFor75(subAttended, subTotal);
    const safeBunks = getSafeBunks(subAttended, subTotal);

    if (pct < 75 && subTotal > 0) {
      lowAttendanceSubjects.push({
        ...sub,
        attended: subAttended,
        total: subTotal,
        percentage: pct,
        classesNeeded
      });
    }
  });

  const overallPercentage = calculatePercentage(totalAttended, totalConducted);
  const overallSafeBunks = getSafeBunks(totalAttended, totalConducted);

  const stats = {
    totalAttended,
    totalConducted,
    overallPercentage,
    lowCount: lowAttendanceSubjects.length,
    safeBunksCount: overallSafeBunks
  };

  // Handlers
  const handleUpdateRecord = (recordKey, newRecord) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [recordKey]: newRecord
    }));
  };

  const handleMarkDayAsOff = (dateKey, info) => {
    setOffDays(prev => {
      const updated = { ...prev };
      if (!info) {
        delete updated[dateKey];
      } else {
        updated[dateKey] = info;
      }
      return updated;
    });
  };

  const handleAddSubject = (newSubject) => {
    setSubjects(prev => [...prev, newSubject]);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all data back to original demo values?")) {
      localStorage.clear();
      setStudent(initialStudent);
      setSubjects(initialSubjects);
      setTimetable(initialTimetable);
      setOffDays(initialOffDays);
      setAttendanceRecords(initialAttendanceRecords);
      setSelectedDate('2026-11-20');
      setCurrentTab('daily');
    }
  };

  const handleOpenSimulator = (subjectId = null) => {
    setSimulatorSubjectId(subjectId);
    setCurrentTab('simulator');
  };

  const handleExportReport = () => {
    const reportData = {
      student,
      generatedAt: new Date().toISOString(),
      overallAttendance: `${overallPercentage}% (${totalAttended}/${totalConducted})`,
      subjects: subjects.map(s => {
        let att = 0;
        let tot = 0;
        Object.entries(attendanceRecords).forEach(([key, rec]) => {
          const [recDate, recPeriodId] = key.split('_');
          const recDay = new Date(recDate).getDay();
          const p = (timetable[recDay] || []).find(x => x.id === recPeriodId);
          if (p && p.subjectId === s.id) {
            if (rec.status === 'present') { att++; tot++; }
            else if (rec.status === 'absent') { tot++; }
          }
        });
        const pct = calculatePercentage(att, tot);
        return {
          code: s.code,
          name: s.name,
          faculty: s.faculty,
          attendance: `${pct}%`,
          attended: att,
          total: tot,
          status: pct >= 75 ? 'Safe' : 'Critical'
        };
      })
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_report_${student.name.replace(/\s+/g, '_')}_Nov2026.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        subjects={subjects}
        lowAttendanceCount={lowAttendanceSubjects.length}
        onOpenAddSubject={() => setIsAddSubjectOpen(true)}
        onResetData={handleResetData}
        selectedSubjectFilter={selectedSubjectFilter}
        setSelectedSubjectFilter={setSelectedSubjectFilter}
      />

      {/* Main Content Pane */}
      <main className="app-main">
        {/* Top Bar Navigation */}
        <TopBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          student={student}
          onEditProfile={() => setIsEditProfileOpen(true)}
          lowAttendanceSubjects={lowAttendanceSubjects}
          onShowAlerts={() => setCurrentTab('subjects')}
        />

        {/* Page Inner Container */}
        <div className="page-content">
          {/* Low Attendance Notification Banner if <75% */}
          <LowAttendanceBanner 
            lowAttendanceSubjects={lowAttendanceSubjects}
            onOpenSimulator={handleOpenSimulator}
          />

          {/* Page Top Header with Title and Primary Actions */}
          <div className="page-header">
            <div className="page-title-wrap">
              <h1>Human Resource & Student Attendance</h1>
              <p>Track subject attendance accurately, manage off-days and test absent safety effortlessly.</p>
            </div>

            <div className="header-action-group">
              <button 
                className="header-btn-secondary"
                onClick={() => setSelectedDate('2026-11-20')}
                title="Jump to today"
              >
                <Calendar size={15} />
                <span>November 2026</span>
              </button>

              <button 
                className="header-btn-simulator"
                onClick={() => handleOpenSimulator()}
              >
                <Calculator size={15} />
                <span>What-If Absent Simulator</span>
              </button>

              <button 
                className="header-btn-primary"
                onClick={() => setIsAddOffDayOpen(true)}
              >
                <Palmtree size={15} />
                <span>+ Add Time Off / Holiday</span>
              </button>
            </div>
          </div>

          {/* Student Profile Card & 2x2 Metric Cards (Matches Reference Screenshot) */}
          <OverviewCards 
            student={student}
            stats={stats}
            onEditStudent={() => setIsEditProfileOpen(true)}
            onExportReport={handleExportReport}
            onOpenSimulator={handleOpenSimulator}
          />

          {/* Horizontal Calendar Month Strip (01 to 30 with green checks and red x) */}
          <MonthStrip 
            currentDate={new Date(2026, 10, 20)}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            offDays={offDays}
            attendanceRecords={attendanceRecords}
            timetable={timetable}
          />

          {/* Dynamic Tab Views */}
          {currentTab === 'daily' && (
            <DailyPeriodLog 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              subjects={subjects}
              timetable={timetable}
              offDays={offDays}
              attendanceRecords={attendanceRecords}
              onUpdateRecord={handleUpdateRecord}
              onMarkDayAsOff={handleMarkDayAsOff}
              onOpenSimulator={handleOpenSimulator}
              onExportReport={handleExportReport}
            />
          )}

          {currentTab === 'simulator' && (
            <AbsentSimulator 
              subjects={subjects}
              timetable={timetable}
              offDays={offDays}
              attendanceRecords={attendanceRecords}
              defaultSubjectId={simulatorSubjectId}
              onApplyAbsence={(dateKey, periodIds) => {
                const updated = { ...attendanceRecords };
                periodIds.forEach(pid => {
                  updated[`${dateKey}_${pid}`] = {
                    ...(updated[`${dateKey}_${pid}`] || {}),
                    status: 'absent'
                  };
                });
                setAttendanceRecords(updated);
                alert("Absence marked in your records!");
                setCurrentTab('daily');
              }}
            />
          )}

          {currentTab === 'subjects' && (
            <SubjectAnalytics 
              subjects={subjects}
              timetable={timetable}
              attendanceRecords={attendanceRecords}
              onOpenSimulator={handleOpenSimulator}
              onOpenAddSubject={() => setIsAddSubjectOpen(true)}
            />
          )}

          {currentTab === 'timetable' && (
            <TimetableManager 
              timetable={timetable}
              setTimetable={setTimetable}
              subjects={subjects}
            />
          )}

          {currentTab === 'offdays' && (
            <OffDaysManager 
              offDays={offDays}
              setOffDays={setOffDays}
              onOpenAddOffDay={() => setIsAddOffDayOpen(true)}
            />
          )}

          {currentTab === 'homework' && (
            <HomeworkTopicsView 
              attendanceRecords={attendanceRecords}
              onUpdateRecord={handleUpdateRecord}
              subjects={subjects}
              timetable={timetable}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <AddOffDayModal 
        isOpen={isAddOffDayOpen}
        onClose={() => setIsAddOffDayOpen(false)}
        onSave={handleMarkDayAsOff}
        defaultDate={selectedDate}
      />

      <AddSubjectModal 
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        onAdd={handleAddSubject}
      />

      <EditProfileModal 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        student={student}
        onSave={setStudent}
      />
    </div>
  );
}
