const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('./auth');

const getAssessments = () => {
  const filePath = path.join(__dirname, '../data/assessments.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Get all assessment questions
router.get('/questions', (req, res) => {
  try {
    const questions = getAssessments();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching assessment questions:', error);
    res.status(500).json({ error: 'Error fetching assessment questions' });
  }
});

// Submit assessment answers and get a rating
router.post('/submit', verifyToken, (req, res) => {
  try {
    const { answers } = req.body; // answers should be an array of { questionId: 1, score: 2 }
    const questions = getAssessments();
    let totalScore = 0;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid answers format' });
    }

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        // Ensure the score is valid for the given question
        const option = question.options.find(opt => opt.score === answer.score);
        if (option) {
          totalScore += answer.score;
        }
      }
    });

    let rating = '';
    let advice = '';
    let recommendation = '';

    // Scoring logic based on PHQ-9 (Patient Health Questionnaire) scale
    // 0-4: Minimal, 5-9: Mild, 10-14: Moderate, 15-19: Moderately Severe, 20-27: Severe
    if (totalScore >= 0 && totalScore <= 4) {
      rating = 'Excellent Mental Health';
      advice = 'You are doing great! Keep up your positive habits and continue to monitor your well-being.';
      recommendation = 'You are in a great state to attend classes and engage fully in your academic activities.';
    } else if (totalScore >= 5 && totalScore <= 9) {
      rating = 'Good Mental Health';
      advice = 'You have good mental health. Consider practicing mindfulness or engaging in stress-reducing activities regularly.';
      recommendation = 'You can attend classes normally. Consider exploring resources to maintain your well-being.';
    } else if (totalScore >= 10 && totalScore <= 14) {
      rating = 'Moderate Mental Health Concerns';
      advice = 'You might be experiencing some mental health concerns. It could be beneficial to explore resources or talk to a counselor.';
      recommendation = 'You may want to consider attending classes but also schedule a counseling session to discuss your concerns.';
    } else if (totalScore >= 15 && totalScore <= 19) {
      rating = 'Moderately Severe Mental Health Concerns';
      advice = 'You are experiencing significant mental health challenges. We strongly recommend scheduling a session with a professional.';
      recommendation = 'Consider taking a break from classes and prioritizing your mental health. Schedule a counseling session immediately.';
    } else {
      rating = 'Severe Mental Health Concerns';
      advice = 'You are experiencing severe mental health challenges. Please seek professional help immediately.';
      recommendation = 'We strongly recommend taking time off from classes and seeking immediate professional support. Your mental health is the priority.';
    }

    res.json({ 
      totalScore, 
      rating, 
      advice,
      recommendation,
      maxScore: questions.length * 3 // Maximum possible score
    });

  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ error: 'Error processing assessment' });
  }
});

module.exports = router;

