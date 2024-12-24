'use client'

import React, { useState, useEffect } from 'react';
import { questions } from './questions';
import styles from './styles.module.css';
import { Pause, Play } from 'lucide-react';

const questionsPerGame = 20;


export default function MathRiddler() {
  const [gameState, setGameState] = useState('start')
  const [score, setScore] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);

  const shuffleQuestions = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, questionsPerGame);
  };

  const startGame = () => {
    const shuffledQuestions = shuffleQuestions(questions);
    setRandomizedQuestions(shuffledQuestions);
    setGameState('playing');
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(15);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  useEffect(() => {
    let timer
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0) {
      handleTimerEnd()
    }
    return () => clearTimeout(timer)
  }, [gameState, timeLeft])


  const handleAnswer = (option) => {
    setSelectedOption(option)
    setIsAnswerChecked(true)
    const currentQuestion = randomizedQuestions[currentQuestionIndex]
    if (option === currentQuestion.correct) {
      setScore(score + 1)
    }
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questionsPerGame - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setTimeLeft(15)
      setSelectedOption(null)
      setIsAnswerChecked(false)
    } else {
      endGame()
    }
  }

  const handleTimerEnd = () => {
    setIsAnswerChecked(true)
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  const endGame = () => {
    setGameState('end')
  }

  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing')
  }

  const getButtonClass = (option) => {
    if (!isAnswerChecked) return styles.optionBtn
    if (option === randomizedQuestions[currentQuestionIndex].correct) return `${styles.optionBtn} ${styles.correct}`
    if (option === selectedOption) return `${styles.optionBtn} ${styles.incorrect}`
    return styles.optionBtn
  }

  const renderStartScreen = () => (
    <div className={styles.startScreen}>
      <h1 className={styles.mainTitle}>Math Riddler</h1>
      <p className={styles.instructions}>
        Hey there! Are you good at math? Well even if you aren't let's help you get better.
      </p>
      <p className={styles.instructions}>
        Try to get the correct answer to as many math questions as you can.
      </p>
      <p className={styles.instructions}>
        You'll be given some options to choose from so that should make your task easier. But be careful, there's a timer.
      </p>
      <p className={styles.instructions}>Goodluck!</p>
      <button className={styles.btn} onClick={startGame}>Let's do some Math</button>
    </div>
  )

  const renderGameScreen = () => (
    <div className={styles.mainGameContainer}>
      <div className={`${styles.gameContent} ${gameState === 'paused' ? styles.blurred : ''}`}>
        <p className={styles.question}>{randomizedQuestions[currentQuestionIndex].question}</p>
        {randomizedQuestions[currentQuestionIndex].options.map((option, index) => (
          <p key={index} className={styles.option}>
            <button 
              className={getButtonClass(String.fromCharCode(65 + index))}
              onClick={() => handleAnswer(String.fromCharCode(65 + index))}
              disabled={isAnswerChecked || gameState === 'paused'}
            >
              {String.fromCharCode(65 + index)}
            </button>
            <span>{option}</span>
          </p>
        ))}
        <div className={styles.scoreDisplay}>
          <p className={styles.scoreCount}>Score: {score}</p>
        </div>
        <div className={styles.timer}>Time left: {timeLeft}s</div>
      </div>
      <button className={`${styles.btn} ${styles.pauseBtn}`} onClick={togglePause}>
        {gameState === 'playing' ? (
          <>
            <Pause className={styles.btnIcon} /> Pause
          </>
        ) : (
          <>
            <Play className={styles.btnIcon} /> Resume
          </>
        )}
      </button>
    </div>
  )

  const renderEndScreen = () => (
    <div className={styles.gameOverScreen}>
      <h2 className={styles.gameOverMessage}>Wow! That was intense. Congratulations on reaching the end</h2>
      <h3 className={styles.finalScore}>Your final score is: {score}</h3>
      <button className={styles.btn} onClick={startGame}>Another round?</button>
    </div>
  )

  return (
    <div className={styles.mathRiddler}>
      {gameState === 'start' && renderStartScreen()}
      {(gameState === 'playing' || gameState === 'paused') && renderGameScreen()}
      {gameState === 'end' && renderEndScreen()}
    </div>
  )
}

