const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('./auth');

const getSessions = () => {
  const filePath = path.join(__dirname, '../data/sessions.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const saveSessions = (sessions) => {
  const filePath = path.join(__dirname, '../data/sessions.json');
  fs.writeFileSync(filePath, JSON.stringify(sessions, null, 2));
};

// Get all sessions
router.get('/', verifyToken, (req, res) => {
  try {
    const sessions = getSessions();
    
    // Students see only their sessions, admins see all
    if (req.user.role === 'student') {
      const userSessions = sessions.filter(s => s.userId === req.user.id);
      return res.json(userSessions);
    }
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sessions' });
  }
});

// Get session by ID
router.get('/:id', verifyToken, (req, res) => {
  try {
    const sessions = getSessions();
    const session = sessions.find(s => s.id === parseInt(req.params.id));
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Students can only view their own sessions
    if (req.user.role === 'student' && session.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching session' });
  }
});

// Create session (Student)
router.post('/', verifyToken, (req, res) => {
  try {
    const { date, time, type, notes } = req.body;

    if (!date || !time || !type) {
      return res.status(400).json({ error: 'Please provide date, time, and type' });
    }

    const sessions = getSessions();
    const newSession = {
      id: sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1,
      userId: req.user.id,
      userName: req.user.email, // In real app, get from user data
      date,
      time,
      type,
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    sessions.push(newSession);
    saveSessions(sessions);

    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: 'Error creating session' });
  }
});

// Update session status (Admin)
router.put('/:id/status', verifyToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const sessions = getSessions();
    const index = sessions.findIndex(s => s.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Session not found' });
    }

    sessions[index].status = status;
    saveSessions(sessions);

    res.json(sessions[index]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating session' });
  }
});

// Delete session
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const sessions = getSessions();
    const session = sessions.find(s => s.id === parseInt(req.params.id));

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Students can only delete their own sessions
    if (req.user.role === 'student' && session.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const filteredSessions = sessions.filter(s => s.id !== parseInt(req.params.id));
    saveSessions(filteredSessions);

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting session' });
  }
});

module.exports = router;


