import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    username: string;
    gamesPlayed: bigint;
    totalScore: bigint;
    avatarUrl: string;
}
export enum GameType {
    numberGuessing = "numberGuessing",
    snake = "snake",
    ticTacToe = "ticTacToe",
    memoryCard = "memoryCard"
}
export interface backendInterface {
    addFriend(friendId: Principal): Promise<void>;
    getFriends(): Promise<Array<Principal>>;
    getFriendsLeaderboard(): Promise<Array<[Principal, UserProfile]>>;
    getLeaderboard(): Promise<Array<[Principal, UserProfile]>>;
    getProfile(): Promise<UserProfile>;
    recordGameResult(gameType: GameType, score: bigint): Promise<void>;
    registerUser(username: string, avatarUrl: string): Promise<void>;
}
