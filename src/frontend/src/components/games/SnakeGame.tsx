import { useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { useRecordGameResult } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { GameType } from '@/backend';
import { toast } from 'sonner';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, startGame, restartGame } = useSnakeGame(canvasRef);
  const recordGameResult = useRecordGameResult();

  useEffect(() => {
    if (gameState.status === 'ended' && gameState.score > 0) {
      recordGameResult.mutate(
        { gameType: GameType.snake, score: BigInt(gameState.score) },
        {
          onSuccess: () => {
            toast.success(`Game Over! Score: ${gameState.score} points recorded`);
          },
        }
      );
    }
  }, [gameState.status]);

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-black via-darkBg to-black">
      <div className="container mx-auto max-w-4xl">
        <Link to="/games">
          <Button variant="ghost" className="mb-6 text-neonBlue hover:text-neonPurple">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent">
            Snake
          </h1>
          <p className="text-gray-400">Use arrow keys to control the snake</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-black/50 border-neonBlue/30">
              <CardContent className="p-6">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={600}
                  className="w-full border-2 border-neonBlue/30 rounded-lg bg-black"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-black/50 border-neonPurple/30">
              <CardHeader>
                <CardTitle className="text-neonPurple">Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-white">{gameState.score}</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-neonBlue/30">
              <CardHeader>
                <CardTitle className="text-neonBlue">Controls</CardTitle>
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
                {gameState.status === 'ended' && (
                  <Button
                    onClick={restartGame}
                    className="w-full bg-gradient-to-r from-neonBlue to-neonPurple hover:opacity-90"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Play Again
                  </Button>
                )}
                {gameState.status === 'playing' && (
                  <Button
                    onClick={restartGame}
                    variant="outline"
                    className="w-full border-neonPurple text-neonPurple hover:bg-neonPurple hover:text-black"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restart
                  </Button>
                )}
                <div className="text-sm text-gray-400 space-y-2">
                  <p>↑ Move Up</p>
                  <p>↓ Move Down</p>
                  <p>← Move Left</p>
                  <p>→ Move Right</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
