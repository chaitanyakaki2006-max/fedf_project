const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const resourcesRoutes = require('./routes/resources');
const sessionsRoutes = require('./routes/sessions');
const groupsRoutes = require('./routes/groups');
const assessmentsRoutes = require('./routes/assessments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize data directory
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize JSON files if they don't exist
const initializeDataFile = (filename, defaultData) => {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

initializeDataFile('users.json', []);
initializeDataFile('resources.json', [
  {
    id: 1,
    title: "Understanding Stress and Anxiety",
    description: "Learn about common stress triggers and effective coping strategies.",
    category: "Self-Help",
    content: "Stress is a natural response to challenges. Understanding your triggers and developing healthy coping mechanisms is key to managing anxiety.",
    type: "Article",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Mindfulness Meditation Guide",
    description: "A beginner's guide to mindfulness and meditation practices.",
    category: "Wellness",
    content: "Mindfulness meditation can help reduce stress and improve mental clarity. Start with just 5 minutes a day.",
    type: "Guide",
    createdAt: new Date().toISOString()
  }
]);
initializeDataFile('sessions.json', []);
initializeDataFile('groups.json', [
  {
    id: 1,
    name: "Anxiety Support Group",
    description: "A safe space for students dealing with anxiety to share experiences and support each other.",
    members: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Stress Management Circle",
    description: "Learn and share stress management techniques with peers.",
    members: [],
    createdAt: new Date().toISOString()
  }
]);
initializeDataFile('assessments.json', [
  {
    id: 1,
    question: "How often have you felt down, depressed, or hopeless over the last two weeks?",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 2,
    question: "How often have you had little interest or pleasure in doing things over the last two weeks?",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 3,
    question: "How often have you felt tired or had little energy over the last two weeks?",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 4,
    question: "How often have you had trouble falling or staying asleep, or sleeping too much over the last two weeks?",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 5,
    question: "How often have you felt bad about yourself - or that you are a failure or have let yourself or your family down over the last two weeks?",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 6,
    question: "How often have you had trouble concentrating on things, such as reading the newspaper or watching television, over the last two weeks?",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 7,
    question: "How often have you been moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 8,
    question: "How often have you had thoughts that you would be better off dead, or of hurting yourself, over the last two weeks?",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 9,
    question: "How often have you felt anxious, nervous, or worried over the last two weeks?",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  }
]);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/assessments', assessmentsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

