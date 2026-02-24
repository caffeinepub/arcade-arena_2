import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetProfile, useRegisterUser } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: profile, isError: profileError } = useGetProfile();
  const registerUser = useRegisterUser();

  useEffect(() => {
    if (identity && !profileError && profile) {
      navigate({ to: '/' });
    }
  }, [identity, profile, profileError, navigate]);

  useEffect(() => {
    if (identity && profileError) {
      const defaultUsername = `Player${identity.getPrincipal().toString().substring(0, 6)}`;
      const defaultAvatar = '/assets/generated/default-avatar.dim_200x200.png';
      
      registerUser.mutate(
        { username: defaultUsername, avatarUrl: defaultAvatar },
        {
          onSuccess: () => {
            toast.success('Welcome to Arcade Arena!');
            navigate({ to: '/' });
          },
          onError: (error) => {
            toast.error(`Registration failed: ${error.message}`);
          },
        }
      );
    }
  }, [identity, profileError, registerUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black via-darkBg to-black">
      <Card className="w-full max-w-md bg-black/80 border-neonBlue/30 shadow-2xl shadow-neonBlue/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Gamepad2 className="h-16 w-16 text-neonBlue" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent">
            Welcome to Arcade Arena
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sign in with Internet Identity to start playing and competing with friends
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-darkBg/50 border border-neonBlue/20 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-neonBlue mb-2">What you'll get:</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <span className="text-neonPurple mr-2">✓</span>
                  Unique gamer ID
                </li>
                <li className="flex items-center">
                  <span className="text-neonPurple mr-2">✓</span>
                  Personal profile and stats
                </li>
                <li className="flex items-center">
                  <span className="text-neonPurple mr-2">✓</span>
                  Add friends and compete
                </li>
                <li className="flex items-center">
                  <span className="text-neonPurple mr-2">✓</span>
                  Climb the leaderboards
                </li>
              </ul>
            </div>
          </div>

          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-neonBlue to-neonPurple hover:opacity-90 text-lg py-6"
          >
            <LogIn className="mr-2 h-5 w-5" />
            {isLoggingIn ? 'Connecting...' : 'Sign in with Internet Identity'}
          </Button>

          <p className="text-xs text-center text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
