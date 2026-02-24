import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export default function GamesPage() {
  const games = [
    {
      id: 'snake',
      name: 'Snake',
      description: 'Navigate the snake to eat food and grow longer. Avoid hitting walls or yourself!',
      icon: '/assets/generated/snake-icon.dim_256x256.png',
      path: '/games/snake',
      color: 'neonBlue',
    },
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      description: 'Classic strategy game. Get three in a row to win!',
      icon: '/assets/generated/tictactoe-icon.dim_256x256.png',
      path: '/games/tictactoe',
      color: 'neonPurple',
    },
    {
      id: 'memory',
      name: 'Memory Cards',
      description: 'Find matching pairs of cards. Complete the game in the fewest moves!',
      icon: '/assets/generated/memory-icon.dim_256x256.png',
      path: '/games/memory',
      color: 'neonBlue',
    },
    {
      id: 'number',
      name: 'Number Guessing',
      description: 'Guess the secret number between 1-100. Use hints to find it quickly!',
      icon: '/assets/generated/number-icon.dim_256x256.png',
      path: '/games/number-guessing',
      color: 'neonPurple',
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-black via-darkBg to-black">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent">
            Choose Your Game
          </h1>
          <p className="text-xl text-gray-400">
            Select a game and start playing to earn points
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => (
            <Card
              key={game.id}
              className={`bg-black/50 border-${game.color}/20 hover:border-${game.color} hover:shadow-lg hover:shadow-${game.color}/30 transition-all group`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <img
                    src={game.icon}
                    alt={game.name}
                    className="w-20 h-20 group-hover:scale-110 transition-transform"
                  />
                  <Link to={game.path}>
                    <Button
                      className={`bg-gradient-to-r from-${game.color} to-neonPurple hover:opacity-90`}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Play Now
                    </Button>
                  </Link>
                </div>
                <CardTitle className={`text-2xl text-${game.color}`}>{game.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {game.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
