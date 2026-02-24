import { useState, useCallback } from 'react';

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type GameStatus = 'idle' | 'playing' | 'ended';

interface GameState {
  cards: Card[];
  flippedCards: number[];
  moves: number;
  matchedPairs: number;
  status: GameStatus;
  score: number;
}

const SYMBOLS = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎸'];

export function useMemoryGame() {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    flippedCards: [],
    moves: 0,
    matchedPairs: 0,
    status: 'idle',
    score: 0,
  });

  const shuffleCards = useCallback((): Card[] => {
    const pairs = [...SYMBOLS, ...SYMBOLS];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    return shuffled.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState({
      cards: shuffleCards(),
      flippedCards: [],
      moves: 0,
      matchedPairs: 0,
      status: 'playing',
      score: 0,
    });
  }, [shuffleCards]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleCardClick = useCallback((cardId: number) => {
    setGameState((prev) => {
      if (prev.status !== 'playing' || prev.flippedCards.length >= 2) {
        return prev;
      }

      const card = prev.cards.find((c) => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) {
        return prev;
      }

      const newCards = prev.cards.map((c) =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      );

      const newFlippedCards = [...prev.flippedCards, cardId];

      if (newFlippedCards.length === 2) {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = newCards.find((c) => c.id === firstId);
        const secondCard = newCards.find((c) => c.id === secondId);

        if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
          const matchedCards = newCards.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
          );
          const newMatchedPairs = prev.matchedPairs + 1;
          const newMoves = prev.moves + 1;

          if (newMatchedPairs === 8) {
            const score = Math.max(1000 - newMoves * 10, 100);
            return {
              cards: matchedCards,
              flippedCards: [],
              moves: newMoves,
              matchedPairs: newMatchedPairs,
              status: 'ended',
              score,
            };
          }

          return {
            ...prev,
            cards: matchedCards,
            flippedCards: [],
            moves: newMoves,
            matchedPairs: newMatchedPairs,
          };
        } else {
          setTimeout(() => {
            setGameState((current) => ({
              ...current,
              cards: current.cards.map((c) =>
                c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
              ),
              flippedCards: [],
            }));
          }, 1000);

          return {
            ...prev,
            cards: newCards,
            flippedCards: newFlippedCards,
            moves: prev.moves + 1,
          };
        }
      }

      return {
        ...prev,
        cards: newCards,
        flippedCards: newFlippedCards,
      };
    });
  }, []);

  return { gameState, handleCardClick, startGame, restartGame };
}
