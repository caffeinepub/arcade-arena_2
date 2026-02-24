import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import SnakeGame from './components/games/SnakeGame';
import TicTacToeGame from './components/games/TicTacToeGame';
import MemoryCardGame from './components/games/MemoryCardGame';
import NumberGuessingGame from './components/games/NumberGuessingGame';
import FriendsPage from './pages/FriendsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games',
  component: GamesPage,
});

const snakeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games/snake',
  component: SnakeGame,
});

const ticTacToeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games/tictactoe',
  component: TicTacToeGame,
});

const memoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games/memory',
  component: MemoryCardGame,
});

const numberGuessingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games/number-guessing',
  component: NumberGuessingGame,
});

const friendsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/friends',
  component: FriendsPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  gamesRoute,
  snakeRoute,
  ticTacToeRoute,
  memoryRoute,
  numberGuessingRoute,
  friendsRoute,
  leaderboardRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
