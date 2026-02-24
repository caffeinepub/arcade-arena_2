import { Link } from '@tanstack/react-router';
import { useTicTacToe } from '@/hooks/useTicTacToe';
import { useRecordGameResult } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { GameType } from '@/backend';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function TicTacToeGame() {
  const { gameState, handleCellClick, startGame, restartGame } = useTicTacToe();
  const recordGameResult = useRecordGameResult();

  useEffect(() => {
    if (gameState.status === 'ended' && gameState.score > 0) {
      recordGameResult.mutate(
        { gameType: GameType.ticTacToe, score: BigInt(gameState.score) },
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
            Tic Tac Toe
          </h1>
          <p className="text-gray-400">Get three in a row to win!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-black/50 border-neonBlue/30">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {gameState.board.map((cell, index) => (
                    <button
                      key={index}
                      onClick={() => handleCellClick(index)}
                      disabled={gameState.status !== 'playing' || cell !== null}
                      className="aspect-square bg-darkBg border-2 border-neonBlue/30 rounded-lg hover:border-neonBlue hover:bg-neonBlue/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cell === 'X' && (
                        <span className="text-6xl font-bold text-neonBlue">X</span>
                      )}
                      {cell === 'O' && (
                        <span className="text-6xl font-bold text-neonPurple">O</span>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-black/50 border-neonPurple/30">
              <CardHeader>
                <CardTitle className="text-neonPurple">Status</CardTitle>
              </CardHeader>
              <CardContent>
                {gameState.status === 'idle' && (
                  <p className="text-white">Ready to play</p>
                )}
                {gameState.status === 'playing' && (
                  <p className="text-white">
                    Current: <span className={gameState.currentPlayer === 'X' ? 'text-neonBlue' : 'text-neonPurple'}>{gameState.currentPlayer}</span>
                  </p>
                )}
                {gameState.status === 'ended' && (
                  <p className="text-white">{gameState.winner ? `${gameState.winner} Wins!` : 'Draw!'}</p>
                )}
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
                  <p className="mb-2">Click on empty cells to place your mark</p>
                  <p className="text-neonBlue">Win: 100 points</p>
                  <p className="text-neonPurple">Draw: 50 points</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
