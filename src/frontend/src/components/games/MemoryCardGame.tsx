import { Link } from '@tanstack/react-router';
import { useMemoryGame } from '@/hooks/useMemoryGame';
import { useRecordGameResult } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { GameType } from '@/backend';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function MemoryCardGame() {
  const { gameState, handleCardClick, startGame, restartGame } = useMemoryGame();
  const recordGameResult = useRecordGameResult();

  useEffect(() => {
    if (gameState.status === 'ended' && gameState.score > 0) {
      recordGameResult.mutate(
        { gameType: GameType.memoryCard, score: BigInt(gameState.score) },
        {
          onSuccess: () => {
            toast.success(`Game Complete! Score: ${gameState.score} points recorded`);
          },
        }
      );
    }
  }, [gameState.status]);

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-black via-darkBg to-black">
      <div className="container mx-auto max-w-5xl">
        <Link to="/games">
          <Button variant="ghost" className="mb-6 text-neonBlue hover:text-neonPurple">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent">
            Memory Cards
          </h1>
          <p className="text-gray-400">Find all matching pairs!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-black/50 border-neonBlue/30">
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  {gameState.cards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      disabled={gameState.status !== 'playing' || card.isFlipped || card.isMatched}
                      className={`aspect-square rounded-lg transition-all transform ${
                        card.isFlipped || card.isMatched
                          ? 'bg-gradient-to-br from-neonBlue to-neonPurple'
                          : 'bg-darkBg border-2 border-neonBlue/30 hover:border-neonBlue hover:scale-105'
                      } disabled:cursor-not-allowed flex items-center justify-center text-4xl`}
                    >
                      {(card.isFlipped || card.isMatched) && card.symbol}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-black/50 border-neonPurple/30">
              <CardHeader>
                <CardTitle className="text-neonPurple">Moves</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-white">{gameState.moves}</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-neonBlue/30">
              <CardHeader>
                <CardTitle className="text-neonBlue">Matched</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-white">{gameState.matchedPairs}/8</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-neonPurple/30">
              <CardHeader>
                <CardTitle className="text-neonPurple">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {gameState.status === 'idle' && (
                  <Button
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-neonBlue to-neonPurple hover:opacity-90"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Game
                  </Button>
                )}
                {(gameState.status === 'playing' || gameState.status === 'ended') && (
                  <Button
                    onClick={restartGame}
                    className="w-full bg-gradient-to-r from-neonBlue to-neonPurple hover:opacity-90"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {gameState.status === 'ended' ? 'Play Again' : 'Restart'}
                  </Button>
                )}
                <div className="text-sm text-gray-400">
                  <p>Click cards to flip them</p>
                  <p className="mt-2">Score: 1000 - (moves × 10)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
