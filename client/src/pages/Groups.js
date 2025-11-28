import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Groups.css';

const Groups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/groups', formData);
      setShowForm(false);
      setFormData({
        name: '',
        description: ''
      });
      fetchGroups();
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating group');
    }
  };

  const handleJoin = async (groupId) => {
    try {
      await axios.post(`/api/groups/${groupId}/join`);
      fetchGroups();
    } catch (error) {
      alert(error.response?.data?.error || 'Error joining group');
    }
  };

  const handleLeave = async (groupId) => {
    try {
      await axios.post(`/api/groups/${groupId}/leave`);
      fetchGroups();
    } catch (error) {
      alert(error.response?.data?.error || 'Error leaving group');
    }
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    
    try {
      await axios.delete(`/api/groups/${groupId}`);
      fetchGroups();
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting group');
    }
  };

  const isMember = (group) => {
    return group.members && group.members.includes(user?.id);
  };

  if (loading) return <div className="loading">Loading support groups...</div>;

  return (
    <div className="groups">
      <div className="groups-header">
        <h1>Support Groups</h1>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Create Group'}
          </button>
        )}
      </div>

      {showForm && user?.role === 'admin' && (
        <div className="group-form">
          <h2>Create New Support Group</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Group Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Anxiety Support Group"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="4"
                placeholder="Describe the purpose and focus of this support group..."
              />
            </div>
            <button type="submit" className="btn-submit">Create Group</button>
          </form>
        </div>
      )}

      <div className="groups-grid">
        {groups.map((group) => (
          <div key={group.id} className="group-card">
            <div className="group-header">
              <h3>{group.name}</h3>
              {user?.role === 'admin' && (
                <button
                  onClick={() => handleDelete(group.id)}
                  className="btn-delete"
                >
                  ✕
                </button>
              )}
            </div>
            
            <p className="group-description">{group.description}</p>
            
            <div className="group-footer">
              <div className="group-stats">
                <span className="member-count">
                  👥 {group.members?.length || 0} members
                </span>
              </div>
              
              {user?.role === 'student' && (
                <div className="group-actions">
                  {isMember(group) ? (
                    <button
                      onClick={() => handleLeave(group.id)}
                      className="btn-leave"
                    >
                      Leave Group
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(group.id)}
                      className="btn-join"
                    >
                      Join Group
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="empty-state">
          <p>No support groups available yet.</p>
          {user?.role === 'admin' && (
            <p>Create your first support group to get started.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Groups;


