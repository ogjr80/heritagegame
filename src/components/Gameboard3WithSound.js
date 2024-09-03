import React, { useState, useEffect, useCallback } from 'react';
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

  // Sound effects
  const startSound = new Audio('/api/placeholder/audio/start.mp3');
  const correctSound = new Audio('/api/placeholder/audio/correct.mp3');
  const incorrectSound = new Audio('/api/placeholder/audio/incorrect.mp3');
  const timerSound = new Audio('/api/placeholder/audio/timer.mp3');
  const gameOverSound = new Audio('/api/placeholder/audio/gameover.mp3');

  const playSound = useCallback((sound) => {
    sound.currentTime = 0;
    sound.play().catch(e => console.error("Error playing sound:", e));
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 5 && prevTimer > 1) {
            playSound(timerSound);
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      playSound(gameOverSound);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, playSound, timerSound, gameOverSound]);

  const startTurn = () => {
    if (isTimerRunning) return;
    const newQuestion = getRandomQuestion();
    setTimer(30);
    setIsTimerRunning(true);
    setShowAnswer(false);
    setCurrentQuestion(newQuestion);
    playSound(startSound);
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
      playSound(correctSound);
    } else {
      playSound(incorrectSound);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-orange-400 to-red-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-5xl font-extrabold text-center mb-8 text-orange-600 tracking-wider">
          South African Heritage Day Quiz
        </h1>
        
        <div className="flex justify-between mb-8">
          {teamScores.map((score, index) => (
            <div key={index} className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 text-white p-4 rounded-xl shadow-md">
              Team {index + 1}: {score}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-8 min-h-[200px] shadow-inner">
          {currentQuestion ? (
            <>
              <h2 className="text-2xl font-bold mb-4 text-orange-600">Question:</h2>
              <p className="text-xl mb-4">{currentQuestion.question}</p>
              {showAnswer && (
                <div className="mt-6 bg-green-100 p-4 rounded-xl">
                  <h3 className="text-xl font-bold text-green-700 mb-2">Answer:</h3>
                  <p className="text-lg text-green-800">{currentQuestion.answer}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-2xl text-center text-orange-500 font-bold">Click "Start Turn" to begin!</p>
          )}
        </div>

        <div className="flex justify-center items-center space-x-6 mb-8">
          <button
            onClick={startTurn}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xl font-bold px-6 py-3 rounded-full shadow-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={isTimerRunning}
          >
            <Clock size={24} className="mr-2" />
            Start Turn (Team {currentTeam + 1})
          </button>
          <div className="bg-blue-500 text-white text-2xl font-bold p-4 rounded-full shadow-lg flex items-center">
            <Clock size={28} className="mr-2" />
            <span>{timer}s</span>
          </div>
        </div>

        {currentQuestion && (
          <div className="flex justify-center space-x-6 mb-8">
            <button
              onClick={toggleAnswer}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xl font-bold px-6 py-3 rounded-full shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 flex items-center"
            >
              {showAnswer ? <EyeOff size={24} className="mr-2" /> : <Eye size={24} className="mr-2" />}
              {showAnswer ? "Hide Answer" : "Check Answer"}
            </button>
          </div>
        )}

        {currentQuestion && (
          <div className="flex justify-center space-x-6">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xl font-bold px-6 py-3 rounded-full shadow-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 flex items-center"
            >
              <CheckCircle size={24} className="mr-2" /> Correct
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="bg-gradient-to-r from-red-400 to-red-600 text-white text-xl font-bold px-6 py-3 rounded-full shadow-lg hover:from-red-500 hover:to-red-700 transition-all duration-300 flex items-center"
            >
              <XCircle size={24} className="mr-2" /> Incorrect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;