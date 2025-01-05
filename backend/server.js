
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://quiz-quj4.onrender.com',
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
    {
      testId,
      questionId: 3,
      question: `History Question ${testId}.3: In which year did event ${1900 + testId} occur?`,
      options: [`${1900 + testId}`, `${1901 + testId}`, `${1899 + testId}`, `${1902 + testId}`],
      correctAnswer: `${1900 + testId}`,
      explanation: `The event ${1900 + testId} is recorded in history books as occurring in the year ${1900 + testId}.`
    },
    {
      testId,
      questionId: 4,
      question: `Geography Question ${testId}.4: What is the approximate latitude of city ${testId * 10}°N?`,
      options: [`${testId * 10}°N`, `${testId * 10 + 5}°N`, `${testId * 10 - 5}°N`, `${testId * 10 + 10}°N`],
      correctAnswer: `${testId * 10}°N`,
      explanation: `Latitude is expressed in degrees north or south. The city lies approximately at ${testId * 10}°N.`
    },
    {
      testId,
      questionId: 5,
      question: `English Question ${testId}.5: Which word best completes the sentence: "The quick brown fox jumps over the ______ dog"?`,
      options: ["lazy", "active", "sleepy", "energetic"],
      correctAnswer: "lazy",
      explanation: `The correct phrase is "The quick brown fox jumps over the lazy dog," which is a pangram.`
    },
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

