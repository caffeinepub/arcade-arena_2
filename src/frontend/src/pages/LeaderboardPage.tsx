import { useGetLeaderboard, useGetFriendsLeaderboard } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal } from 'lucide-react';

export default function LeaderboardPage() {
  const { identity } = useInternetIdentity();
  const { data: globalLeaderboard = [] } = useGetLeaderboard();
  const { data: friendsLeaderboard = [] } = useGetFriendsLeaderboard();
  const myPrincipal = identity?.getPrincipal().toString();

  const renderLeaderboard = (data: typeof globalLeaderboard, showEmpty = false) => {
    if (data.length === 0 && showEmpty) {
      return (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {data.slice(0, 50).map(([principal, profile], index) => {
          const isCurrentUser = principal.toString() === myPrincipal;
          const rank = index + 1;

          return (
            <Card
              key={principal.toString()}
              className={`bg-black/50 transition-all ${
                isCurrentUser
                  ? 'border-neonPurple shadow-lg shadow-neonPurple/20'
                  : 'border-neonBlue/20 hover:border-neonBlue/50'
              }`}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 text-center">
                    {rank <= 3 ? (
                      <div className="relative">
                        <img
                          src="/assets/generated/trophy-icon.dim_128x128.png"
                          alt="Trophy"
                          className="w-10 h-10 mx-auto"
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
                          {rank}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-500">#{rank}</span>
                    )}
                  </div>
                  <Avatar className="h-12 w-12 border-2 border-neonBlue">
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback className="bg-neonBlue/20 text-neonBlue">
                      {profile.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate ${isCurrentUser ? 'text-neonPurple' : 'text-white'}`}>
                      {profile.username} {isCurrentUser && '(You)'}
                    </p>
                    <p className="text-xs text-gray-500 font-mono truncate">
                      {principal.toString().substring(0, 30)}...
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-neonBlue">
                    {profile.totalScore.toString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {profile.gamesPlayed.toString()} games
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-black via-darkBg to-black">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Trophy className="h-16 w-16 text-neonBlue mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-400">
            See who's dominating the arena
          </p>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-neonBlue/20">
            <TabsTrigger
              value="global"
              className="data-[state=active]:bg-neonBlue data-[state=active]:text-black"
            >
              Global
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="data-[state=active]:bg-neonPurple data-[state=active]:text-black"
            >
              Friends
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="data-[state=active]:bg-neonBlue data-[state=active]:text-black"
              disabled
            >
              Weekly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-6">
            {renderLeaderboard(globalLeaderboard)}
          </TabsContent>

          <TabsContent value="friends" className="mt-6">
            {renderLeaderboard(friendsLeaderboard, true)}
          </TabsContent>

          <TabsContent value="weekly" className="mt-6">
            <Card className="bg-black/50 border-neonBlue/20">
              <CardContent className="p-12 text-center">
                <Medal className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Weekly leaderboard coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
