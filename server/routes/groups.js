const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('./auth');

const getGroups = () => {
  const filePath = path.join(__dirname, '../data/groups.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const saveGroups = (groups) => {
  const filePath = path.join(__dirname, '../data/groups.json');
  fs.writeFileSync(filePath, JSON.stringify(groups, null, 2));
};

// Get all groups
router.get('/', (req, res) => {
  try {
    const groups = getGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching groups' });
  }
});

// Get group by ID
router.get('/:id', (req, res) => {
  try {
    const groups = getGroups();
    const group = groups.find(g => g.id === parseInt(req.params.id));
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching group' });
  }
});

// Join group (Student)
router.post('/:id/join', verifyToken, (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Students only' });
    }

    const groups = getGroups();
    const group = groups.find(g => g.id === parseInt(req.params.id));

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    group.members.push(req.user.id);
    saveGroups(groups);

    res.json({ message: 'Joined group successfully', group });
  } catch (error) {
    res.status(500).json({ error: 'Error joining group' });
  }
});

// Leave group (Student)
router.post('/:id/leave', verifyToken, (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Students only' });
    }

    const groups = getGroups();
    const group = groups.find(g => g.id === parseInt(req.params.id));

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    group.members = group.members.filter(id => id !== req.user.id);
    saveGroups(groups);

    res.json({ message: 'Left group successfully', group });
  } catch (error) {
    res.status(500).json({ error: 'Error leaving group' });
  }
});

// Create group (Admin)
router.post('/', verifyToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Please provide name and description' });
    }

    const groups = getGroups();
    const newGroup = {
      id: groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1,
      name,
      description,
      members: [],
      createdAt: new Date().toISOString()
    };

    groups.push(newGroup);
    saveGroups(groups);

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ error: 'Error creating group' });
  }
});

// Delete group (Admin)
router.delete('/:id', verifyToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const groups = getGroups();
    const filteredGroups = groups.filter(g => g.id !== parseInt(req.params.id));

    if (groups.length === filteredGroups.length) {
      return res.status(404).json({ error: 'Group not found' });
    }

    saveGroups(filteredGroups);
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting group' });
  }
});

module.exports = router;


