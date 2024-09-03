import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

const heritageQuestions = [
  {
    question: "On which date is Heritage Day celebrated in South Africa?",
    answer: "24 September",
    difficulty: "easy"
  },
  {
    question: "What was Heritage Day originally known as in KwaZulu-Natal?",
    answer: "Shaka Day",
    difficulty: "medium"
  },
  {
    question: "In what year was Heritage Day first celebrated as a public holiday in South Africa?",
    answer: "1995",
    difficulty: "hard"
  },
  {
    question: "What is the popular nickname for Heritage Day celebrations involving outdoor cooking?",
    answer: "Braai Day",
    difficulty: "easy"
  },
  {
    question: "Name one of the 11 official languages of South Africa.",
    answer: "Answers may include: Afrikaans, English, Ndebele, Northern Sotho, Sotho, Swazi, Tsonga, Tswana, Venda, Xhosa, or Zulu",
    difficulty: "medium"
  },
];

const GameBoard = () => {
  const [teamScores, setTeamScores] = useState([0, 0, 0, 0]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer(timer - 1), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const startTurn = () => {
    if (isTimerRunning) return;
    const newQuestion = getRandomQuestion();
    console.log("New question set:", newQuestion); // Debug log
    setTimer(30);
    setIsTimerRunning(true);
    setShowAnswer(false);
    setCurrentQuestion(newQuestion);
  };

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * heritageQuestions.length);
    return heritageQuestions[randomIndex];
  };

  const handleAnswer = (correct) => {
    setIsTimerRunning(false);
    if (correct) {
      setTeamScores(prevScores => {
        const newScores = [...prevScores];
        newScores[currentTeam] += 1;
        return newScores;
      });
    }
    nextTeam();
  };

  const nextTeam = () => {
    setCurrentTeam((currentTeam + 1) % teamScores.length);
    setShowAnswer(false);
    setCurrentQuestion(null);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  console.log("Current question state:", currentQuestion); // Debug log

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">South African Heritage Day Quiz</h1>
      
      <div className="flex justify-between mb-4">
        {teamScores.map((score, index) => (
          <div key={index} className="text-xl font-bold">
            Team {index + 1}: {score}
          </div>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-4 min-h-[200px]">
        {currentQuestion ? (
          <>
            <h2 className="text-xl font-semibold mb-2">Question:</h2>
            <p className="text-lg mb-4">{currentQuestion.question}</p>
            {showAnswer && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Answer:</h3>
                <p className="text-md">{currentQuestion.answer}</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-lg">Click "Start Turn" to begin!</p>
        )}
      </div>

      <div className="flex justify-center items-center space-x-4 mb-4">
        <button
          onClick={startTurn}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isTimerRunning}
        >
          Start Turn (Team {currentTeam + 1})
        </button>
        <div className="flex items-center">
          <Clock size={24} className="mr-2" />
          <span className="text-xl font-bold">{timer}s</span>
        </div>
      </div>

      {currentQuestion && (
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={toggleAnswer}
            className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center"
          >
            {showAnswer ? <EyeOff size={24} className="mr-2" /> : <Eye size={24} className="mr-2" />}
            {showAnswer ? "Hide Answer" : "Check Answer"}
          </button>
        </div>
      )}

      {currentQuestion && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleAnswer(true)}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
          >
            <CheckCircle size={24} className="mr-2" /> Correct
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
          >
            <XCircle size={24} className="mr-2" /> Incorrect
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;