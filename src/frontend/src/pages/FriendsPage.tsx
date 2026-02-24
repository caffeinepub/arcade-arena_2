import { useState } from 'react';
import { useGetFriends, useAddFriend, useGetLeaderboard } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@icp-sdk/core/principal';

export default function FriendsPage() {
  const { identity } = useInternetIdentity();
  const { data: friends = [] } = useGetFriends();
  const { data: leaderboard = [] } = useGetLeaderboard();
  const addFriend = useAddFriend();
  const [friendId, setFriendId] = useState('');
  const [copied, setCopied] = useState(false);

  const myPrincipal = identity?.getPrincipal().toString() || '';

  const friendProfiles = friends.map((friendPrincipal) => {
    const profile = leaderboard.find(([p]) => p.toString() === friendPrincipal.toString());
    return profile ? { principal: friendPrincipal, profile: profile[1] } : null;
  }).filter(Boolean);

  const handleAddFriend = () => {
    if (!friendId.trim()) {
      toast.error('Please enter a friend ID');
      return;
    }

    try {
      const principal = Principal.fromText(friendId.trim());
      addFriend.mutate(principal, {
        onSuccess: () => {
          toast.success('Friend added successfully!');
          setFriendId('');
        },
        onError: (error) => {
          toast.error(`Failed to add friend: ${error.message}`);
        },
      });
    } catch (error) {
      toast.error('Invalid friend ID format');
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(myPrincipal);
    setCopied(true);
    toast.success('Your ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-black via-darkBg to-black">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent">
            Friends
          </h1>
          <p className="text-xl text-gray-400">
            Add friends and compete together
          </p>
        </div>

        {/* Your ID Card */}
        <Card className="mb-8 bg-black/50 border-neonBlue/30">
          <CardHeader>
            <CardTitle className="text-neonBlue">Your Gamer ID</CardTitle>
            <CardDescription>Share this ID with friends to connect</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                value={myPrincipal}
                readOnly
                className="bg-darkBg border-neonBlue/20 text-gray-300 font-mono text-sm"
              />
              <Button
                onClick={handleCopyId}
                variant="outline"
                className="border-neonBlue text-neonBlue hover:bg-neonBlue hover:text-black"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Friend Card */}
        <Card className="mb-8 bg-black/50 border-neonPurple/30">
          <CardHeader>
            <CardTitle className="text-neonPurple flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Add Friend
            </CardTitle>
            <CardDescription>Enter your friend's gamer ID to add them</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter friend's gamer ID"
                value={friendId}
                onChange={(e) => setFriendId(e.target.value)}
                className="bg-darkBg border-neonPurple/20 text-gray-300"
              />
              <Button
                onClick={handleAddFriend}
                disabled={addFriend.isPending}
                className="bg-gradient-to-r from-neonBlue to-neonPurple hover:opacity-90"
              >
                {addFriend.isPending ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Friends List */}
        <Card className="bg-black/50 border-neonBlue/30">
          <CardHeader>
            <CardTitle className="text-neonBlue flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Your Friends ({friendProfiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {friendProfiles.length > 0 ? (
              <div className="space-y-4">
                {friendProfiles.map((friend) => (
                  <div
                    key={friend!.principal.toString()}
                    className="flex items-center justify-between p-4 bg-darkBg/50 border border-neonBlue/20 rounded-lg hover:border-neonBlue/50 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-neonBlue">
                        <AvatarImage src={friend!.profile.avatarUrl} />
                        <AvatarFallback className="bg-neonBlue/20 text-neonBlue">
                          {friend!.profile.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white">{friend!.profile.username}</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {friend!.principal.toString().substring(0, 20)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-neonPurple/20 text-neonPurple border-neonPurple/30">
                        {friend!.profile.totalScore.toString()} pts
                      </Badge>
                      <p className="text-xs text-gray-400 mt-1">
                        {friend!.profile.gamesPlayed.toString()} games
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">You haven't added any friends yet</p>
                <p className="text-sm text-gray-500">
                  Share your gamer ID or add friends using their ID
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
