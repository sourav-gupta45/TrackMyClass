import React, { useState } from 'react';
import { X, BookOpen, Plus } from 'lucide-react';

export default function AddSubjectModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [faculty, setFaculty] = useState('');
  const [room, setRoom] = useState('');
  const [color, setColor] = useState('#2563EB');

  if (!isOpen) return null;

  const colorOptions = [
    { color: '#2563EB', bg: '#EFF6FF' },
    { color: '#10B981', bg: '#ECFDF5' },
    { color: '#F59E0B', bg: '#FFFBEB' },
    { color: '#8B5CF6', bg: '#F5F3FF' },
    { color: '#EC4899', bg: '#FDF2F8' },
    { color: '#06B6D4', bg: '#ECFEFF' },
    { color: '#EF4444', bg: '#FEF2F2' },
    { color: '#6366F1', bg: '#EEF2FF' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedColorObj = colorOptions.find(c => c.color === color) || colorOptions[0];

    const newSubject = {
      id: code.trim().toUpperCase() || `SUB_${Date.now()}`,
      code: code.trim().toUpperCase() || 'SUB',
      name: name.trim(),
      faculty: faculty.trim() || 'Prof. TBA',
      room: room.trim() || 'Room TBA',
      color: selectedColorObj.color,
      bgLight: selectedColorObj.bg
    };

    onAdd(newSubject);
    setName('');
    setCode('');
    setFaculty('');
    setRoom('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <BookOpen size={20} style={{ color: '#2563eb' }} />
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
              Add Enrolled Subject
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                SUBJECT NAME *
              </label>
              <input 
                type="text"
                placeholder="e.g. Artificial Intelligence, Microprocessors..."
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  COURSE CODE
                </label>
                <input 
                  type="text"
                  placeholder="e.g. CS306"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
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
                  FACULTY / TEACHER
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Dr. Jennifer Davis"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
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

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                CLASSROOM / LAB
              </label>
              <input 
                type="text"
                placeholder="e.g. Hall 401, AI Lab"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
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
                COLOR BADGE
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {colorOptions.map(opt => (
                  <button
                    key={opt.color}
                    type="button"
                    onClick={() => setColor(opt.color)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: opt.color,
                      border: color === opt.color ? '3px solid #0f172a' : '2px solid transparent',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  />
                ))}
              </div>
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
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
