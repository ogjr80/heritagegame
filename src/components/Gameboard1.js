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
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardRotation, setCardRotation] = useState(0);

  const teamColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

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
    setTimer(30);
    setIsTimerRunning(true);
    setShowAnswer(false);
    setIsFlipped(false);
    setCurrentQuestion(getRandomQuestion());
    setCardRotation(cardRotation + 360);
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
    setIsFlipped(false);
    setCurrentQuestion(null);
  };

  const toggleAnswer = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gradient-to-r from-yellow-100 to-red-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-800 shadow-text">South African Heritage Day Quiz</h1>
      
      <div className="flex justify-between items-center mb-6">
        {teamScores.map((score, index) => (
          <div key={index} className={`${teamColors[index]} text-white text-xl font-bold p-3 rounded-lg shadow-md`}>
            Team {index + 1}: {score}
          </div>
        ))}
      </div>

      <div className="relative perspective-1000 mb-6">
        <div 
          className={`card-container w-full h-80 transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transform: `rotateY(${isFlipped ? 180 : 0}deg) rotateZ(${cardRotation}deg)` }}
        >
          <div className="absolute w-full h-full backface-hidden bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between">
            <div className="text-2xl font-semibold text-center mb-4">
              {currentQuestion ? "Question:" : "Heritage Day Quiz"}
            </div>
            <div className="text-xl text-center flex-grow flex items-center justify-center">
              {currentQuestion ? currentQuestion.question : "Click 'Start Turn' to begin!"}
            </div>
            <div className={`text-sm text-center ${currentQuestion ? 'visible' : 'invisible'}`}>
              Difficulty: {currentQuestion?.difficulty}
            </div>
          </div>
          <div className="absolute w-full h-full backface-hidden bg-green-100 shadow-lg rounded-xl p-6 flex flex-col justify-center items-center rotate-y-180">
            <div className="text-2xl font-semibold mb-4">Answer:</div>
            <div className="text-xl text-center">{currentQuestion?.answer}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-4 mb-6">
        <button
          onClick={startTurn}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          disabled={isTimerRunning}
        >
          Start Turn (Team {currentTeam + 1})
        </button>
        <div className="flex items-center bg-white p-3 rounded-full shadow-md">
          <Clock size={24} className="mr-2 text-blue-500" />
          <span className="text-2xl font-bold text-blue-500">{timer}s</span>
        </div>
      </div>

      {currentQuestion && (
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={toggleAnswer}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-bold shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
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
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <CheckCircle size={24} className="mr-2" /> Correct
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <XCircle size={24} className="mr-2" /> Incorrect
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;