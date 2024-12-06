import React, { useState, useEffect } from 'react';
import { Timer, Award, RotateCcw, ChevronRight, User, Mail, Lock, Trophy, Heart, Star, Music2, Volume2, VolumeX } from 'lucide-react';

const QuizApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Sound effects
  const playSound = (type) => {
    if (!soundEnabled) return;
    const sounds = {
      wrong: new Audio('https://assets.mixkit.co/active_storage/sfx/2185/2185-preview.mp3'),
      complete: new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3')
    };
    sounds[type]?.play().catch(() => {});
  };

  if (!isLoggedIn) {
    return <AuthScreen 
      setIsLoggedIn={setIsLoggedIn} 
      setUserData={setUserData}
      showRegister={showRegister}
      setShowRegister={setShowRegister}
    />;
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed top-4 right-4 p-2 bg-white rounded-full shadow-lg"
      >
        {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      </button>
      <EnhancedQuiz userData={userData} playSound={playSound} />
    </div>
  );
};

const AuthScreen = ({ setIsLoggedIn, setUserData, showRegister, setShowRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hobi: '',
    avatar: ''
  });

  const avatars = [
    '👨‍💻', '👩‍💻', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🦊', '🐯'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData(formData);
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {showRegister ? 'Join The Quiz Adventure!' : 'Quiz Game'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {showRegister && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Choose Your Avatar</label>
                <div className="grid grid-cols-4 gap-2">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setFormData({...formData, avatar})}
                      className={`text-2xl p-2 rounded-lg ${
                        formData.avatar === avatar 
                          ? 'bg-indigo-100 border-2 border-indigo-500' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Masukkan nama Kamu"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>
          
          
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Hobi</label>
            <div className="relative">
              <Heart className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Apa hobimu?"
                value={formData.hobi}
                onChange={(e) => setFormData({...formData, hobi: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 duration-200 font-medium"
          >
            {showRegister ? 'Mulai Petualangan!' : 'Mulai Kuis'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          {showRegister ? 'Sudah punya akun?' : 'anda akan mengerjakan kuis random'}{' '}
        </p>
      </div>
    </div>
  );
};

const EnhancedQuiz = ({ userData, playSound }) => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [lifelines, setLifelines] = useState(2);
  
  const quizData = [
    {
      question: "Apa Tujuan Kamu hidup di dunia?",
      a: "Makan Seblak",
      b: "Push Rank",
      c: "Beribadah",
      d: "Tidur",
      correct: "c",
      hint: "awas diabetes",
      difficulty: "easy"
    },
    {
      question: "Kenapa burung hantu nggak punya pacar?",
      a: "Karena dia Burik",
      b: "Karena dia Gay",
      c: "karena dia wibu",
      d: "Al isra ayat 32",
      correct: "d",
      hint: "Taulah ya...",
      difficulty: "medium"
    },
    {
      question: "Kalau ikan bisa jadi konten kreator, kontennya apa?",
      a: "Mukbang pelet",
      b: "Prank Pura-pura Mati di Aquarium",
      c: "Tutorial Berenang buat Pemula",
      d: "Prank buang sampah ke laut",
      correct: "b",
      hint: "Apacoba?",
      difficulty: "medium"
    },
    {
      question: "Kalau monyet pegang HP, kira-kira dia buka apa?",
      a: "Intagram",
      b: "Tiktok",
      c: "Facebook",
      d: "Situs Slot/Judi Online",
      correct: "d",
      hint: "akwoako",
      difficulty: "hard"
    },

    {
      question: "Siapakah Guru Informatika di MAN 2?",
      a: "Pak Suja",
      b: "Bu baeti",
      c: "Pak Eman",
      d: "Pak Arip",
      correct: "d",
      hint: "akwoako",
      difficulty: "hard"
    },

    {
      question: "Siapakah Orang paling hytam di MAN 2",
      a: "Azhar",
      b: "Stop Rasis",
      c: "Azzam",
      d: "Rojik",
      correct: "b",
      hint: "akwoako",
      difficulty: "hard"
    },

    {
      question: "Apa yang Membedakan Manusia dan Hewan?",
      a: "Akal dan Pikiran",
      b: "Bentuk/Rupa",
      c: "kelakuan",
      d: "gaada bedanya",
      correct: "a",
      hint: "akwoako",
      difficulty: "hard"
    },

    {
      question: "Tahun Berapakah Uni-soviet Runtuh?",
      a: "1998",
      b: "1973",
      c: "1991",
      d: "1945",
      correct: "c",
      hint: "akwoako",
      difficulty: "hard"
    },

    {
      question: "Siapakah Penemu Lampu?",
      a: "Tomas Alpa Edison",
      b: "Nikola Tesla",
      c: "D.N Aidit",
      d: "Hitler",
      correct: "b",
      hint: "akwoako",
      difficulty: "hard"
    },

    {
      question: "Apa yang ada di Ujung Pulau Jawa?",
      a: "Madura",
      b: "NTT",
      c: "Huruf 'a'",
      d: "Bali",
      correct: "c",
      hint: "akwoako",
      difficulty: "hard"
    }

  ];

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && !showScore) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleSubmit();
    }
  }, [timeLeft, isAnswered]);

  const calculatePoints = (timeLeft, difficulty) => {
    const basePoints = {
      easy: 100,
      medium: 200,
      hard: 300
    };
    const timeBonus = Math.floor(timeLeft * 3.33); // Max 100 points bonus for quick answers
    return basePoints[difficulty] + timeBonus;
  };

  const handleAnswerSelect = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!isAnswered && selectedAnswer) {
      setIsAnswered(true);
      if (selectedAnswer === quizData[currentQuiz].correct) {
        const points = calculatePoints(timeLeft, quizData[currentQuiz].difficulty);
        setTotalPoints(prev => prev + points);
        setScore(score + 1);
        setStreak(streak + 1);
        playSound('correct');
      } else {
        setStreak(0);
        playSound('wrong');
      }
    }
  };

  const handleNext = () => {
    if (currentQuiz < quizData.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
      setSelectedAnswer('');
      setIsAnswered(false);
      setTimeLeft(30);
      setShowHint(false);
    } else {
      setShowScore(true);
      playSound('complete');
      if (score > highScore) {
        setHighScore(score);
      }
    }
  };

  const useLifeline = () => {
    if (lifelines > 0 && !showHint) {
      setLifelines(prev => prev - 1);
      setShowHint(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer('');
    setIsAnswered(false);
    setTimeLeft(30);
    setStreak(0);
    setTotalPoints(0);
    setShowHint(false);
    setLifelines(2);
  };

  if (showScore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="relative">
              <Award className="w-24 h-24 mx-auto mb-4 text-yellow-500" />
              {score === quizData.length && (
                <div className="absolute top-0 left-0 w-full h-full animate-ping">
                  <Star className="w-24 h-24 mx-auto text-yellow-500 opacity-75" />
                </div>
              )}
            </div>
            
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {score === quizData.length ? '🎉 SEMPURNA (≧▽≦)🎉' : 'Quiz Terselesaikan!'}
            </h2>
            <p className="text-gray-600 mb-4">
              Hebat Banget {userData.avatar} {userData.name}!
            </p>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {score}/{quizData.length}
              </div>
              <p className="text-indigo-800 text-lg mb-2">
                Tingkat Keberhasilan: {((score / quizData.length) * 100).toFixed(1)}%
              </p>
              <p className="text-purple-600 font-medium">
                Total Points: {totalPoints}
              </p>
              {score > highScore && (
                <div className="mt-2 text-green-600 font-medium animate-bounce">
                  🎯 New High Score! 🎯
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <button
                onClick={resetQuiz}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Coba Lagi
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-all transform hover:scale-105 duration-200 flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        <div className="absolute top-4 right-4 text-gray-600">
          Soal {currentQuiz + 1}/{quizData.length}
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {quizData[currentQuiz].question}
          </h2>
        </div>

        <div className="space-y-4 mb-6">
          {Object.keys(quizData[currentQuiz])
            .filter(key => ['a', 'b', 'c', 'd'].includes(key))
            .map(key => (
              <button
                key={key}
                onClick={() => handleAnswerSelect(key)}
                className={`w-full py-3 rounded-lg text-left px-4 ${
                  isAnswered
                    ? key === quizData[currentQuiz].correct
                      ? 'bg-green-500 text-white'
                      : key === selectedAnswer
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                    : selectedAnswer === key
                    ? 'bg-indigo-100 border-2 border-indigo-500'
                    : 'bg-gray-100 hover:bg-indigo-50'
                }`}
                disabled={isAnswered}
              >
                {quizData[currentQuiz][key]}
              </button>
            ))
          }
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-gray-600" />
            <span>{timeLeft}s</span>
          </div>

          {!isAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`px-6 py-2 rounded-lg ${
                selectedAnswer
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Jawab
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
            >
              soal Selanjutnya
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizApp;