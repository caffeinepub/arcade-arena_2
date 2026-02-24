import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { GameType, type UserProfile } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

export function useGetProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useRegisterUser() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ username, avatarUrl }: { username: string; avatarUrl: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.registerUser(username, avatarUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFriendsLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ['friendsLeaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFriendsLeaderboard();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetFriends() {
  const { actor, isFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['friends'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFriends();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useAddFriend() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (friendId: Principal) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addFriend(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendsLeaderboard'] });
    },
  });
}

export function useRecordGameResult() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ gameType, score }: { gameType: GameType; score: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.recordGameResult(gameType, score);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['friendsLeaderboard'] });
    },
  });
}
