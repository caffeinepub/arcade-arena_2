import { useState, useCallback } from 'react';

type Cell = 'X' | 'O' | null;
type GameStatus = 'idle' | 'playing' | 'ended';

interface GameState {
  board: Cell[];
  currentPlayer: 'X' | 'O';
  status: GameStatus;
  winner: 'X' | 'O' | null;
  score: number;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function useTicTacToe() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    status: 'idle',
    winner: null,
    score: 0,
  });

  const checkWinner = useCallback((board: Cell[]): 'X' | 'O' | null => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }, []);

  const startGame = useCallback(() => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      score: 0,
    });
  }, []);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleCellClick = useCallback(
    (index: number) => {
      setGameState((prev) => {
        if (prev.status !== 'playing' || prev.board[index] !== null) {
          return prev;
        }

        const newBoard = [...prev.board];
        newBoard[index] = prev.currentPlayer;

        const winner = checkWinner(newBoard);
        const isDraw = !winner && newBoard.every((cell) => cell !== null);

        if (winner || isDraw) {
          return {
            ...prev,
            board: newBoard,
            status: 'ended',
            winner,
            score: winner ? 100 : 50,
          };
        }

        return {
          ...prev,
          board: newBoard,
          currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
        };
      });
    },
    [checkWinner]
  );

  return { gameState, handleCellClick, startGame, restartGame };
}
