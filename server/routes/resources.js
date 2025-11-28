const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('./auth');

const getResources = () => {
  const filePath = path.join(__dirname, '../data/resources.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const saveResources = (resources) => {
  const filePath = path.join(__dirname, '../data/resources.json');
  fs.writeFileSync(filePath, JSON.stringify(resources, null, 2));
};

// Get all resources
router.get('/', (req, res) => {
  try {
    const resources = getResources();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching resources' });
  }
});

// Get resource by ID
router.get('/:id', (req, res) => {
  try {
    const resources = getResources();
    const resource = resources.find(r => r.id === parseInt(req.params.id));
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching resource' });
  }
});

// Create resource (Admin only)
router.post('/', verifyToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { title, description, category, content, type } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Please provide title, description, and category' });
    }

    const resources = getResources();
    const newResource = {
      id: resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1,
      title,
      description,
      category,
      content: content || '',
      type: type || 'Article',
      createdAt: new Date().toISOString()
    };

    resources.push(newResource);
    saveResources(resources);

    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ error: 'Error creating resource' });
  }
});

// Update resource (Admin only)
router.put('/:id', verifyToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const resources = getResources();
    const index = resources.findIndex(r => r.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    resources[index] = {
      ...resources[index],
      ...req.body,
      id: resources[index].id,
      createdAt: resources[index].createdAt
    };

    saveResources(resources);
    res.json(resources[index]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating resource' });
  }
});

// Delete resource (Admin only)
router.delete('/:id', verifyToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const resources = getResources();
    const filteredResources = resources.filter(r => r.id !== parseInt(req.params.id));

    if (resources.length === filteredResources.length) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    saveResources(filteredResources);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting resource' });
  }
});

module.exports = router;


