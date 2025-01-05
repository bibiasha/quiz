
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());

mongoose.connect('mongodb+srv://asha:asha@cluster0.xhvp1qr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Updated Schema with testId
const questionSchema = new mongoose.Schema({
  testId: Number,
  questionId: Number,
  question: String,
  options: [String],
  correctAnswer: String,
  explanation: String
});

const Question = mongoose.model('Question', questionSchema);

// Route to get questions for a specific test
app.get('/api/tests/:testId', async (req, res) => {
  try {
    const testId = parseInt(req.params.testId);
    const questions = await Question.find({ testId }).sort('questionId');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all tests
app.get('/api/tests', async (req, res) => {
  try {
    const tests = await Question.distinct('testId');
    res.json(tests.sort((a, b) => a - b));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function generateQuestions(testId) {
  return [
    {
      testId,
      questionId: 1,
      question: `Math Question ${testId}.1: If a train travels at ${40 + testId} km/hr, how long will it take to cover ${100 + testId} km?`,
      options: [`${2 + testId} hours`, `${3 + testId} hours`, `${2.5 + testId} hours`, `${1.5 + testId} hours`],
      correctAnswer: `${2.5 + testId} hours`,
      explanation: `Speed = Distance/Time. Time = ${100 + testId}/${40 + testId} = ${2.5 + testId} hours`
    },
    {
      testId,
      questionId: 2,
      question: `Science Question ${testId}.2: What is the atomic number of ${testId}th element in periodic table?`,
      options: [`${testId}`, `${testId + 1}`, `${testId - 1}`, `${testId + 2}`],
      correctAnswer: `${testId}`,
      explanation: `The atomic number of an element is its position in the periodic table.`
    },
    // Add more questions following similar pattern
  ];
}

async function insertTestQuestions() {
  try {
    await Question.deleteMany({});
    
    for (let testId = 1; testId <= 20; testId++) {
      const questions = generateQuestions(testId);
      await Question.insertMany(questions);
    }
    
    console.log('Test questions inserted successfully');
  } catch (error) {
    console.error('Error inserting test questions:', error);
  }
}

insertTestQuestions();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

