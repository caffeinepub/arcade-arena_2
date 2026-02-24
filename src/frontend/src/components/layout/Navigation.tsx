import { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Gamepad2 } from 'lucide-react';

export default function Navigation() {
  const { identity, clear, login } = useInternetIdentity();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isAuthenticated = !!identity;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/games', label: 'Games' },
    { path: '/friends', label: 'Friends', protected: true },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/profile', label: 'Profile', protected: true },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neonBlue/20 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Gamepad2 className="h-8 w-8 text-neonBlue group-hover:text-neonPurple transition-colors" />
            <span className="text-2xl font-bold bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent">
              Arcade Arena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              if (link.protected && !isAuthenticated) return null;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-neonBlue ${
                    isActive(link.path)
                      ? 'text-neonBlue'
                      : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAuthenticated ? (
              <Button
                onClick={clear}
                variant="outline"
                className="border-neonPurple text-neonPurple hover:bg-neonPurple hover:text-black"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={login}
                className="bg-gradient-to-r from-neonBlue to-neonPurple hover:opacity-90"
              >
                Login
              </Button>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-neonBlue">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-neonBlue/20">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => {
                  if (link.protected && !isAuthenticated) return null;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-neonBlue ${
                        isActive(link.path)
                          ? 'text-neonBlue'
                          : 'text-gray-300'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                {isAuthenticated ? (
                  <Button
                    onClick={() => {
                      clear();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="border-neonPurple text-neonPurple hover:bg-neonPurple hover:text-black"
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      login();
                      setIsOpen(false);
                    }}
                    className="bg-gradient-to-r from-neonBlue to-neonPurple hover:opacity-90"
                  >
                    Login
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
