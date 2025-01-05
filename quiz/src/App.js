
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/card/card.js';
import { Button } from '../src/components/button/button';
import { ChevronLeft, ChevronRight, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

import axios from 'axios';

const QuizApp = () => {
  const [currentTest, setCurrentTest] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableTests, setAvailableTests] = useState([]);

  useEffect(() => {
    fetchAvailableTests();
  }, []);

  useEffect(() => {
    if (currentTest) {
      fetchQuestions(currentTest);
    }
  }, [currentTest]);

  const fetchAvailableTests = async () => {
    try {
      const response = await axios.get('https://quiz-quj4.onrender.com/api/tests');
      setAvailableTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const fetchQuestions = async (testId) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://quiz-quj4.onrender.com/api/tests/${testId}`);
      setQuestions(response.data);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  
  };

  const handleExplaination=()=>{
    setShowExplanation(true);
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else if (currentTest < Math.max(...availableTests)) {
      setCurrentTest(currentTest + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else if (currentTest > 1) {
      setCurrentTest(currentTest - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQuestionData?.correctAnswer;

  return (
    <div className="min-h-screen bg-blue-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 bg-white ">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-red-600">
              {/* Test {currentTest} - Question {currentQuestionData?.questionId} */}
              Quiz
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
          <CardTitle className="text-center text-2xl text-blue-600 mb-6">
              Test {currentTest} - Question {currentQuestionData?.questionId}
            </CardTitle>
          
        <div className="flex space-x-6">
  <div className="space-y-6 w-3/4">
    <div className="flex justify-between items-center">
      <div className="text-lg font-medium">Question {currentQuestion + 1}/5</div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentTest(prev => Math.max(1, prev - 1))}>
          Previous Test
        </Button>
        <Button variant="outline" onClick={() => setCurrentTest(prev => Math.min(20, prev + 1))}>
          Next Test
        </Button>
      </div>
    </div>

    <div className="rounded-lg mt-8 p-4 bg-blue-50 border border-blue-100">
      <p className="text-lg">{currentQuestionData?.question}</p>
    </div>

    <div className="space-y-3">
      {currentQuestionData?.options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleAnswerSelect(option)}
          disabled={showExplanation}
          className={`w-full p-4 rounded-lg text-left relative transition-all duration-200
            ${showExplanation
              ? option === currentQuestionData.correctAnswer
                ? 'bg-green-100 border-green-500'
                : option === selectedAnswer
                ? 'bg-red-100 border-red-500'
                : 'bg-white border-gray-200'
              : selectedAnswer === option
              ? 'bg-blue-100 border-blue-500'
              : 'bg-white border-gray-200 hover:bg-blue-50'
            } border-2`}
        >
          <div className="flex justify-between items-center">
            <span>{option}</span>
            {option === currentQuestionData.correctAnswer && (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            )}
            { option === selectedAnswer && option !== currentQuestionData.correctAnswer && (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
          </div>
        </button>
      ))}
    </div>
    <div className=''>
    <h3  onClick={() => handleExplaination()} className="font-semibold mb-2">Explanation</h3>

{showExplanation && (
  <div className={`rounded-lg p-4 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
 
    <p>{currentQuestionData?.explanation}</p>
  </div>
)}

    </div>
   
    <div className="flex justify-between items-center pt-4">
      <Button
        onClick={handlePrevQuestion}
        disabled={currentQuestion === 0 && currentTest === 1}
        variant="outline"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <Button
        onClick={handleNextQuestion}
        disabled={currentQuestion === questions.length - 1 && currentTest === 20}
        variant="outline"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  </div>

  <div className="text-center mt-6">
  <h3 className="text-xl font-semibold flex items-center justify-between">
  <div className="text-xs">Question {currentQuestion + 1}/5</div>
  <Button variant="ghost" className="flex items-center gap-2">
    <HelpCircle className="h-5 w-5 text-xs" />
    Need Help?
  </Button>
</h3>


  <div className="grid grid-cols-4 gap-1 justify-center mt-4 max-w-xs mx-auto auto-rows-min">
    {Array.from({ length: 20 }, (_, i) => (
      <button
        key={i}
        onClick={() => setCurrentTest(i + 1)}
        className={`w-10 h-10 rounded-full flex items-center justify-center
          ${currentTest === i + 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-100'}
          border border-blue-200 transition-colors duration-200`}
      >
        {i + 1}
      </button>
    ))}
  </div>
</div>


</div>

          </CardContent>
        </Card>

     
      </div>
    </div>
  );
};

export default QuizApp;