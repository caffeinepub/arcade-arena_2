import { useState, useCallback } from 'react';

type GameStatus = 'idle' | 'playing' | 'ended';
type Feedback = 'too low' | 'too high' | 'correct';

interface GuessEntry {
  guess: number;
  feedback: Feedback;
  attempt: number;
}

interface GameState {
  targetNumber: number;
  guessHistory: GuessEntry[];
  attempts: number;
  status: GameStatus;
  score: number;
}

export function useNumberGuessing() {
  const [gameState, setGameState] = useState<GameState>({
    targetNumber: 0,
    guessHistory: [],
    attempts: 0,
    status: 'idle',
    score: 0,
  });

  const generateRandomNumber = useCallback(() => {
    return Math.floor(Math.random() * 100) + 1;
  }, []);

  const startGame = useCallback(() => {
    setGameState({
      targetNumber: generateRandomNumber(),
      guessHistory: [],
      attempts: 0,
      status: 'playing',
      score: 0,
    });
  }, [generateRandomNumber]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const makeGuess = useCallback((guess: number) => {
    setGameState((prev) => {
      if (prev.status !== 'playing') {
        return prev;
      }

      const newAttempts = prev.attempts + 1;
      let feedback: Feedback;

      if (guess === prev.targetNumber) {
        feedback = 'correct';
        const score = Math.max(100 - newAttempts * 5, 10);
        return {
          ...prev,
          guessHistory: [...prev.guessHistory, { guess, feedback, attempt: newAttempts }],
          attempts: newAttempts,
          status: 'ended',
          score,
        };
      } else if (guess > prev.targetNumber) {
        feedback = 'too high';
      } else {
        feedback = 'too low';
      }

      return {
        ...prev,
        guessHistory: [...prev.guessHistory, { guess, feedback, attempt: newAttempts }],
        attempts: newAttempts,
      };
    });
  }, []);

  return { gameState, makeGuess, startGame, restartGame };
}
