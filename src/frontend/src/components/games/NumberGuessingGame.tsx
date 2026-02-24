import { Link } from '@tanstack/react-router';
import { useNumberGuessing } from '@/hooks/useNumberGuessing';
import { useRecordGameResult } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCcw, Send } from 'lucide-react';
import { GameType } from '@/backend';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function NumberGuessingGame() {
  const { gameState, makeGuess, startGame, restartGame } = useNumberGuessing();
  const recordGameResult = useRecordGameResult();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (gameState.status === 'ended' && gameState.score > 0) {
      recordGameResult.mutate(
        { gameType: GameType.numberGuessing, score: BigInt(gameState.score) },
        {
          onSuccess: () => {
            toast.success(`Correct! Score: ${gameState.score} points recorded`);
          },
        }
      );
    }
  }, [gameState.status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const guess = parseInt(inputValue);
    if (!isNaN(guess) && guess >= 1 && guess <= 100) {
      makeGuess(guess);
      setInputValue('');
    } else {
      toast.error('Please enter a number between 1 and 100');
    }
  };

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
            Number Guessing
          </h1>
          <p className="text-gray-400">Guess the number between 1 and 100</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-black/50 border-neonBlue/30">
              <CardHeader>
                <CardTitle className="text-neonBlue">Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] space-y-3">
                  {gameState.guessHistory.length === 0 && gameState.status === 'playing' && (
                    <p className="text-gray-400 text-center py-12">
                      Make your first guess!
                    </p>
                  )}
                  {gameState.guessHistory.map((entry, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        entry.feedback === 'correct'
                          ? 'border-green-500 bg-green-500/10'
                          : entry.feedback === 'too high'
                          ? 'border-neonPurple bg-neonPurple/10'
                          : 'border-neonBlue bg-neonBlue/10'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Guess #{entry.attempt}: {entry.guess}</span>
                        <span
                          className={`font-bold ${
                            entry.feedback === 'correct'
                              ? 'text-green-500'
                              : entry.feedback === 'too high'
                              ? 'text-neonPurple'
                              : 'text-neonBlue'
                          }`}
                        >
                          {entry.feedback === 'correct' ? '🎉 Correct!' : entry.feedback === 'too high' ? '↓ Too High' : '↑ Too Low'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-black/50 border-neonPurple/30">
              <CardHeader>
                <CardTitle className="text-neonPurple">Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-white">{gameState.attempts}</p>
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
                {gameState.status === 'playing' && (
                  <>
                    <form onSubmit={handleSubmit} className="space-y-2">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter your guess"
                        className="bg-darkBg border-neonBlue/20 text-white"
                      />
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-neonBlue to-neonPurple hover:opacity-90"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Submit Guess
                      </Button>
                    </form>
                    <Button
                      onClick={restartGame}
                      variant="outline"
                      className="w-full border-neonPurple text-neonPurple hover:bg-neonPurple hover:text-black"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restart
                    </Button>
                  </>
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
                <div className="text-sm text-gray-400">
                  <p>Range: 1 - 100</p>
                  <p className="mt-2">Score: 100 - (attempts × 5)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
