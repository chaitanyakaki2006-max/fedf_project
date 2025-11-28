import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    resources: 0,
    sessions: 0,
    groups: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [resourcesRes, sessionsRes, groupsRes] = await Promise.all([
        axios.get('/api/resources'),
        axios.get('/api/sessions'),
        axios.get('/api/groups')
      ]);

      setStats({
        resources: resourcesRes.data.length,
        sessions: sessionsRes.data.length,
        groups: groupsRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's an overview of your mental health support platform</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{stats.resources}</h3>
            <p>Resources Available</p>
          </div>
          <Link to="/resources" className="stat-link">View All →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <h3>{stats.sessions}</h3>
            <p>Your Sessions</p>
          </div>
          <Link to="/sessions" className="stat-link">Manage →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.groups}</h3>
            <p>Support Groups</p>
          </div>
          <Link to="/groups" className="stat-link">Explore →</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/resources" className="action-card">
            <span className="action-icon">📖</span>
            <h3>Browse Resources</h3>
            <p>Access mental health articles and guides</p>
          </Link>

          <Link to="/sessions" className="action-card">
            <span className="action-icon">📅</span>
            <h3>Schedule Session</h3>
            <p>Book a therapy or counseling session</p>
          </Link>

          <Link to="/groups" className="action-card">
            <span className="action-icon">💚</span>
            <h3>Join Support Group</h3>
            <p>Connect with peers in support groups</p>
          </Link>

          <Link to="/mental-health-test" className="action-card">
            <span className="action-icon">🧠</span>
            <h3>Test Your Mental Health</h3>
            <p>Take an assessment to understand your mental well-being</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

