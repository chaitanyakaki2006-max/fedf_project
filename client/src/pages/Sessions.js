import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Sessions.css';

const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'therapy',
    notes: ''
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/api/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/sessions', formData);
      setShowForm(false);
      setFormData({
        date: '',
        time: '',
        type: 'therapy',
        notes: ''
      });
      fetchSessions();
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating session');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/api/sessions/${id}/status`, { status });
      fetchSessions();
    } catch (error) {
      alert(error.response?.data?.error || 'Error updating session');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    
    try {
      await axios.delete(`/api/sessions/${id}`);
      fetchSessions();
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting session');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#4caf50',
      completed: '#2196f3',
      cancelled: '#f44336'
    };
    return colors[status] || '#999';
  };

  if (loading) return <div className="loading">Loading sessions...</div>;

  return (
    <div className="sessions">
      <div className="sessions-header">
        <h1>Counseling Sessions</h1>
        {user?.role === 'student' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Schedule Session'}
          </button>
        )}
      </div>

      {showForm && user?.role === 'student' && (
        <div className="session-form">
          <h2>Schedule New Session</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Session Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="therapy">Therapy</option>
                <option value="counseling">Counseling</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                placeholder="Any specific topics or concerns you'd like to discuss..."
              />
            </div>
            <button type="submit" className="btn-submit">Schedule Session</button>
          </form>
        </div>
      )}

      <div className="sessions-list">
        {sessions.map((session) => (
          <div key={session.id} className="session-card">
            <div className="session-header">
              <div>
                <h3>{session.type.charAt(0).toUpperCase() + session.type.slice(1)} Session</h3>
                <p className="session-user">
                  {user?.role === 'admin' ? session.userName : 'Your Session'}
                </p>
              </div>
              <span
                className="session-status"
                style={{ backgroundColor: getStatusColor(session.status) }}
              >
                {session.status}
              </span>
            </div>
            
            <div className="session-details">
              <div className="detail-item">
                <span className="detail-label">📅 Date:</span>
                <span>{new Date(session.date).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">🕐 Time:</span>
                <span>{session.time}</span>
              </div>
              {session.notes && (
                <div className="session-notes">
                  <strong>Notes:</strong>
                  <p>{session.notes}</p>
                </div>
              )}
            </div>

            <div className="session-actions">
              {user?.role === 'admin' && (
                <div className="status-buttons">
                  <button
                    onClick={() => handleStatusUpdate(session.id, 'confirmed')}
                    className="btn-status"
                    disabled={session.status === 'confirmed'}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(session.id, 'completed')}
                    className="btn-status"
                    disabled={session.status === 'completed'}
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(session.id, 'cancelled')}
                    className="btn-status btn-cancel"
                    disabled={session.status === 'cancelled'}
                  >
                    Cancel
                  </button>
                </div>
              )}
              <button
                onClick={() => handleDelete(session.id)}
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="empty-state">
          <p>No sessions scheduled yet.</p>
          {user?.role === 'student' && (
            <p>Click "Schedule Session" to book your first appointment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Sessions;


