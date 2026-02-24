import { Link } from '@tanstack/react-router';
import { useGetLeaderboard } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Play, Users, Target } from 'lucide-react';

export default function HomePage() {
  const { data: leaderboard } = useGetLeaderboard();
  const topPlayers = leaderboard?.slice(0, 5) || [];

  const games = [
    {
      id: 'snake',
      name: 'Snake',
      description: 'Classic snake game with a neon twist',
      icon: '/assets/generated/snake-icon.dim_256x256.png',
      path: '/games/snake',
    },
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      description: 'Challenge yourself in this classic strategy game',
      icon: '/assets/generated/tictactoe-icon.dim_256x256.png',
      path: '/games/tictactoe',
    },
    {
      id: 'memory',
      name: 'Memory Cards',
      description: 'Test your memory with matching cards',
      icon: '/assets/generated/memory-icon.dim_256x256.png',
      path: '/games/memory',
    },
    {
      id: 'number',
      name: 'Number Guessing',
      description: 'Guess the number in the fewest attempts',
      icon: '/assets/generated/number-icon.dim_256x256.png',
      path: '/games/number-guessing',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-neonBlue via-neonPurple to-neonBlue bg-clip-text text-transparent animate-pulse">
            Arcade Arena
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Play With Friends Online
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Experience the thrill of classic browser games with a modern twist. Compete with friends, climb the leaderboards, and become a gaming legend.
          </p>
          <Link to="/games">
            <Button
              size="lg"
              className="bg-gradient-to-r from-neonBlue to-neonPurple hover:opacity-90 text-lg px-8 py-6 shadow-lg shadow-neonBlue/50"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Playing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-darkBg">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-darkBg/50 border-neonBlue/20 hover:border-neonBlue/50 transition-all">
              <CardContent className="pt-6 text-center">
                <Users className="h-12 w-12 text-neonBlue mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neonBlue mb-2">Play With Friends</h3>
                <p className="text-gray-400">Add friends and compete together</p>
              </CardContent>
            </Card>
            <Card className="bg-darkBg/50 border-neonPurple/20 hover:border-neonPurple/50 transition-all">
              <CardContent className="pt-6 text-center">
                <Trophy className="h-12 w-12 text-neonPurple mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neonPurple mb-2">Climb Leaderboards</h3>
                <p className="text-gray-400">Compete for the top spot</p>
              </CardContent>
            </Card>
            <Card className="bg-darkBg/50 border-neonBlue/20 hover:border-neonBlue/50 transition-all">
              <CardContent className="pt-6 text-center">
                <Target className="h-12 w-12 text-neonBlue mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neonBlue mb-2">Track Progress</h3>
                <p className="text-gray-400">Monitor your gaming stats</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16 px-4 bg-darkBg">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent">
            Featured Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {games.map((game) => (
              <Link key={game.id} to={game.path}>
                <Card className="bg-black/50 border-neonBlue/20 hover:border-neonBlue hover:shadow-lg hover:shadow-neonBlue/30 transition-all cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <img
                      src={game.icon}
                      alt={game.name}
                      className="w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-transform"
                    />
                    <h3 className="text-xl font-bold text-neonBlue mb-2">{game.name}</h3>
                    <p className="text-gray-400 text-sm">{game.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Players */}
      <section className="py-16 px-4 bg-gradient-to-b from-darkBg to-black">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent">
            Top Players
          </h2>
          {topPlayers.length > 0 ? (
            <div className="space-y-4">
              {topPlayers.map(([principal, profile], index) => (
                <Card
                  key={principal.toString()}
                  className="bg-black/50 border-neonBlue/20 hover:border-neonBlue/50 transition-all"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-neonPurple w-8">
                        #{index + 1}
                      </div>
                      <Avatar className="h-12 w-12 border-2 border-neonBlue">
                        <AvatarImage src={profile.avatarUrl} />
                        <AvatarFallback className="bg-neonBlue/20 text-neonBlue">
                          {profile.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white">{profile.username}</p>
                        <p className="text-sm text-gray-400">
                          {profile.gamesPlayed.toString()} games played
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-neonBlue">
                        {profile.totalScore.toString()}
                      </p>
                      <p className="text-sm text-gray-400">points</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-black/50 border-neonBlue/20">
              <CardContent className="p-8 text-center">
                <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No players yet. Be the first to play!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
