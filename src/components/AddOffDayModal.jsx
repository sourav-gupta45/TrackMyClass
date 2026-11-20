import React, { useState } from 'react';
import { X, Palmtree, Sparkles, Calendar } from 'lucide-react';

export default function AddOffDayModal({ isOpen, onClose, onSave, defaultDate = '' }) {
  const [date, setDate] = useState(defaultDate || '2026-11-21');
  const [type, setType] = useState('holiday'); // holiday, weekend, college_fest, sick_leave
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) return;
    onSave(date, {
      type,
      reason: reason.trim() || (type === 'holiday' ? 'Official Holiday' : 'Day Off')
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Palmtree size={20} style={{ color: '#2563eb' }} />
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
              Mark Day Off / Holiday
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Days marked as off will be exempt from regular classes and will not negatively impact your attendance percentage.
            </p>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                SELECT DATE
              </label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontFamily: 'inherit',
                  fontSize: '13.5px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                OFF-DAY TYPE
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontFamily: 'inherit',
                  fontSize: '13.5px'
                }}
              >
                <option value="holiday">Official University Holiday</option>
                <option value="college_fest">College Cultural / Tech Fest</option>
                <option value="dayoff">General Day Off / No Classes</option>
                <option value="sick_leave">Sanctioned Medical Leave</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                REASON / OCCASION
              </label>
              <input 
                type="text"
                placeholder="e.g. Annual Sports Meet, Thanksgiving, Teacher Seminar..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontFamily: 'inherit',
                  fontSize: '13.5px'
                }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="header-btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="header-btn-primary"
            >
              Save Off-Day
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
