import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <div className="hero">
        <h1>Mental Health Support Platform</h1>
        <p className="hero-subtitle">
          Your safe space for mental wellness, counseling, and peer support
        </p>
        
        {!isAuthenticated ? (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        ) : (
          <div className="hero-actions">
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Mental Health Resources</h3>
          <p>Access a library of articles, guides, and self-help materials to support your mental wellness journey.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💬</div>
          <h3>Virtual Therapy Sessions</h3>
          <p>Schedule one-on-one counseling sessions with professional therapists to get personalized support.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Support Groups</h3>
          <p>Join peer support groups to connect with others, share experiences, and find community.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;


