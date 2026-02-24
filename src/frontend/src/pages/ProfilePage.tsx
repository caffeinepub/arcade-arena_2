import { useState } from 'react';
import { useGetProfile } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Trophy, Gamepad2, Edit } from 'lucide-react';
import EditProfileModal from '@/components/profile/EditProfileModal';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const myPrincipal = identity?.getPrincipal().toString() || '';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-black via-darkBg to-black">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent">
            Profile
          </h1>
        </div>

        {/* Profile Card */}
        <Card className="mb-8 bg-black/50 border-neonBlue/30">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <Avatar className="h-32 w-32 border-4 border-neonBlue">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback className="bg-neonBlue/20 text-neonBlue text-3xl">
                  {profile.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">{profile.username}</h2>
                <p className="text-sm text-gray-500 font-mono mb-4">
                  ID: {myPrincipal.substring(0, 40)}...
                </p>
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  variant="outline"
                  className="border-neonPurple text-neonPurple hover:bg-neonPurple hover:text-black"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/50 border-neonBlue/30 hover:border-neonBlue/50 transition-all">
            <CardHeader>
              <CardTitle className="text-neonBlue flex items-center">
                <Trophy className="mr-2 h-5 w-5" />
                Total Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{profile.totalScore.toString()}</p>
              <p className="text-sm text-gray-400 mt-1">points earned</p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-neonPurple/30 hover:border-neonPurple/50 transition-all">
            <CardHeader>
              <CardTitle className="text-neonPurple flex items-center">
                <Gamepad2 className="mr-2 h-5 w-5" />
                Games Played
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{profile.gamesPlayed.toString()}</p>
              <p className="text-sm text-gray-400 mt-1">total games</p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-neonBlue/30 hover:border-neonBlue/50 transition-all">
            <CardHeader>
              <CardTitle className="text-neonBlue flex items-center">
                <User className="mr-2 h-5 w-5" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">
                {profile.gamesPlayed > 0n
                  ? Math.round(Number(profile.totalScore) / Number(profile.gamesPlayed))
                  : 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">per game</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card className="mt-8 bg-black/50 border-neonPurple/30">
          <CardHeader>
            <CardTitle className="text-neonPurple">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {profile.gamesPlayed >= 1n && (
                <Badge className="bg-neonBlue/20 text-neonBlue border-neonBlue/30 px-4 py-2">
                  🎮 First Game
                </Badge>
              )}
              {profile.gamesPlayed >= 10n && (
                <Badge className="bg-neonPurple/20 text-neonPurple border-neonPurple/30 px-4 py-2">
                  🔥 10 Games
                </Badge>
              )}
              {profile.totalScore >= 1000n && (
                <Badge className="bg-neonBlue/20 text-neonBlue border-neonBlue/30 px-4 py-2">
                  ⭐ 1K Points
                </Badge>
              )}
              {profile.gamesPlayed === 0n && (
                <p className="text-gray-400 text-sm">Play games to unlock achievements!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUsername={profile.username}
        currentAvatarUrl={profile.avatarUrl}
      />
    </div>
  );
}
