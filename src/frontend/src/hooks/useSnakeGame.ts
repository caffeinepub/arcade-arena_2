import { useState, useEffect, useCallback, type RefObject } from 'react';

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameStatus = 'idle' | 'playing' | 'ended';

interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  status: GameStatus;
}

const GRID_SIZE = 30;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export function useSnakeGame(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 15, y: 15 }],
    food: { x: 10, y: 10 },
    direction: 'RIGHT',
    score: 0,
    status: 'idle',
  });

  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const startGame = useCallback(() => {
    const initialSnake = [{ x: 15, y: 15 }];
    setGameState({
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: 'RIGHT',
      score: 0,
      status: 'playing',
    });
  }, [generateFood]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.status !== 'playing') return;

      setGameState((prev) => {
        let newDirection = prev.direction;
        if (e.key === 'ArrowUp' && prev.direction !== 'DOWN') newDirection = 'UP';
        if (e.key === 'ArrowDown' && prev.direction !== 'UP') newDirection = 'DOWN';
        if (e.key === 'ArrowLeft' && prev.direction !== 'RIGHT') newDirection = 'LEFT';
        if (e.key === 'ArrowRight' && prev.direction !== 'LEFT') newDirection = 'RIGHT';
        return { ...prev, direction: newDirection };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.status]);

  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        const head = prev.snake[0];
        let newHead: Position;

        switch (prev.direction) {
          case 'UP':
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case 'DOWN':
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case 'LEFT':
            newHead = { x: head.x - 1, y: head.y };
            break;
          case 'RIGHT':
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          return { ...prev, status: 'ended' };
        }

        // Check self collision
        if (prev.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          return { ...prev, status: 'ended' };
        }

        const newSnake = [newHead, ...prev.snake];

        // Check food collision
        if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
          return {
            ...prev,
            snake: newSnake,
            food: generateFood(newSnake),
            score: prev.score + 10,
          };
        }

        newSnake.pop();
        return { ...prev, snake: newSnake };
      });
    }, INITIAL_SPEED);

    return () => clearInterval(gameLoop);
  }, [gameState.status, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00D9FF' : '#B931FC';
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    // Draw food
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(gameState.food.x * CELL_SIZE, gameState.food.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
  }, [gameState, canvasRef]);

  return { gameState, startGame, restartGame };
}
