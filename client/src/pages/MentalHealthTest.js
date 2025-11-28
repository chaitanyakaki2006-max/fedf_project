import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './MentalHealthTest.css';

const MentalHealthTest = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: score }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { totalScore, rating, advice, recommendation }
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/assessments/questions');
      setQuestions(response.data);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (questionId, score) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: score
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Object.keys(answers).length !== questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = Object.keys(answers).map(qId => ({
        questionId: parseInt(qId),
        score: answers[qId]
      }));

      const response = await axios.post('/api/assessments/submit', { answers: formattedAnswers });
      setResult(response.data);
      setAnswers({}); // Clear answers after submission
      setCurrentQuestion(0);
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError(err.response?.data?.error || 'Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
    setCurrentQuestion(0);
    setError('');
  };

  if (loading) {
    return (
      <div className="mental-health-test">
        <div className="loading-container">
          <div className="loading">Loading assessment...</div>
        </div>
      </div>
    );
  }

  if (result) {
    const getScoreColor = () => {
      if (result.totalScore <= 4) return 'excellent';
      if (result.totalScore <= 9) return 'good';
      if (result.totalScore <= 14) return 'moderate';
      if (result.totalScore <= 19) return 'moderately-severe';
      return 'severe';
    };

    return (
      <div className="mental-health-test">
        <div className="test-card result-card">
          <h1>Your Mental Health Assessment Results</h1>
          
          <div className={`result-badge ${getScoreColor()}`}>
            <div className="result-score">
              <span className="score-number">{result.totalScore}</span>
              <span className="score-max">/{result.maxScore}</span>
            </div>
            <h2 className="result-rating">{result.rating}</h2>
          </div>

          <div className="result-content">
            <div className="result-section">
              <h3>📊 Assessment Summary</h3>
              <p className="result-advice">{result.advice}</p>
            </div>

            <div className="result-section recommendation-section">
              <h3>🎓 Academic Recommendation</h3>
              <p className="result-recommendation">{result.recommendation}</p>
            </div>

            <div className="result-actions">
              <button onClick={handleRetake} className="btn-retake">
                Take Test Again
              </button>
              <Link to="/dashboard" className="btn-dashboard">
                Back to Dashboard
              </Link>
              {(result.totalScore >= 10) && (
                <Link to="/sessions" className="btn-schedule">
                  Schedule a Session
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mental-health-test">
      <div className="test-card">
        <div className="test-header">
          <h1>Mental Health Assessment</h1>
          <p className="test-subtitle">
            Answer the questions below to get an insight into your current mental well-being.
            This will help you make informed decisions about your academic activities.
          </p>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          Question {currentQuestion + 1} of {questions.length} • {answeredCount} answered
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="test-form">
          {question && (
            <div className="question-group">
              <h3 className="question-text">{question.question}</h3>
              <div className="options-container">
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className={`option-label ${answers[question.id] === option.score ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.score}
                      checked={answers[question.id] === option.score}
                      onChange={() => handleOptionChange(question.id, option.score)}
                      required={currentQuestion === questions.length - 1}
                    />
                    <span className="option-text">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="navigation-buttons">
            {currentQuestion > 0 && (
              <button type="button" onClick={handlePrevious} className="btn-nav btn-previous">
                ← Previous
              </button>
            )}
            <div className="nav-spacer"></div>
            {currentQuestion < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-nav btn-next"
                disabled={!answers[question?.id] && answers[question?.id] !== 0}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className="btn-submit"
                disabled={submitting || !answers[question?.id] && answers[question?.id] !== 0}
              >
                {submitting ? 'Submitting...' : 'Get My Rating'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentalHealthTest;

