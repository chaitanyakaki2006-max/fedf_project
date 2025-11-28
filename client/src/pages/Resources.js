import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Resources.css';

const Resources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    type: 'Article'
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get('/api/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/resources', formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        content: '',
        type: 'Article'
      });
      fetchResources();
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating resource');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await axios.delete(`/api/resources/${id}`);
      fetchResources();
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting resource');
    }
  };

  if (loading) return <div className="loading">Loading resources...</div>;

  return (
    <div className="resources">
      <div className="resources-header">
        <h1>Mental Health Resources</h1>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Add Resource'}
          </button>
        )}
      </div>

      {showForm && user?.role === 'admin' && (
        <div className="resource-form">
          <h2>Create New Resource</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="4"
              />
            </div>
            <button type="submit" className="btn-submit">Create Resource</button>
          </form>
        </div>
      )}

      <div className="resources-grid">
        {resources.map((resource) => (
          <div key={resource.id} className="resource-card">
            <div className="resource-header">
              <span className="resource-category">{resource.category}</span>
              {user?.role === 'admin' && (
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="btn-delete"
                >
                  ✕
                </button>
              )}
            </div>
            <h3>{resource.title}</h3>
            <p className="resource-description">{resource.description}</p>
            {resource.content && (
              <p className="resource-content">{resource.content}</p>
            )}
            <div className="resource-footer">
              <span className="resource-type">{resource.type}</span>
            </div>
          </div>
        ))}
      </div>

      {resources.length === 0 && (
        <div className="empty-state">
          <p>No resources available yet.</p>
        </div>
      )}
    </div>
  );
};

export default Resources;


